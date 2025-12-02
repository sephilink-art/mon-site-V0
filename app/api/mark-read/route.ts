import { serverStorage } from "@/lib/server-storage"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, otherUserId } = await request.json()

    if (!userId || !otherUserId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    serverStorage.messages.markAsRead(userId, otherUserId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error marking messages as read:", error)
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}
