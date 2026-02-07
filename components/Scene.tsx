'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls, Stars, DepthOfField, EffectComposer, Bloom, Noise, Glitch } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { Vector3 } from 'three';

const NebulaParticles = () => {
  const points = useRef<THREE.Points>(null!);
  const count = 10000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    // Nebula cloud positions
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

    // Neon cyberpunk colors (pink/cyan/purple gradients)
    const color = new THREE.Color();
    const hue = Math.random() * 0.2 + 0.7; // Cyan-purple range
    color.setHSL(hue, 1, 0.5 + Math.random() * 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = Math.random() * 3 + 0.5;
  }

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.1;
      points.current.rotation.x += delta * 0.05;
      
      // Gentle nebula drift
      points.current.position.z += delta * 0.5;
      if (points.current.position.z > 100) {
        points.current.position.z = -100;
      }
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        size={0.005}
        sizeAttenuation={true}
        depthWrite={false}
        color="hotpink"
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const NeonOrbs = () => {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.01;
      group.current.children.forEach((child, i) => {
        child.position.y = Math.sin(state.clock.elapsedTime + i) * 2;
        child.rotation.x += 0.01;
        child.rotation.y += 0.005;
      });
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 10, 0, Math.cos(i) * 10]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshBasicMaterial 
            color={['#ff00ff', '#00ffff', '#8a2be2', '#00ff00', '#ff4500', '#ffff00'][i % 6]}
            transparent
            opacity={0.6}
            emissive={['#ff00ff', '#00ffff', '#8a2be2', '#00ff00', '#ff4500', '#ffff00'][i % 6]}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

const Scene = ({ onLoad }: { onLoad?: () => void }) => {
  return (
    <div className="fixed inset-0 z-0 w-screen h-screen">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />
          <NebulaParticles />
          <NeonOrbs />
          <EffectComposer>
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
            <Noise opacity={0.02} />
            <Glitch />
            <DepthOfField focalLength={0} />
          </EffectComposer>
        </Suspense>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
};

export default Scene;
