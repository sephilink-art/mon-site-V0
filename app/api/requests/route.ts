export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const visibility = searchParams.get("visibility")

  let requests = JSON.parse(localStorage.getItem("drawingRequests") || "[]")

  if (visibility) {
    requests = requests.filter((r: any) => r.visibility === visibility || r.visibility !== "private")
  }

  return Response.json(requests)
}

export async function POST(request: Request) {
  const body = await request.json()
  const requests = JSON.parse(localStorage.getItem("drawingRequests") || "[]")
  requests.unshift(body)
  localStorage.setItem("drawingRequests", JSON.stringify(requests))
  return Response.json(body)
}
