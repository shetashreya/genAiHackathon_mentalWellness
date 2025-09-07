"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, Zap, Brain, Smile } from "lucide-react"

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

  const MoodSlider = ({ value, onChange, label, icon: Icon, lowLabel, highLabel, getLabel }: any) => (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-warm">
            <Icon className="w-5 h-5 text-background" />
          </div>
          <Label className="text-base font-semibold text-primary">{label}</Label>
        </div>
        <motion.div
          key={value[0]}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <Badge variant="secondary" className="font-medium bg-muted/50 text-accent border-accent/20">
            {getLabel(value[0])}
          </Badge>
        </motion.div>
      </div>

      <div className="relative">
        <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(value[0] / 10) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={value[0]}
          onChange={(e) => onChange([Number.parseInt(e.target.value)])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <motion.div
          className="absolute top-1/2 w-6 h-6 bg-accent rounded-full shadow-warm border-2 border-primary -translate-y-1/2"
          style={{ left: `calc(${((value[0] - 1) / 9) * 100}% - 12px)` }}
          whileHover={{ scale: 1.2, boxShadow: "0 0 20px rgba(212, 163, 115, 0.4)" }}
          whileTap={{ scale: 0.9 }}
        />
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-2xl w-full"
      >
        <Card className="shadow-warm border-primary/20 bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 25 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-warm hover-glow"
            >
              <Heart className="w-8 h-8 text-background" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-primary font-sans">How are you feeling today?</CardTitle>
            <CardDescription className="text-base mt-2 text-muted-foreground">
              Take a moment to check in with yourself. This helps us understand how to best support you.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <MoodSlider
              value={overall}
              onChange={setOverall}
              label="Overall Mood"
              icon={Heart}
              lowLabel="Very Low"
              highLabel="Excellent"
              getLabel={getMoodLabel}
            />

            <MoodSlider
              value={energy}
              onChange={setEnergy}
              label="Energy Level"
              icon={Zap}
              lowLabel="Exhausted"
              highLabel="Energized"
              getLabel={getMoodLabel}
            />

            <MoodSlider
              value={stress}
              onChange={setStress}
              label="Stress Level"
              icon={Brain}
              lowLabel="Very Calm"
              highLabel="Very Stressed"
              getLabel={getStressLabel}
            />

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-base font-semibold flex items-center gap-2 text-primary">
                <Smile className="w-5 h-5 text-secondary" />
                What emotions are you experiencing?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {emotions.map((emotion, index) => (
                  <motion.div
                    key={emotion}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.2 }}
                  >
                    <Button
                      variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleEmotion(emotion)}
                      className={`w-full text-sm font-medium transition-all duration-200 ${
                        selectedEmotions.includes(emotion)
                          ? "bg-gradient-to-r from-primary to-secondary text-background shadow-warm border-0 hover-glow"
                          : "hover:bg-muted/50 hover:scale-105 border-primary/20 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {emotion}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="notes" className="text-base font-semibold text-primary">
                Anything else on your mind? (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Share what's been on your mind lately, any challenges you're facing, or anything you'd like to talk about..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none border-primary/20 bg-muted/30 focus:bg-muted/50 transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </motion.div>

            <motion.div
              className="flex gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-background border-0 shadow-warm font-medium hover-glow"
                  size="lg"
                >
                  Complete Check-in
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={onSkip}
                  size="lg"
                  className="border-primary/20 text-muted-foreground hover:text-primary hover:bg-muted/30 bg-transparent"
                >
                  Skip for Now
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
