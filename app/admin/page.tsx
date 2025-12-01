"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, LogOut, Trash2, MessageSquare, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState("")
  const [viewingMessages, setViewingMessages] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [selectedConversation, setSelectedConversation] = useState<any>(null)
  const [conversationMessages, setConversationMessages] = useState<any[]>([])

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      window.location.href = "/"
      return
    }

    const parsedUser = JSON.parse(currentUser)
    if (parsedUser.email !== "colindaron19@gmail.com") {
      window.location.href = "/feed"
      return
    }

    setUser(parsedUser)
    loadData()
  }, [])

  const loadData = () => {
    const allRequests = JSON.parse(localStorage.getItem("drawingRequests") || "[]")
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setRequests(allRequests)
    setUsers(allUsers)
  }

  const handleDeleteRequest = (requestId: string) => {
    const updated = requests.filter((r) => r.id !== requestId)
    localStorage.setItem("drawingRequests", JSON.stringify(updated))
    setRequests(updated)
  }

  const handleDeleteUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId)
    localStorage.setItem("users", JSON.stringify(updated))
    setUsers(updated)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    window.location.href = "/"
  }

  const handleUserSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredUsers([])
      return
    }
    const results = users.filter(
      (u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredUsers(results)
  }

  const handleSelectUser = (u: any) => {
    setSelectedUser(u)
    setSearchQuery("")
    setFilteredUsers([])
    loadUserConversations(u.id)
  }

  const loadUserConversations = (userId: string) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const conversations = []

    allUsers.forEach((user: any) => {
      const messagesKey = `messages_${userId}_${user.id}`
      const messages = JSON.parse(localStorage.getItem(messagesKey) || "[]")
      if (messages.length > 0) {
        conversations.push({
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          messages: messages,
          lastMessage: messages[messages.length - 1],
        })
      }
    })

    setSelectedConversation(null)
    setConversationMessages([])
  }

  const handleViewConversation = (conversation: any) => {
    setSelectedConversation(conversation)
    setConversationMessages(conversation.messages)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/feed">
              <Button size="sm" variant="ghost">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Panneau Admin</h1>
          </div>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!viewingMessages ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Demandes de dessin */}
            <div>
              <h2 className="text-xl font-bold mb-4">Demandes de dessin ({requests.length})</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {requests.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">Aucune demande reçue</CardContent>
                  </Card>
                ) : (
                  requests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={request.userAvatar || "/placeholder.svg"} />
                              <AvatarFallback>{request.username[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{request.username}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-muted-foreground">
                                  {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                                </p>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    request.visibility === "private"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {request.visibility === "private" ? "🔒 Privé" : "🌍 Public"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteRequest(request.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm">{request.description}</p>
                        {request.image && (
                          <img
                            src={request.image || "/placeholder.svg"}
                            alt="Demande"
                            className="w-full rounded max-h-40 object-cover"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Comptes utilisateurs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Comptes utilisateurs ({users.length})</h2>
                <Button
                  size="sm"
                  onClick={() => {
                    setViewingMessages(true)
                    setSelectedUser(null)
                    setSearchQuery("")
                  }}
                  className="btn-gradient-primary"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages privés
                </Button>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center text-muted-foreground">
                      Aucun utilisateur enregistré
                    </CardContent>
                  </Card>
                ) : (
                  users.map((u) => (
                    <Card key={u.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar>
                              <AvatarImage src={u.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{u.username[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{u.username}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setViewingMessages(false)
                  setSelectedUser(null)
                  setSelectedConversation(null)
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">Messages privés des utilisateurs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search and user selection */}
              <div className="md:col-span-1 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchQuery}
                    onChange={(e) => handleUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {selectedUser && (
                  <Card className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedUser.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                      </div>
                    </div>
                  </Card>
                )}

                <div className="space-y-2">
                  {filteredUsers.length > 0 &&
                    filteredUsers.map((u) => (
                      <Card
                        key={u.id}
                        className="p-3 cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleSelectUser(u)}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={u.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{u.username[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">{u.username}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Conversations list and messages */}
              {selectedUser && (
                <>
                  <div className="md:col-span-1 space-y-2">
                    <h3 className="font-semibold mb-2">Conversations avec {selectedUser.username}</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredUsers.length === 0 &&
                        Array.isArray(selectedUser.conversations) &&
                        selectedUser.conversations.length === 0 && (
                          <Card>
                            <CardContent className="p-4 text-center text-sm text-muted-foreground">
                              Aucune conversation
                            </CardContent>
                          </Card>
                        )}
                      {(() => {
                        const allUsers = JSON.parse(localStorage.getItem("users") || "[]")
                        const conversations = []

                        allUsers.forEach((user: any) => {
                          const messagesKey = `messages_${selectedUser.id}_${user.id}`
                          const messages = JSON.parse(localStorage.getItem(messagesKey) || "[]")
                          if (messages.length > 0) {
                            conversations.push({
                              userId: user.id,
                              username: user.username,
                              avatar: user.avatar,
                              messages: messages,
                              lastMessage: messages[messages.length - 1],
                            })
                          }
                        })

                        return conversations.map((conv) => (
                          <Card
                            key={conv.userId}
                            className={`p-3 cursor-pointer transition-colors ${
                              selectedConversation?.userId === conv.userId
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => handleViewConversation(conv)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{conv.username[0]}</AvatarFallback>
                              </Avatar>
                              <p className="text-sm font-semibold">{conv.username}</p>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.text}</p>
                          </Card>
                        ))
                      })()}
                    </div>
                  </div>

                  {/* Messages display */}
                  <div className="md:col-span-1">
                    {selectedConversation ? (
                      <Card className="h-full flex flex-col">
                        <CardHeader className="border-b pb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={selectedConversation.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{selectedConversation.username[0]}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold text-sm">{selectedConversation.username}</p>
                          </div>
                        </CardHeader>
                        <ScrollArea className="flex-1 p-4">
                          <div className="space-y-3">
                            {conversationMessages.map((msg: any) => (
                              <div
                                key={msg.id}
                                className={`flex gap-2 ${msg.senderId === selectedUser.id ? "" : "flex-row-reverse"}`}
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      msg.senderId === selectedUser.id
                                        ? selectedUser.avatar
                                        : selectedConversation.avatar
                                    }
                                  />
                                  <AvatarFallback>
                                    {msg.senderId === selectedUser.id
                                      ? selectedUser.username[0]
                                      : selectedConversation.username[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className={`flex flex-col ${msg.senderId === selectedUser.id ? "" : "items-end"}`}>
                                  <div
                                    className={`rounded-lg px-3 py-2 max-w-xs text-sm ${
                                      msg.senderId === selectedUser.id
                                        ? "bg-muted text-muted-foreground"
                                        : "bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground"
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </Card>
                    ) : (
                      <Card className="p-4 h-full flex items-center justify-center text-muted-foreground">
                        Sélectionnez une conversation
                      </Card>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
