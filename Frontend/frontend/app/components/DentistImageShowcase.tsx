import React from 'react';
import { motion } from 'framer-motion';

const DentistImageShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid md:grid-cols-2 gap-12 items-center">
            
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative"
            >
               {/* Decorative backdrop */}
               <div className="absolute inset-0 bg-primary/5 rounded-[40px] rotate-3 scale-105 z-0"></div>
               
               {/* Main Image Container */}
               <div className="relative z-10 rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/10">
                  <img 
                    src="https://picsum.photos/800/600?random=1" 
                    alt="Modern Dental Clinic Reception" 
                    className="w-full h-full object-cover"
                  />
                  {/* Floating UI Element */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-slate-900">Appointment Booked</p>
                          <p className="text-xs text-slate-500">Dr. Sarah O'Connor • 10:30 AM Tomorrow</p>
                       </div>
                    </div>
                  </motion.div>
               </div>
            </motion.div>

            <div>
               <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Designed for Modern <br/><span className="text-primary">Medical Practices</span></h2>
               <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Your reception is the first touchpoint for patients. Sonva ensures it is professional, empathetic, and efficient, even when your team is busy with patients.
               </p>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <h4 className="font-bold text-slate-900 mb-2">Private Clinics</h4>
                     <p className="text-sm text-slate-500">Capture high-value cosmetic inquiries instantly.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <h4 className="font-bold text-slate-900 mb-2">NHS Practices</h4>
                     <p className="text-sm text-slate-500">Handle high call volumes without overwhelming staff.</p>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
};

export default DentistImageShowcase;