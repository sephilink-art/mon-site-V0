// Server-side in-memory storage that persists across all users
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
      allMessages.filter((m) => (m.fromId === user1 && m.toId === user2) || (m.fromId === user2 && m.toId === user1)),
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
      const conversations = new Map()

      allMessages.forEach((msg) => {
        const otherUserId = msg.senderId === userId ? msg.recipientId : msg.senderId
        if (!conversations.has(otherUserId)) {
          conversations.set(otherUserId, msg)
        } else {
          const existing = conversations.get(otherUserId)
          if (new Date(msg.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
            conversations.set(otherUserId, msg)
          }
        }
      })

      const storage = serverStorage
      return Array.from(conversations.values()).map((lastMessage) => {
        const otherUserId = lastMessage.senderId === userId ? lastMessage.recipientId : lastMessage.senderId
        const user = storage.users.getAll().find((u: any) => u.id === otherUserId)
        return {
          userId: otherUserId,
          username: user?.username || "Unknown",
          avatar: user?.avatar || "/placeholder.svg",
          lastMessage: lastMessage.text,
          timestamp: lastMessage.timestamp,
          unreadCount: 0,
        }
      })
    },
  },
}

export function getServerStorage() {
  return serverStorage
}
