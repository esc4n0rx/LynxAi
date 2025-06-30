"use client"

import {
  motion,
  MotionValue,
  useAnimationFrame,
  motionValue,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"

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
    // Calcular direção da explosão baseada na posição inicial
    const explosionX = particle.x * 8 + (Math.random() - 0.5) * 600
    const explosionY = particle.y * 8 + (Math.random() - 0.5) * 600

    return (
      <motion.div
        className="absolute rounded-full"
        style={{
          x: motionX,
          y: motionY,
          width: size * 1.5,
          height: size * 1.5,
          left: "50%",
          top: "25%",
          background: `radial-gradient(circle, rgba(168, 85, 247, ${intensity}) 0%, rgba(236, 72, 153, ${
            intensity * 0.8
          }) 50%, transparent 70%)`,
          boxShadow: `0 0 ${size * 2}px rgba(168, 85, 247, ${intensity}), 0 0 ${
            size * 4
          }px rgba(236, 72, 153, ${intensity * 0.5})`,
        }}
        initial={{
          x: motionX.get(),
          y: motionY.get(),
          scale: motionScale.get(),
          opacity: intensity,
        }}
        animate={{
          x: explosionX,
          y: explosionY,
          scale: [motionScale.get(), motionScale.get() * 1.5, 0],
          opacity: [intensity, intensity * 0.5, 0],
        }}
        transition={{
          duration: 1.2,
          delay: delay * 0.1, // Reduzir delay para animação mais rápida
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
  const animationRef = useRef<number>()

  const mouse = {
    x: useMotionValue(0.5),
    y: useMotionValue(0.5),
  }

  const smoothMouse = {
    x: useSpring(mouse.x, { stiffness: 75, damping: 100, mass: 3 }),
    y: useSpring(mouse.y, { stiffness: 75, damping: 100, mass: 3 }),
  }

  const rotateX = useTransform(smoothMouse.y, [0, 1], [-0.3, 0.3])
  const rotateY = useTransform(smoothMouse.x, [0, 1], [-0.3, 0.3])

  // Otimizar animação com useCallback
  const updateParticles = useCallback((time: number) => {
    if (isExpanded) return // Para animação quando expandido

    const baseRotation = time / 12000 // Rotação mais lenta e suave
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
      const scale = Math.max(0.2, perspective / (perspective + finalZ))

      const projectedX = rotatedY_X * scale
      const projectedY = rotatedX_Y * scale

      particle.motionX.set(projectedX)
      particle.motionY.set(projectedY)
      particle.motionScale.set(scale)
    })
  }, [particles, rotateX, rotateY, isExpanded])

  useAnimationFrame(updateParticles)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      mouse.x.set(e.clientX / innerWidth)
      mouse.y.set(e.clientY / innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)

    const generateSphereParticles = () => {
      const newParticles: ParticleData[] = []
      const particleCount = 180 // Reduzido de 300 para 180 para melhor performance
      const radius = 120

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
          size: 1.5 + Math.random() * 2,
          delay: Math.random() * 2,
          intensity: 0.6 + Math.random() * 0.4,
          motionX: motionValue(0),
          motionY: motionValue(0),
          motionScale: motionValue(1),
        })
      }

      setParticles(newParticles)
    }

    generateSphereParticles()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mouse.x, mouse.y])

  // Cleanup quando componente desmonta
  useEffect(() => {
    return () => {
      particles.forEach(particle => {
        particle.motionX.destroy?.()
        particle.motionY.destroy?.()
        particle.motionScale.destroy?.()
      })
    }
  }, [particles])

  if (isExpanded) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
        <AnimatePresence>
          {particles.map((particle) => (
            <Particle key={particle.id} particle={particle} isExpanded={true} />
          ))}
        </AnimatePresence>

        {/* Ondas de choque da explosão - Otimizadas */}
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={`shockwave-${i}`}
            className="absolute border border-purple-500/20 rounded-full"
            style={{
              left: "50%",
              top: "25%",
              transform: "translate(-50%, -50%)",
            }}
            initial={{
              width: 0,
              height: 0,
              opacity: 0.6,
            }}
            animate={{
              width: 800,
              height: 800,
              opacity: 0,
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Flash central */}
        <motion.div
          className="absolute w-20 h-20 bg-white rounded-full"
          style={{
            left: "50%",
            top: "25%",
            transform: "translate(-50%, -50%)",
            filter: "blur(10px)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 2, 4] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    )
  }

  return (
    <div className="relative mb-12" ref={containerRef}>
      <motion.div
        className="relative w-96 h-96 mx-auto"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Glow de fundo - Otimizado */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.05) 50%, transparent 70%)",
            filter: "blur(15px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <AnimatePresence>
          {particles.map((particle) => (
            <Particle key={particle.id} particle={particle} isExpanded={false} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}