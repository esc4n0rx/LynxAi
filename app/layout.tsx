import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Lynx AI - Gerador de Código VBA",
  description: "AI-powered VBA code generator with intelligent assistance",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster 
            theme="dark" 
            position="top-right"
            richColors
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  )
}