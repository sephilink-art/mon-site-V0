import { getServerStorage } from "@/lib/server-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 })
    }

    const storage = getServerStorage()
    const conversations = storage.messages.getConversations(userId)
    return Response.json(conversations)
  } catch (error) {
    console.error("[v0] Error in conversations API:", error)
    return Response.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, otherUserId } = body

    if (!userId || !otherUserId) {
      return Response.json({ error: "Missing parameters" }, { status: 400 })
    }

    const storage = getServerStorage()
    storage.messages.markAsRead(userId, otherUserId)
    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Error marking as read:", error)
    return Response.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}
