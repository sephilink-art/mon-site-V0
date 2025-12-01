import { serverStorage } from "@/lib/server-storage"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const visibility = searchParams.get("visibility")

  const requests = visibility === "public" ? serverStorage.requests.getPublic() : serverStorage.requests.getAll()

  return Response.json(requests)
}

export async function POST(request: Request) {
  const body = await request.json()
  const req = serverStorage.requests.add(body)
  return Response.json(req)
}
