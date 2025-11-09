import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold">
            Stop Missing Calls While
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              You're With Patients
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join dental practices using Sonva AI to book more patients, handle emergencies, and grow their practice.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-14 px-10 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-[var(--shadow-glow)]">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-14 px-10 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              Schedule a Demo
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground pt-4">
            No credit card required • 1 month free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
