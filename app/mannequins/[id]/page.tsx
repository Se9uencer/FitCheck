import MannequinViewer from "../MannequinViewer"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function MannequinPage({ params }: PageProps) {
  // params is a Promise in Next 16 app router
  const { id } = await params

  const { data: measurement, error } = await supabase
    .from("user_measurements")
    .select("id, email, gender, height_cm, mannequin_url, mannequin_status")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("Error loading measurement", error)
  }

  if (!measurement) {
    return (
      <div className="container mx-auto py-16">
        <div className="w-full rounded-lg border border-border/60 bg-muted/10 px-6 py-16 text-center text-muted-foreground">
          Measurement not found
        </div>
      </div>
    )
  }

  if (!measurement.mannequin_url || measurement.mannequin_status !== "generated") {
    return (
      <div className="container mx-auto py-16">
        <div className="w-full rounded-lg border border-border/60 bg-muted/10 px-6 py-16 text-center text-muted-foreground">
          Mannequin not generated yet for this measurement.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div>
        <Link
          href="/admin/measurements"
          className="mb-4 inline-block text-sm text-muted-foreground hover:underline"
        >
          ← Back to admin
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">3D Mannequin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {measurement.email} · {measurement.gender} · {measurement.height_cm} cm
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
        <div className="aspect-[4/3] w-full max-w-3xl mx-auto">
          <MannequinViewer url={measurement.mannequin_url} />
        </div>
      </div>
    </div>
  )
}
