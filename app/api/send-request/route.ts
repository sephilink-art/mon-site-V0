import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, request: drawingRequest } = await request.json()

    if (!userEmail || !drawingRequest) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 })
    }

    // Send email to colindaron19@gmail.com with the drawing request
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "noreply@dessein.com",
          to: "colindaron19@gmail.com",
          subject: `Nouvelle demande de dessin de ${userEmail}`,
          html: `<h2>Nouvelle demande de dessin</h2>
                 <p><strong>De:</strong> ${userEmail}</p>
                 <p><strong>Demande:</strong></p>
                 <p>${drawingRequest.replace(/\n/g, "<br>")}</p>`,
        }),
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
      // Continue anyway - request was received even if email failed
    }

    return NextResponse.json({ message: "Demande envoyée avec succès" }, { status: 200 })
  } catch (error) {
    console.error("Request error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
