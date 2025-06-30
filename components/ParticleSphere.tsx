"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

export default function ParticleSphere({ isExpanded }: { isExpanded: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      const particleCount = 50

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2
        const radius = 80 + Math.random() * 40
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        newParticles.push({
          id: i,
          x,
          y,
          size: 2 + Math.random() * 3,
          delay: Math.random() * 2,
        })
      }

      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  if (isExpanded) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-blue-400 rounded-full opacity-70"
            style={{
              width: particle.size,
              height: particle.size,
              left: "50%",
              top: "30%",
            }}
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              x: particle.x * 10 + (Math.random() - 0.5) * 1000,
              y: particle.y * 10 + (Math.random() - 0.5) * 1000,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
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
        className="relative w-64 h-64 mx-auto"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-blue-400 rounded-full opacity-70 shadow-lg shadow-blue-400/50"
            style={{
              width: particle.size,
              height: particle.size,
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [particle.x, particle.x * 1.2, particle.x],
              y: [particle.y, particle.y * 1.2, particle.y],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3 + particle.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}

        {/* Central glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent rounded-full"
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
      </motion.div>
    </div>
  )
}
