import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import { RedBullCan, FlavorConfig } from './RedBullCan';
import { ParticleField } from './ParticleField';

interface Canvas3DProps {
  scrollProgress: number;
  activeFlavor: FlavorConfig;
  mousePos: { x: number; y: number };
  onCanClick?: () => void;
}

export const Canvas3D: React.FC<Canvas3DProps> = ({
  scrollProgress,
  activeFlavor,
  mousePos,
  onCanClick,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full pointer-events-auto"
      >
        <Suspense fallback={null}>
          {/* Ambient & Studio Key Lighting */}
          <ambientLight intensity={1.2} />
          
          {/* Main Key Light */}
          <directionalLight
            position={[5, 6, 5]}
            intensity={2.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Fill Light */}
          <directionalLight
            position={[-5, 2, -2]}
            intensity={1.4}
            color="#8fb4ff"
          />

          {/* Reactive Rim Light (changes with active flavor) */}
          <spotLight
            position={[0, 4, -4]}
            intensity={4.5}
            color={activeFlavor.accentColor}
            angle={0.6}
            penumbra={1}
          />

          {/* Under-glow for aerodynamic stadium lighting */}
          <pointLight
            position={[0, -3, 2]}
            intensity={2.0}
            color={activeFlavor.lightColor}
          />

          {/* Environment Studio Reflections */}
          <Environment preset="city" />

          {/* Floating Carbonation & Energy Particle System */}
          <ParticleField
            scrollProgress={scrollProgress}
            activeFlavor={activeFlavor}
          />

          {/* Interactive 3D Red Bull Can */}
          <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
            floatingRange={[-0.05, 0.05]}
          >
            <RedBullCan
              scrollProgress={scrollProgress}
              activeFlavor={activeFlavor}
              onCanClick={onCanClick}
              mousePos={mousePos}
            />
          </Float>

          {/* Dynamic Ground Contact Shadow */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.6}
            scale={6}
            blur={2.4}
            far={4}
            color="#000518"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
