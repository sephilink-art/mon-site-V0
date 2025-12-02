"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, ArrowLeft } from "lucide-react"
import { ProfileSettings } from "@/components/profile-settings"

export default function Profile() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      window.location.href = "/"
      return
    }
    setUser(JSON.parse(currentUser))
  }, [])

  const handleAvatarUpdate = (avatar: string) => {
    const updatedUser = { ...user, avatar }
    setUser(updatedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    window.location.href = "/"
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/feed">
            <Button variant="ghost" size="sm" gap-2 className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Mon profil</h1>
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <ProfileSettings user={user} onAvatarUpdate={handleAvatarUpdate} />
      </div>
    </div>
  )
}
