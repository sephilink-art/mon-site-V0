"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedEmail = localStorage.getItem("userEmail")
    if (!storedEmail) {
      router.push("/")
      return
    }
    setEmail(storedEmail)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userId")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dessein</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-foreground border-border hover:bg-muted bg-transparent"
          >
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md shadow-lg">
            <div className="p-12 text-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenue !</h2>
                <p className="text-muted-foreground">Prêt à créer quelque chose d'incroyable ?</p>
              </div>

              <Button
                onClick={() => router.push("/chat")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-6 text-lg"
              >
                Envoyer une demande de dessin
              </Button>

              <p className="text-sm text-muted-foreground">
                Décrivez votre vision et notre équipe se chargera du reste
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
