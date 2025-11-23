"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Sonva AI?",
    answer:
      "Sonva AI is an intelligent dental receptionist that answers calls, schedules appointments, and handles patient communication 24/7 — seamlessly integrated with your practice management workflow.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Setup takes less than one hour. Simply connect your practice details, forward your calls, and Sonva starts working instantly — no complicated onboarding.",
  },
  {
    question: "Can Sonva AI handle emergencies?",
    answer:
      "Yes. Sonva AI automatically detects emergency cases, prioritizes them, and alerts you or your on-call staff in real time through your preferred communication channel.",
  },
  {
    question: "Is patient data secure?",
    answer:
      "Absolutely. Sonva uses encrypted communication, GDPR-compliant storage, and advanced voice authentication layers to keep every conversation private and protected.",
  },
  {
    question: "Does it integrate with existing systems?",
    answer:
      "Sonva AI integrates with your scheduling tools, CRMs, and EHRs via secure APIs — ensuring a smooth workflow with minimal disruption.",
  },
];

const FloatingParticles = () => {
  const particles = Array.from({ length: 10 });

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background:
              i % 3 === 0
                ? "rgba(59,130,246,0.4)" // primary
                : i % 3 === 1
                ? "rgba(34,197,94,0.4)" // accent
                : "rgba(249,115,22,0.4)", // orange
          }}
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: 0,
            opacity: 0,
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0.4, 0.7, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32 bg-gradient-to-b from-background via-background/80 to-background overflow-hidden">
      {/* Animated Background Layers */}
      <FloatingParticles />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-3xl opacity-40 -z-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      />

      {/*  Header  */}
      <div className="text-center mb-16 px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Everything you need to know about Sonva AI, from setup to security.
        </motion.p>
      </div>

      {/* ==== FAQ List ==== */}
      <div className="max-w-3xl mx-auto px-4 space-y-6 relative z-10">
        {faqs.map((faq, index) => {
          const isOpen = index === openIndex;

          return (
            <motion.div
              key={index}
              layout
              className={`border border-border/60 rounded-2xl backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ${
                isOpen
                  ? "bg-gradient-to-br from-primary/5 to-accent/5 shadow-[0_0_30px_rgba(0,0,0,0.2)] border-primary/30"
                  : "bg-card/30 hover:border-primary/30"
              }`}
            >
              {/* Question Row */}
              <motion.button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center text-left"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span
                  className={`text-lg md:text-xl font-semibold ${
                    isOpen ? "text-primary" : "text-foreground"
                  }`}
                >
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="ml-3 flex-shrink-0"
                >
                  <ChevronDown
                    className={`w-5 h-5 ${
                      isOpen ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
              </motion.button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground mt-4 text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Subtle Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-center mt-24 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
          <span className="text-primary font-semibold">
            Still have questions?
          </span>
          <span className="text-muted-foreground">
            Contact us anytime - we’re here to help.
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQ;
