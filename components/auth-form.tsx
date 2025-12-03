"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AuthFormProps {
  isLogin: boolean
  onAuthSuccess: (user: any) => void
  onToggleMode: () => void
}

export function AuthForm({ isLogin, onAuthSuccess, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        const response = await fetch("/api/users")
        const users = await response.json()
        const user = users.find((u: any) => u.email === email && u.password === password)
        if (!user) {
          setError("Email ou mot de passe incorrect")
          setLoading(false)
          return
        }
        localStorage.setItem("currentUser", JSON.stringify(user))
        onAuthSuccess(user)
      } else {
        if (!username.trim()) {
          setError("Veuillez entrer un nom d'utilisateur")
          setLoading(false)
          return
        }

        const response = await fetch("/api/users")
        const users = await response.json()

        const userExists = users.find((u: any) => u.email === email)
        const usernameExists = users.find((u: any) => u.username === username)

        if (userExists) {
          setError("Cet email est déjà utilisé")
          setLoading(false)
          return
        }

        if (usernameExists) {
          setError("Ce nom d'utilisateur est déjà pris")
          setLoading(false)
          return
        }

        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          password,
          username: username.trim(),
          avatar: `/placeholder.svg?height=48&width=48&query=avatar`,
          bio: "",
          createdAt: new Date().toISOString(),
        }

        const postResponse = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        })

        if (!postResponse.ok) {
          setError("Erreur lors de la création du compte")
          setLoading(false)
          return
        }

        localStorage.setItem("currentUser", JSON.stringify(newUser))
        onAuthSuccess(newUser)
      }
    } catch (err) {
      setError("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Dessin</CardTitle>
        <CardDescription>{isLogin ? "Connectez-vous à votre compte" : "Créez un nouveau compte"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                type="text"
                placeholder="votre_pseudo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </Button>

          <Button type="button" variant="outline" className="w-full bg-transparent" onClick={onToggleMode}>
            {isLogin ? "Créer un compte" : "Se connecter"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
