"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Download, Check } from "lucide-react"
import vbnet from "react-syntax-highlighter/dist/esm/languages/prism/vbnet"
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript"

SyntaxHighlighter.registerLanguage("vbnet", vbnet)
SyntaxHighlighter.registerLanguage("javascript", javascript)

export default function CodeCard({
  code,
  language = "javascript",
}: {
  code: string
  language?: string
}) {
  const [displayedCode, setDisplayedCode] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsTyping(true)
    setDisplayedCode("")
    if (!code) {
      setIsTyping(false)
      return
    }

    let index = 0
    const timer = setInterval(() => {
      if (index < code.length) {
        setDisplayedCode((prev) => prev + code.charAt(index))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, 15) // Velocidade de digitação

    return () => {
      clearInterval(timer)
      setIsTyping(false)
    }
  }, [code])

  const handleCopy = async () => {
    if (copied || isTyping) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (isTyping) return
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `lynx-code.${language}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-black/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 h-96 overflow-hidden group flex flex-col"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-center mb-4 shrink-0 z-10">
        <h3 className="text-xl font-semibold text-white">🧑‍💻 Generated Code</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            disabled={isTyping}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                >
                  <Check className="w-4 h-4 text-green-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                >
                  <Copy className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isTyping}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Download code"
          >
            <Download className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>

      <div
        className="h-full overflow-y-auto flex-grow z-10"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
        }}
      >
        <SyntaxHighlighter
          language={language === "vba" ? "vbnet" : language}
          style={vscDarkPlus}
          customStyle={{
            background: "transparent",
            margin: 0,
            padding: "0.5rem 0",
            height: "100%",
          }}
          codeTagProps={{
            style: {
              fontFamily: "inherit",
              fontSize: "0.875rem",
            },
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {displayedCode}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  )
}
