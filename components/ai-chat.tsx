"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CrisisIntervention } from "@/components/crisis-intervention"
import { Heart, Send, Sparkles, Bot } from "lucide-react"
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
    <div className="flex flex-col h-[700px] max-w-4xl mx-auto">
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-4"
          >
            <CrisisIntervention riskLevel={crisisLevel} onDismiss={() => setShowCrisisAlert(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="flex-1 flex flex-col shadow-soft border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4 gradient-primary text-white rounded-t-lg">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Sparkles className="w-2 h-2 text-accent-foreground" />
              </motion.div>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Your AI Companion</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <span className="text-sm text-white/80">Online and ready to listen</span>
              </div>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-6">
          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "flex items-end gap-2 max-w-[80%]",
                      message.sender === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    <motion.div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        message.sender === "user" ? "gradient-accent" : "gradient-primary",
                      )}
                      whileHover={{ scale: 1.1 }}
                    >
                      {message.sender === "user" ? (
                        <Heart className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </motion.div>

                    <motion.div
                      className={cn(
                        "rounded-2xl px-4 py-3 shadow-soft",
                        message.sender === "user"
                          ? "gradient-primary text-white rounded-br-md"
                          : "bg-muted/50 backdrop-blur-sm rounded-bl-md",
                      )}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 gap-2">
                        <span
                          className={cn(
                            "text-xs",
                            message.sender === "user" ? "text-white/70" : "text-muted-foreground",
                          )}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                        <div className="flex gap-1">
                          {message.crisisAnalysis && message.crisisAnalysis.riskLevel !== "none" && (
                            <Badge
                              variant={
                                message.crisisAnalysis.riskLevel === "high" ||
                                message.crisisAnalysis.riskLevel === "critical"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {message.crisisAnalysis.riskLevel} risk
                            </Badge>
                          )}
                          {message.analysis && message.sender === "ai" && (
                            <>
                              {message.analysis.mood !== "neutral" && (
                                <Badge variant="secondary" className="text-xs">
                                  {message.analysis.mood}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted/50 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-soft">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-muted-foreground/50 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                disabled={isLoading}
                className="flex-1 border-0 bg-muted/30 focus:bg-muted/50 rounded-2xl px-4 py-3 transition-colors"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="gradient-primary text-white border-0 shadow-glow rounded-2xl w-12 h-12"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              This conversation is confidential. Your AI companion is here to listen and support you.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}
