"use client"

import { useState } from "react"
import { AuthForm } from "@/components/auth-form"

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
      <AuthForm
        isLogin={showLogin}
        onAuthSuccess={() => {
          window.location.href = "/feed"
        }}
        onToggleMode={() => setShowLogin(!showLogin)}
      />
    </main>
  )
}
