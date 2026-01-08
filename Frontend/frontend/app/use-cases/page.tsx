"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { User, Users, HeartPulse, Clock, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookNowCTA from '../components/BookNowCTA';

const cases = [
  {
    title: "Solo Practitioners",
    icon: User,
    color: "bg-blue-100 text-blue-600",
    pain: "You're with a patient. The phone rings. You miss a new booking.",
    solution: "Sonva answers instantly, checks your calendar, and books the slot without you lifting a finger."
  },
  {
    title: "Multi-Chair Clinics",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
    pain: "Reception staff are overwhelmed with routine queries while trying to greet in-person patients.",
    solution: "Sonva filters calls. It handles cancellations and directions, letting staff focus on the people in the room."
  },
  {
    title: "Emergency Dentistry",
    icon: HeartPulse,
    color: "bg-red-100 text-red-600",
    pain: "Patients in pain call at 2 AM. If you don't answer, they call the next clinic.",
    solution: "Sonva screens for keywords and can escalate to your on-call mobile instantly."
  },
  {
    title: "Cosmetic Practices",
    icon: Sparkles,
    color: "bg-amber-100 text-amber-600",
    pain: "High-value leads need nurturing, not a generic voicemail.",
    solution: "Sonva provides a premium, empathetic voice experience that reflects your luxury brand."
  }
];

export default function UseCasesPage() {
  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen pt-20">
        <div className="bg-slate-900 text-white pt-32 pb-24 px-4 text-center">
           <motion.h1 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-5xl md:text-8xl font-black mb-6 tracking-tighter"
           >
             Built for Every Practice.
           </motion.h1>
           <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto font-medium">From single-chair clinics to nationwide dental groups.</p>
        </div>

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-24">
           <div className="grid md:grid-cols-2 gap-10">
              {cases.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group"
                >
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                     <item.icon size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{item.title}</h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100">
                      <p className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-2">The Friction</p>
                      <p className="text-slate-700 text-lg font-medium">{item.pain}</p>
                    </div>
                    <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100">
                      <p className="text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-2">The Sonva Advantage</p>
                      <p className="text-slate-700 text-lg font-medium">{item.solution}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
        <BookNowCTA />
      </div>
      <Footer />
    </>
  );
}