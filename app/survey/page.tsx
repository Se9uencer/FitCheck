"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
      "gaping or pulling at the bust in button-up tops and dresses",
      "waistband issues including slipping, digging, or pants riding up in back",
      "tight hips with loose waist (pants fit in one area but not another)",
      "shoulders too wide or shoulder seams hanging past the shoulder",
      "sleeves too long or bunching at the wrist",
      "neckline that doesn’t lie flat or gaps at the chest",
      "inconsistent sizing across brands for the same labeled size",
      "dress bodice too long or too short for torso length",
      "hems on pants either dragging on the floor or sitting too high",
      "fabric pulling lines that point to fit stress around hips or thighs",
      "waist gap in jeans where back waistband pulls away from lower back",
      "bust fit good but waist too tight or vice versa",
      "rise too low or too high in pants causing discomfort",
      "general “one size fits none” problems from vanity sizing",
      "other (please specify)",
    ],
  },
  {
    id: "fabricDrape",
    question: "How important is fabric drape? (Fabric drape describes how a fabric hangs and flows on the body)",
    options: ["not important", "somewhat important", "very important"],
  },
  {
    id: "shopFor",
    question: "What do you shop for most often?",
    options: ["Tops", "Jeans / Pants", "Dresses / Skirts", "Activewear", "Everything"],
  },
  {
    id: "arUsed",
    question: "Have you used an augmented reality try-on app to preview outfits?",
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
    question: "Have you used an app that creates a mannequin/avatar of you and dresses it?",
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
    // Append 'other' text if selected and provided
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
  const allQuestionsAnswered = visibleQuestions.every((q) => {
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
  })

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-border/50 shadow-lg">
          <CardContent className="pt-12 pb-12 px-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Thanks for your feedback.</h2>
              <p className="text-muted-foreground">
                Your responses will help us build a better fit experience for you.
              </p>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/">Return to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">30 Second Fit Survey</h1>
            <p className="text-lg text-muted-foreground">Help us understand your fit preferences</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {visibleQuestions.map((q, index) => (
            <Card key={q.id} className="border-border/50 shadow-sm">
              <CardContent className="pt-8 pb-8 px-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">
                    {index + 1}. {q.question}
                  </Label>
                </div>
                {q.type === "textarea" ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full border rounded p-3"
                      rows={4}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Share any details that could improve your fit experience…"
                    />
                  </div>
                ) : q.type === "checkbox" ? (
                  <div className="space-y-3">
                    {(q.options || []).map((option) => {
                      const checked = Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(option)
                      const inputId = `${q.id}-${option}`
                      return (
                        <div key={option} className="flex items-center space-x-3">
                          <input
                            id={inputId}
                            type="checkbox"
                            className="h-4 w-4 rounded border"
                            checked={checked}
                            onChange={() => handleMultiToggle(q.id, option)}
                          />
                          <Label htmlFor={inputId} className="font-normal cursor-pointer">
                            {option}
                          </Label>
                          {option === "other (please specify)" && checked && (
                            <input
                              type="text"
                              className="ml-2 flex-1 border rounded p-2"
                              placeholder="Describe your fit issue"
                              value={(answers["fitIssuesOther"] as string) || ""}
                              onChange={(e) => handleAnswerChange("fitIssuesOther", e.target.value)}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <RadioGroup
                    value={answers[q.id] || ""}
                    onValueChange={(value) => handleAnswerChange(q.id, value)}
                    name={q.id}
                  >
                    <div className="space-y-3">
                      {(q.options || []).map((option) => (
                        <div key={option} className="flex items-center space-x-3">
                          <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                          <Label htmlFor={`${q.id}-${option}`} className="font-normal cursor-pointer capitalize">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={!allQuestionsAnswered} className="rounded-full">
              Submit survey
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
