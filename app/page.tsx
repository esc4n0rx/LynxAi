"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import Header from "../components/Header"
import ModernSphere3D from "../components/ModernSphere3D"
import InputSection from "../components/InputSection"
import ChatCard from "../components/ChatCard"
import CodeCard from "../components/CodeCard"
import { useAuth } from "@/contexts/AuthContext"
import { useApiUsage } from "@/hooks/useApiUsage"
import { arceeClient } from "@/lib/api/arcee"
import type { Message } from "@/types/api"

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useAuth()
  const { canMakeRequest, incrementUsage, usage } = useApiUsage()

  const handleSubmit = async (inputPrompt: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para usar o Lynx AI")
      return
    }

    if (!canMakeRequest()) {
      toast.error(`Limite diário atingido. Você pode fazer mais ${usage?.limit || 5} requests amanhã.`)
      return
    }

    setPrompt(inputPrompt)
    setIsExpanded(true)
    setIsGenerating(true)

    // Add user message
    const userMessage: Message = { 
      id: Date.now(), 
      text: inputPrompt, 
      isUser: true,
      timestamp: new Date()
    }
    setMessages([userMessage])

    try {
      // Increment usage before making the request
      if (!incrementUsage()) {
        toast.error("Não foi possível processar a solicitação. Tente novamente.")
        setIsGenerating(false)
        return
      }

      // Add initial AI response
      const initialAiMessage: Message = {
        id: Date.now() + 1,
        text: "Analisando sua solicitação e gerando código VBA personalizado...",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, initialAiMessage])

      // Generate VBA code using Arcee API
      const { explanation, code } = await arceeClient.generateVBACode(inputPrompt)

      // Update AI response with explanation
      const finalAiMessage: Message = {
        id: Date.now() + 2,
        text: explanation,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = finalAiMessage
        return newMessages
      })

      setGeneratedCode(code)
      
      toast.success("Código VBA gerado com sucesso!")
      
    } catch (error) {
      console.error('Error generating code:', error)
      
      const errorMessage: Message = {
        id: Date.now() + 3,
        text: "Desculpe, ocorreu um erro ao gerar o código. Tente novamente em alguns instantes.",
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = errorMessage
        return newMessages
      })

      // Generate fallback code
      const fallbackCode = `Sub CodigoPersonalizado()
    ' Código VBA para: ${inputPrompt}
    ' Gerado pelo Lynx AI
    
    Dim ws As Worksheet
    Set ws = ActiveSheet
    
    ' Sua lógica personalizada aqui
    MsgBox "Código gerado com base em: ${inputPrompt}"
    
    ' Exemplo de loop simples
    Dim i As Integer
    For i = 1 To 5
        ws.Cells(i, 1).Value = "Item " & i
    Next i
    
    Set ws = Nothing
End Sub`

      setGeneratedCode(fallbackCode)
      
      toast.error("Erro na geração. Um código base foi criado para você.")
    } finally {
      setIsGenerating(false)
    }
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
                    <ChatCard messages={messages} isGenerating={isGenerating} />
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
                    <CodeCard code={generatedCode} language="vba" isGenerating={isGenerating} />
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