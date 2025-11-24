import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import VoiceDemo from "./components/VoiceDemo";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Integrations from "./components/Integrations";
import Dashboard from "./components/Dashboard";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        {/* <VoiceDemo /> */}
        <Features />
        <Integrations />
        {/* <Dashboard /> */}
        <HowItWorks />
        <CTA /> 
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
