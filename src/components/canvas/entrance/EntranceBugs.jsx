import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useAudio } from '../../../context/AudioManager';

// Four independent crawling zones across the brick wall, positioned clear of
// the center PORTFOLIO door hitbox (|x| < 1.25, y < 1.15) and duck pot hitbox.
const BUG_SLOTS = [
    {
        id: 'upper-right',
        homeX: 2.65,
        offsetY: 3.75,
        ampX: 0.72,
        ampY: 0.42,
        freqX: 0.68,
        freqY: 0.52,
        phase: 0.3,
        entryX: 4.85,
        entryOffsetY: 3.95,
        size: 0.4,
        respawnMs: 1650,
    },
    {
        id: 'above-door',
        homeX: -0.05,
        offsetY: 3.95,
        ampX: 0.95,
        ampY: 0.32,
        freqX: 0.55,
        freqY: 0.85,
        phase: 2.1,
        entryX: 0.55,
        entryOffsetY: 5.25,
        size: 0.36,
        respawnMs: 1800,
    },
    {
        id: 'left-tree',
        homeX: -1.68,
        offsetY: 2.85,
        ampX: 0.24,
        ampY: 0.65,
        freqX: 0.92,
        freqY: 0.62,
        phase: 4.0,
        // Emerges from behind the left tree (rendered at z = 1 in front of the wall)
        entryX: -3.25,
        entryOffsetY: 3.05,
        size: 0.38,
        respawnMs: 1550,
    },
    {
        id: 'mid-right',
        homeX: 3.72,
        offsetY: 2.65,
        ampX: 0.42,
        ampY: 0.52,
        freqX: 0.78,
        freqY: 0.48,
        phase: 5.4,
        entryX: 5.2,
        entryOffsetY: 2.75,
        size: 0.34,
        respawnMs: 1950,
    },
];

const ENTRY_DURATION = 1.15;

/**
 * Evaluates a bug's wandering wall position while keeping it outside the
 * center PORTFOLIO door hitbox.
 */
function computeBugPosition(slot, t, floorY, phaseOffset, speedMultiplier, spawnElapsed) {
    const effectiveT = t * speedMultiplier + phaseOffset;
    const xOffset =
        Math.sin(effectiveT * slot.freqX + slot.phase) * slot.ampX +
        Math.sin(effectiveT * slot.freqX * 1.9 + slot.phase * 1.4) * (slot.ampX * 0.22);
    const yOffset =
        Math.cos(effectiveT * slot.freqY + slot.phase * 0.7) * slot.ampY +
        Math.sin(effectiveT * slot.freqY * 1.7 + slot.phase) * (slot.ampY * 0.22);

    const targetX = slot.homeX + xOffset;
    const targetY = floorY + slot.offsetY + yOffset;

    let x = targetX;
    let y = targetY;

    if (spawnElapsed !== null && spawnElapsed < ENTRY_DURATION) {
        const raw = Math.min(1, Math.max(0, spawnElapsed / ENTRY_DURATION));
        const eased = 1 - Math.pow(1 - raw, 3);
        const entryY = floorY + slot.entryOffsetY;
        x = slot.entryX + (targetX - slot.entryX) * eased;
        y = entryY + (targetY - entryY) * eased;
    }

    // Keep bugs strictly clear of the center PORTFOLIO door frame & hitbox
    if (Math.abs(x) < 1.3 && y < 1.25) {
        y = 1.25;
    }

    return { x, y };
}

/**
 * Single crawling + squashable pencil-sketch bug with reusable ink splash and
 * "BUG FIXED!" popup text kept mounted for smooth GPU performance.
 */
const CrawlingBugSlot = ({ slot, floorY, bugTexture, inkSplashTexture, onSquash }) => {
    const bugRef = useRef();
    const inkSplashRef = useRef();
    const textRef = useRef();

    const stateRef = useRef('crawling'); // 'crawling' | 'squashing' | 'respawning'
    const spawnStartRef = useRef(null);
    const phaseOffsetRef = useRef(0);
    const speedRef = useRef(1);
    const prevPosRef = useRef({ x: slot.homeX, y: floorY + slot.offsetY });
    const respawnTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (respawnTimerRef.current) {
                clearTimeout(respawnTimerRef.current);
            }
            gsap.killTweensOf([
                bugRef.current?.scale,
                bugRef.current?.material,
                inkSplashRef.current?.scale,
                inkSplashRef.current?.material,
                textRef.current?.position,
                textRef.current?.scale,
                textRef.current,
            ]);
        };
    }, []);

    useFrame(({ clock }) => {
        if (stateRef.current !== 'crawling' || !bugRef.current) return;

        const time = clock.elapsedTime;
        let spawnElapsed = null;
        if (spawnStartRef.current !== null) {
            if (spawnStartRef.current === 'pending') {
                spawnStartRef.current = time;
                spawnElapsed = 0;
            } else {
                spawnElapsed = time - spawnStartRef.current;
                if (spawnElapsed >= ENTRY_DURATION) {
                    spawnStartRef.current = null;
                    spawnElapsed = null;
                }
            }
        }

        const { x, y } = computeBugPosition(
            slot,
            time,
            floorY,
            phaseOffsetRef.current,
            speedRef.current,
            spawnElapsed
        );

        const dx = x - prevPosRef.current.x;
        const dy = y - prevPosRef.current.y;
        prevPosRef.current = { x, y };

        bugRef.current.position.x = x;
        bugRef.current.position.y = y;

        // Subtle crawling scuttle + lean toward movement direction
        const moveTilt = Math.hypot(dx, dy) > 0.0001 ? Math.atan2(dy, dx) * 0.25 : 0;
        bugRef.current.rotation.z =
            Math.sin(time * 7 * speedRef.current + slot.phase) * 0.12 + moveTilt;
    });

    const handleClick = (e) => {
        e.stopPropagation();
        if (stateRef.current !== 'crawling' || !bugRef.current) return;

        stateRef.current = 'squashing';
        document.body.style.cursor = 'auto';
        onSquash?.();

        const clickX = bugRef.current.position.x;
        const clickY = bugRef.current.position.y;

        // 1. Brief squash flatten + fade out on the bug mesh
        gsap.killTweensOf([bugRef.current.scale, bugRef.current.material]);
        gsap.to(bugRef.current.scale, {
            x: 1.45,
            y: 0.32,
            z: 1,
            duration: 0.16,
            ease: 'power2.out',
        });
        gsap.to(bugRef.current.material, {
            opacity: 0,
            duration: 0.2,
            delay: 0.06,
            ease: 'power2.in',
            onComplete: () => {
                if (bugRef.current) {
                    bugRef.current.visible = false;
                }
            },
        });

        // 2. Ink splash burst at the squash point
        if (inkSplashRef.current) {
            gsap.killTweensOf([inkSplashRef.current.scale, inkSplashRef.current.material]);
            inkSplashRef.current.visible = true;
            inkSplashRef.current.position.set(clickX, clickY, 0.17);
            inkSplashRef.current.rotation.z = (Math.random() - 0.5) * 0.8;
            inkSplashRef.current.scale.set(0, 0, 0);
            inkSplashRef.current.material.opacity = 1;

            gsap.to(inkSplashRef.current.scale, {
                x: 0.72,
                y: 0.72,
                z: 1,
                duration: 0.3,
                ease: 'back.out(1.8)',
            });
            gsap.to(inkSplashRef.current.material, {
                opacity: 0,
                duration: 0.7,
                delay: 0.55,
                ease: 'power2.out',
                onComplete: () => {
                    if (inkSplashRef.current) {
                        inkSplashRef.current.visible = false;
                    }
                },
            });
        }

        // 3. Sketchy "BUG FIXED!" floating text popup
        if (textRef.current) {
            gsap.killTweensOf([textRef.current.position, textRef.current.scale, textRef.current]);
            textRef.current.visible = true;
            textRef.current.position.set(clickX, clickY + 0.08, 0.35);
            textRef.current.rotation.z = (Math.random() - 0.5) * 0.14;
            textRef.current.scale.set(0.25, 0.25, 1);
            textRef.current.fillOpacity = 1;
            textRef.current.outlineOpacity = 1;

            gsap.to(textRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.32,
                ease: 'back.out(2.2)',
            });
            gsap.to(textRef.current.position, {
                y: clickY + 0.58,
                duration: 1.2,
                ease: 'power2.out',
            });
            gsap.to(textRef.current, {
                fillOpacity: 0,
                outlineOpacity: 0,
                duration: 0.45,
                delay: 0.75,
                ease: 'power2.in',
                onComplete: () => {
                    if (textRef.current) {
                        textRef.current.visible = false;
                    }
                },
            });
        }

        // 4. Respawn a replacement bug crawling in from the wall edge / behind tree
        stateRef.current = 'respawning';
        if (respawnTimerRef.current) {
            clearTimeout(respawnTimerRef.current);
        }
        respawnTimerRef.current = setTimeout(() => {
            if (!bugRef.current) return;
            gsap.killTweensOf([bugRef.current.scale, bugRef.current.material]);

            phaseOffsetRef.current += 1.7;
            speedRef.current = 0.88 + Math.random() * 0.28;
            spawnStartRef.current = 'pending';
            prevPosRef.current = { x: slot.entryX, y: floorY + slot.entryOffsetY };

            bugRef.current.position.set(slot.entryX, floorY + slot.entryOffsetY, 0.16);
            bugRef.current.scale.set(1, 1, 1);
            bugRef.current.material.opacity = 1;
            bugRef.current.visible = true;
            stateRef.current = 'crawling';
        }, slot.respawnMs);
    };

    const handlePointerEnter = (e) => {
        e.stopPropagation();
        if (stateRef.current === 'crawling') {
            document.body.style.cursor = 'pointer';
        }
    };

    const handlePointerLeave = () => {
        document.body.style.cursor = 'auto';
    };

    return (
        <group>
            <mesh
                ref={bugRef}
                position={[slot.homeX, floorY + slot.offsetY, 0.16]}
                onClick={handleClick}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                <planeGeometry args={[slot.size, slot.size]} />
                <meshBasicMaterial
                    color="#e0e0e0"
                    map={bugTexture}
                    transparent={true}
                    alphaTest={0.01}
                    depthWrite={false}
                />
            </mesh>

            {/* Kept mounted so texture/shader stays warm */}
            <mesh
                ref={inkSplashRef}
                position={[slot.homeX, floorY + slot.offsetY, 0.17]}
                scale={[0, 0, 0]}
                visible={false}
            >
                <planeGeometry args={[1.8, 1.8]} />
                <meshBasicMaterial
                    color="#e0e0e0"
                    map={inkSplashTexture}
                    transparent={true}
                    alphaTest={0.01}
                    depthWrite={false}
                />
            </mesh>

            {/* Kept mounted so CabinSketch font atlas stays preloaded */}
            <Text
                ref={textRef}
                position={[slot.homeX, floorY + slot.offsetY, 0.35]}
                fontSize={0.23}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                font="/fonts/CabinSketch-Bold.ttf"
                outlineWidth={0.015}
                outlineColor="#ffffff"
                fillOpacity={0}
                outlineOpacity={0}
                scale={[0, 0, 0]}
                visible={false}
            >
                BUG FIXED!
            </Text>
        </group>
    );
};

/**
 * Swarm of 4 independent hand-drawn wall bugs for the Entrance brick facade.
 */
const EntranceBugs = ({ floorY = -1.75 }) => {
    const bugTexture = useTexture('/textures/entrance/bug_sketch.webp');
    const inkSplashTexture = useTexture('/images/ink-splash.webp');
    const { isMuted, play, enableAudio } = useAudio();

    const handleSquash = () => {
        if (!isMuted) {
            enableAudio();
            play('baloonpoop', { volume: 0.4 });
        }
    };

    return (
        <group>
            {BUG_SLOTS.map((slot) => (
                <CrawlingBugSlot
                    key={slot.id}
                    slot={slot}
                    floorY={floorY}
                    bugTexture={bugTexture}
                    inkSplashTexture={inkSplashTexture}
                    onSquash={handleSquash}
                />
            ))}
        </group>
    );
};

export default EntranceBugs;
