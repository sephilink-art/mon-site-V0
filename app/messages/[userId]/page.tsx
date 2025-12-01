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
import { useMessages } from "@/components/message-context"

export default function MessagesPage() {
  const params = useParams()
  const recipientId = params.userId as string

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [recipient, setRecipient] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { addNotification } = useMessages()

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

    loadMessages()
  }, [recipientId])

  const loadMessages = () => {
    const allMessages = JSON.parse(localStorage.getItem(`messages_${currentUser?.id}_${recipientId}`) || "[]")
    setMessages(allMessages)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)

    const message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      recipientId: recipientId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    }

    // Still using localStorage for messages until we implement message API
    const allMessages = JSON.parse(localStorage.getItem(`messages_${currentUser?.id}_${recipientId}`) || "[]")
    allMessages.push(message)
    localStorage.setItem(`messages_${currentUser?.id}_${recipientId}`, JSON.stringify(allMessages))

    const reverseMessages = JSON.parse(localStorage.getItem(`messages_${recipientId}_${currentUser?.id}`) || "[]")
    reverseMessages.push(message)
    localStorage.setItem(`messages_${recipientId}_${currentUser?.id}`, JSON.stringify(reverseMessages))

    if (recipientId !== currentUser.id) {
      addNotification({
        id: Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        username: currentUser.username,
        avatar: currentUser.avatar || "/placeholder.svg",
        lastMessage: newMessage,
        timestamp: message.timestamp,
        unreadCount: 1,
      })
    }

    setMessages(allMessages)
    setNewMessage("")
    setLoading(false)
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
