import React, { useRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../utils/audio';
import { canScreen, CAN_SPIN_EVENT } from '../three/canScreen';

export interface FlavorConfig {
  id: string;
  name: string;
  tagline: string;
  accentColor: string;
  lightColor: string;
  emissiveColor: string;
  tintHex?: string;
  tasteNotes: string[];
}

export const FLAVORS: FlavorConfig[] = [
  {
    id: 'original',
    name: 'Original Energy',
    tagline: 'The Iconic Classic // Vitalizes Body and Mind',
    accentColor: '#ED1B2D',
    lightColor: '#0055B8',
    emissiveColor: '#101738',
    tintHex: '#ffffff',
    tasteNotes: ['Crisp Alpine Carbonation', 'Signature Taurine Kick', 'Tart Citrus Balance'],
  },
  {
    id: 'sugarfree',
    name: 'Sugarfree Edition',
    tagline: 'Zero Sugar // 100% Adrenaline Rush',
    accentColor: '#00D8FF',
    lightColor: '#00D8FF',
    emissiveColor: '#003366',
    tintHex: '#88e0ff',
    tasteNotes: ['Zero Calorie Peak Flow', 'Ultra Crisp Finish', 'Clean Mental Focus'],
  },
  {
    id: 'red',
    name: 'The Red Edition',
    tagline: 'Wild Watermelon // Intense Crimson Power',
    accentColor: '#FF2A3D',
    lightColor: '#FF1133',
    emissiveColor: '#44000d',
    tintHex: '#ff4d64',
    tasteNotes: ['Juicy Watermelon Rush', 'High Energy Punch', 'Exotic Sweet Undertone'],
  },
  {
    id: 'yellow',
    name: 'The Yellow Edition',
    tagline: 'Tropical Fusion // Exotic Sunshine Velocity',
    accentColor: '#FFC800',
    lightColor: '#FFA500',
    emissiveColor: '#442b00',
    tintHex: '#ffe066',
    tasteNotes: ['Ripe Passionfruit & Mango', 'Electric Citrus Spark', 'Summer Race Energy'],
  },
  {
    id: 'winter',
    name: 'The Winter Edition',
    tagline: 'Iced Vanilla Berry // Glacial Alpine Surge',
    accentColor: '#00FFA3',
    lightColor: '#00E5FF',
    emissiveColor: '#003322',
    tintHex: '#7fffd4',
    tasteNotes: ['Frosty Forest Berries', 'Smooth Vanilla Echo', 'Sub-Zero Peak Rush'],
  },
];

interface RedBullCanProps {
  scrollProgress: number; // 0 to 1
  activeFlavor: FlavorConfig;
  onCanClick?: () => void;
  mousePos: { x: number; y: number };
}

export const RedBullCan: React.FC<RedBullCanProps> = ({
  scrollProgress,
  activeFlavor,
  onCanClick,
  mousePos,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, rotX: 0, rotY: 0 });
  const { scene } = useGLTF('/models/redbull_can.glb');

  // Clone scene so we can adjust materials per flavor without affecting cached instances
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    
    // Auto-center and normalize bounding box
    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.sub(center);

    // Enhance metallic & roughness for high-end look
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.envMapIntensity = 2.4;
          
          if (mat.name === 'label') {
            // Pristine metallic aluminum Red Bull can
            // Remove the dark blue photo that was making water drops look opaque and dark
            mat.roughnessMap = null;
            mat.metalnessMap = null;
            mat.metalness = 0.88;
            mat.roughness = 0.22;
            
            // Water droplets as subtle translucent surface condensation
            if (mat.normalMap) {
              mat.normalScale = new THREE.Vector2(0.04, 0.04);
            }
          } else if (mat.name === 'silver' || mat.name === 'top_part' || mat.name === 'tab') {
            mat.metalness = 0.95;
            mat.roughness = 0.18;
          }
          mesh.material = mat;
        }
      }
    });

    return cloned;
  }, [scene]);

  // Model dimensions (local, pre-scale) for projecting the can axis to the screen
  const canDims = useMemo(() => {
    const size = new THREE.Box3().setFromObject(clonedScene).getSize(new THREE.Vector3());
    return { halfH: size.y / 2 };
  }, [clonedScene]);
  const axisTop = useMemo(() => new THREE.Vector3(), []);
  const axisBottom = useMemo(() => new THREE.Vector3(), []);

  // Preloader hand-off: one full spin that settles through the existing drag inertia
  useEffect(() => {
    const spin = () => {
      dragRef.current.rotY -= Math.PI * 2;
    };
    window.addEventListener(CAN_SPIN_EVENT, spin);
    return () => window.removeEventListener(CAN_SPIN_EVENT, spin);
  }, []);

  // Update material tint when flavor changes
  useEffect(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && mat.name === 'label') {
          if (activeFlavor.id === 'original') {
            mat.color.set('#ffffff');
            mat.emissive.set('#000000');
          } else {
            mat.color.set(activeFlavor.tintHex || '#ffffff');
            mat.emissive.set(activeFlavor.emissiveColor);
            mat.emissiveIntensity = 0.35;
          }
        }
      }
    });
  }, [clonedScene, activeFlavor]);

  // Handle pointer drag rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    audio.playClick();
    if (onCanClick) onCanClick();
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.rotY += dx * 0.008;
    dragRef.current.rotX += dy * 0.008;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;

    const dragSpeed = Math.hypot(dx, dy);
    if (dragSpeed > 2) {
      audio.feedScrollVelocity(dragSpeed * 2.2);
    }
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Frame update: interpolate scroll choreography + idle breathing + drag
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = scrollProgress; // 0 to 6 (anchored to sections: 0=Hero, 1=Arenas, 2=Athletes, 3=Experience, 4=Anatomy, 5=Schedule, 6=Tickets)
    const time = state.clock.getElapsedTime();
    const width = window.innerWidth;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    // Responsive flank X coordinates
    const flankRightX = isMobile ? 0 : isTablet ? 1.05 : 1.65;
    const flankLeftX = isMobile ? 0 : isTablet ? -1.05 : -1.65;

    // Responsive Y offsets (on mobile, hovers above stacked cards)
    const heroY = -0.05;
    const arenasY = isMobile ? 0.35 : 0.05;
    const athletesY = isMobile ? 0.35 : 0.0;
    const experienceY = isMobile ? 0.4 : 0.2;
    const anatomyY = isMobile ? 0.35 : 0.0;
    const scheduleY = isMobile ? 0.4 : 0.05;

    // Responsive scale
    const scaleHero = isMobile ? 9.5 : isTablet ? 13 : 16.5;
    const scaleArenas = isMobile ? 8.5 : isTablet ? 13.5 : 17;
    const scaleAthletes = isMobile ? 8.5 : isTablet ? 13 : 16;
    const scaleExperience = isMobile ? 7.5 : isTablet ? 11.5 : 14.5;
    const scaleAnatomy = isMobile ? 9.0 : isTablet ? 14 : 18.5;
    const scaleSchedule = isMobile ? 8.0 : isTablet ? 11 : 14;
    const scaleTickets = isMobile ? 6.5 : isTablet ? 7.5 : 8.5;

    let targetX = 0;
    let targetY = heroY;
    let targetZ = 0.1;
    let targetRotX = 0.12;
    let targetRotY = -0.35;
    let targetRotZ = -0.06;
    let targetScale = scaleHero;

    if (t <= 1) {
      // 0 -> 1: Hero to Arenas
      const p = Math.max(0, Math.min(1, t));
      const smooth = THREE.MathUtils.smoothstep(p, 0, 1);
      targetX = THREE.MathUtils.lerp(0, flankRightX, smooth);
      targetY = THREE.MathUtils.lerp(heroY, arenasY, smooth);
      targetZ = THREE.MathUtils.lerp(0.1, 0.35, smooth);
      targetRotX = THREE.MathUtils.lerp(0.12, -0.18, smooth);
      targetRotY = THREE.MathUtils.lerp(-0.35, 1.15, smooth);
      targetRotZ = THREE.MathUtils.lerp(-0.06, -0.42, smooth);
      targetScale = THREE.MathUtils.lerp(scaleHero, scaleArenas, smooth);
    } else if (t <= 2) {
      // 1 -> 2: Arenas to Athletes
      const p = Math.min(1, t - 1);
      const smooth = THREE.MathUtils.smoothstep(p, 0, 1);
      targetX = THREE.MathUtils.lerp(flankRightX, flankLeftX, smooth);
      targetY = THREE.MathUtils.lerp(arenasY, athletesY, smooth);
      targetZ = THREE.MathUtils.lerp(0.35, 0.25, smooth);
      targetRotX = THREE.MathUtils.lerp(-0.18, 0.16, smooth);
      targetRotY = THREE.MathUtils.lerp(1.15, 2.8, smooth);
      targetRotZ = THREE.MathUtils.lerp(-0.42, 0.38, smooth);
      targetScale = THREE.MathUtils.lerp(scaleArenas, scaleAthletes, smooth);
    } else if (t <= 3) {
      // 2 -> 3: Athletes to Venue Experience
      const p = Math.min(1, t - 2);
      const smooth = THREE.MathUtils.smoothstep(p, 0, 1);
      targetX = THREE.MathUtils.lerp(flankLeftX, flankRightX, smooth);
      targetY = THREE.MathUtils.lerp(athletesY, experienceY, smooth);
      targetZ = THREE.MathUtils.lerp(0.25, -0.1, smooth);
      targetRotX = THREE.MathUtils.lerp(0.16, 0.22, smooth);
      targetRotY = THREE.MathUtils.lerp(2.8, 4.3, smooth);
      targetRotZ = THREE.MathUtils.lerp(0.38, -0.15, smooth);
      targetScale = THREE.MathUtils.lerp(scaleAthletes, scaleExperience, smooth);
    } else if (t <= 4) {
      // 3 -> 4: Venue Experience to Adrenaline / Formula
      const p = Math.min(1, t - 3);
      const smooth = THREE.MathUtils.smoothstep(p, 0, 1);
      targetX = flankRightX;
      targetY = THREE.MathUtils.lerp(experienceY, anatomyY, smooth);
      targetZ = THREE.MathUtils.lerp(-0.1, 0.45, smooth);
      targetRotX = THREE.MathUtils.lerp(0.22, 0.18, smooth);
      targetRotY = THREE.MathUtils.lerp(4.3, 5.6, smooth);
      targetRotZ = THREE.MathUtils.lerp(-0.15, -0.28, smooth);
      targetScale = THREE.MathUtils.lerp(scaleExperience, scaleAnatomy, smooth);
    } else if (t <= 5) {
      // 4 -> 5: Adrenaline to Schedule
      const p = Math.min(1, t - 4);
      const smooth = THREE.MathUtils.smoothstep(p, 0, 1);
      targetX = flankRightX;
      targetY = THREE.MathUtils.lerp(anatomyY, scheduleY, smooth);
      targetZ = THREE.MathUtils.lerp(0.45, -0.2, smooth);
      targetRotX = THREE.MathUtils.lerp(0.18, 0.25, smooth);
      targetRotY = THREE.MathUtils.lerp(5.6, 7.4, smooth);
      targetRotZ = THREE.MathUtils.lerp(-0.28, -0.15, smooth);
      targetScale = THREE.MathUtils.lerp(scaleAnatomy, scaleSchedule, smooth);
    } else {
      // 5 -> 6: Schedule to Tickets (Stratosphere Launch)
      const p = Math.min(1, t - 5);
      const smooth = THREE.MathUtils.smoothstep(p, 0, 1);
      targetX = THREE.MathUtils.lerp(flankRightX, 0, smooth);
      targetY = THREE.MathUtils.lerp(scheduleY, 4.5, smooth);
      targetZ = THREE.MathUtils.lerp(-0.2, -1.5, smooth);
      targetRotX = THREE.MathUtils.lerp(0.25, 1.35, smooth);
      targetRotY = THREE.MathUtils.lerp(7.4, 10.2, smooth);
      targetRotZ = THREE.MathUtils.lerp(-0.15, 0.5, smooth);
      targetScale = THREE.MathUtils.lerp(scaleSchedule, scaleTickets, smooth);
    }

    // Add gentle floating motion and mouse gyro parallax
    const idleY = Math.sin(time * 1.8) * 0.04;
    const idleRotY = Math.sin(time * 0.9) * 0.05;
    const mouseTiltX = mousePos.y * 0.15;
    const mouseTiltY = mousePos.x * 0.2;

    // Apply drag inertia decay
    if (!dragRef.current.isDragging) {
      dragRef.current.rotX *= 0.94;
      dragRef.current.rotY *= 0.94;
    }

    // Smoothly damp transform using delta for framerate independence
    const damping = Math.min(delta * 7.5, 1);
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * damping;
    groupRef.current.position.y += (targetY + idleY - groupRef.current.position.y) * damping;
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * damping;

    groupRef.current.rotation.x += (targetRotX + mouseTiltX + dragRef.current.rotX - groupRef.current.rotation.x) * damping;
    groupRef.current.rotation.y += (targetRotY + idleRotY + mouseTiltY + dragRef.current.rotY - groupRef.current.rotation.y) * damping;
    groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * damping;

    const currentScale = groupRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * damping;
    groupRef.current.scale.set(newScale, newScale, newScale);

    // Publish the can's screen pose for the preloader hand-off (read-only; no effect on motion)
    const { camera, size } = state;
    groupRef.current.updateWorldMatrix(true, false);
    axisTop.set(0, canDims.halfH, 0);
    axisBottom.set(0, -canDims.halfH, 0);
    groupRef.current.localToWorld(axisTop).project(camera);
    groupRef.current.localToWorld(axisBottom).project(camera);
    const tx = ((axisTop.x + 1) / 2) * size.width;
    const ty = ((1 - axisTop.y) / 2) * size.height;
    const bx = ((axisBottom.x + 1) / 2) * size.width;
    const by = ((1 - axisBottom.y) / 2) * size.height;
    const len = Math.hypot(tx - bx, ty - by);
    canScreen.cx = (tx + bx) / 2;
    canScreen.cy = (ty + by) / 2;
    canScreen.h = len;
    canScreen.angle = (Math.atan2(tx - bx, by - ty) * 180) / Math.PI;
    canScreen.valid = len > 0;
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      cursor="grab"
    >
      <primitive object={clonedScene} />
    </group>
  );
};

// Preload GLTF model
useGLTF.preload('/models/redbull_can.glb');
