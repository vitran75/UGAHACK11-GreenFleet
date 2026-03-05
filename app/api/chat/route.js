import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const SYSTEM_PROMPT = `You are GreenFleet AI, a sustainability fleet assistant for a battery recycling operation.

Key conversion factors:
- Each battery recycled avoids ~15 kg CO₂
- Each battery recovers ~10 kg of material
- Each battery saves ~20 L of water

Risk level thresholds (based on days until a dealership reaches full capacity):
- High risk: < 3 days
- Medium risk: 3–7 days
- Low risk: > 7 days

STRICT formatting rules:
- NEVER use markdown. No #, *, **, \`, or code blocks. Write in plain text only.
- Use line breaks to separate sections. Use dashes (-) for lists.
- Answer ONLY what the user asked. Do not add extra sections, fun facts, tips, or additional information beyond the request.
- Be concise and actionable.
- Reference specific dealership names and numbers from the provided fleet data when relevant.
- You ARE allowed to share fun facts about battery recycling, sustainability, and environmental topics when asked. Be enthusiastic and informative.`

export async function POST(request) {
  try {
    const { message, fleetContext } = await request.json()

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

    const prompt = `${SYSTEM_PROMPT}

Current fleet data:
${JSON.stringify(fleetContext, null, 2)}

User question: ${message}`

    const result = await model.generateContent(prompt)
    const reply = result.response.text()

    return Response.json({ reply })
  } catch (error) {
    console.error('Gemini API error:', error)
    return Response.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    )
  }
}
