"use client"

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  z: number
  size: number
  delay: number
  color: string
}

export default function ParticleSphere3D({
  isExpanded,
}: {
  isExpanded: boolean
}) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const mouse = {
    x: useMotionValue(0.5),
    y: useMotionValue(0.5),
  }

  const smoothMouse = {
    x: useSpring(mouse.x, { stiffness: 75, damping: 100, mass: 3 }),
    y: useSpring(mouse.y, { stiffness: 75, damping: 100, mass: 3 }),
  }

  const rotateX = useTransform(smoothMouse.y, [0, 1], [-0.5, 0.5])
  const rotateY = useTransform(smoothMouse.x, [0, 1], [-0.5, 0.5])

  useAnimationFrame((time) => {
    const baseRotation = time / 8000
    setRotation({ x: rotateX.get(), y: baseRotation + rotateY.get() })
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouse.x.set(e.clientX / innerWidth)
      mouse.y.set(e.clientY / innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    const generateSphereParticles = () => {
      const newParticles: Particle[] = []
      const particleCount = 250
      const radius = 120
      const colors = ["#FFFFFF", "#B4B4FF", "#6A6AFF", "#3b82f6", "#8A2BE2"]

      for (let i = 0; i < particleCount; i++) {
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
          size: 1.2 + Math.random() * 1.8,
          delay: Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      setParticles(newParticles)
    }

    generateSphereParticles()

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouse.x, mouse.y, rotateX, rotateY])

  if (isExpanded) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => {
          const { x, y, z } = particle

          // Rotação
          const rY = x * Math.cos(rotation.y) - z * Math.sin(rotation.y)
          const rZ = x * Math.sin(rotation.y) + z * Math.cos(rotation.y)

          const rX = y * Math.cos(rotation.x) - rZ * Math.sin(rotation.x)
          const finalZ = y * Math.sin(rotation.x) + rZ * Math.cos(rotation.x)

          const perspective = 300
          const scale = perspective / (perspective + finalZ)
          const projectedX = rY * scale
          const projectedY = rX * scale

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size * scale,
                height: particle.size * scale,
                left: "50%",
                top: "40%",
                backgroundColor: particle.color,
                boxShadow: `0 0 10px ${particle.color}`,
                opacity: Math.max(0.2, scale),
              }}
              initial={{
                x: projectedX,
                y: projectedY,
              }}
              animate={{
                x: projectedX * 20 + (Math.random() - 0.5) * 1500,
                y: projectedY * 20 + (Math.random() - 0.5) * 1500,
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
    <div className="relative mb-12" ref={containerRef}>
      <motion.div
        className="relative w-80 h-80 mx-auto"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {particles.map((particle) => {
          const { x, y, z } = particle

          // Rotação Y
          const rotatedY_X = x * Math.cos(rotation.y) - z * Math.sin(rotation.y)
          const rotatedY_Z = x * Math.sin(rotation.y) + z * Math.cos(rotation.y)

          // Rotação X
          const rotatedX_Y =
            y * Math.cos(rotation.x) - rotatedY_Z * Math.sin(rotation.x)
          const finalZ =
            y * Math.sin(rotation.x) + rotatedY_Z * Math.cos(rotation.x)

          const perspective = 300
          const scale = perspective / (perspective + finalZ)
          const projectedX = rotatedY_X * scale
          const projectedY = rotatedX_Y * scale

          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size * scale,
                height: particle.size * scale,
                left: "50%",
                top: "50%",
                backgroundColor: particle.color,
                boxShadow: `0 0 8px ${particle.color}`,
                opacity: Math.max(0.3, scale),
                zIndex: Math.round(scale * 100),
              }}
              animate={{
                x: [projectedX, projectedX * 1.05, projectedX],
                y: [projectedY, projectedY * 1.05, projectedY],
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

        {/* Glow central */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/15 to-transparent rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Anel de luz */}
        <motion.div
          className="absolute inset-8 border border-white/20 rounded-full"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )
}
