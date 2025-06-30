"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Laptop,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  Volume2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/AuthContext"
import UserMenu from "./UserMenu"
import UsageIndicator from "./UsageIndicator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

export default function Header() {
  const { setTheme } = useTheme()
  const { user, loading } = useAuth()
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  const handleTitleClick = () => {
    window.location.reload()
  }

  return (
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

        <div className="flex items-center gap-3">
          {!loading && user && (
            <>
              <UsageIndicator />
              <UserMenu />
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Configurações
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Personalize a interface
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="w-4 h-4 mr-2 text-purple-400" />
                  <span>Tema</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Claro</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Escuro</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop className="mr-2 h-4 w-4" />
                      <span>Sistema</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center"
              >
                <Volume2 className="w-4 h-4 mr-2 text-purple-400" />
                <span>Sons</span>
                <Switch
                  className="ml-auto"
                  checked={soundsEnabled}
                  onCheckedChange={setSoundsEnabled}
                />
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center"
              >
                <Monitor className="w-4 h-4 mr-2 text-purple-400" />
                <span>Animações</span>
                <Switch
                  className="ml-auto"
                  checked={animationsEnabled}
                  onCheckedChange={setAnimationsEnabled}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  )
}