import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '../utils/motion';

interface ModelProps {
  isDraggingRef: React.MutableRefObject<boolean>;
  dragDeltaRef: React.MutableRefObject<number>;
}

const CanModel: React.FC<ModelProps> = ({ isDraggingRef, dragDeltaRef }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/redbull_can.glb');
  const drops = useTexture('/textures/can-drops-normal.webp', (t) => {
    const tex = t as THREE.Texture;
    tex.flipY = false; // glTF UV convention
    tex.wrapS = THREE.RepeatWrapping;
    tex.colorSpace = THREE.NoColorSpace;
    tex.anisotropy = 8;
  });

  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.sub(center);

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          if (mat.name === 'label') {
            // Wet can, matching the drafts: smooth metal under a clear coat carrying the bead normals
            mesh.material = new THREE.MeshPhysicalMaterial({
              name: 'label',
              map: mat.map,
              color: mat.color,
              side: mat.side,
              metalness: 0.85,
              roughness: 0.28,
              envMapIntensity: 1.2,
              clearcoat: 0.85,
              clearcoatRoughness: 0.06,
              clearcoatNormalMap: drops,
              clearcoatNormalScale: new THREE.Vector2(0.75, 0.75),
            });
            return;
          }
          mat.roughnessMap = null;
          mat.metalnessMap = null;
          mat.metalness = 0.9;
          mat.roughness = 0.2;
          mat.envMapIntensity = 1.8;
          mesh.material = mat;
        }
      }
    });

    return cloned;
  }, [scene, drops]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Apply drag rotation
    if (dragDeltaRef.current !== 0) {
      groupRef.current.rotation.y += dragDeltaRef.current;
      dragDeltaRef.current = 0;
    } else if (!isDraggingRef.current && !prefersReducedMotion()) {
      // Slow turntable auto-rotation (strictly disabled under reduced motion)
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} scale={[15.5, 15.5, 15.5]} position={[0, 0.02, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
};

useGLTF.preload('/models/redbull_can.glb');
useTexture.preload('/textures/can-drops-normal.webp');

class WebGLErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('WebGL render error fallback:', error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export const TurntableCan: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isNarrow, setIsNarrow] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const dragDeltaRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());

    const checkNarrow = () => {
      setIsNarrow(window.innerWidth < 768);
    };
    checkNarrow();
    window.addEventListener('resize', checkNarrow);
    return () => window.removeEventListener('resize', checkNarrow);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    dragDeltaRef.current += dx * 0.007;
    startXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const fallbackImage = (
    <div className="w-full h-full flex items-center justify-center bg-paper/60 p-4 border border-slate/20">
      <img
        src="/drafts/posters/original.jpg"
        alt="Red Bull Can"
        className="max-h-[85%] max-w-[85%] object-contain contrast-110"
      />
    </div>
  );

  if (!hasWebGL) {
    return fallbackImage;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing flex items-center justify-center ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="region"
      aria-label="3D Red Bull Can turntable. Drag horizontally to spin."
    >
      <WebGLErrorBoundary fallback={fallbackImage}>
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 38 }}
          dpr={isNarrow ? 1 : [1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 6, 5]} intensity={2.4} castShadow />
          <directionalLight position={[-5, 2, -2]} intensity={0.9} color="#e5ecf6" />
          <directionalLight position={[0, -3, 2]} intensity={0.6} />

          <Environment preset="city" />

          <Suspense fallback={null}>
            <CanModel
              isDraggingRef={isDraggingRef}
              dragDeltaRef={dragDeltaRef}
            />

            <ContactShadows
              position={[0, -1.85, 0]}
              opacity={0.4}
              scale={6.0}
              blur={2.4}
              far={4.0}
              color="#0E1116"
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>

      {/* Floating subtle drag hint */}
      <div className="absolute bottom-4 right-4 pointer-events-none font-utility text-[10px] tracking-utility text-slate/70">
        DRAG TO SPIN // 3D TURNTABLE
      </div>
    </div>
  );
};
