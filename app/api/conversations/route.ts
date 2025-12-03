import { getServerStorage } from "@/lib/server-storage"
import { Response } from "next/dist/compiled/@edge-runtime/primitives"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 })
    }

    const storage = getServerStorage()
    const conversations = storage.getConversations(userId)
    return Response.json(conversations)
  } catch (error) {
    return Response.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}
