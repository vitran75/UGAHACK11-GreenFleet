import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  try {
    const { image } = await request.json()

    if (!image || typeof image !== 'string' || !image.startsWith('data:')) {
      return Response.json(
        { error: 'A valid data URI image is required' },
        { status: 400 }
      )
    }

    // Parse data URI: "data:<mimeType>;base64,<data>"
    const match = image.match(/^data:(.+?);base64,(.+)$/)
    if (!match) {
      return Response.json(
        { error: 'Invalid data URI format' },
        { status: 400 }
      )
    }

    const mimeType = match[1]
    const base64Data = match[2]

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

    const prompt = `You are a recyclability analyst. Identify the item in this image and return ONLY a JSON object (no markdown, no code fences, no extra text) with these keys:
- "itemName": string — what the item is (e.g. "Aluminum Can", "Plastic Bottle", "Car Battery")
- "recyclable": boolean — whether it can be recycled
- "grade": string — recyclability grade from A to F (A = easily recyclable, F = not recyclable)
- "funFact": string — a fun or surprising fact about recycling this type of item (1-2 sentences)
- "decompositionTime": string — how long it takes to decompose in a landfill (e.g. "200 years")
- "co2SavedKg": number — estimated kg of CO2 saved by recycling one of these instead of landfilling
- "waterSavedL": number — estimated liters of water saved by recycling one of these
- "energySavedKwh": number — estimated kWh of energy saved by recycling one of these

Return ONLY the JSON object.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ])

    let text = result.response.text()

    // Strip markdown code fences if present
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

    const data = JSON.parse(text)

    return Response.json(data)
  } catch (error) {
    console.error('Analyze item error:', error)
    return Response.json(
      { error: 'Failed to analyze item. Please try again.' },
      { status: 500 }
    )
  }
}
