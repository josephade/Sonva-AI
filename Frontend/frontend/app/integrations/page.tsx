"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookNowCTA from '../components/BookNowCTA';

const categories = [
  {
     name: "Clinical Software",
     apps: ["Dentally", "Software of Excellence", "Aerona", "Exact", "Carestream"]
  },
  {
     name: "Marketing & Growth",
     apps: ["HubSpot", "Salesforce", "ActiveCampaign", "GoHighLevel", "Zoho"]
  }
];

export default function IntegrationsPage() {
  return (
    <>
      <Navbar />
      <div className="bg-background min-h-screen pt-20">
        <div className="bg-white pt-32 pb-24 px-4 border-b border-slate-100 text-center">
           <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-4 py-1.5 bg-blue-50 text-primary text-sm font-black rounded-full mb-6 uppercase tracking-widest"
           >
             50+ Ready Integrations
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-8xl font-black text-[#0F172A] mb-8 tracking-tighter"
           >
             Unified Connectivity.
           </motion.h1>
           <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto font-medium leading-relaxed">Sync data effortlessly between Sonva and your current tech stack.</p>
        </div>

        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12 py-24">
           {categories.map((cat, idx) => (
             <div key={idx} className="mb-24">
               <h3 className="text-3xl font-black text-slate-900 mb-10 pb-4 border-b-2 border-slate-100 inline-block">{cat.name}</h3>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                  {cat.apps.map((app, i) => (
                     <motion.div 
                       key={i}
                       whileHover={{ scale: 1.05, y: -5 }}
                       className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col items-center justify-center aspect-square"
                     >
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl mb-6 shadow-inner"></div>
                        <span className="font-black text-slate-800 tracking-tight text-lg">{app}</span>
                     </motion.div>
                  ))}
               </div>
             </div>
           ))}

           <div className="bg-slate-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="relative z-10 max-w-3xl mx-auto">
                 <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Need a custom bridge?</h3>
                 <p className="text-xl text-slate-300 mb-10 font-medium">Our engineering team creates custom API workflows for enterprise dental networks.</p>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   className="px-12 py-5 bg-white text-slate-900 font-black rounded-full shadow-2xl inline-flex items-center gap-3 text-lg"
                 >
                   Contact Engineering <ArrowRight size={22} />
                 </motion.button>
              </div>
           </div>
        </div>
        <BookNowCTA />
      </div>
      <Footer />
    </>
  );
}