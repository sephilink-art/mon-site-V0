"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, LogOut, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { UserProfileModal } from "@/components/user-profile-modal"
import { NotificationBell } from "@/components/notification-bell"

export default function Feed() {
  const [user, setUser] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [likedRequests, setLikedRequests] = useState<Set<string>>(new Set())
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      window.location.href = "/"
      return
    }
    setUser(JSON.parse(currentUser))
    loadRequests()

    const interval = setInterval(loadRequests, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadRequests = async () => {
    try {
      const response = await fetch("/api/requests?visibility=public")
      const publicRequests = await response.json()
      setRequests(publicRequests)
    } catch (err) {
      console.error("Error loading requests:", err)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const response = await fetch("/api/users")
      const users = await response.json()
      const results = users.filter(
        (u: any) =>
          u.email.toLowerCase().includes(query.toLowerCase()) || u.username.toLowerCase().includes(query.toLowerCase()),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile)
    setIsProfileModalOpen(true)
  }

  const toggleLike = (requestId: string) => {
    const newLiked = new Set(likedRequests)
    if (newLiked.has(requestId)) {
      newLiked.delete(requestId)
    } else {
      newLiked.add(requestId)
    }
    setLikedRequests(newLiked)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    window.location.href = "/"
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link
            href="/feed"
            className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          >
            Dessin
          </Link>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <Link href="/create-request">
              <Button size="sm" className="btn-gradient-primary gap-2 rounded-full">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Demander</span>
              </Button>
            </Link>
            {user.email === "colindaron19@gmail.com" && (
              <Link href="/admin">
                <Button size="sm" variant="outline" className="rounded-full bg-transparent">
                  Admin
                </Button>
              </Link>
            )}
            <Button size="sm" variant="ghost" onClick={handleLogout} className="rounded-full">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un compte..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-card rounded-full"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2 absolute z-40 w-full max-w-md left-4 right-4">
              {searchResults.map((result) => (
                <Card
                  key={result.id}
                  className="cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => handleProfileClick(result)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={result.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{result.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{result.username}</p>
                      <p className="text-sm text-muted-foreground">{result.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">Aucune demande de dessin pour le moment</p>
                <Link href="/create-request">
                  <Button className="btn-gradient-primary">Créer la première demande</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handleProfileClick({ ...request, id: request.userId, email: request.userEmail })}
                  >
                    <Avatar>
                      <AvatarImage src={request.userAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{request.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{request.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base">{request.description}</p>
                  {request.image && (
                    <img
                      src={request.image || "/placeholder.svg"}
                      alt="Demande de dessin"
                      className="w-full rounded-lg max-h-96 object-cover"
                    />
                  )}
                  <div className="flex gap-4 text-muted-foreground">
                    <button
                      className="flex items-center gap-2 hover:text-primary transition"
                      onClick={() => toggleLike(request.id)}
                    >
                      <Heart
                        className={`h-5 w-5 ${likedRequests.has(request.id) ? "fill-primary text-primary" : ""}`}
                      />
                      <span className="text-sm">{request.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm">{request.comments || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <UserProfileModal
        user={selectedProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
      />
    </div>
  )
}
