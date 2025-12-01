"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ChatPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: "user" | "system" }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    if (!storedEmail) {
      router.push("/")
      return
    }
    setEmail(storedEmail)
    setIsLoading(false)

    // Initial system message
    setMessages([
      {
        id: "1",
        text: "Bonjour ! Je suis votre assistant de dessin. Décrivez votre demande en détail.",
        sender: "system",
      },
    ])
  }, [router])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user" as const,
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsSending(true)

    try {
      // Send the drawing request to the email
      const response = await fetch("/api/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          request: message,
        }),
      })

      if (response.ok) {
        // Add system confirmation message
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Votre demande a été envoyée avec succès ! Nous vous recontacterons bientôt.",
            sender: "system",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Erreur lors de l'envoi. Veuillez réessayer.",
            sender: "system",
          },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Erreur de connexion. Veuillez réessayer.",
          sender: "system",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-foreground">Demande de dessin</h1>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="text-foreground border-border hover:bg-muted"
          >
            Retour
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        <Card className="flex-1 flex flex-col shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-card">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-6 bg-card/50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                type="text"
                placeholder="Décrivez votre demande de dessin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
                className="bg-input text-foreground placeholder:text-muted-foreground flex-1"
              />
              <Button
                type="submit"
                disabled={isSending || !message.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
              >
                {isSending ? "Envoi..." : "Envoyer"}
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  )
}
