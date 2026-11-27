/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture, useCursor } from '@react-three/drei';
import * as THREE from 'three';

const PAPER_WIDTH = 1.51; // Legacy ratio 1197/1340
const PAPER_HEIGHT = 1.7;
const FONT_PATH = '/fonts/CabinSketch-Regular.ttf';
const CONTACT_EMAIL = 'amitkumaryadav4444s@gmail.com';

// Helper: Smooth Animated Button matching hand-drawn paper styling
const SmoothButton = ({ texture, onClick, position, size, text, fontPath, fontSize = 0.055 }) => {
    const groupRef = useRef();
    const [hovered, setHovered] = useState(false);
    useCursor(hovered);

    const targetY = hovered ? position[1] + 0.007 : position[1];
    const targetRotZ = hovered ? 0.015 : 0;

    useFrame((state, delta) => {
        const t = delta * 12;
        if (groupRef.current) {
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, t);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, t);
            groupRef.current.scale.set(1, 1, 1);
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={(e) => {
                e.stopPropagation();
                onClick && onClick();
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={size} />
                <meshBasicMaterial
                    color="#e0e0e0"
                    map={texture}
                    transparent
                    alphaTest={0.1}
                />
            </mesh>
            {text && (
                <Text
                    renderOrder={1}
                    position={[0, 0.005, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={fontSize}
                    color={hovered ? '#111111' : '#333333'}
                    font={fontPath}
                    anchorX="center"
                    anchorY="middle"
                >
                    {text}
                </Text>
            )}
        </group>
    );
};

const MessagePaper = ({ position = [0, 0.05, 2], onSend, onBack }) => {
    const groupRef = useRef();
    const paperRef = useRef();
    const backPaperRef = useRef();
    const copyTimerRef = useRef(null);

    const [copied, setCopied] = useState(false);
    const [backHovered, setBackHovered] = useState(false);
    useCursor(backHovered);

    // Load textures
    const paperTexture = useTexture('/textures/contact/paper_form.webp');
    const buttonTexture = useTexture('/textures/contact/send_button.webp');

    // Configure textures
    useEffect(() => {
        if (paperTexture) paperTexture.colorSpace = THREE.SRGBColorSpace;
        if (buttonTexture) buttonTexture.colorSpace = THREE.SRGBColorSpace;
    }, [paperTexture, buttonTexture]);

    useEffect(() => {
        return () => {
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        };
    }, []);

    // Copy Gmail to clipboard with brief "Copied!" feedback
    const handleCopyEmail = useCallback(async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(CONTACT_EMAIL);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = CONTACT_EMAIL;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setCopied(true);
            onSend?.({ action: 'copy', email: CONTACT_EMAIL });
            if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
            copyTimerRef.current = setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback: prompt user if clipboard permissions are blocked
            window.prompt('Copy Gmail address:', CONTACT_EMAIL);
        }
    }, [onSend]);

    // Open visitor's default mail client
    const handleOpenMailApp = useCallback(() => {
        onSend?.({ action: 'mailto', email: CONTACT_EMAIL });
        window.location.href = `mailto:${CONTACT_EMAIL}`;
    }, [onSend]);

    // Gentle paper flutter animation
    useFrame((state) => {
        if (!paperRef.current) return;
        const time = state.clock.getElapsedTime();
        paperRef.current.rotation.z = Math.sin(time * 0.5) * 0.005;
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Main Paper Mesh - FRONT (with hand-drawn form texture) */}
            <mesh ref={paperRef} rotation={[-Math.PI / 2, 0, 0]} onClick={(e) => e.stopPropagation()}>
                <planeGeometry args={[PAPER_WIDTH, PAPER_HEIGHT, 20, 20]} />
                <meshBasicMaterial
                    color="#e0e0e0"
                    map={paperTexture}
                    transparent
                    alphaTest={0.5}
                    side={THREE.FrontSide}
                    roughness={0.9}
                />
            </mesh>

            {/* Paper BACK (white) */}
            <mesh ref={backPaperRef} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[PAPER_WIDTH, PAPER_HEIGHT, 20, 20]} />
                <meshBasicMaterial
                    color="#f5f5f0"
                    side={THREE.BackSide}
                    roughness={0.9}
                />
            </mesh>

            {/* Top Box 1: Heading */}
            <Text
                renderOrder={1}
                position={[0, 0.008, -0.61]}
                rotation={[-Math.PI / 2, 0, 0.02]}
                fontSize={0.06}
                color="#1a1a1a"
                font={FONT_PATH}
                anchorX="center"
                anchorY="middle"
            >
                DIRECT GMAIL
            </Text>

            {/* Top Box 2: Gmail Address */}
            <Text
                renderOrder={1}
                position={[0, 0.008, -0.46]}
                rotation={[-Math.PI / 2, 0, 0.02]}
                fontSize={0.044}
                color="#111111"
                font={FONT_PATH}
                anchorX="center"
                anchorY="middle"
                maxWidth={PAPER_WIDTH * 0.84}
            >
                {CONTACT_EMAIL}
            </Text>

            {/* Body Area: Short note */}
            <Text
                renderOrder={1}
                position={[0, 0.008, -0.14]}
                rotation={[-Math.PI / 2, 0, 0.02]}
                fontSize={0.048}
                color="#333333"
                font={FONT_PATH}
                anchorX="center"
                anchorY="middle"
                maxWidth={PAPER_WIDTH * 0.72}
                textAlign="center"
                lineHeight={1.4}
            >
                {"Reach out directly for web apps,\nAI/ML tools, or embedded builds."}
            </Text>

            {/* Action 1: Copy Gmail Button */}
            <SmoothButton
                texture={buttonTexture}
                onClick={handleCopyEmail}
                position={[0, 0.005, 0.14]}
                size={[0.76, 0.19]}
                text={copied ? 'COPIED!' : 'COPY GMAIL'}
                fontPath={FONT_PATH}
                fontSize={0.056}
            />

            {/* Action 2: Open Mail App Button */}
            <SmoothButton
                texture={buttonTexture}
                onClick={handleOpenMailApp}
                position={[0, 0.005, 0.38]}
                size={[0.76, 0.19]}
                text="OPEN MAIL APP"
                fontPath={FONT_PATH}
                fontSize={0.056}
            />

            {/* Copied feedback note */}
            {copied && (
                <Text
                    renderOrder={1}
                    position={[0, 0.01, 0.56]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={0.04}
                    color="#228844"
                    font={FONT_PATH}
                    anchorX="center"
                    anchorY="middle"
                >
                    Copied {CONTACT_EMAIL}
                </Text>
            )}

            {/* Back to social barrels */}
            {onBack && (
                <group
                    position={[0, 0.008, 0.70]}
                    onClick={(e) => {
                        e.stopPropagation();
                        onBack();
                    }}
                    onPointerOver={() => setBackHovered(true)}
                    onPointerOut={() => setBackHovered(false)}
                >
                    <Text
                        renderOrder={1}
                        rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.042}
                        color={backHovered ? '#111111' : '#555555'}
                        font={FONT_PATH}
                        anchorX="center"
                        anchorY="middle"
                    >
                        ← BACK TO LINKS
                    </Text>
                </group>
            )}
        </group>
    );
};

export default MessagePaper;
