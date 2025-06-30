"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Download, Check, Loader2, BookOpen } from "lucide-react"
import vbnet from "react-syntax-highlighter/dist/esm/languages/prism/vbnet"
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript"

SyntaxHighlighter.registerLanguage("vbnet", vbnet)
SyntaxHighlighter.registerLanguage("javascript", javascript)

interface CodeCardProps {
  code: string
  language?: string
  isGenerating?: boolean
}

export default function CodeCard({
  code,
  language = "vba",
  isGenerating = false,
}: CodeCardProps) {
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
    }, 15)

    return () => {
      clearInterval(timer)
      setIsTyping(false)
    }
  }, [code])

  const handleCopy = async () => {
    if (copied || isTyping || !code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (isTyping || !code) return
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `lynx-vba-code.${language === "vba" ? "bas" : language}`
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
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white">Código VBA Gerado</h3>
          {isGenerating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-5 h-5 text-blue-400" />
            </motion.div>
          )}
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            disabled={isTyping || !code}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Copiar código"
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
            disabled={isTyping || !code}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Baixar código"
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
        {isGenerating && !code ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-300">Gerando código VBA...</p>
            </div>
          </div>
        ) : code || displayedCode ? (
          <SyntaxHighlighter
            language={language === "vba" ? "vbnet" : language}
            style={vscDarkPlus}
            customStyle={{
              background: "transparent",
              margin: 0,
              padding: "0.5rem 0",
              height: "100%",
              fontSize: "0.875rem",
            }}
            codeTagProps={{
              style: {
                fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
              },
            }}
            wrapLines={true}
            wrapLongLines={true}
            showLineNumbers={true}
            lineNumberStyle={{
              color: "#6b7280",
              fontSize: "0.75rem",
              paddingRight: "1rem",
            }}
          >
            {displayedCode}
          </SyntaxHighlighter>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aguardando geração do código...</p>
            </div>
          </div>
        )}
      </div>

      {code && !isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-gray-700/50 text-xs text-gray-400 z-10"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3 h-3" />
            <span>
              Para usar: Pressione Alt+F11 no Excel → Inserir → Módulo → Cole o código → Execute com F5
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}