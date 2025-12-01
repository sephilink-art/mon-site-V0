"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

interface UserProfileModalProps {
  user: any
  isOpen: boolean
  onClose: () => void
  currentUser: any
}

export function UserProfileModal({ user, isOpen, onClose, currentUser }: UserProfileModalProps) {
  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Profil utilisateur</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-bold text-lg">{user.username}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {currentUser?.id !== user.id && (
            <Link href={`/messages/${user.id}`} onClick={onClose}>
              <Button className="w-full btn-gradient-primary gap-2">
                <MessageCircle className="h-4 w-4" />
                Envoyer un message
              </Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
