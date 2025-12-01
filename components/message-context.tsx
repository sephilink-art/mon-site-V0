"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Notification {
  id: string
  userId: string
  username: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
}

interface MessageContextType {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (userId: string) => void
  markAsRead: (userId: string) => void
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("messageNotifications")
    if (saved) {
      setNotifications(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("messageNotifications", JSON.stringify(notifications))
  }, [notifications])

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => {
      const existing = prev.find((n) => n.userId === notification.userId)
      if (existing) {
        return prev.map((n) =>
          n.userId === notification.userId ? { ...notification, unreadCount: (n.unreadCount || 0) + 1 } : n,
        )
      }
      return [...prev, { ...notification, unreadCount: 1 }]
    })
  }

  const removeNotification = (userId: string) => {
    setNotifications((prev) => prev.filter((n) => n.userId !== userId))
  }

  const markAsRead = (userId: string) => {
    setNotifications((prev) => prev.map((n) => (n.userId === userId ? { ...n, unreadCount: 0 } : n)))
  }

  return (
    <MessageContext.Provider value={{ notifications, addNotification, removeNotification, markAsRead }}>
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error("useMessages must be used within MessageProvider")
  }
  return context
}
