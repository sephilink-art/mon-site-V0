import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 })
    }

    // Generate a simple user ID
    const userId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)

    // Send email to colindaron19@gmail.com notifying about new signup
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
          subject: "Nouveau compte créé - Dessein",
          html: `<p>Un nouvel utilisateur s'est inscrit avec l'email: <strong>${email}</strong></p>
                 <p>ID utilisateur: ${userId}</p>`,
        }),
      })
    } catch (emailError) {
      console.log("Email notification failed (non-critical):", emailError)
    }

    return NextResponse.json(
      {
        message: "Compte créé avec succès",
        userId,
        email,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 })
  }
}
