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
  intensity: number
}

export default function ModernSphere3D({ isExpanded }: { isExpanded: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const generateSphereParticles = () => {
      const newParticles: Particle[] = []
      const particleCount = 200
      const radius = 130

      for (let i = 0; i < particleCount; i++) {
        // Distribuição esférica mais uniforme
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
          size: 1.5 + Math.random() * 3.5,
          delay: Math.random() * 3,
          intensity: 0.6 + Math.random() * 0.4,
        })
      }

      setParticles(newParticles)
    }

    generateSphereParticles()

    // Rotação contínua mais suave
    const rotationInterval = setInterval(() => {
      setRotation((prev) => prev + 0.3)
    }, 50)

    return () => clearInterval(rotationInterval)
  }, [])

  if (isExpanded) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((particle) => {
          const rotatedX = particle.x * Math.cos(rotation * 0.01) - particle.z * Math.sin(rotation * 0.01)
          const rotatedZ = particle.x * Math.sin(rotation * 0.01) + particle.z * Math.cos(rotation * 0.01)

          const perspective = 400
          const scale = perspective / (perspective + rotatedZ)
          const projectedX = rotatedX * scale
          const projectedY = particle.y * scale

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size * scale * 2,
                height: particle.size * scale * 2,
                left: "50%",
                top: "25%",
                background: `radial-gradient(circle, rgba(168, 85, 247, ${particle.intensity}) 0%, rgba(236, 72, 153, ${particle.intensity * 0.8}) 50%, transparent 70%)`,
                boxShadow: `0 0 ${particle.size * 3}px rgba(168, 85, 247, ${particle.intensity}), 0 0 ${particle.size * 6}px rgba(236, 72, 153, ${particle.intensity * 0.5})`,
              }}
              initial={{
                x: projectedX,
                y: projectedY,
                scale: scale,
                opacity: particle.intensity,
              }}
              animate={{
                x: [
                  projectedX,
                  projectedX * 3 + (Math.random() - 0.5) * 800,
                  projectedX * 8 + (Math.random() - 0.5) * 1600,
                ],
                y: [
                  projectedY,
                  projectedY * 3 + (Math.random() - 0.5) * 800,
                  projectedY * 8 + (Math.random() - 0.5) * 1600,
                ],
                scale: [scale, scale * 2, 0],
                opacity: [particle.intensity, particle.intensity * 0.7, 0],
              }}
              transition={{
                duration: 3,
                delay: particle.delay * 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          )
        })}

        {/* Ondas de choque da explosão */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shockwave-${i}`}
            className="absolute border border-purple-500/30 rounded-full"
            style={{
              left: "50%",
              top: "25%",
              transform: "translate(-50%, -50%)",
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.8,
            }}
            animate={{
              width: 1200,
              height: 1200,
              opacity: 0,
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="relative mb-12">
      <motion.div
        className="relative w-96 h-96 mx-auto"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Glow de fundo */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 70%)",
            filter: "blur(20px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {particles.map((particle) => {
          const rotatedX = particle.x * Math.cos(rotation * 0.01) - particle.z * Math.sin(rotation * 0.01)
          const rotatedZ = particle.x * Math.sin(rotation * 0.01) + particle.z * Math.cos(rotation * 0.01)

          const perspective = 400
          const scale = perspective / (perspective + rotatedZ)
          const projectedX = rotatedX * scale
          const projectedY = particle.y * scale

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size * scale,
                height: particle.size * scale,
                left: "50%",
                top: "50%",
                background: `radial-gradient(circle, rgba(255, 255, 255, ${particle.intensity}) 0%, rgba(168, 85, 247, ${particle.intensity * 0.8}) 30%, rgba(236, 72, 153, ${particle.intensity * 0.6}) 60%, transparent 100%)`,
                boxShadow: `0 0 ${particle.size * 2}px rgba(168, 85, 247, ${particle.intensity}), 0 0 ${particle.size * 4}px rgba(236, 72, 153, ${particle.intensity * 0.5})`,
                zIndex: Math.round(scale * 100),
              }}
              animate={{
                x: [projectedX, projectedX * 1.08, projectedX],
                y: [projectedY, projectedY * 1.08, projectedY],
                scale: [scale, scale * 1.1, scale],
              }}
              transition={{
                duration: 4 + particle.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          )
        })}
      </motion.div>
    </div>
  )
}
