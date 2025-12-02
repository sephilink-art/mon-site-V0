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
    const messages = storage.messages.getMessages(userId, otherUserId)
    return Response.json(messages)
  } catch (error) {
    console.error("[v0] GET /api/messages error:", error)
    return Response.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { senderId, recipientId, text } = body

    console.log("[v0] POST /api/messages received:", { senderId, recipientId, text })

    if (!senderId || !recipientId || !text) {
      console.log("[v0] Missing fields in request")
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

    console.log("[v0] Creating message:", message)
    storage.messages.addMessage(message)

    console.log("[v0] Message created successfully")
    return Response.json(message)
  } catch (error) {
    console.error("[v0] POST /api/messages error:", error)
    return Response.json({ error: "Failed to send message", details: String(error) }, { status: 500 })
  }
}
