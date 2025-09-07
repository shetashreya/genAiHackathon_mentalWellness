"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Shield, Heart, MessageCircle, ArrowRight, ArrowLeft } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: (userData: { nickname: string; preferences: string[] }) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [nickname, setNickname] = useState("")
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])

  const steps = [
    {
      title: "Welcome to MindfulAI",
      description: "Your safe, confidential space for mental wellness",
      content: <WelcomeStep />,
    },
    {
      title: "Choose Your Nickname",
      description: "No real names needed - stay completely anonymous",
      content: <NicknameStep nickname={nickname} setNickname={setNickname} />,
    },
    {
      title: "What Brings You Here?",
      description: "Help us personalize your experience (optional)",
      content: (
        <PreferencesStep selectedPreferences={selectedPreferences} setSelectedPreferences={setSelectedPreferences} />
      ),
    },
    {
      title: "You're All Set!",
      description: "Ready to start your wellness journey",
      content: <CompletionStep nickname={nickname} />,
    },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete({ nickname, preferences: selectedPreferences })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return nickname.trim().length > 0
    return true
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
          <CardDescription className="text-lg">{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">{steps[currentStep].content}</div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">100% Anonymous</h3>
          <p className="text-sm text-muted-foreground">No personal information required. Your privacy is protected.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Stigma-Free</h3>
          <p className="text-sm text-muted-foreground">A judgment-free zone where you can be yourself.</p>
        </div>
        <div className="flex flex-col items-center p-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Always Here</h3>
          <p className="text-sm text-muted-foreground">24/7 support whenever you need someone to listen.</p>
        </div>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Important:</strong> MindfulAI provides emotional support but is not a replacement for professional
          mental health care. In crisis situations, we'll connect you with appropriate resources.
        </p>
      </div>
    </div>
  )
}

function NicknameStep({ nickname, setNickname }: { nickname: string; setNickname: (value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-6">
          Choose a nickname that feels right to you. This is how your AI companion will address you.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="nickname">Your Nickname</Label>
        <Input
          id="nickname"
          placeholder="e.g., Alex, River, Phoenix..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="text-lg"
        />
      </div>
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
        <p className="text-sm text-primary">
          <Shield className="w-4 h-4 inline mr-2" />
          Your nickname stays completely private and is never shared with anyone.
        </p>
      </div>
    </div>
  )
}

function PreferencesStep({
  selectedPreferences,
  setSelectedPreferences,
}: {
  selectedPreferences: string[]
  setSelectedPreferences: (prefs: string[]) => void
}) {
  const preferences = [
    "Stress & Anxiety",
    "Mood Support",
    "Sleep Issues",
    "Social Connections",
    "Academic Pressure",
    "Self-Confidence",
    "Relationship Concerns",
    "Life Transitions",
  ]

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) => (prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground">
          Select areas you'd like support with. This helps us personalize your experience, but you can always change
          these later.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {preferences.map((pref) => (
          <Button
            key={pref}
            variant={selectedPreferences.includes(pref) ? "default" : "outline"}
            onClick={() => togglePreference(pref)}
            className="h-auto p-4 text-left justify-start"
          >
            {pref}
          </Button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground text-center">You can skip this step if you prefer.</p>
    </div>
  )
}

function CompletionStep({ nickname }: { nickname: string }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <Heart className="w-10 h-10 text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Welcome, {nickname}!</h3>
        <p className="text-muted-foreground">
          You're all set to begin your wellness journey. Your AI companion is ready to listen, support, and help you
          grow.
        </p>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg text-left">
        <h4 className="font-semibold mb-2">What happens next?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Start with a quick mood check-in</li>
          <li>• Chat with your AI companion anytime</li>
          <li>• Explore personalized wellness resources</li>
          <li>• Track your progress over time</li>
        </ul>
      </div>
    </div>
  )
}
