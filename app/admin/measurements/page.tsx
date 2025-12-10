"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Check, ExternalLink, Upload } from "lucide-react"
import { motion } from "framer-motion"
import { useRef } from "react"

type UserMeasurement = {
  id: string
  email: string
  gender: string | null
  height_cm: number
  mannequin_status: string | null
  mannequin_url: string | null
  created_at: string
}

export default function AdminMeasurementsPage() {
  const [measurements, setMeasurements] = useState<UserMeasurement[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set())
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set())
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    fetchMeasurements()
  }, [])

  const fetchMeasurements = async () => {
    try {
      const { data, error } = await supabase
        .from("user_measurements")
        .select("id, email, gender, height_cm, mannequin_status, mannequin_url, created_at")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching measurements:", error)
        return
      }

      setMeasurements(data || [])
    } catch (error) {
      console.error("Error fetching measurements:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMannequin = async (measurementId: string) => {
    setGeneratingIds((prev) => new Set(prev).add(measurementId))

    try {
      const response = await fetch("/api/generate-mannequin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ measurementId }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        console.error("Failed to generate mannequin:", data.error)
        alert(data.error || "Failed to generate mannequin")
        return
      }

      // Update local state
      setMeasurements((prev) =>
        prev.map((m) =>
          m.id === measurementId
            ? {
                ...m,
                mannequin_status: "generated",
                mannequin_url: "https://example.com/mock-mannequin.glb",
              }
            : m
        )
      )
    } catch (error) {
      console.error("Error generating mannequin:", error)
      alert("An unexpected error occurred")
    } finally {
      setGeneratingIds((prev) => {
        const next = new Set(prev)
        next.delete(measurementId)
        return next
      })
    }
  }

  const handleFileSelect = (measurementId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith(".glb")) {
      setUploadErrors((prev) => ({
        ...prev,
        [measurementId]: "Please select a .glb file",
      }))
      return
    }

    handleUploadMannequin(measurementId, file)
    // Reset input so same file can be selected again
    event.target.value = ""
  }

  const handleUploadMannequin = async (measurementId: string, file: File) => {
    setUploadingIds((prev) => new Set(prev).add(measurementId))
    setUploadErrors((prev) => {
      const next = { ...prev }
      delete next[measurementId]
      return next
    })

    try {
      // Upload to Supabase Storage
      const path = `${measurementId}/mannequin.glb`
      const { error: uploadError } = await supabase.storage
        .from("mannequins")
        .upload(path, file, {
          upsert: true,
          contentType: "model/gltf-binary",
        })

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload file")
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("mannequins").getPublicUrl(path)

      // Update database row
      const { error: updateError } = await supabase
        .from("user_measurements")
        .update({
          mannequin_status: "generated",
          mannequin_url: publicUrl,
          last_generated_at: new Date().toISOString(),
        })
        .eq("id", measurementId)

      if (updateError) {
        throw new Error(updateError.message || "Failed to update database")
      }

      // Update local state
      setMeasurements((prev) =>
        prev.map((m) =>
          m.id === measurementId
            ? {
                ...m,
                mannequin_status: "generated",
                mannequin_url: publicUrl,
              }
            : m
        )
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setUploadErrors((prev) => ({
        ...prev,
        [measurementId]: errorMessage,
      }))
      console.error("Error uploading mannequin:", error)
    } finally {
      setUploadingIds((prev) => {
        const next = new Set(prev)
        next.delete(measurementId)
        return next
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-light">
                  User Measurements Admin
                </CardTitle>
                <CardDescription>
                  View and manage user measurements and mannequin generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 text-center text-muted-foreground">Loading...</div>
                ) : measurements.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    No measurements found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Gender
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Height (cm)
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Created
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {measurements.map((measurement) => (
                          <tr
                            key={measurement.id}
                            className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm">{measurement.email}</td>
                            <td className="py-3 px-4 text-sm capitalize">
                              {measurement.gender || "—"}
                            </td>
                            <td className="py-3 px-4 text-sm">{measurement.height_cm}</td>
                            <td className="py-3 px-4 text-sm">
                              {measurement.mannequin_status === "generated" ? (
                                <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <Check className="w-4 h-4" />
                                  Generated
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Not generated</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {formatDate(measurement.created_at)}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-2">
                                {measurement.mannequin_status === "generated" ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Generated</span>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleGenerateMannequin(measurement.id)}
                                    disabled={generatingIds.has(measurement.id)}
                                    className="rounded-full"
                                  >
                                    {generatingIds.has(measurement.id)
                                      ? "Generating..."
                                      : "Generate mannequin"}
                                  </Button>
                                )}

                                {/* View mannequin (internal route) */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  asChild
                                  disabled={
                                    measurement.mannequin_status !== "generated" ||
                                    !measurement.mannequin_url
                                  }
                                  className="rounded-full"
                                >
                                  <Link href={`/mannequins/${measurement.id}`}>
                                    View mannequin
                                  </Link>
                                </Button>

                                {/* Optional direct external link/download */}
                                {measurement.mannequin_status === "generated" &&
                                  measurement.mannequin_url && (
                                    <a
                                      href={measurement.mannequin_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                    >
                                      Direct link <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}

                                {/* Upload button/input */}
                                <div className="flex flex-col gap-1">
                                  <input
                                    ref={(el) => {
                                      fileInputRefs.current[measurement.id] = el
                                    }}
                                    type="file"
                                    accept=".glb"
                                    onChange={(e) => handleFileSelect(measurement.id, e)}
                                    className="hidden"
                                    disabled={uploadingIds.has(measurement.id)}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => fileInputRefs.current[measurement.id]?.click()}
                                    disabled={uploadingIds.has(measurement.id)}
                                    className="rounded-full text-xs"
                                  >
                                    <Upload className="w-3 h-3 mr-1" />
                                    {uploadingIds.has(measurement.id)
                                      ? "Uploading..."
                                      : "Upload mannequin (.glb)"}
                                  </Button>
                                  {uploadErrors[measurement.id] && (
                                    <span className="text-xs text-destructive">
                                      {uploadErrors[measurement.id]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

