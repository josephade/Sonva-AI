import { ArrowRight } from "lucide-react";
import BookNowButton from "./BookNowButton";

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
          
          {/* Mid-section CTA */}
      <div className="relative z-20 flex justify-center mb-16 -mt-2">
        <BookNowButton href="#book-demo" />
      </div>
          
        </div>
      </div>
    </section>
  );
};

export default CTA;
