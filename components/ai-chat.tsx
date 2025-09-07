"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CrisisIntervention } from "@/components/crisis-intervention"
import { Heart, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { analyzeCrisisRisk, logCrisisEvent } from "@/lib/crisis-detection"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  analysis?: {
    mood: string
    crisisLevel: string
    indicators: string[]
    recommendedAction: string
  }
  crisisAnalysis?: any
}

interface AiChatProps {
  userName: string
}

export function AiChat({ userName }: AiChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hi ${userName}! I'm your AI companion, here to listen and support you. This is a safe, judgment-free space where you can share whatever's on your mind. How are you feeling today?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [crisisLevel, setCrisisLevel] = useState<"low" | "medium" | "high" | "critical">("low")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const crisisAnalysis = analyzeCrisisRisk(inputValue.trim())

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
      crisisAnalysis,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    if (crisisAnalysis.riskLevel === "high" || crisisAnalysis.riskLevel === "critical") {
      setShowCrisisAlert(true)
      setCrisisLevel(crisisAnalysis.riskLevel)
      logCrisisEvent(userName, crisisAnalysis, "chat_message")
    }

    try {
      const conversationHistory = messages.map((msg) => msg.content)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue.trim(),
          conversationHistory,
          crisisAnalysis, // Pass crisis analysis to API
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        analysis: data.analysis,
      }

      setMessages((prev) => [...prev, aiMessage])

      if (data.analysis?.crisisLevel === "high" || data.analysis?.crisisLevel === "critical") {
        setShowCrisisAlert(true)
        setCrisisLevel(data.analysis.crisisLevel)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you're in crisis, please contact emergency services or a mental health helpline immediately.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-[600px] max-w-4xl mx-auto">
      {showCrisisAlert && (
        <div className="mb-4">
          <CrisisIntervention riskLevel={crisisLevel} onDismiss={() => setShowCrisisAlert(false)} />
        </div>
      )}

      {/* Chat Header */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Your AI Companion</CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Online and ready to listen</span>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    {message.crisisAnalysis && message.crisisAnalysis.riskLevel !== "none" && (
                      <Badge
                        variant={
                          message.crisisAnalysis.riskLevel === "high" || message.crisisAnalysis.riskLevel === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {message.crisisAnalysis.riskLevel} risk
                      </Badge>
                    )}
                    {message.analysis && message.sender === "ai" && (
                      <div className="flex gap-1">
                        {message.analysis.mood !== "neutral" && (
                          <Badge variant="secondary" className="text-xs">
                            {message.analysis.mood}
                          </Badge>
                        )}
                        {message.analysis.crisisLevel !== "none" && (
                          <Badge
                            variant={
                              message.analysis.crisisLevel === "high" || message.analysis.crisisLevel === "critical"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {message.analysis.crisisLevel}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-3 max-w-[80%]">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This conversation is confidential. Your AI companion is here to listen and support you.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="pt-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Need immediate support? These resources are available 24/7:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="tel:9999666555">Vandrevala Foundation: 9999 666 555</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:08046110007">NIMHANS: 080-46110007</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:912227546669">Snehi: 91-22-27546669</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/crisis-support">More Resources</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
