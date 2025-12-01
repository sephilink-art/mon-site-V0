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
  },
}
