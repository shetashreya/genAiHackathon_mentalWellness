// Enhanced crisis detection and safety system

export interface CrisisAnalysis {
  riskLevel: "none" | "low" | "medium" | "high" | "critical"
  indicators: string[]
  recommendedAction: "continue" | "provide_resources" | "escalate_immediately" | "emergency_intervention"
  confidence: number
  triggerWords: string[]
  supportMessage: string
}

export interface CrisisResource {
  id: string
  name: string
  phone: string
  description: string
  availability: string
  type: "hotline" | "text" | "chat" | "emergency"
  region: string
}

export const crisisResources: CrisisResource[] = [
  {
    id: "vandrevala",
    name: "Vandrevala Foundation",
    phone: "9999666555",
    description: "24/7 mental health support and crisis intervention",
    availability: "24/7",
    type: "hotline",
    region: "India",
  },
  {
    id: "nimhans",
    name: "NIMHANS Helpline",
    phone: "08046110007",
    description: "Professional mental health crisis support",
    availability: "24/7",
    type: "hotline",
    region: "India",
  },
  {
    id: "snehi",
    name: "Snehi Helpline",
    phone: "912227546669",
    description: "Emotional support and crisis counseling",
    availability: "24/7",
    type: "hotline",
    region: "India",
  },
  {
    id: "emergency",
    name: "Emergency Services",
    phone: "112",
    description: "Immediate emergency response",
    availability: "24/7",
    type: "emergency",
    region: "India",
  },
  {
    id: "kiran",
    name: "Kiran Mental Health Helpline",
    phone: "18005990019",
    description: "Government mental health helpline",
    availability: "24/7",
    type: "hotline",
    region: "India",
  },
]

// Enhanced crisis keywords and patterns
const crisisKeywords = {
  suicide: [
    "kill myself",
    "end my life",
    "suicide",
    "suicidal",
    "want to die",
    "better off dead",
    "no point living",
    "end it all",
    "take my own life",
    "don't want to be here",
  ],
  selfHarm: [
    "hurt myself",
    "cut myself",
    "self harm",
    "self-harm",
    "cutting",
    "burning myself",
    "punish myself",
    "deserve pain",
  ],
  hopelessness: [
    "no hope",
    "hopeless",
    "nothing matters",
    "can't go on",
    "give up",
    "no future",
    "pointless",
    "worthless",
    "useless",
    "burden",
  ],
  crisis: [
    "emergency",
    "crisis",
    "can't cope",
    "breaking down",
    "losing control",
    "can't handle",
    "overwhelmed completely",
    "falling apart",
  ],
}

export function analyzeCrisisRisk(text: string): CrisisAnalysis {
  const lowerText = text.toLowerCase()
  const foundKeywords: string[] = []
  let riskScore = 0

  // Check for crisis keywords
  Object.entries(crisisKeywords).forEach(([category, keywords]) => {
    keywords.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        foundKeywords.push(keyword)
        // Weight different categories
        switch (category) {
          case "suicide":
            riskScore += 10
            break
          case "selfHarm":
            riskScore += 8
            break
          case "hopelessness":
            riskScore += 5
            break
          case "crisis":
            riskScore += 6
            break
        }
      }
    })
  })

  // Additional pattern matching
  const patterns = [
    /plan.*(?:kill|hurt|end).*(?:myself|my life)/i,
    /(?:have|got).*(?:pills|rope|knife|gun)/i,
    /(?:wrote|writing).*(?:note|letter|goodbye)/i,
    /(?:can't|cannot).*(?:take|handle|deal).*(?:anymore|any more)/i,
  ]

  patterns.forEach((pattern) => {
    if (pattern.test(text)) {
      riskScore += 12
      foundKeywords.push("high-risk pattern detected")
    }
  })

  // Determine risk level and actions
  let riskLevel: CrisisAnalysis["riskLevel"] = "none"
  let recommendedAction: CrisisAnalysis["recommendedAction"] = "continue"
  let supportMessage = ""

  if (riskScore >= 15) {
    riskLevel = "critical"
    recommendedAction = "emergency_intervention"
    supportMessage =
      "I'm very concerned about you right now. Please reach out for immediate help. You don't have to go through this alone."
  } else if (riskScore >= 10) {
    riskLevel = "high"
    recommendedAction = "escalate_immediately"
    supportMessage =
      "I'm worried about you. It sounds like you're going through a really difficult time. Please consider reaching out for support."
  } else if (riskScore >= 6) {
    riskLevel = "medium"
    recommendedAction = "provide_resources"
    supportMessage =
      "It sounds like you're struggling right now. Remember that support is available, and things can get better."
  } else if (riskScore >= 3) {
    riskLevel = "low"
    recommendedAction = "provide_resources"
    supportMessage = "I hear that you're having a tough time. You're not alone in this."
  }

  const confidence = Math.min(riskScore / 15, 1) // Normalize to 0-1

  return {
    riskLevel,
    indicators: foundKeywords,
    recommendedAction,
    confidence,
    triggerWords: foundKeywords,
    supportMessage,
  }
}

export function getCrisisResources(type?: CrisisResource["type"]): CrisisResource[] {
  if (type) {
    return crisisResources.filter((resource) => resource.type === type)
  }
  return crisisResources
}

export function logCrisisEvent(userId: string, analysis: CrisisAnalysis, context: string) {
  // In a real app, this would log to a secure system for follow-up
  const event = {
    timestamp: new Date().toISOString(),
    userId,
    riskLevel: analysis.riskLevel,
    indicators: analysis.indicators,
    context,
    confidence: analysis.confidence,
  }

  // Store in localStorage for demo purposes
  const existingLogs = JSON.parse(localStorage.getItem("mindfulai_crisis_logs") || "[]")
  existingLogs.push(event)
  localStorage.setItem("mindfulai_crisis_logs", JSON.stringify(existingLogs))

  console.log("Crisis event logged:", event)
}
