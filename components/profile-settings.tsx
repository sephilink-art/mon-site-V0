"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"

interface ProfileSettingsProps {
  user: any
  onAvatarUpdate: (avatar: string) => void
}

export function ProfileSettings({ user, onAvatarUpdate }: ProfileSettingsProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const reader = new FileReader()

    reader.onload = async (event) => {
      const base64 = event.target?.result as string

      const updatedUser = { ...user, avatar: base64 }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      onAvatarUpdate(base64)
      setIsUploading(false)
    }

    reader.readAsDataURL(file)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo de profil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-gradient-primary gap-2"
            >
              <Camera className="h-4 w-4" />
              {isUploading ? "Téléchargement..." : "Changer la photo"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
