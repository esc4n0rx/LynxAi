"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface Message {
  id: number
  text: string
  isUser: boolean
}

export default function ChatCard({ messages }: { messages: Message[] }) {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([])

  useEffect(() => {
    messages.forEach((message, index) => {
      setTimeout(() => {
        setDisplayedMessages((prev) => [...prev, message])
      }, index * 500)
    })
  }, [messages])

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-96 overflow-hidden"
    >
      <h3 className="text-xl font-semibold mb-4 text-white">🧠 AI Assistant</h3>

      <div className="h-full overflow-y-auto space-y-4">
        <AnimatePresence>
          {displayedMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser ? "bg-gray-700 text-white" : "bg-gray-800 text-white"
                }`}
              >
                <TypewriterText text={message.text} speed={30} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return <span>{displayedText}</span>
}
