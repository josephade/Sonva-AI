const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Setup Your Dental AI Assistant",
      description: "Tell us about your dental practice, services, insurance accepted, and scheduling preferences. Our AI learns your style and protocols in minutes.",
      color: "bg-[hsl(220,90%,55%)]"
    },
    {
      number: 2,
      title: "Forward Your Practice Calls",
      description: "Simply redirect your dental office phone to our AI system. Your patients won't notice the difference - just better, faster service.",
      color: "bg-[hsl(145,70%,45%)]"
    },
    {
      number: 3,
      title: "Watch Your Practice Grow",
      description: "Receive detailed reports, confirmed appointments, emergency alerts, and watch your booking rate soar while you focus on patient care.",
      color: "bg-[hsl(25,95%,55%)]"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              How It Works
            </h2>
            <p className="text-lg text-primary">
              Three simple steps to transform your dental practice communication
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className="flex items-start gap-6 group"
              >
                {/* Number Circle */}
                <div className={`${step.color} w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-block px-6 py-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Ready in under 1 hour</span> • Minimal technical setup required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
