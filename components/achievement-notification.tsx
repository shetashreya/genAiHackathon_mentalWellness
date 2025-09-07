"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, X } from "lucide-react"
import type { Achievement } from "@/lib/gamification"

interface AchievementNotificationProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementNotification({ achievement, onDismiss }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300) // Wait for animation to complete
  }

  if (!achievement || !isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <Card className="w-80 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-yellow-800">Achievement Unlocked!</h3>
                <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <div className="font-semibold text-yellow-800">{achievement.title}</div>
                  <div className="text-sm text-yellow-700">{achievement.description}</div>
                </div>
              </div>
              <div className="text-sm text-yellow-600">
                +{achievement.reward.points} points • {achievement.reward.badge} badge earned
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
