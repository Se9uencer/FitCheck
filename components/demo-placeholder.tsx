export function DemoPlaceholder() {
  return (
    <section id="demo" className="container px-4 md:px-6 py-16 md:py-24 bg-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">See it in action</h2>
          <p className="text-lg text-muted-foreground">Experience the future of online shopping</p>
        </div>

        <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center shadow-sm">
          <div className="text-center space-y-2">
            <p className="text-xl font-medium text-muted-foreground">3D demo coming soon</p>
            <p className="text-sm text-muted-foreground/70">Interactive mannequin preview</p>
          </div>
        </div>
      </div>
    </section>
  )
}
