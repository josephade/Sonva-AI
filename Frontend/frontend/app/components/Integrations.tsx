import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Integrations: React.FC = () => {
  const logos = [
    "Salesforce", "HubSpot", "Twilio", "Zoho", "HighLevel", "Dentally", "Software of Excellence"
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Connect to your <br/>
              <span className="text-primary">Tech Stack & CRM</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Sonva integrates seamlessly with your existing practice management software. Sync appointments, patient records, and call logs in real-time.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Real-time calendar synchronization",
                "Automatic patient record updates",
                "Secure, encrypted data transfer",
                "Custom webhooks for unique workflows"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* <Link to="/integrations" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all group">
              View all 50+ integrations 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link> */}
          </motion.div>

          {/* Right Visual - Frosted Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-3xl blur-2xl opacity-20 -z-10 transform rotate-3 scale-105"></div>
            
            <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-2xl shadow-slate-200/50">
               <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200/50">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900">Active Integrations</h3>
                    <p className="text-sm text-slate-500">System Status: <span className="text-green-600 font-semibold">Online</span></p>
                 </div>
                 <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Zap size={20} />
                 </div>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {logos.slice(0, 6).map((logo, idx) => (
                   <div key={idx} className="aspect-square flex flex-col items-center justify-center bg-white/50 rounded-2xl border border-white/50 shadow-sm hover:scale-105 transition-transform duration-300">
                     <div className="w-10 h-10 bg-slate-100 rounded-lg mb-2 animate-pulse"></div>
                     <span className="text-xs font-semibold text-slate-600">{logo}</span>
                   </div>
                 ))}
               </div>

               <div className="mt-8 text-center">
                 <div className="inline-block px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full">
                    99.9% Uptime Guarantee
                 </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Integrations;