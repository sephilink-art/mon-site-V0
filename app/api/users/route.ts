export async function GET() {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  return Response.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  users.push(body)
  localStorage.setItem("users", JSON.stringify(users))
  return Response.json(body)
}
