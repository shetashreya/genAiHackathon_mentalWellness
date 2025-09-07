"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Clock, CheckCircle, Play, Pause } from "lucide-react"
import type { WellnessResource } from "@/lib/resources"

interface ResourceViewerProps {
  resource: WellnessResource
  onBack: () => void
  onComplete: (resourceId: string, notes?: string) => void
}

export function ResourceViewer({ resource, onBack, onComplete }: ResourceViewerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const [notes, setNotes] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && resource.content.type === "guided") {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, resource.content.type])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStepComplete = () => {
    if (resource.content.steps && currentStep < resource.content.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const handleComplete = () => {
    onComplete(resource.id, notes)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Great Job!</CardTitle>
            <CardDescription>You've completed "{resource.title}"</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                How was this experience? Your feedback helps us recommend better resources for you.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reflection Notes (Optional)</label>
              <Textarea
                placeholder="How did this activity make you feel? What did you learn or notice?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleComplete} className="flex-1">
                Complete & Save Progress
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {resource.duration}
            </div>
            <Badge className={getDifficultyColor(resource.difficulty)}>{resource.difficulty}</Badge>
          </div>
          <CardTitle className="text-2xl">{resource.title}</CardTitle>
          <CardDescription className="text-lg">{resource.description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          {resource.content.type === "guided" && resource.content.steps && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Step {currentStep + 1} of {resource.content.steps.length}
                </h3>
                <div className="flex items-center gap-2">
                  {isActive && <span className="text-sm text-muted-foreground">{formatTime(timer)}</span>}
                  <Button variant="outline" size="sm" onClick={() => setIsActive(!isActive)}>
                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isActive ? "Pause" : "Start"}
                  </Button>
                </div>
              </div>

              <Progress value={((currentStep + 1) / resource.content.steps.length) * 100} />

              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-lg leading-relaxed">{resource.content.steps[currentStep]}</p>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                >
                  Previous Step
                </Button>
                <Button onClick={handleStepComplete}>
                  {currentStep === resource.content.steps.length - 1 ? "Complete" : "Next Step"}
                </Button>
              </div>
            </div>
          )}

          {resource.content.type === "article" && (
            <div className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-sm leading-relaxed">{resource.content.text}</div>
              </div>
              <Button onClick={() => setIsCompleted(true)} className="w-full">
                Mark as Complete
              </Button>
            </div>
          )}

          {resource.content.type === "prompt" && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="whitespace-pre-line text-sm leading-relaxed">{resource.content.text}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Reflection</label>
                <Textarea
                  placeholder="Write your thoughts here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                />
              </div>
              <Button onClick={() => setIsCompleted(true)} className="w-full">
                Complete Journaling
              </Button>
            </div>
          )}

          {resource.content.type === "exercise" && resource.content.steps && (
            <div className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="space-y-3">
                  {resource.content.steps.map((step, index) => (
                    <div key={index} className="text-sm leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={() => setIsCompleted(true)} className="w-full">
                I've Completed This Activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
