import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, CreditCard, Tag, PhoneForwarded, ChevronDown } from 'lucide-react';

interface Subtitle {
  time: number;
  text: string;
  speaker: 'ai' | 'patient';
}

interface DataCard {
  time: number;
  type: 'request' | 'time' | 'insurance' | 'offer';
  label: string;
  value: string;
  subValue?: string;
  icon: any;
}

// const SUBTITLES: SubtitleEntry[] = [
//   { t: 0, text: "Hey, Amy here from Sonva Dental. How may I help you?" },
//   { t: 3, text: "Hello Amy, I'm calling because I have a really sore tooth and I'd like to book an appointment." },
//   { t: 9, text: "I'm sorry to hear you're in pain. Let's get you in as soon as possible." },
//   { t: 12, text: "Do you have a preferred time or are you open to the earliest available slot?" },
//   { t: 17, text: "Do you have a slot today?" },
//   { t: 20, text: "We have a spot at 3:30pm today. Would that work for you?" },
//   { t: 24, text: "That sounds perfect. Also, do you take medical cards?" },
//   { t: 29, text: "We’re not accepting medical card patients, but we offer 20% off our emergency special." },
//   { t: 37, text: "Yeah, that sounds good." },
//   { t: 40, text: "Great. Can I get your first name, last name, and date of birth please?" },
//   { t: 47, text: "My name is David James. DOB: 2nd February 2001." },
//   { t: 55, text: "Thanks David. Is this your best contact number?" },
//   { t: 59, text: "Yeah, that’s correct." },
//   { t: 61, text: "Your appointment is confirmed for today at 3:30pm." },
//   { t: 63, text: "You'll receive a text with the details shortly." },
//   { t: 67, text: "Can I change the appointment to tomorrow at 1?" },
//   { t: 73, text: "Sure, I can move you to tomorrow at 1pm. Does that work better?" },
//   { t: 77, text: "Yeah, that sounds much ." },
//   { t: 80, text: "Your appointment is now confirmed for tomorrow at 1pm." },
//   { t: 86, text: "And where is the parking for the clinic?" },
//   { t: 91, text: "Parking is available in the underground garage. Just follow the signs." },
//   { t: 97, text: "Perfect, thank you very much." }
// ];

const transcript: Subtitle[] = [
  { time: 0, text: "Hi, Sophie from Sonva Dental. How may I help you?", speaker: 'ai' },
  { time: 3, text: "Hey, one of my teeth has been really hurting me for a few days and I wanted to come in and maybe get it checked.", speaker: 'patient' },
  { time: 8, text: "I'm sorry to hear that. Let's get you in for an emergency appointment.", speaker: 'ai' },
  { time: 11, text: "Will this be your first visit with us?", speaker: 'ai' },
  { time: 13, text: "Yes.", speaker: 'patient' },
  { time: 14, text: "All right. Let me check our schedule for you.", speaker: 'ai' },
  { time: 16, text: "The earliest we can see you is today at 4:30 in the evening. Does that work for you?", speaker: 'ai' },
  { time: 21, text: "That works, yeah.", speaker: 'patient' },
  { time: 23, text: "Perfect. I've noted that down. We also have an Emergency Special for $49 today.", speaker: 'ai' },
  { time: 28, text: "Great, thanks!", speaker: 'patient' }
];

const dataCards: DataCard[] = [
  { time: 8, type: 'request', label: 'Request Type:', value: 'Appt. Booking', subValue: 'Emerg. Exam', icon: User },
  { time: 16, type: 'time', label: 'Booking Time:', value: 'Mon, Jul 17', subValue: '4:30PM, PST', icon: Calendar },
  { time: 20, type: 'insurance', label: 'Patient Insurance:', value: 'Medicaid.', subValue: 'Not Accepted', icon: CreditCard },
  { time: 25, type: 'offer', label: 'Special Offer:', value: 'Emergency Special', subValue: '$49.00', icon: Tag },
];

const AudioDemo: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'loading' | 'context' | 'pickup' | 'active' | 'end'>('loading');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const loadingTimer = setTimeout(() => setStep('context'), 2000);
    const contextTimer = setTimeout(() => setStep('pickup'), 4000);
    const pickupTimer = setTimeout(() => {
      setStep('active');
      setIsPlaying(true);
    }, 6000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(contextTimer);
      clearTimeout(pickupTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isPlaying && step === 'active') {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 32) {
            if (timerRef.current) clearInterval(timerRef.current);
            setStep('end');
            return prev;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, step]);

  const activeSubtitle = [...transcript].reverse().find(s => currentTime >= s.time);
  const activeCards = dataCards.filter(c => currentTime >= c.time);

  const barCount = 100;

  return (
    <div className="fixed inset-0 z-40 bg-[#020617] text-white flex flex-col items-center justify-center overflow-hidden font-sans pt-20">
      <AnimatePresence mode="wait">
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center relative z-10 p-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">Starting demo...</h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium">For the full experience,<br />ensure your volume is on.</p>
            <p className="text-slate-500 mt-4 text-base font-medium">This Audio has NOT been edited.</p>
          </motion.div>
        )}

        {step === 'context' && (
          <motion.div
            key="context"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center px-6 relative z-10"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8 flex justify-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#2b1009] text-[#ea580c] rounded-full flex items-center justify-center border border-[#ea580c]/20 shadow-[0_0_50px_rgba(234,88,12,0.1)]">
                <PhoneForwarded size={32} className="md:w-10 md:h-10" />
              </div>
            </motion.div>
            <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-tight mb-2 text-white">Front desk is busy</h2>
            <p className="text-xl md:text-2xl text-slate-400 font-medium">or call is after hours...</p>
          </motion.div>
        )}

        {step === 'pickup' && (
          <motion.div
            key="pickup"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center px-6 relative z-10 flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="mb-10 w-20 h-20 md:w-24 md:h-24 bg-[#0047AB] rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,71,171,0.3)]"
            >
              <svg width="40" height="40" className="md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 10.39 4.48 8.9 5.29 7.66L16.34 18.71C15.1 19.52 13.61 20 12 20ZM18.71 16.34L7.66 5.29C8.9 4.48 10.39 4 12 4C16.41 4 20 7.59 20 12C20 13.61 19.52 15.1 18.71 16.34Z" fill="white" fillOpacity="0.4"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#0047AB"/>
                <circle cx="10" cy="11" r="2.5" fill="#94A3B8"/> H
                <path d="M12 7V17M12 7C14.5 7 16.5 9 16.5 11.5V12.5C16.5 15 14.5 17 12 17M12 7C9.5 7 7.5 9 7.5 11.5V12.5C7.5 15 9.5 17 12 17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
            <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-tight text-white text-center">Sonva picks up,<br />24/7...</h2>
          </motion.div>
        )}

        {step === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative flex flex-col items-center justify-center"
          >
            {/* Liquid Curtain Visualizer - Full Screen */}
            <div className="absolute inset-0 flex items-end justify-center gap-[1px] md:gap-[2px] opacity-25 pointer-events-none">
              {[...Array(barCount)].map((_, i) => {
                const delay = i * 0.02;
                const multiplier = Math.exp(-Math.pow(i - barCount / 2, 2) / (2 * Math.pow(barCount / 4, 2)));
                
                return (
                  <motion.div
                    key={i}
                    animate={{
                      height: isPlaying 
                        ? [`${15 + multiplier * 30}%`, `${30 + multiplier * 65}%`, `${15 + multiplier * 30}%`]
                        : `${20 + multiplier * 20}%`,
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: delay
                    }}
                    className="flex-1 min-w-[1px] bg-gradient-to-t from-blue-600 via-blue-400 to-transparent rounded-t-full shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                  />
                );
              })}
            </div>

            {/* Glowing Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
                 transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] bg-blue-600/10 blur-[150px] rounded-full"
               />
               <motion.div 
                 animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 60, 0] }}
                 transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] bg-purple-600/10 blur-[150px] rounded-full"
               />
            </div>

            {/* Top-Right Skip Button */}
            <div className="absolute top-10 right-4 md:right-10 z-50">
               <button 
                 onClick={() => setStep('end')}
                 className="px-6 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white font-bold rounded-full text-xs flex items-center gap-2 transition-all tracking-widest uppercase hover:scale-105 active:scale-95 shadow-2xl"
               >
                 <X size={14} /> Skip
               </button>
            </div>

            {/* Status Cards (Top Overlay) */}
            <div className="absolute top-12 left-0 right-0 flex flex-col items-center gap-3 md:gap-4 z-20 pointer-events-none px-4">
              <AnimatePresence>
                {activeCards.map((card) => (
                  <motion.div
                    key={card.type}
                    initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-2 md:p-3 pr-6 md:pr-8 flex items-center gap-3 md:gap-4 w-full max-w-[280px] md:max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  >
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white shrink-0 shadow-lg">
                      <card.icon size={18} className="md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">{card.label}</p>
                      <p className="text-xs md:text-base font-bold flex items-center gap-1 md:gap-2 truncate">
                        {card.value} <span className="text-white/20 font-light">|</span> <span className="text-blue-400">{card.subValue}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Subtitles (Center/Bottom Overlay) - Moved lower via reduced mb */}
            <div className="mt-auto mb-8 md:mb-12 text-center z-20 max-w-2xl md:max-w-4xl px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSubtitle?.text}
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className={`text-base md:text-2xl font-bold tracking-tight leading-relaxed md:leading-[1.1] ${activeSubtitle?.speaker === 'ai' ? 'text-slate-400 italic' : 'text-white'}`}>
                    {activeSubtitle?.text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 'end' && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center text-center px-6 relative"
          >
             {/* Dynamic Background */}
             <div className="absolute inset-0 flex items-center justify-center gap-[2px] opacity-10 pointer-events-none">
                {[...Array(40)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ height: ['40%', '60%', '40%'] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.1 }}
                    className="flex-1 max-w-[10px] bg-blue-600 rounded-full" 
                  />
                ))}
            </div>

            <div className="relative z-10 max-w-5xl">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-6xl font-black mb-8 md:mb-10 tracking-tighter leading-tight text-white"
              >
                Sound effective? <br className="hidden md:block" /> Want to see behind the curtain?
              </motion.h2>
              
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                onClick={onClose}
                className="px-10 py-5 md:px-14 md:py-6 bg-blue-600 text-white text-lg md:text-2xl font-black rounded-full hover:bg-blue-500 transition-all shadow-[0_20px_60px_rgba(37,99,235,0.4)] mb-12 md:mb-16"
              >
                Book Your Demo
              </motion.button>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-3 md:gap-4 text-blue-500 cursor-pointer group" 
                onClick={onClose}
              >
                 <div className="p-3 md:p-4 rounded-full border border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-300 animate-bounce">
                    <ChevronDown size={28} className="md:w-8 md:h-8" />
                 </div>
                 <span className="text-[10px] md:text-sm font-black tracking-[0.4em] uppercase opacity-40 group-hover:opacity-100 transition-opacity">Scroll to discover Sonva</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioDemo;