'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function CyberBox() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      ref={meshRef}
      scale={hovered ? 1.5 : 1}
      onPointerEnter={(event) => (event.stopPropagation(), setHovered(true))}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="text-4xl font-bold mb-8">
        3D AI Chat - Sm0ken420 🚀
      </div>
      <div className="w-[600px] h-[400px] border border-white/30 rounded-lg overflow-hidden">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <CyberBox />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          <OrbitControls />
        </Canvas>
      </div>
      <div className="mt-8 text-lg">
        Ready for Groq AI Chat integration...
      </div>
    </main>
  )
}