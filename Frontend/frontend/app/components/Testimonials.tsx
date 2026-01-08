import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonialData = [
  {
    quote: "Sonva has transformed how we handle appointments. Our patients love the instant responses, and we've reduced missed calls by 95%.",
    author: "Dr. Sarah O'Connor",
    role: "Principal Dentist, Dublin Dental Care",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "The setup was incredibly easy. Within 15 minutes, Sonva was answering calls like she'd been part of our team for years.",
    author: "Dr. James McKenna",
    role: "Practice Owner, Cork Family Dentistry",
    image: "https://i.pravatar.cc/150?u=james"
  },
  {
    quote: "Our front desk staff can now focus on patient care instead of juggling phone calls. Sonva handles everything flawlessly.",
    author: "Emily Thompson",
    role: "Practice Manager, Belfast Smile Studio",
    image: "https://i.pravatar.cc/150?u=emily"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#F8FAFF] overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-black text-[#0F172A] mb-4 md:mb-6 tracking-tight leading-[1.1]"
          >
            Trusted by clinics across <span className="text-primary">Ireland & the UK</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-base md:text-xl max-w-3xl mx-auto font-medium leading-relaxed px-4"
          >
            Join hundreds of dental practices that have transformed their patient experience and reclaimed thousands of hours with Sonva.
          </motion.p>
        </div>

        {/* Mobile: Horizontal Snap Scroll | Desktop: 3-column Grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-6 md:gap-10 pb-10 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {testimonialData.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="min-w-[85vw] md:min-w-0 snap-center bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-start text-left transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 group relative overflow-hidden"
            >
              {/* Background Glow Effect on Hover */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex gap-1 mb-6 md:mb-8 text-primary">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={16} fill="currentColor" strokeWidth={0} className="md:w-5 md:h-5" />
                ))}
              </div>
              
              <p className="text-slate-700 text-lg md:text-xl leading-relaxed mb-8 md:mb-10 flex-grow font-medium italic relative z-10">
                "{t.quote}"
              </p>

              <div className="w-full pt-6 md:pt-10 border-t border-slate-50 flex items-center gap-4 md:gap-5 mt-auto relative z-10">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img 
                    src={t.image} 
                    alt={t.author} 
                    className="relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 border-2 border-white shadow-sm" 
                  />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-base md:text-lg truncate tracking-tight">{t.author}</h4>
                  <p className="text-slate-400 text-[10px] md:text-xs truncate font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="flex justify-center gap-1.5 mt-4 md:hidden">
          {testimonialData.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;