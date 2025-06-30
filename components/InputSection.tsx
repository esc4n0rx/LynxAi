"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Send } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useApiUsage } from "@/hooks/useApiUsage"
import LoginModal from "./LoginModal"
import UsageIndicator from "./UsageIndicator"

const suggestions = [
  "Criar planilha de controle financeiro",
  "Gerar relatório de vendas automatizado", 
  "Formulário de cadastro de clientes",
  "Macro para análise de dados",
  "Sistema de controle de estoque"
]

export default function InputSection({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [input, setInput] = useState("")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, loading } = useAuth()
  const { canMakeRequest, usage } = useApiUsage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading) return
    
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!canMakeRequest()) {
      return
    }
    
    if (input.trim()) {
      onSubmit(input.trim())
      setInput("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (loading) return
    
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!canMakeRequest()) {
      return
    }
    
    onSubmit(suggestion)
  }

  const isDisabled = !canMakeRequest() || loading

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        {user && usage && (
          <div className="flex justify-center mb-4">
            <UsageIndicator />
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isDisabled 
                ? "Limite diário atingido. Tente amanhã."
                : "Descreva o código VBA que você precisa..."
            }
            disabled={isDisabled}
            className={`w-full px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-full text-white placeholder-gray-300 focus:outline-none transition-all duration-300 ${
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:shadow-lg focus:shadow-purple-500/10"
            }`}
          />
          <motion.button
            type="submit"
            disabled={isDisabled}
            whileHover={isDisabled ? {} : { scale: 1.05 }}
            whileTap={isDisabled ? {} : { scale: 0.95 }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-300 ${
              isDisabled
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/25"
            }`}
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
              whileHover={isDisabled ? {} : {
                scale: 1.05,
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
              }}
              whileTap={isDisabled ? {} : { scale: 0.95 }}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isDisabled}
              className={`px-4 py-2 border rounded-full text-sm transition-all duration-300 ${
                isDisabled
                  ? "bg-gray-800/30 border-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800/50 hover:bg-gray-700/50 border-gray-600 hover:border-purple-500/50 text-white hover:text-white"
              }`}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>

        {user && usage?.remaining === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg"
          >
            <p className="text-red-400 text-sm">
              Limite diário de {usage.limit} requests atingido. 
              <br />
              Novos requests estarão disponíveis amanhã às {usage.resetTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.
            </p>
          </motion.div>
        )}
      </motion.div>

      <LoginModal isOpen={showLoginModal} onOpenChange={setShowLoginModal} />
    </>
  )
}