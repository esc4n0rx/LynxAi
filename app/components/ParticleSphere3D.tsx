"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  delay: number
  rotationSpeed: number
}

export default function ParticleSphere3D({ isExpanded }: { isExpanded: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const generateSphereParticles = () => {
      const newParticles: Particle[] = []
      const particleCount = 80
      const radius = 100

      for (let i = 0; i < particleCount; i++) {
        // Distribuição esférica usando coordenadas esféricas
        const phi = Math.acos(-1 + (2 * i) / particleCount)
        const theta = Math.sqrt(particleCount * Math.PI) * phi

        const x = radius * Math.cos(theta) * Math.sin(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(phi)

        newParticles.push({
          id: i,
          x,
          y,
          z,
          size: 1.5 + Math.random() * 2.5,
          delay: Math.random() * 2,
          rotationSpeed: 0.5 + Math.random() * 0.5,
        })
      }

      setParticles(newParticles)
    }

    generateSphereParticles()

    // Rotação contínua
    const rotationInterval = setInterval(() => {
      setRotation((prev) => prev + 0.5)
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [])

  if (isExpanded) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => {
          // Calcular posição 2D da projeção 3D
          const rotatedX = particle.x * Math.cos(rotation * 0.01) - particle.z * Math.sin(rotation * 0.01)
          const rotatedZ = particle.x * Math.sin(rotation * 0.01) + particle.z * Math.cos(rotation * 0.01)

          // Projeção perspectiva simples
          const perspective = 300
          const scale = perspective / (perspective + rotatedZ)
          const projectedX = rotatedX * scale
          const projectedY = particle.y * scale

          return (
            <motion.div
              key={particle.id}
              className="absolute bg-white rounded-full shadow-lg shadow-white/30"
              style={{
                width: particle.size * scale,
                height: particle.size * scale,
                left: "50%",
                top: "30%",
                opacity: Math.max(0.3, scale),
              }}
              initial={{
                x: projectedX,
                y: projectedY,
              }}
              animate={{
                x: projectedX * 15 + (Math.random() - 0.5) * 1200,
                y: projectedY * 15 + (Math.random() - 0.5) * 1200,
                opacity: 0,
                scale: 0,
              }}
              transition={{
                duration: 2.5,
                delay: particle.delay,
                ease: "easeOut",
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative mb-12">
      <motion.div
        className="relative w-80 h-80 mx-auto"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {particles.map((particle) => {
          // Rotação 3D
          const rotatedX = particle.x * Math.cos(rotation * 0.01) - particle.z * Math.sin(rotation * 0.01)
          const rotatedZ = particle.x * Math.sin(rotation * 0.01) + particle.z * Math.cos(rotation * 0.01)

          // Projeção perspectiva
          const perspective = 300
          const scale = perspective / (perspective + rotatedZ)
          const projectedX = rotatedX * scale
          const projectedY = particle.y * scale

          return (
            <motion.div
              key={particle.id}
              className="absolute bg-white rounded-full shadow-lg shadow-white/50"
              style={{
                width: particle.size * scale,
                height: particle.size * scale,
                left: "50%",
                top: "50%",
                opacity: Math.max(0.4, scale),
                zIndex: Math.round(scale * 100),
              }}
              animate={{
                x: [projectedX, projectedX * 1.1, projectedX],
                y: [projectedY, projectedY * 1.1, projectedY],
              }}
              transition={{
                duration: 3 + particle.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          )
        })}

        {/* Glow central */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Anel de luz */}
        <motion.div
          className="absolute inset-8 border border-white/20 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      </motion.div>
    </div>
  )
}
