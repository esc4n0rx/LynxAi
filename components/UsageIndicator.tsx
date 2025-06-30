"use client"

import { motion } from "framer-motion"
import { Clock, Zap } from "lucide-react"
import { useApiUsage } from "@/hooks/useApiUsage"

export default function UsageIndicator() {
  const { usage, loading } = useApiUsage()

  if (loading || !usage) return null

  const progressPercentage = (usage.current / usage.limit) * 100
  const isNearLimit = usage.remaining <= 1
  const isAtLimit = usage.remaining === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50"
    >
      <div className="flex items-center gap-2">
        <Zap className={`w-4 h-4 ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-blue-400'}`} />
        <span className="text-sm text-gray-300">
          {usage.remaining} / {usage.limit} disponíveis
        </span>
      </div>

      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {isAtLimit && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Reset: {usage.resetTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}
    </motion.div>
  )
}