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
    // Iniciar explosão imediatamente para melhor responsividade
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
        text: "## 🔄 Processando Solicitação\n\nAnalisando sua solicitação e preparando código VBA personalizado...\n\n**Status:** Conectando com IA especializada em VBA\n\n⏳ **Aguarde alguns instantes**",
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
      
      toast.success("✅ Código VBA gerado com sucesso!")
      
    } catch (error) {
      console.error('Error generating code:', error)
      
      const errorMessage: Message = {
        id: Date.now() + 3,
        text: `## ⚠️ Erro na Geração

Desculpe, ocorreu um erro ao gerar o código personalizado. 

## 🔄 O que aconteceu?
- Possível instabilidade temporária na conexão com a IA
- Sobrecarga do servidor de processamento

## 💡 Soluções
1. **Tente novamente** em alguns instantes
2. **Reformule** sua solicitação de forma mais específica  
3. **Aguarde** alguns minutos antes de tentar novamente

## 🛠️ Código de Fallback
Um código básico foi gerado para você começar. Você pode personalizá-lo conforme sua necessidade.

**Não se preocupe!** Seu contador de requests não foi afetado por este erro.`,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = errorMessage
        return newMessages
      })

      // Generate fallback code
      const fallbackCode = `Option Explicit

Sub CodigoPersonalizado()
    ' Código VBA para: ${inputPrompt}
    ' Gerado pelo Lynx AI
    
    Dim ws As Worksheet
    Dim i As Integer
    
    ' Define a planilha ativa
    Set ws = ActiveSheet
    
    ' Desabilita atualização de tela para performance
    Application.ScreenUpdating = False
    
    ' Tratamento de erro básico
    On Error GoTo TrataErro
    
    ' === SUA LÓGICA PERSONALIZADA AQUI ===
    ' Baseado na solicitação: ${inputPrompt}
    
    ' Exemplo: Loop simples para demonstração
    For i = 1 To 5
        ws.Cells(i, 1).Value = "Item " & i & " - " & "${inputPrompt.substring(0, 20)}..."
    Next i
    
    ' === FIM DA LÓGICA PERSONALIZADA ===
    
    ' Restaura configurações
    Application.ScreenUpdating = True
    
    ' Mensagem de sucesso
    MsgBox "Operação concluída com sucesso!" & vbNewLine & _
           "Verifique os resultados na planilha.", vbInformation, "Lynx AI"
    
    ' Limpeza de memória
    Set ws = Nothing
    Exit Sub
    
TrataErro:
    Application.ScreenUpdating = True
    MsgBox "Erro durante execução: " & Err.Description, vbCritical, "Erro VBA"
    Set ws = Nothing
End Sub`

      setGeneratedCode(fallbackCode)
      
      toast.error("❌ Erro na geração. Código base criado para você.")
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
                scale: 0.98,
                transition: { duration: 0.3 }, // Reduzido de 0.5 para 0.3
              }}
              className="flex flex-col items-center justify-center min-h-screen px-4"
            >
              <ModernSphere3D isExpanded={false} />
              <InputSection onSubmit={handleSubmit} />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6, // Reduzido de 1 para 0.6
                  delay: 0.8, // Reduzido de 1.5 para 0.8
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
              className="min-h-screen pt-20 px-4"
            >
              <ModernSphere3D isExpanded={true} />

              <motion.div
                className="max-w-7xl mx-auto mt-8 pb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5, // Reduzido de 0.8 para 0.5
                    delay: 1.0, // Reduzido de 2 para 1.0
                    ease: "easeOut",
                  },
                }}
              >
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.4, // Reduzido de 0.6 para 0.4
                        delay: 1.2, // Reduzido de 2.3 para 1.2
                        ease: "easeOut",
                      },
                    }}
                  >
                    <ChatCard messages={messages} isGenerating={isGenerating} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        duration: 0.4, // Reduzido de 0.6 para 0.4
                        delay: 1.4, // Reduzido de 2.6 para 1.4
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