const allUsers: any[] = []
const allRequests: any[] = []
const allMessages: any[] = []

export const serverStorage = {
  users: {
    getAll: () => allUsers,
    add: (user: any) => {
      allUsers.push(user)
      return user
    },
    updateAvatar: (userId: string, avatar: string) => {
      const user = allUsers.find((u) => u.id === userId)
      if (user) {
        user.avatar = avatar
      }
      return user
    },
    findByEmail: (email: string) => allUsers.find((u) => u.email === email),
  },
  requests: {
    getAll: () => allRequests,
    add: (request: any) => {
      allRequests.unshift(request)
      return request
    },
    getPublic: () => allRequests.filter((r) => r.visibility !== "private"),
    getByUserId: (userId: string) => allRequests.filter((r) => r.userId === userId),
  },
  messages: {
    getAll: () => allMessages,
    add: (message: any) => {
      allMessages.push(message)
      return message
    },
    getConversation: (user1: string, user2: string) =>
      allMessages
        .filter(
          (m) => (m.senderId === user1 && m.recipientId === user2) || (m.senderId === user2 && m.recipientId === user1),
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    getMessages: (userId: string, otherUserId: string) => {
      return allMessages
        .filter(
          (m) =>
            (m.senderId === userId && m.recipientId === otherUserId) ||
            (m.senderId === otherUserId && m.recipientId === userId),
        )
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    },
    addMessage: (message: any) => {
      allMessages.push(message)
      return message
    },
    getConversations: (userId: string) => {
      const conversationMap = new Map()

      allMessages.forEach((msg) => {
        const isReceived = msg.recipientId === userId
        const isSent = msg.senderId === userId

        if (isReceived || isSent) {
          const otherUserId = msg.senderId === userId ? msg.recipientId : msg.senderId

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, { lastMessage: msg, messages: [] })
          }

          const conv = conversationMap.get(otherUserId)
          conv.messages.push(msg)

          if (new Date(msg.timestamp).getTime() > new Date(conv.lastMessage.timestamp).getTime()) {
            conv.lastMessage = msg
          }
        }
      })

      const conversations = Array.from(conversationMap.entries()).map(([otherUserId, data]) => {
        const user = allUsers.find((u: any) => u.id === otherUserId)
        const unreadCount = data.messages.filter(
          (m: any) => m.senderId === otherUserId && m.recipientId === userId && !m.read,
        ).length

        return {
          userId: otherUserId,
          username: user?.username || "Unknown",
          avatar: user?.avatar || "/placeholder.svg",
          lastMessage: data.lastMessage.text,
          timestamp: data.lastMessage.timestamp,
          unreadCount,
        }
      })

      return conversations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    },
    markAsRead: (userId: string, otherUserId: string) => {
      allMessages.forEach((msg) => {
        if (msg.senderId === otherUserId && msg.recipientId === userId) {
          msg.read = true
        }
      })
    },
  },
}

export function getServerStorage() {
  return serverStorage
}
