import { getServerStorage } from "@/lib/server-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const otherUserId = searchParams.get("otherUserId")

    if (!userId || !otherUserId) {
      return Response.json({ error: "Missing parameters" }, { status: 400 })
    }

    const storage = getServerStorage()
    const messages = storage.getMessages(userId, otherUserId)
    return Response.json(messages)
  } catch (error) {
    return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { senderId, recipientId, text } = body

    if (!senderId || !recipientId || !text) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    const storage = getServerStorage()
    const message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      recipientId,
      text,
      timestamp: new Date().toISOString(),
    }

    storage.addMessage(message)
    return Response.json(message)
  } catch (error) {
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}
