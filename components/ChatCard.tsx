"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { Bot, User, Loader2 } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from "@/types/api"

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Reduzido de 0.2 para 0.1
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 }, // Reduzido de y: 20 para y: 10
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 150, // Aumentado de 100 para 150
      damping: 20, // Adicionado damping para suavizar
    },
  },
}

interface ChatCardProps {
  messages: Message[]
  isGenerating?: boolean
}

export default function ChatCard({ messages, isGenerating = false }: ChatCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll automático otimizado
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, isGenerating])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 h-[600px] overflow-hidden group flex flex-col"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center gap-3 mb-4 z-10 relative shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center">
          <Bot className="text-white w-5 h-5" />
        </div>
        <h3 className="text-xl font-semibold text-white">Lynx AI Assistant</h3>
        {isGenerating && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-4 h-4 text-purple-400" />
          </motion.div>
        )}
      </div>

      {/* Container principal com scroll otimizado */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        style={{
          maxHeight: 'calc(100% - 60px)', // 60px é aproximadamente a altura do header
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={itemVariants}
              layout
              className={`flex items-start gap-3 ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-xl break-words ${
                  message.isUser
                    ? "bg-blue-600/50 text-white rounded-br-none"
                    : "bg-gray-800 text-white rounded-bl-none"
                }`}
              >
                {message.isUser ? (
                  <TypewriterText text={message.text} speed={15} />
                ) : (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h1 className="text-lg font-bold text-purple-300 mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-semibold text-blue-300 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold text-green-300 mb-1">{children}</h3>,
                        p: ({ children }) => <p className="text-gray-100 mb-2 leading-relaxed break-words">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-gray-100 mb-2 break-words">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-gray-100 mb-2 break-words">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-100 break-words">{children}</li>,
                        strong: ({ children }) => <strong className="text-yellow-300 font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="text-pink-300">{children}</em>,
                        code: ({ children }) => (
                          <code className="bg-gray-700 text-green-300 px-1 py-0.5 rounded text-xs font-mono break-all">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-gray-700 p-3 rounded-lg overflow-x-auto text-sm font-mono text-green-300 mb-2 whitespace-pre-wrap break-words">
                            {children}
                          </pre>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-purple-500 pl-3 italic text-gray-300 mb-2 break-words">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                )}
                {message.timestamp && (
                  <div className="text-xs text-gray-400 mt-2 flex justify-end">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
              </div>
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          
          {isGenerating && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 text-white rounded-xl rounded-bl-none p-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-4 h-4 text-purple-400" />
                  </motion.div>
                  <span>Estou analisando a solicitação e gerando código VBA...</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

function BlinkingCursor() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="inline-block w-0.5 h-4 bg-white ml-1"
    />
  )
}

function TypewriterText({ text, speed = 15 }: { text: string; speed?: number }) { // Padrão alterado de 50 para 15
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    setDisplayedText("")
    setIsTyping(true)
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, speed)

    return () => {
      clearInterval(timer)
      setIsTyping(false)
    }
  }, [text, speed])

  return (
    <span className="leading-relaxed break-words">
      {displayedText}
      {isTyping && <BlinkingCursor />}
    </span>
  )
}