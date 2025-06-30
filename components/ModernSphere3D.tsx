"use client"

import {
  motion,
  MotionValue,
  useAnimationFrame,
  motionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface ParticleData {
  id: number
  x: number
  y: number
  z: number
  size: number
  delay: number
  intensity: number
  motionX: MotionValue<number>
  motionY: MotionValue<number>
  motionScale: MotionValue<number>
}

function Particle({
  particle,
  isExpanded,
}: {
  particle: ParticleData
  isExpanded: boolean
}) {
  const { size, intensity, delay, motionX, motionY, motionScale } = particle

  if (isExpanded) {
    return (
      <motion.div
        className="absolute rounded-full"
        style={{
          x: motionX,
          y: motionY,
          width: size * 2,
          height: size * 2,
          left: "50%",
          top: "25%",
          background: `radial-gradient(circle, rgba(168, 85, 247, ${intensity}) 0%, rgba(236, 72, 153, ${
            intensity * 0.8
          }) 50%, transparent 70%)`,
          boxShadow: `0 0 ${size * 3}px rgba(168, 85, 247, ${intensity}), 0 0 ${
            size * 6
          }px rgba(236, 72, 153, ${intensity * 0.5})`,
        }}
        initial={{
          scale: motionScale.get(),
          opacity: intensity,
        }}
        animate={{
          x: [
            motionX.get(),
            motionX.get() * 3 + (Math.random() - 0.5) * 800,
            motionX.get() * 8 + (Math.random() - 0.5) * 1600,
          ],
          y: [
            motionY.get(),
            motionY.get() * 3 + (Math.random() - 0.5) * 800,
            motionY.get() * 8 + (Math.random() - 0.5) * 1600,
          ],
          scale: [motionScale.get(), motionScale.get() * 2, 0],
          opacity: [intensity, intensity * 0.7, 0],
        }}
        transition={{
          duration: 3,
          delay: delay * 0.3,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      />
    )
  }

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        x: motionX,
        y: motionY,
        scale: motionScale,
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        background: `radial-gradient(circle, rgba(255, 255, 255, ${intensity}) 0%, rgba(168, 85, 247, ${
          intensity * 0.8
        }) 30%, rgba(236, 72, 153, ${intensity * 0.6}) 60%, transparent 100%)`,
        boxShadow: `0 0 ${size * 2}px rgba(168, 85, 247, ${intensity}), 0 0 ${
          size * 4
        }px rgba(236, 72, 153, ${intensity * 0.5})`,
      }}
    />
  )
}

export default function ModernSphere3D({ isExpanded }: { isExpanded: boolean }) {
  const [particles, setParticles] = useState<ParticleData[]>([])
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
    const baseRotation = time / 15000
    const rX = rotateX.get()
    const rY = baseRotation + rotateY.get()

    particles.forEach((particle) => {
      const { x, y, z } = particle
      const cosRX = Math.cos(rX)
      const sinRX = Math.sin(rX)
      const cosRY = Math.cos(rY)
      const sinRY = Math.sin(rY)

      const rotatedY_X = x * cosRY - z * sinRY
      const rotatedY_Z = x * sinRY + z * cosRY

      const rotatedX_Y = y * cosRX - rotatedY_Z * sinRX
      const finalZ = y * sinRX + rotatedY_Z * cosRX

      const perspective = 400
      const scale = Math.max(0, perspective / (perspective + finalZ))

      const projectedX = rotatedY_X * scale
      const projectedY = rotatedX_Y * scale

      particle.motionX.set(projectedX)
      particle.motionY.set(projectedY)
      particle.motionScale.set(scale)
    })
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouse.x.set(e.clientX / innerWidth)
      mouse.y.set(e.clientY / innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    const generateSphereParticles = () => {
      const newParticles: ParticleData[] = []
      const particleCount = 300
      const radius = 130

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
          size: 1.5 + Math.random() * 2.5,
          delay: Math.random() * 3,
          intensity: 0.6 + Math.random() * 0.4,
          motionX: motionValue(0),
          motionY: motionValue(0),
          motionScale: motionValue(1),
        })
      }

      setParticles(newParticles)
    }

    generateSphereParticles()

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouse.x, mouse.y])

  if (isExpanded) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        {particles.map((particle) => (
          <Particle key={particle.id} particle={particle} isExpanded={true} />
        ))}

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
    <div className="relative mb-12" ref={containerRef}>
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

        {particles.map((particle) => (
          <Particle key={particle.id} particle={particle} isExpanded={false} />
        ))}
      </motion.div>
    </div>
  )
}
