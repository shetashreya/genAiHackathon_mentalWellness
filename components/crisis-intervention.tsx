"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Phone, Heart, Shield, Clock } from "lucide-react"
import { getCrisisResources, type CrisisResource } from "@/lib/crisis-detection"

interface CrisisInterventionProps {
  riskLevel: "low" | "medium" | "high" | "critical"
  onDismiss?: () => void
  showFullPage?: boolean
}

export function CrisisIntervention({ riskLevel, onDismiss, showFullPage = false }: CrisisInterventionProps) {
  const [selectedResource, setSelectedResource] = useState<CrisisResource | null>(null)
  const [showSafetyPlan, setShowSafetyPlan] = useState(false)

  const resources = getCrisisResources()
  const hotlines = getCrisisResources("hotline")
  const emergency = getCrisisResources("emergency")

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 border-red-500 text-red-800"
      case "high":
        return "bg-orange-100 border-orange-500 text-orange-800"
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-800"
      default:
        return "bg-blue-100 border-blue-500 text-blue-800"
    }
  }

  const getUrgencyMessage = (level: string) => {
    switch (level) {
      case "critical":
        return {
          title: "Immediate Support Needed",
          message:
            "You're going through something very difficult right now. Please reach out for immediate help. You matter, and support is available.",
          action: "Get Help Now",
        }
      case "high":
        return {
          title: "We're Concerned About You",
          message:
            "It sounds like you're struggling with some serious challenges. Please consider reaching out for professional support.",
          action: "Find Support",
        }
      case "medium":
        return {
          title: "Support is Available",
          message:
            "You're going through a tough time, and that's okay. There are people who want to help you through this.",
          action: "Explore Resources",
        }
      default:
        return {
          title: "You're Not Alone",
          message: "Remember that support is always available when you need it.",
          action: "View Resources",
        }
    }
  }

  const urgency = getUrgencyMessage(riskLevel)

  if (showFullPage) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <CrisisInterventionContent />
        </div>
      </div>
    )
  }

  return (
    <Alert className={`border-2 ${getRiskColor(riskLevel)}`}>
      <Shield className="h-5 w-5" />
      <AlertDescription className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{urgency.title}</h3>
          <p className="mb-4">{urgency.message}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {riskLevel === "critical" && (
            <Button size="sm" variant="destructive" asChild>
              <a href="tel:112">
                <Phone className="w-3 h-3 mr-1" />
                Emergency: 112
              </a>
            </Button>
          )}
          {hotlines.slice(0, 2).map((resource) => (
            <Button key={resource.id} size="sm" variant="outline" asChild>
              <a href={`tel:${resource.phone}`}>
                <Phone className="w-3 h-3 mr-1" />
                {resource.name}
              </a>
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={() => setShowSafetyPlan(true)}>
            <Heart className="w-3 h-3 mr-1" />
            Safety Plan
          </Button>
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              I'm Safe Now
            </Button>
          )}
        </div>

        {showSafetyPlan && <SafetyPlanQuick onClose={() => setShowSafetyPlan(false)} />}
      </AlertDescription>
    </Alert>
  )
}

function CrisisInterventionContent() {
  return (
    <>
      {/* Immediate Help Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Immediate Help Available
          </CardTitle>
          <CardDescription className="text-red-700">
            If you're in immediate danger or having thoughts of hurting yourself, please reach out now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" variant="destructive" asChild className="h-auto p-4">
              <a href="tel:112">
                <div className="text-center">
                  <Phone className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Emergency Services</div>
                  <div className="text-sm">Call 112 - Available 24/7</div>
                </div>
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-auto p-4 bg-transparent">
              <a href="tel:9999666555">
                <div className="text-center">
                  <Phone className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Crisis Helpline</div>
                  <div className="text-sm">9999 666 555 - 24/7 Support</div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Helplines */}
      <Card>
        <CardHeader>
          <CardTitle>24/7 Crisis Support</CardTitle>
          <CardDescription>Professional mental health support is available anytime you need it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getCrisisResources("hotline").map((resource) => (
              <Card key={resource.id} className="border border-border">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.availability}
                    </Badge>
                  </div>
                  <Button asChild className="w-full">
                    <a href={`tel:${resource.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call {resource.phone}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Planning */}
      <Card>
        <CardHeader>
          <CardTitle>Create Your Safety Plan</CardTitle>
          <CardDescription>A personalized plan to help you stay safe during difficult moments</CardDescription>
        </CardHeader>
        <CardContent>
          <SafetyPlanBuilder />
        </CardContent>
      </Card>

      {/* Immediate Coping Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Right Now: Immediate Coping</CardTitle>
          <CardDescription>Things you can do in this moment to help yourself feel safer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Grounding Techniques</h4>
              <ul className="space-y-2 text-sm">
                <li>• Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste</li>
                <li>• Hold an ice cube or splash cold water on your face</li>
                <li>• Focus on your breathing: in for 4, hold for 4, out for 6</li>
                <li>• Call or text someone you trust</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Distraction Activities</h4>
              <ul className="space-y-2 text-sm">
                <li>• Watch funny videos or look at photos that make you smile</li>
                <li>• Listen to calming or uplifting music</li>
                <li>• Take a warm shower or bath</li>
                <li>• Go for a walk, even if it's just around your room</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function SafetyPlanQuick({ onClose }: { onClose: () => void }) {
  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Quick Safety Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm space-y-2">
          <p>
            <strong>Remember:</strong> This feeling is temporary. You've gotten through difficult times before.
          </p>
          <p>
            <strong>Right now:</strong> Focus on staying safe. Reach out to someone you trust or call a helpline.
          </p>
          <p>
            <strong>You matter:</strong> Your life has value, and there are people who care about you.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <a href="tel:9999666555">Call for Help</a>
          </Button>
          <Button size="sm" variant="outline" onClick={onClose}>
            I'm Safe
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SafetyPlanBuilder() {
  const [safetyPlan, setSafetyPlan] = useState({
    warningSigns: "",
    copingStrategies: "",
    supportContacts: "",
    professionalContacts: "",
    safeEnvironment: "",
  })

  const handleSave = () => {
    localStorage.setItem("mindfulai_safety_plan", JSON.stringify(safetyPlan))
    alert("Safety plan saved! You can access it anytime from your dashboard.")
  }

  useEffect(() => {
    const saved = localStorage.getItem("mindfulai_safety_plan")
    if (saved) {
      setSafetyPlan(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h4 className="font-semibold">Warning Signs</h4>
          <p className="text-sm text-muted-foreground">What tells you that you might be entering a crisis?</p>
          <textarea
            className="w-full p-3 border rounded-md text-sm"
            rows={3}
            placeholder="e.g., feeling hopeless, isolating from friends, not sleeping..."
            value={safetyPlan.warningSigns}
            onChange={(e) => setSafetyPlan({ ...safetyPlan, warningSigns: e.target.value })}
          />
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Coping Strategies</h4>
          <p className="text-sm text-muted-foreground">What helps you feel better or safer?</p>
          <textarea
            className="w-full p-3 border rounded-md text-sm"
            rows={3}
            placeholder="e.g., listening to music, calling a friend, taking a walk..."
            value={safetyPlan.copingStrategies}
            onChange={(e) => setSafetyPlan({ ...safetyPlan, copingStrategies: e.target.value })}
          />
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Support Contacts</h4>
          <p className="text-sm text-muted-foreground">Friends or family you can reach out to</p>
          <textarea
            className="w-full p-3 border rounded-md text-sm"
            rows={3}
            placeholder="Name and phone number of trusted people..."
            value={safetyPlan.supportContacts}
            onChange={(e) => setSafetyPlan({ ...safetyPlan, supportContacts: e.target.value })}
          />
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold">Professional Contacts</h4>
          <p className="text-sm text-muted-foreground">Therapist, doctor, or crisis services</p>
          <textarea
            className="w-full p-3 border rounded-md text-sm"
            rows={3}
            placeholder="Professional support contacts..."
            value={safetyPlan.professionalContacts}
            onChange={(e) => setSafetyPlan({ ...safetyPlan, professionalContacts: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={handleSave} className="w-full">
        Save My Safety Plan
      </Button>
    </div>
  )
}
