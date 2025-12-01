"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { useMessages } from "./message-context"
import { Button } from "@/components/ui/button"

export function NotificationBell() {
  const { notifications } = useMessages()

  const totalUnread = notifications.reduce((sum, n) => sum + (n.unreadCount || 0), 0)

  return (
    <Link href="/messages">
      <Button size="sm" variant="ghost" className="rounded-full relative">
        <Bell className="h-5 w-5" />
        {totalUnread > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </Button>
    </Link>
  )
}
