"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react"

type Question =
  | {
      id:
        | "identity"
        | "bodyShape"
        | "size"
        | "fitIssues"
        | "shopFor"
        | "fabricDrape"
        | "arUsed"
        | "arExperienceRating"
        | "arMethod"
        | "mannequinUsed"
        | "mannequinHelpful"
        | "extraNotes"
      question: string
      options?: string[]
      type?: "radio" | "textarea" | "checkbox"
    }

// Order: general fit → AR experience → mannequin → free text
const questions: Question[] = [
  {
    id: "identity",
    question: "What describes you best?",
    options: ["male", "female", "other"],
  },
  {
    id: "bodyShape",
    question: "What category best describes your body shape?",
    options: ["slim", "athletic", "curvy", "plus", "tall", "petite"],
  },
  {
    id: "size",
    question: "What size do you usually order?",
    options: ["XXXS", "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL", "other"],
  },
  {
    id: "fitIssues",
    question: "What fit issues bother you most?",
    type: "checkbox",
    options: [
      "Bust gaping or pulling",
      "Waistband digging / slipping / riding up",
      "Waist too loose, hips/thighs too tight (or vice versa)",
      "Shoulders or sleeves too big/long",
      "Neckline gaping or not lying flat",
      "Torso or dress bodice too long/short",
      "Pant length off (too short or dragging)",
      "Rise too low or too high",
      "Inconsistent sizing between brands",
      "“One size fits none” / vanity sizing in general",
      "Other (please specify)",
    ],
  },
  {
    id: "fabricDrape",
    question: "How important is fabric drape?",
    options: ["not important", "somewhat important", "very important"],
  },
  {
    id: "shopFor",
    question: "What do you shop for most often?",
    options: ["Tops", "Jeans / Pants", "Dresses / Skirts", "Activewear", "Everything"],
  },
  {
    id: "arUsed",
    question: "Have you used an augmented reality try-on app?",
    options: ["yes", "no"],
  },
  {
    id: "arExperienceRating",
    question: "If yes, how was your experience?",
    options: [
      "1 - Very dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Very satisfied",
      "N/A",
    ],
  },
  {
    id: "arMethod",
    question: "Which best describes what the app did?",
    options: ["captured your measurements", "projected garments onto your camera image", "other"],
  },
  {
    id: "mannequinUsed",
    question: "Have you used an app that creates a mannequin/avatar of you?",
    options: ["yes", "no"],
  },
  {
    id: "mannequinHelpful",
    question: "Would a personalized mannequin be helpful for you?",
    options: ["yes", "no"],
  },
  {
    id: "extraNotes",
    question: "Anything else we should know?",
    type: "textarea",
  },
]

export default function SurveyPage() {
  type AnswerMap = Record<string, string | string[]>
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const arUsed = answers["arUsed"] === "yes" ? true : answers["arUsed"] === "no" ? false : null
    const arRatingRaw = answers["arExperienceRating"]
    const arExperienceRating =
      arRatingRaw && arRatingRaw.startsWith("N/A") ? null : arRatingRaw ? parseInt(arRatingRaw[0], 10) : null
    let fitIssues =
      Array.isArray(answers["fitIssues"])
        ? (answers["fitIssues"] as string[])
        : answers["fitIssues"]
        ? [answers["fitIssues"] as string]
        : []
    const otherSelected = fitIssues.includes("other (please specify)")
    const otherText = (answers["fitIssuesOther"] as string | undefined)?.trim()
    if (otherSelected) {
      fitIssues = fitIssues.filter((v) => v !== "other (please specify)")
      if (otherText) fitIssues.push(otherText)
    }
    if (fitIssues.length === 0) fitIssues = null as unknown as string[]

    await supabase.from("survey_results").insert({
      identity: answers["identity"] || null,
      body_shape: answers["bodyShape"] || null,
      size: answers["size"] || null,
      fit_issues: fitIssues,
      shop_for: answers["shopFor"] || null,
      fabric_drape: answers["fabricDrape"] || null,
      ar_used: arUsed,
      ar_experience_rating: arExperienceRating,
      ar_method: answers["arMethod"] || null,
      mannequin_used: answers["mannequinUsed"] ? answers["mannequinUsed"] === "yes" : null,
      mannequin_helpful: answers["mannequinHelpful"] ? answers["mannequinHelpful"] === "yes" : null,
      extra_notes: answers["extraNotes"] || null,
    })

    setSubmitted(true)
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }
  const handleMultiToggle = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = prev[questionId]
      const currentArr = Array.isArray(current) ? current : []
      const exists = currentArr.includes(value)
      const next = exists ? currentArr.filter((v) => v !== value) : [...currentArr, value]
      return { ...prev, [questionId]: next }
    })
  }

  const visibleQuestions = questions.filter((q) => {
    if (q.id === "arExperienceRating" || q.id === "arMethod") {
      return answers["arUsed"] === "yes"
    }
    return true
  })

  const isQuestionAnswered = (q: Question) => {
    if (q.type === "textarea") return true
    const val = answers[q.id]
    if (q.type === "checkbox") {
      const arr = Array.isArray(val) ? (val as string[]) : []
      const hasAny = arr.length > 0
      const otherIsSelected = arr.includes("other (please specify)")
      const otherOk = !otherIsSelected || ((answers["fitIssuesOther"] as string | undefined)?.trim()?.length ?? 0) > 0
      return hasAny && otherOk
    }
    return typeof val === "string" && val.length > 0
  }

  const allQuestionsAnswered = visibleQuestions.every(isQuestionAnswered)
  const currentQuestion = visibleQuestions[currentStep]
  const isCurrentAnswered = currentQuestion ? isQuestionAnswered(currentQuestion) : false
  const progress = ((currentStep + 1) / visibleQuestions.length) * 100

  const goNext = () => {
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <motion.div
          className="max-w-md w-full bg-card rounded-2xl border border-border p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Check className="w-8 h-8 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-serif font-light mb-2">Thanks for your feedback</h2>
          <p className="text-muted-foreground mb-8">
            Your responses will help us build a better fit experience tailored to your needs.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/">Return to home</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {currentStep + 1} of {visibleQuestions.length}
            </span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Question */}
                <div className="space-y-2">
                  <span className="text-primary text-sm font-medium">Question {currentStep + 1}</span>
                  <h1 className="text-3xl md:text-4xl font-serif font-light">
                    {currentQuestion?.question}
                  </h1>
                  {currentQuestion?.id === "fabricDrape" && (
                    <p className="text-muted-foreground text-sm mt-2">
                      Fabric drape describes how a fabric hangs and flows on the body
                    </p>
                  )}
                </div>

                {/* Answer options */}
                <div className="space-y-3">
                  {currentQuestion?.type === "textarea" ? (
                    <textarea
                      className="w-full h-40 p-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none resize-none"
                      value={(answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      placeholder="Share any details that could improve your fit experience…"
                    />
                  ) : currentQuestion?.type === "checkbox" ? (
                    <div className="grid gap-2">
                      {(currentQuestion.options || []).map((option) => {
                        const checked = Array.isArray(answers[currentQuestion.id]) && 
                          (answers[currentQuestion.id] as string[]).includes(option)
                        return (
                          <motion.button
                            key={option}
                            type="button"
                            onClick={() => handleMultiToggle(currentQuestion.id, option)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${
                              checked
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                            }`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center mt-0.5 ${
                                checked ? "bg-primary border-primary" : "border-muted-foreground/30"
                              }`}>
                                {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <span className={`text-sm leading-relaxed ${checked ? "text-foreground" : "text-muted-foreground"}`}>
                                {option}
                              </span>
                            </div>
                            {option === "other (please specify)" && checked && (
                              <input
                                type="text"
                                className="mt-3 ml-8 w-[calc(100%-2rem)] p-3 rounded-lg bg-secondary border border-border"
                                placeholder="Describe your fit issue"
                                value={(answers["fitIssuesOther"] as string) || ""}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleAnswerChange("fitIssuesOther", e.target.value)}
                              />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  ) : (
                    <RadioGroup
                      value={(answers[currentQuestion?.id || ""] as string) || ""}
                      onValueChange={(value) => currentQuestion && handleAnswerChange(currentQuestion.id, value)}
                      className="grid gap-2"
                    >
                      {(currentQuestion?.options || []).map((option) => (
                        <motion.div
                          key={option}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Label
                            htmlFor={`${currentQuestion?.id}-${option}`}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                              answers[currentQuestion?.id || ""] === option
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-muted-foreground/50"
                            }`}
                          >
                            <RadioGroupItem 
                              value={option} 
                              id={`${currentQuestion?.id}-${option}`}
                              className="border-primary text-primary"
                            />
                            <span className="capitalize">{option}</span>
                          </Label>
                        </motion.div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </main>

      {/* Footer navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === visibleQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              Submit survey
              <Check className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={!isCurrentAnswered}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
