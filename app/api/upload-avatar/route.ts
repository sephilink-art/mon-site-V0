export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file || !userId) {
      return Response.json({ error: "Missing file or userId" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    return Response.json({ avatar: dataUrl })
  } catch (error) {
    return Response.json({ error: "Upload failed" }, { status: 500 })
  }
}
