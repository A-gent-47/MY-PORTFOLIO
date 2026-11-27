import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Measured from mouse_hanging.webp (1024x1024 on a 6x8 plane resting at [-0.01, 0.02, 0] inside tree group):
// Top of cord attaches to tree branch at pixel (602, 595) -> offset (+0.5273, -0.6484).
const PIVOT_POSITION = [0.5173, -0.6284, 0];
const MESH_OFFSET = [-0.5273, 0.6484, 0];

const MAX_ANGLE = THREE.MathUtils.degToRad(50);
const GRAVITY_OVER_LENGTH = 18.0; // Natural pendulum restoring stiffness (rad/s^2)
const DAMPING = 1.45; // Viscous damping so swings decay smoothly after release
const DRAG_PIXELS_FOR_FULL_SWING = 220;

/**
 * Interactive hanging computer mouse & cord pinned to the left tree branch.
 * Supports pointer grab/drag with flick momentum and damped pendulum physics.
 */
const HangingMouse = ({ mouseTexture }) => {
    const pivotRef = useRef();
    const angleRef = useRef(0);
    const targetAngleRef = useRef(0);
    const angularVelRef = useRef(0);
    const isDraggingRef = useRef(false);
    const isHoveredRef = useRef(false);

    const dragStateRef = useRef({
        startX: 0,
        startAngle: 0,
        lastX: 0,
        lastTime: 0,
        dragVel: 0,
        maxDragPx: 0,
    });

    const cleanupListenersRef = useRef(null);

    useEffect(() => {
        return () => {
            if (cleanupListenersRef.current) {
                cleanupListenersRef.current();
            }
            if (isDraggingRef.current || isHoveredRef.current) {
                document.body.style.cursor = 'auto';
            }
        };
    }, []);

    useFrame(({ clock }, delta) => {
        if (!pivotRef.current) return;

        const dt = Math.min(delta, 0.05);

        if (isDraggingRef.current) {
            const follow = 1 - Math.exp(-24 * dt);
            angleRef.current = THREE.MathUtils.lerp(
                angleRef.current,
                targetAngleRef.current,
                follow
            );
        } else {
            // Damped nonlinear pendulum: theta'' = -(g/L)*sin(theta) - damping*theta'
            const angularAccel = -GRAVITY_OVER_LENGTH * Math.sin(angleRef.current);
            angularVelRef.current += angularAccel * dt;
            angularVelRef.current *= Math.exp(-DAMPING * dt);
            angleRef.current += angularVelRef.current * dt;

            if (angleRef.current > MAX_ANGLE) {
                angleRef.current = MAX_ANGLE;
                angularVelRef.current *= -0.3;
            } else if (angleRef.current < -MAX_ANGLE) {
                angleRef.current = -MAX_ANGLE;
                angularVelRef.current *= -0.3;
            }

            // Snap tiny residual oscillation cleanly to rest
            if (Math.abs(angleRef.current) < 0.0008 && Math.abs(angularVelRef.current) < 0.003) {
                angleRef.current = 0;
                angularVelRef.current = 0;
            }
        }

        pivotRef.current.rotation.z = angleRef.current;
        // Preserve subtle depth sway on X when near rest
        pivotRef.current.rotation.x = Math.sin(clock.elapsedTime * 1.5) * 0.035;
    });

    const handlePointerDown = (e) => {
        e.stopPropagation();
        e.nativeEvent?.stopPropagation?.();

        if (cleanupListenersRef.current) {
            cleanupListenersRef.current();
        }

        isDraggingRef.current = true;
        angularVelRef.current = 0;
        targetAngleRef.current = angleRef.current;
        document.body.style.cursor = 'grabbing';

        const now = performance.now();
        dragStateRef.current = {
            startX: e.clientX,
            startAngle: angleRef.current,
            lastX: e.clientX,
            lastTime: now,
            dragVel: 0,
            maxDragPx: 0,
        };

        const sensitivity =
            MAX_ANGLE / Math.min(Math.max(window.innerWidth * 0.25, 160), DRAG_PIXELS_FOR_FULL_SWING);

        const handlePointerMove = (moveEvent) => {
            if (!isDraggingRef.current) return;

            const state = dragStateRef.current;
            const currentNow = performance.now();
            const totalDx = moveEvent.clientX - state.startX;
            state.maxDragPx = Math.max(state.maxDragPx, Math.abs(totalDx));

            const nextTarget = THREE.MathUtils.clamp(
                state.startAngle + totalDx * sensitivity,
                -MAX_ANGLE,
                MAX_ANGLE
            );

            const stepDt = Math.max((currentNow - state.lastTime) / 1000, 0.004);
            const prevTarget = targetAngleRef.current;
            const instVel = THREE.MathUtils.clamp((nextTarget - prevTarget) / stepDt, -11, 11);

            state.dragVel = state.dragVel * 0.6 + instVel * 0.4;
            state.lastX = moveEvent.clientX;
            state.lastTime = currentNow;
            targetAngleRef.current = nextTarget;
        };

        const handlePointerUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;

            const state = dragStateRef.current;
            const timeSinceMove = performance.now() - state.lastTime;

            if (state.maxDragPx < 5) {
                // Click without dragging: give a gentle playful nudge
                const nudgeDir = angleRef.current >= 0 ? -1 : 1;
                angularVelRef.current += nudgeDir * 1.8;
            } else if (timeSinceMove < 100) {
                // Transfer flick momentum on release
                angularVelRef.current = THREE.MathUtils.clamp(state.dragVel * 0.85, -9, 9);
            }

            document.body.style.cursor = isHoveredRef.current ? 'grab' : 'auto';

            if (cleanupListenersRef.current) {
                cleanupListenersRef.current();
                cleanupListenersRef.current = null;
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);

        cleanupListenersRef.current = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    };

    const handlePointerEnter = (e) => {
        e.stopPropagation();
        isHoveredRef.current = true;
        if (!isDraggingRef.current) {
            document.body.style.cursor = 'grab';
        }
    };

    const handlePointerLeave = (e) => {
        e.stopPropagation();
        isHoveredRef.current = false;
        if (!isDraggingRef.current) {
            document.body.style.cursor = 'auto';
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
    };

    return (
        <group ref={pivotRef} position={PIVOT_POSITION}>
            {/* Hanging mouse & cord sprite offset so cord top sits cleanly on the pivot */}
            <mesh position={MESH_OFFSET}>
                <planeGeometry args={[6, 8]} />
                <meshBasicMaterial
                    color="#e0e0e0"
                    map={mouseTexture}
                    transparent={true}
                    alphaTest={0.01}
                    depthWrite={false}
                />
            </mesh>

            {/* Tight invisible hitbox around the cord and mouse body only */}
            <mesh
                position={[0, -0.85, 0.02]}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onClick={handleClick}
            >
                <planeGeometry args={[0.72, 1.75]} />
                <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    );
};

export default HangingMouse;
