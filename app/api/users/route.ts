import { serverStorage } from "@/lib/server-storage"

export async function GET() {
  const users = serverStorage.users.getAll()
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = serverStorage.users.add(body)
  return Response.json(user)
}
