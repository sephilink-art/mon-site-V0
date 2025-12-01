"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

export default function CreateRequest() {
  const [user, setUser] = useState<any>(null)
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      window.location.href = "/"
      return
    }
    setUser(JSON.parse(currentUser))
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!description.trim()) {
      setError("Veuillez décrire votre demande de dessin")
      setLoading(false)
      return
    }

    try {
      const request = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        username: user.username,
        userEmail: user.email,
        userAvatar: user.avatar,
        description,
        image,
        visibility,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
      }

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        setError("Erreur lors de la création de la demande")
        setLoading(false)
        return
      }

      setSuccess(true)
      setDescription("")
      setImage("")
      setVisibility("public")

      setTimeout(() => {
        window.location.href = "/feed"
      }, 1500)
    } catch (err) {
      setError("Erreur lors de la création de la demande")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/feed">
            <Button size="sm" variant="ghost" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nouvelle demande de dessin</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">
                    Demande créée avec succès! Redirection...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description de votre demande
                </label>
                <Textarea
                  id="description"
                  placeholder="Décrivez le dessin que vous souhaitez..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Image (optionnel)
                </label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {image && (
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Aperçu"
                    className="max-w-xs rounded-lg max-h-64 object-cover"
                  />
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Visibilité de la demande</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setVisibility("public")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                      visibility === "public"
                        ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    🌍 Public
                    <div className="text-xs font-normal opacity-75 mt-1">Tout le monde peut voir</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility("private")}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                      visibility === "private"
                        ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-primary"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    🔒 Privé
                    <div className="text-xs font-normal opacity-75 mt-1">Seuls les admins voient</div>
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full btn-gradient-primary" disabled={loading}>
                {loading ? "Publication..." : "Publier la demande"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
