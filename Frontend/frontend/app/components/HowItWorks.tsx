import React from 'react';
import { motion } from 'framer-motion';
import { Settings, PhoneForwarded, TrendingUp, Check, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Onboard Your Clinic",
    description: "Upload your practice handbook, pricing list, and common patient questions. Sonva's neural engine builds a custom knowledge base in minutes.",
    icon: Settings,
    color: "from-blue-600 to-blue-400",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    preview: (
      <div className="space-y-2 p-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Learning Phase</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="h-full bg-blue-500" 
          />
        </div>
        <div className="text-[10px] text-slate-400 font-medium">Analyzing: Price_List_2024.pdf</div>
      </div>
    )
  },
  {
    number: "02",
    title: "The Smart Divert",
    description: "Point your missed calls or out-of-hours lines to your Sonva AI number. No hardware changes or engineers required.",
    icon: PhoneForwarded,
    color: "from-purple-600 to-purple-400",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    preview: (
      <div className="relative p-4 bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <PhoneForwarded size={14} className="text-purple-400" />
          </div>
          <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[8px] font-bold uppercase tracking-widest">Active</div>
        </div>
        <div className="flex gap-1 items-end h-8">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i}
              animate={{ height: [8, 24, 12, 28, 8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              className="flex-1 bg-purple-500/40 rounded-t-sm"
            />
          ))}
        </div>
      </div>
    )
  },
  {
    number: "03",
    title: "Automated Growth",
    description: "Sonva books the appointment, sends the confirmation, and syncs directly to your CRM. Your team walks into a full schedule.",
    icon: TrendingUp,
    color: "from-green-600 to-green-400",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    preview: (
      <div className="p-4 bg-white rounded-2xl border border-green-100 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
            <Check size={16} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-900">Booking Confirmed</div>
            <div className="text-[8px] text-slate-400">Scaling Session • Tuesday 2PM</div>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-50 rounded-full" />
        <div className="h-1 w-2/3 bg-slate-50 rounded-full" />
      </div>
    )
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-white selection:bg-primary/10">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#2A6FF2_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <Zap size={12} fill="currentColor" />
              Efficiency Protocol
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">
              Seamless scaling, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Zero friction.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              Sonva isn't just software; it's a world-class employee that never sleeps, never takes a break, and learns your clinic's DNA in a single afternoon.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
               <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck size={20} className="text-green-500" />
                  <span>HIPAA Compliant</span>
               </div>
               <div className="w-1 h-1 rounded-full bg-slate-200 mt-2.5 hidden sm:block" />
               <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Zap size={20} className="text-yellow-500" />
                  <span>24-Hour Setup</span>
               </div>
            </div>
          </motion.div>

          <div className="relative">
             {/* Large Number Background Decorations */}
             <div className="absolute -top-20 -right-20 text-[20rem] font-black text-slate-50 opacity-[0.02] pointer-events-none select-none italic">
                S01
             </div>
          </div>
        </div>

        {/* The Timeline Steps */}
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-[100px] left-0 w-full h-px bg-slate-100 -z-10">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              {/* Step Card */}
              <div className="bg-white rounded-[3rem] p-8 md:p-10 border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(15,23,42,0.08)] h-full flex flex-col">
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <step.icon size={28} />
                  </div>
                  <span className="text-6xl font-black text-slate-50 tracking-tighter group-hover:text-slate-100 transition-colors duration-500">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10">
                  {step.description}
                </p>

                {/* Interactive Preview Snippet */}
                <div className={`mt-auto p-2 rounded-3xl ${step.lightColor} border border-white transition-all duration-500 group-hover:shadow-inner overflow-hidden`}>
                  <div className="relative">
                    {step.preview}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
                  </div>
                </div>

                {/* Bottom CTA Indicator */}
                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-300 group-hover:text-primary transition-colors cursor-pointer">
                  <span>Explore Workflow</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Step Connection Dot (Mobile) */}
              <div className="lg:hidden w-1 h-12 bg-slate-100 mx-auto my-4" />
            </motion.div>
          ))}
        </div>

        {/* Global Footer of the section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em]">Integrated with all major PMS systems</p>
          <div className="flex justify-center gap-8 mt-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* These would be actual logos in a real app */}
            <div className="w-12 h-6 bg-slate-300 rounded-md" />
            <div className="w-12 h-6 bg-slate-300 rounded-md" />
            <div className="w-12 h-6 bg-slate-300 rounded-md" />
            <div className="w-12 h-6 bg-slate-300 rounded-md" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;