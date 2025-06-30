"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, X, Palette, Volume2, Monitor } from "lucide-react"

export default function Header() {
  const [showConfig, setShowConfig] = useState(false)

  const handleTitleClick = () => {
    window.location.reload()
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-sm border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-white cursor-pointer select-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTitleClick}
          >
            Lynx AI
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors relative"
          >
            <Settings className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.header>

      {/* Config Modal */}
      <AnimatePresence>
        {showConfig && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowConfig(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="fixed top-20 right-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 z-50 w-80"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">Configurações</h3>
                <button
                  onClick={() => setShowConfig(false)}
                  className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-purple-400" />
                    <span className="text-white">Tema</span>
                  </div>
                  <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm">
                    <option>Escuro</option>
                    <option>Roxo</option>
                    <option>Azul</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span className="text-white">Sons</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-4 h-4 text-purple-400" />
                    <span className="text-white">Animações</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Salvar Configurações
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
