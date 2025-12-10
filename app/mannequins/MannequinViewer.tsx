"use client"

import { useEffect } from "react"

type MannequinViewerProps = {
  url: string
}

export default function MannequinViewer({ url }: MannequinViewerProps) {
  useEffect(() => {
    // Dynamically import @google/model-viewer to register the custom element
    import("@google/model-viewer").catch((err) => {
      console.error("Failed to load model-viewer:", err)
    })
  }, [])

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border bg-secondary/50">
      {/* @ts-ignore - model-viewer is a web component */}
      <model-viewer
        src={url}
        autoplay
        auto-rotate
        camera-controls
        style={{ width: "100%", height: "500px" }}
        alt="3D Mannequin"
      />
    </div>
  )
}

