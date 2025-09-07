"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame, Calendar, Target } from "lucide-react"

interface StreakCelebrationProps {
  streak: number
  onContinue: () => void
}

export function StreakCelebration({ streak, onContinue }: StreakCelebrationProps) {
  const getStreakMessage = (days: number) => {
    if (days === 1) return "Great start! You've begun your wellness journey."
    if (days === 3) return "Amazing! Three days of consistent self-care."
    if (days === 7) return "Incredible! A full week of dedication to your wellbeing."
    if (days === 14) return "Outstanding! Two weeks of consistent wellness habits."
    if (days === 30) return "Phenomenal! A full month of commitment to your mental health."
    if (days % 7 === 0) return `Fantastic! ${days} days of consistent wellness practice.`
    return `Keep it up! ${days} days and counting.`
  }

  const getStreakEmoji = (days: number) => {
    if (days >= 30) return "🚀"
    if (days >= 14) return "⭐"
    if (days >= 7) return "🔥"
    if (days >= 3) return "💪"
    return "🌱"
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
      <CardContent className="pt-6 text-center">
        <div className="mb-4">
          <div className="text-6xl mb-2">{getStreakEmoji(streak)}</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-3xl font-bold text-orange-600">{streak}</span>
            <span className="text-lg text-orange-600">day{streak !== 1 ? "s" : ""}</span>
          </div>
          <h3 className="text-xl font-semibold text-orange-800 mb-2">Streak Milestone!</h3>
          <p className="text-orange-700 mb-4">{getStreakMessage(streak)}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-4 text-sm text-orange-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Consistent</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span>Focused</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4" />
              <span>Motivated</span>
            </div>
          </div>

          <Button onClick={onContinue} className="w-full">
            Continue Your Journey
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
