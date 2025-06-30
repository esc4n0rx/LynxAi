"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { Bot, User, Loader2 } from "lucide-react"
import type { Message } from "@/types/api"

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
}

interface ChatCardProps {
  messages: Message[]
  isGenerating?: boolean
}

export default function ChatCard({ messages, isGenerating = false }: ChatCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 h-96 overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center gap-3 mb-4 z-10 relative">
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

      <div
        ref={scrollRef}
        className="h-full overflow-y-auto space-y-4 pr-2 -mr-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.isUser
                    ? "bg-blue-600/50 text-white rounded-br-none"
                    : "bg-gray-800 text-white rounded-bl-none"
                }`}
              >
                <TypewriterText text={message.text} speed={20} />
                {message.timestamp && (
                  <div className="text-xs text-gray-400 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
              </div>
              {message.isUser && (
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
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
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 text-white rounded-xl rounded-bl-none p-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-4 h-4 text-purple-400" />
                  </motion.div>
                  <span>Gerando resposta...</span>
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

function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
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
    <span>
      {displayedText}
      {isTyping && <BlinkingCursor />}
    </span>
  )
}