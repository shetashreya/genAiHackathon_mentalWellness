"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface MoodData {
  overall: number
  energy: number
  stress: number
  emotions: string[]
  notes: string
}

interface MoodCheckinProps {
  onSubmit: (moodData: MoodData) => void
  onSkip: () => void
}

export function MoodCheckin({ onSubmit, onSkip }: MoodCheckinProps) {
  const [overall, setOverall] = useState([5])
  const [energy, setEnergy] = useState([5])
  const [stress, setStress] = useState([5])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [notes, setNotes] = useState("")

  const emotions = [
    "Happy",
    "Calm",
    "Excited",
    "Grateful",
    "Confident",
    "Anxious",
    "Sad",
    "Frustrated",
    "Overwhelmed",
    "Lonely",
    "Angry",
    "Confused",
  ]

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]))
  }

  const handleSubmit = () => {
    onSubmit({
      overall: overall[0],
      energy: energy[0],
      stress: stress[0],
      emotions: selectedEmotions,
      notes,
    })
  }

  const getMoodLabel = (value: number) => {
    if (value <= 2) return "Low"
    if (value <= 4) return "Below Average"
    if (value <= 6) return "Average"
    if (value <= 8) return "Good"
    return "Excellent"
  }

  const getStressLabel = (value: number) => {
    if (value <= 2) return "Very Low"
    if (value <= 4) return "Low"
    if (value <= 6) return "Moderate"
    if (value <= 8) return "High"
    return "Very High"
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How are you feeling today?</CardTitle>
          <CardDescription>
            Take a moment to check in with yourself. This helps us understand how to best support you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Overall Mood */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Overall Mood</Label>
              <Badge variant="secondary">{getMoodLabel(overall[0])}</Badge>
            </div>
            <Slider value={overall} onValueChange={setOverall} max={10} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Very Low</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Energy Level</Label>
              <Badge variant="secondary">{getMoodLabel(energy[0])}</Badge>
            </div>
            <Slider value={energy} onValueChange={setEnergy} max={10} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Stress Level</Label>
              <Badge variant="secondary">{getStressLabel(stress[0])}</Badge>
            </div>
            <Slider value={stress} onValueChange={setStress} max={10} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Very Calm</span>
              <span>Very Stressed</span>
            </div>
          </div>

          {/* Emotions */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">What emotions are you experiencing?</Label>
            <div className="grid grid-cols-3 gap-2">
              {emotions.map((emotion) => (
                <Button
                  key={emotion}
                  variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleEmotion(emotion)}
                  className="text-sm"
                >
                  {emotion}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <Label htmlFor="notes" className="text-base font-semibold">
              Anything else on your mind? (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Share what's been on your mind lately, any challenges you're facing, or anything you'd like to talk about..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Complete Check-in
            </Button>
            <Button variant="outline" onClick={onSkip}>
              Skip for Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
