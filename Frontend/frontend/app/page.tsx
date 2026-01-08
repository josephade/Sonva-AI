"use client";
import React from 'react';
import { useState } from "react";
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import BookNowCTA from './components/BookNowCTA';
import HowItWorks from './components/HowItWorks';
import Integrations from './components/Integrations';
import StatsSection from './components/StatsSection';
import FAQ from './components/FAQ';
import DentistImageShowcase from './components/DentistImageShowcase';
import Testimonials from './components/Testimonials';
import AudioDemo from './components/AudioDemo';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <Navbar isDemoOpen={showDemo} />
      {showDemo && <AudioDemo onClose={() => setShowDemo(false)} />}
      
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="bg-background pt-16 md:pt-12"
      >
        <Hero onOpenDemo={() => setShowDemo(true)} />
        <BookNowCTA />
        <HowItWorks />
        <BookNowCTA />
        <Testimonials />
        <BookNowCTA />
        <Integrations />
        <BookNowCTA />
        <StatsSection />
        {/* <DentistImageShowcase /> */}
        {/* <BookNowCTA /> */}
        <FAQ />
        
        <section className="py-32 relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]"
            >
              Ready to transform <br className="hidden md:block" /> your clinic?
            </motion.h2>
            <p className="text-xl md:text-3xl text-slate-400 mb-12 max-w-5xl mx-auto font-medium leading-relaxed">
              Join the dental evolution. Reclaim your time and never miss a patient call again.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-primary text-white text-xl font-black rounded-full shadow-[0_20px_50px_rgba(42,111,242,0.4)] hover:bg-blue-600 transition-all"
            >
              Start Your Free Trial
            </motion.button>
          </div>
        </section>
      </motion.div>
      <Footer />
    </>
  );
}