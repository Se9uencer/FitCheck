import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    number: "01",
    title: "Tell us about your fit issues",
    description: "Quick survey with body shape and style preferences.",
  },
  {
    number: "02",
    title: "Upload measurements once",
    description: "We build a mannequin that matches your proportions.",
  },
  {
    number: "03",
    title: "See realistic previews",
    description: "Watch how fabric drapes, stretches, and fits before you buy.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container px-4 md:px-6 py-16 md:py-24 bg-secondary/20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
          <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-border/50 shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="text-5xl font-bold text-primary/20 min-w-[80px]">{step.number}</div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-2xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
