import { type NextRequest, NextResponse } from "next/server"
import { generateWellnessResponse, analyzeMoodAndCrisis } from "@/lib/gemini"
import { analyzeCrisisRisk, logCrisisEvent } from "@/lib/crisis-detection"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, crisisAnalysis } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    let finalCrisisAnalysis = crisisAnalysis

    // If no crisis analysis provided, perform it
    if (!finalCrisisAnalysis) {
      finalCrisisAnalysis = analyzeCrisisRisk(message)
    }

    // Also use Gemini's analysis for additional context
    const geminiAnalysis = await analyzeMoodAndCrisis(message)

    // Combine analyses for comprehensive assessment
    const combinedAnalysis = {
      ...geminiAnalysis,
      enhancedCrisis: finalCrisisAnalysis,
    }

    let aiResponse
    if (finalCrisisAnalysis.riskLevel === "critical" || finalCrisisAnalysis.riskLevel === "high") {
      // Priority response for high-risk situations
      aiResponse = `${finalCrisisAnalysis.supportMessage}

I want you to know that you're not alone in this, and there are people who want to help you right now. What you're feeling is real and valid, but these intense feelings can change.

Please consider reaching out for immediate support:
• Emergency Services: 112
• Vandrevala Foundation: 9999 666 555 (24/7)
• NIMHANS Helpline: 080-46110007

Would you like to talk about what's making you feel this way, or would you prefer to focus on staying safe right now?`
    } else {
      // Generate normal AI response
      aiResponse = await generateWellnessResponse(message, conversationHistory)
    }

    if (finalCrisisAnalysis.riskLevel !== "none") {
      logCrisisEvent("anonymous_user", finalCrisisAnalysis, "chat_interaction")
    }

    return NextResponse.json({
      response: aiResponse,
      analysis: combinedAnalysis,
      crisisLevel: finalCrisisAnalysis.riskLevel,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
