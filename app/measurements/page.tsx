"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { motion } from "framer-motion"

export default function MeasurementsPage() {
  const [formData, setFormData] = useState({
    email: "",
    gender: "",
    height_cm: "",
    chest_cm: "",
    waist_cm: "",
    hips_cm: "",
    arm_cm: "",
    leg_cm: "",
    bicep_cm: "",
    thigh_cm: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [lastMeasurementId, setLastMeasurementId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [mannequinMessage, setMannequinMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear message when user starts typing
    if (message) setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    // Validation
    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Email is required." })
      setIsSubmitting(false)
      return
    }

    if (!formData.height_cm || parseFloat(formData.height_cm) <= 0) {
      setMessage({ type: "error", text: "Height must be greater than 0." })
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare data for insertion
      const insertData: Record<string, string | number | null> = {
        email: formData.email.trim(),
        height_cm: parseFloat(formData.height_cm),
      }

      // Add gender if provided
      if (formData.gender) {
        insertData.gender = formData.gender
      }

      // Add optional measurements (convert to number or null)
      const measurementFields = [
        "chest_cm",
        "waist_cm",
        "hips_cm",
        "arm_cm",
        "leg_cm",
        "bicep_cm",
        "thigh_cm",
      ]

      measurementFields.forEach((field) => {
        const value = formData[field as keyof typeof formData]
        insertData[field] = value && parseFloat(value) > 0 ? parseFloat(value) : null
      })

      const { data, error } = await supabase
        .from("user_measurements")
        .insert(insertData)
        .select()
        .single()

      if (error) {
        setMessage({ type: "error", text: error.message || "Failed to save measurements." })
        setIsSubmitting(false)
        return
      }

      // Success - store the returned id
      if (data?.id) {
        setLastMeasurementId(data.id)
      }

      setMessage({ type: "success", text: "Measurements saved." })
      
      // Clear form
      setFormData({
        email: "",
        gender: "",
        height_cm: "",
        chest_cm: "",
        waist_cm: "",
        hips_cm: "",
        arm_cm: "",
        leg_cm: "",
        bicep_cm: "",
        thigh_cm: "",
      })
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateMannequin = async () => {
    if (!lastMeasurementId) return

    setIsGenerating(true)
    setMannequinMessage(null)

    try {
      const response = await fetch("/api/generate-mannequin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ measurementId: lastMeasurementId }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setMannequinMessage({
          type: "error",
          text: data.error || "Failed to generate mannequin.",
        })
        return
      }

      setMannequinMessage({
        type: "success",
        text: "Mannequin generated for this measurement.",
      })
    } catch (error) {
      setMannequinMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An unexpected error occurred.",
      })
    } finally {
      setIsGenerating(false)
    }
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
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-light">
                  Enter Your Measurements
                </CardTitle>
                <CardDescription>
                  Provide your measurements to get personalized fit recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height_cm">
                      Height (cm) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="height_cm"
                      name="height_cm"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.height_cm}
                      onChange={handleChange}
                      required
                      placeholder="170"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Measurement fields grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chest_cm">Chest (cm)</Label>
                      <Input
                        id="chest_cm"
                        name="chest_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.chest_cm}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="waist_cm">Waist (cm)</Label>
                      <Input
                        id="waist_cm"
                        name="waist_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.waist_cm}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hips_cm">Hips (cm)</Label>
                      <Input
                        id="hips_cm"
                        name="hips_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.hips_cm}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="arm_cm">Arm (cm)</Label>
                      <Input
                        id="arm_cm"
                        name="arm_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.arm_cm}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leg_cm">Leg (cm)</Label>
                      <Input
                        id="leg_cm"
                        name="leg_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.leg_cm}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bicep_cm">Bicep (cm)</Label>
                      <Input
                        id="bicep_cm"
                        name="bicep_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.bicep_cm}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thigh_cm">Thigh (cm)</Label>
                      <Input
                        id="thigh_cm"
                        name="thigh_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.thigh_cm}
                        onChange={handleChange}
                        placeholder="Optional"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        message.type === "success"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {message.type === "success" && <Check className="w-4 h-4" />}
                        <span className="text-sm">{message.text}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Saving..." : "Save Measurements"}
                  </Button>
                </form>

                {/* Mannequin generation section */}
                {lastMeasurementId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-border space-y-4"
                  >
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Mannequin Generation</h3>
                      <p className="text-xs text-muted-foreground">
                        Generate a 3D mannequin based on your measurements.
                      </p>
                    </div>

                    {/* Mannequin status message */}
                    {mannequinMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg text-sm ${
                          mannequinMessage.type === "success"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {mannequinMessage.type === "success" && <Check className="w-4 h-4" />}
                          <span>{mannequinMessage.text}</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Generate button */}
                    <Button
                      type="button"
                      onClick={handleGenerateMannequin}
                      disabled={isGenerating}
                      variant="outline"
                      className="w-full rounded-full"
                    >
                      {isGenerating ? "Generating..." : "Generate mannequin"}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

