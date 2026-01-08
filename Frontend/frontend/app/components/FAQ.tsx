import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "How does Sonva handle accents?",
    answer: "Sonva is trained specifically on Irish and UK datasets, ensuring high accuracy with regional dialects and accents. It understands context, colloquialisms, and dental terminology perfectly."
  },
  {
    question: "Is patient data secure and GDPR compliant?",
    answer: "Absolutely. We are fully GDPR compliant. All data is encrypted at rest and in transit, and servers are located within the EU. We sign a Data Processing Agreement (DPA) with every clinic."
  },
  {
    question: "Can it integrate with my specific dental software?",
    answer: "We support major practice management systems including Dentally, Software of Excellence, and Aerona. For others, our team can build custom webhooks to ensure your calendar stays in sync."
  },
  {
    question: "What happens if the AI doesn't know the answer?",
    answer: "Sonva is programmed to gracefully handle unknowns. If it cannot resolve a query, it will take a message, mark it as 'High Priority', and instantly notify your reception team via email or SMS."
  },
  {
    question: "Is there a contract or setup fee?",
    answer: "We operate on a flexible monthly subscription. There is a one-time onboarding fee to configure your clinic's specific knowledge base, but you can cancel the subscription at any time with 30 days notice."
  }
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600">Everything you need to know about setting up your AI receptionist.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className={`font-semibold text-lg ${activeIndex === index ? 'text-primary' : 'text-slate-800'}`}>
                  {faq.question}
                </span>
                <div className={`p-1 rounded-full ${activeIndex === index ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                   {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;