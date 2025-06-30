"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Copy, Download } from "lucide-react"

export default function CodeCard({ code }: { code: string }) {
  const [displayedCode, setDisplayedCode] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!code) return

    let index = 0
    const timer = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode(code.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [code])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 h-96 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">🧑‍💻 Generated Code</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4 text-white" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      <div className="h-full overflow-y-auto">
        <pre className="text-sm text-white font-mono leading-relaxed">
          <code>{displayedCode}</code>
        </pre>
      </div>

      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Copied!
        </motion.div>
      )}
    </motion.div>
  )
}
