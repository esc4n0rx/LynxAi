"use client"

import { motion } from "framer-motion"
import { LogOut, User, Settings } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserMenu() {
  const { user, signOut } = useAuth()

  if (!user) return null

  const initials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2 p-1 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback className="bg-gradient-to-tr from-purple-600 to-pink-600 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || 'Usuário'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" />
          <span>Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={signOut}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}