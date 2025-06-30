"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"

const suggestions = ["Generate Loop", "Create Form", "Excel Macro", "Data Analysis", "Chart Builder"]

export default function InputSection({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSubmit(suggestion)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Descreva o que você quer criar..."
          className="w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-full text-white placeholder-gray-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:shadow-lg focus:shadow-purple-500/10 transition-all duration-300"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/25"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>

      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-purple-500/50 rounded-full text-sm text-white hover:text-white transition-all duration-300"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
