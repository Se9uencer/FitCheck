import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(request: NextRequest) {
  try {
    // 1) Validate input
    const body = await request.json()
    const { measurementId } = body

    if (!measurementId || typeof measurementId !== "string") {
      return NextResponse.json(
        { success: false, error: "measurementId is required" },
        { status: 400 }
      )
    }

    // 2) Load the measurement row from Supabase
    const { data: measurement, error: fetchError } = await supabase
      .from("user_measurements")
      .select("*")
      .eq("id", measurementId)
      .single()

    if (fetchError) {
      if (fetchError.code === "PGRST116") {
        // Row not found
        return NextResponse.json(
          { success: false, error: "Measurement not found" },
          { status: 404 }
        )
      }
      console.error("Error loading measurement:", fetchError)
      return NextResponse.json(
        { success: false, error: "Failed to load measurement" },
        { status: 500 }
      )
    }

    if (!measurement) {
      return NextResponse.json(
        { success: false, error: "Measurement not found" },
        { status: 404 }
      )
    }

    // 3) Build payload for mannequin generator service
    const serviceUrl = process.env.MANNEQUIN_SERVICE_URL || "http://127.0.0.1:8000"
    const bodyForService = {
      gender: measurement.gender ?? "neutral",
      height_cm: measurement.height_cm,
      waist_cm: measurement.waist_cm,
      hips_cm: measurement.hips_cm,
      chest_cm: measurement.chest_cm,
      arm_cm: measurement.arm_cm,
      leg_cm: measurement.leg_cm,
      bicep_cm: measurement.bicep_cm,
      thigh_cm: measurement.thigh_cm,
      format: "glb" as const,
    }

    // Call external mannequin service
    const mannequinRes = await fetch(`${serviceUrl}/generate-mannequin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyForService),
    })

    if (!mannequinRes.ok) {
      console.error("Mannequin service failed:", mannequinRes.status, mannequinRes.statusText)
      return NextResponse.json(
        { success: false, error: "Mannequin service failed" },
        { status: 500 }
      )
    }

    const arrayBuffer = await mannequinRes.arrayBuffer()
    const fileData = new Uint8Array(arrayBuffer)

    // 4) Upload to Supabase Storage
    const storagePath = `${measurementId}/mannequin.glb`

    const { error: uploadError } = await supabase.storage
      .from("mannequins")
      .upload(storagePath, fileData, {
        upsert: true,
        contentType: "model/gltf-binary",
      })

    if (uploadError) {
      console.error("Upload to storage failed:", uploadError)
      return NextResponse.json(
        { success: false, error: "Upload to storage failed" },
        { status: 500 }
      )
    }

    const { data: publicData } = supabase.storage.from("mannequins").getPublicUrl(storagePath)
    const mannequinUrl = publicData?.publicUrl

    if (!mannequinUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to get public URL" },
        { status: 500 }
      )
    }

    // 5) Update DB row
    const { error: updateError } = await supabase
      .from("user_measurements")
      .update({
        mannequin_status: "generated",
        mannequin_url: mannequinUrl,
        last_generated_at: new Date().toISOString(),
      })
      .eq("id", measurementId)

    if (updateError) {
      console.error("Error updating mannequin:", updateError)
      return NextResponse.json(
        { success: false, error: "Failed to update mannequin" },
        { status: 500 }
      )
    }

    // Return success with the mannequin URL
    return NextResponse.json({ success: true, mannequinUrl }, { status: 200 })
  } catch (error) {
    // Handle JSON parsing errors or other unexpected errors
    console.error("Error in generate-mannequin route:", error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

