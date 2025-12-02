"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MessagesPage() {
  const params = useParams()
  const recipientId = params.userId as string

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [recipient, setRecipient] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const loadMessages = async (user: any) => {
    if (!user?.id) return
    try {
      const response = await fetch(`/api/messages?userId=${user.id}&otherUserId=${recipientId}`)
      if (!response.ok) throw new Error("Failed to load messages")
      const data = await response.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const markAsRead = async (user: any) => {
    if (!user?.id) return
    try {
      await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          otherUserId: recipientId,
        }),
      })
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      window.location.href = "/"
      return
    }

    const parsedUser = JSON.parse(user)
    setCurrentUser(parsedUser)

    fetch("/api/users")
      .then((res) => res.json())
      .then((users) => {
        const found = users.find((u: any) => u.id === recipientId)
        if (found) {
          setRecipient(found)
        }
      })

    loadMessages(parsedUser)
    markAsRead(parsedUser)

    const interval = setInterval(() => loadMessages(parsedUser), 300)
    return () => clearInterval(interval)
  }, [recipientId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    setLoading(true)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          recipientId: recipientId,
          text: newMessage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }

      const message = await response.json()
      setNewMessage("")
      setMessages((prev) => [...prev, message])
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("Erreur lors de l'envoi du message")
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser || !recipient) return null

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/feed">
            <Button size="sm" variant="ghost" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Avatar>
            <AvatarImage src={recipient.avatar || "/placeholder.svg"} />
            <AvatarFallback>{recipient.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{recipient.username}</p>
            <p className="text-xs text-muted-foreground">Actif maintenant</p>
          </div>
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun message. Commencez la conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.senderId === currentUser.id ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage
                    src={msg.senderId === currentUser.id ? currentUser.avatar : recipient.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {msg.senderId === currentUser.id ? currentUser.username[0] : recipient.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${msg.senderId === currentUser.id ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-xs ${
                      msg.senderId === currentUser.id
                        ? "bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card sticky bottom-0">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Écrivez un message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
              className="rounded-full"
            />
            <Button
              type="submit"
              disabled={loading || !newMessage.trim()}
              className="btn-gradient-primary rounded-full"
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
