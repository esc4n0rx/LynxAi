"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "../components/Header"
import ModernSphere3D from "../components/ModernSphere3D"
import InputSection from "../components/InputSection"
import ChatCard from "../components/ChatCard"
import CodeCard from "../components/CodeCard"

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean }>>([])
  const [generatedCode, setGeneratedCode] = useState("")

  const handleSubmit = (inputPrompt: string) => {
    setPrompt(inputPrompt)
    setIsExpanded(true)

    // Add user message
    const userMessage = { id: Date.now(), text: inputPrompt, isUser: true }
    setMessages([userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: `Vou ajudar você a criar código VBA para: "${inputPrompt}". Deixe-me gerar isso para você.`,
        isUser: false,
      }
      setMessages((prev) => [...prev, aiResponse])

      // Generate sample VBA code
      const sampleCode = `Sub GeneratedMacro()
    ' Código VBA gerado para: ${inputPrompt}
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    ' Sua lógica personalizada aqui
    MsgBox "Olá do Lynx AI!"
    
    ' Processar dados
    For i = 1 To 10
        ws.Cells(i, 1).Value = "Item " & i
    Next i
    
End Sub`

      setGeneratedCode(sampleCode)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white overflow-hidden">
      <Header />

      <main className="relative">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.5 },
              }}
              className="flex flex-col items-center justify-center min-h-screen px-4"
            >
              <ModernSphere3D isExpanded={false} />
              <InputSection onSubmit={handleSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1,
                  delay: 1.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              className="min-h-screen pt-20 px-4"
            >
              <ModernSphere3D isExpanded={true} />

              <motion.div
                className="max-w-7xl mx-auto mt-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    delay: 2,
                    ease: "easeOut",
                  },
                }}
              >
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[600px]">
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.6,
                        delay: 2.3,
                        ease: "easeOut",
                      },
                    }}
                  >
                    <ChatCard messages={messages} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.6,
                        delay: 2.6,
                        ease: "easeOut",
                      },
                    }}
                  >
                    <CodeCard code={generatedCode} />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}