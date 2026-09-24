import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FlavorConfig } from './RedBullCan';

interface ParticleFieldProps {
  scrollProgress: number;
  activeFlavor: FlavorConfig;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ activeFlavor }) => {
  const bubblesCount = 120;
  const streaksCount = 60;

  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const streaksRef = useRef<THREE.LineSegments>(null);

  // Initialize random particle seeds
  const bubbleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < bubblesCount; i++) {
      data.push({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 7,
        z: (Math.random() - 0.5) * 4,
        speed: 0.8 + Math.random() * 1.5,
        size: 0.02 + Math.random() * 0.045,
        wobbleSpeed: 2 + Math.random() * 3,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  // Initialize aerodynamic speed lines
  const streakPositions = useMemo(() => {
    const pos = new Float32Array(streaksCount * 6); // 2 vertices per streak
    for (let i = 0; i < streaksCount; i++) {
      const x = (Math.random() - 0.5) * 7;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 4;
      const len = 0.4 + Math.random() * 0.8;

      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;

      pos[i * 6 + 3] = x;
      pos[i * 6 + 4] = y + len;
      pos[i * 6 + 5] = z;
    }
    return pos;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Frame animation: float bubbles upward with carbonation effervescence
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (bubblesRef.current) {
      for (let i = 0; i < bubblesCount; i++) {
        const b = bubbleData[i];
        b.y += b.speed * delta * 0.9;
        if (b.y > 4) {
          b.y = -3.8;
          b.x = (Math.random() - 0.5) * 5;
        }

        const wobbleX = Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * 0.03;
        const wobbleZ = Math.cos(time * b.wobbleSpeed + b.wobbleOffset) * 0.03;

        dummy.position.set(b.x + wobbleX, b.y, b.z + wobbleZ);
        dummy.scale.set(b.size, b.size, b.size);
        dummy.updateMatrix();
        bubblesRef.current.setMatrixAt(i, dummy.matrix);
      }
      bubblesRef.current.instanceMatrix.needsUpdate = true;
    }

    if (streaksRef.current) {
      const positions = streaksRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < streaksCount; i++) {
        positions[i * 6 + 1] += delta * 4;
        positions[i * 6 + 4] += delta * 4;

        if (positions[i * 6 + 1] > 5) {
          positions[i * 6 + 1] = -5;
          positions[i * 6 + 4] = -4.3;
        }
      }
      streaksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Carbonation Bubbles */}
      <instancedMesh
        ref={bubblesRef}
        args={[undefined, undefined, bubblesCount]}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial
          color={activeFlavor.accentColor}
          emissive={activeFlavor.accentColor}
          emissiveIntensity={0.6}
          transmission={0.8}
          roughness={0.1}
          metalness={0.1}
          transparent
          opacity={0.7}
        />
      </instancedMesh>

      {/* Speed Streaks */}
      <lineSegments ref={streaksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[streakPositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={activeFlavor.accentColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};
