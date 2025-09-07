"use client"
import { useRouter } from "next/navigation"
import { OnboardingFlow } from "@/components/onboarding-flow"

export default function OnboardingPage() {
  const router = useRouter()

  const handleOnboardingComplete = (userData: { nickname: string; preferences: string[] }) => {
    // Store user data in localStorage for this demo
    localStorage.setItem("mindfulai_user", JSON.stringify(userData))
    localStorage.setItem("mindfulai_onboarded", "true")

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return <OnboardingFlow onComplete={handleOnboardingComplete} />
}
