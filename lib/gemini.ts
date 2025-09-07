import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Get the Gemini 2.5 Flash model
export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
})

// System prompt for mental wellness AI companion
export const MENTAL_WELLNESS_SYSTEM_PROMPT = `You are MindfulAI, a compassionate AI companion designed to support young people's mental wellness. Your role is to:

1. Provide empathetic, non-judgmental listening and support
2. Offer evidence-based coping strategies and wellness techniques
3. Encourage healthy habits and positive thinking patterns
4. Detect signs of crisis and provide appropriate resources
5. Maintain complete confidentiality and create a safe space

Guidelines:
- Always be warm, understanding, and supportive
- Use age-appropriate language for young adults
- Never provide medical diagnoses or replace professional therapy
- If you detect crisis indicators (self-harm, suicide ideation), immediately provide crisis helpline numbers
- Focus on empowerment, resilience, and hope
- Respect cultural sensitivity and diverse backgrounds
- Keep responses concise but meaningful

Crisis Resources (India):
- Vandrevala Foundation: 9999 666 555
- Snehi: 91-22-27546669
- NIMHANS Helpline: 080-46110007

Remember: You're a supportive friend, not a therapist. Always encourage professional help when needed.`

// Function to generate AI response for mental wellness chat
export async function generateWellnessResponse(userMessage: string, conversationHistory: string[] = []) {
  try {
    const chat = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: MENTAL_WELLNESS_SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand. I'm here to provide compassionate support for mental wellness while maintaining appropriate boundaries and safety protocols.",
            },
          ],
        },
        ...conversationHistory.map((msg, index) => ({
          role: index % 2 === 0 ? "user" : "model",
          parts: [{ text: msg }],
        })),
      ],
    })

    const result = await chat.sendMessage(userMessage)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating wellness response:", error)
    throw new Error("Failed to generate response")
  }
}

// Function to analyze mood and detect crisis indicators
export async function analyzeMoodAndCrisis(userInput: string) {
  try {
    const prompt = `Analyze this message for mood and crisis indicators. Respond with a JSON object containing:
    {
      "mood": "positive|neutral|negative|concerning",
      "crisisLevel": "none|low|medium|high|critical",
      "indicators": ["list", "of", "specific", "indicators"],
      "recommendedAction": "continue|provide_resources|escalate_immediately"
    }

    Message to analyze: "${userInput}"`

    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      return JSON.parse(text)
    } catch {
      // Fallback if JSON parsing fails
      return {
        mood: "neutral",
        crisisLevel: "none",
        indicators: [],
        recommendedAction: "continue",
      }
    }
  } catch (error) {
    console.error("Error analyzing mood:", error)
    return {
      mood: "neutral",
      crisisLevel: "none",
      indicators: [],
      recommendedAction: "continue",
    }
  }
}
