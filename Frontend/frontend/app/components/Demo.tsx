"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface SubtitleEntry {
  t: number;
  text: string;
}

const SUBTITLES: SubtitleEntry[] = [
  { t: 0, text: "Hey, Amy here from Sonva Dental. How may I help you?" },
  { t: 3, text: "Hello Amy, I'm calling because I have a really sore tooth and I'd like to book an appointment." },
  { t: 9, text: "I'm sorry to hear you're in pain. Let's get you in as soon as possible." },
  { t: 12, text: "Do you have a preferred time or are you open to the earliest available slot?" },
  { t: 17, text: "Do you have a slot today?" },
  { t: 20, text: "We have a spot at 3:30pm today. Would that work for you?" },
  { t: 24, text: "That sounds perfect. Also, do you take medical cards?" },
  { t: 29, text: "We’re not accepting medical card patients, but we offer 20% off our emergency special." },
  { t: 37, text: "Yeah, that sounds good." },
  { t: 40, text: "Great. Can I get your first name, last name, and date of birth please?" },
  { t: 47, text: "My name is David James. DOB: 2nd February 2001." },
  { t: 55, text: "Thanks David. Is this your best contact number?" },
  { t: 59, text: "Yeah, that’s correct." },
  { t: 61, text: "Your appointment is confirmed for today at 3:30pm." },
  { t: 63, text: "You'll receive a text with the details shortly." },
  { t: 67, text: "Can I change the appointment to tomorrow at 1?" },
  { t: 73, text: "Sure, I can move you to tomorrow at 1pm. Does that work better?" },
  { t: 77, text: "Yeah, that sounds much ." },
  { t: 80, text: "Your appointment is now confirmed for tomorrow at 1pm." },
  { t: 86, text: "And where is the parking for the clinic?" },
  { t: 91, text: "Parking is available in the underground garage. Just follow the signs." },
  { t: 97, text: "Perfect, thank you very much." }
];

const BAR_COUNT = 24;
const BAR_WIDTH = 20;
const BAR_GAP = 12;

interface DemoProps {
  isActive: boolean;
  onClose: () => void;
}

const Demo = ({ isActive, onClose }: DemoProps) => {
  const [step, setStep] = useState(0);
  const [subtitle, setSubtitle] = useState("");

  const [barValues, setBarValues] = useState<number[]>(
    Array(BAR_COUNT).fill(0)
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const animationRef = useRef<number | null>(null);
  const subtitleInterval = useRef<number | null>(null);

  // 🔥 FIX to prevent "already connected" error:
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // TypeScript-safe wrapper for audio frequency
  const safeGetByteFrequencyData = (analyser: any, array: Uint8Array) => {
    analyser.getByteFrequencyData(array);
  };

  // -----------------------
  // Clean-up
  // -----------------------
  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (subtitleInterval.current !== null) {
      clearInterval(subtitleInterval.current);
      subtitleInterval.current = null;
    }

    // DO NOT clear sourceRef — must persist
    // analyser and data can be reset safely
    analyserRef.current = null;
    dataArrayRef.current = null;
  };

  // -----------------------
  // Bars Animation
  // -----------------------
  const animateBars = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const analyser = analyserRef.current;
    const data = dataArrayRef.current;

    safeGetByteFrequencyData(analyser, data);

    const mid = Math.floor(BAR_COUNT / 2);
    const mappedBars = Array(BAR_COUNT).fill(0);

    for (let i = 0; i < BAR_COUNT; i++) {
      const mirroredIndex = Math.abs(i - mid);
      mappedBars[i] = data[mirroredIndex] / 255;
    }

    setBarValues(mappedBars);
    animationRef.current = requestAnimationFrame(animateBars);
  };

  // -----------------------
  // Subtitles
  // -----------------------
  const startSubtitles = () => {
    if (!audioRef.current) return;

    subtitleInterval.current = window.setInterval(() => {
      const t = audioRef.current!.currentTime;
      let text = "";

      for (let s of SUBTITLES) {
        if (t >= s.t) text = s.text;
      }

      setSubtitle(text);
    }, 120);
  };

  // -----------------------
  // Start Audio (AUTOPLAY)
  // -----------------------
  const startAudio = async () => {
    try {
      const audio = document.getElementById("demo-audio") as HTMLAudioElement;
      audioRef.current = audio;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      let ctx =
        (analyserRef.current?.context as AudioContext) ?? new AudioCtx();

      await ctx.resume();

      // ------------ IMPORTANT ------------
      // Only create the MediaElementSourceNode ONCE
      // -----------------------------------
      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audio);

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;

        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        sourceRef.current.connect(analyser);
        analyser.connect(ctx.destination);
      }

      await audio.play();

      animateBars();
      startSubtitles();

      audio.onended = () => {
        stopAll();
        onClose();
      };
    } catch (e) {
      console.warn("Audio autoplay blocked or source reused:", e);
    }
  };

  // -----------------------
  // Step Flow
  // -----------------------
  useEffect(() => {
    if (!isActive) {
      stopAll();
      return;
    }

    setSubtitle("");

    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => {
      setStep(3);
      startAudio();
    }, 2500);

    return () => {
      stopAll();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isActive]);

  return (
    <>
      <audio id="demo-audio" src="/demo-call.mp3" preload="auto" />

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center text-white"
            style={{ background: "#06112B" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 px-4 py-2 rounded-md bg-white/10 border border-white/20 hover:bg-white/20"
            >
              Skip
            </button>

            {/* Step 1 */}
            {step === 1 && (
              <div className="text-center space-y-4">
                <p className="text-3xl font-semibold">Starting demo…</p>
                <p className="text-lg opacity-70">Turn your volume up.</p>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                <p className="text-xl opacity-70">Front desk is busy…</p>
              </div>
            )}

            {/* Step 3 - Audio Playing */}
            {step === 3 && (
              <>
                {/* Bars */}
                <div
                  className="absolute bottom-[120px] left-0 right-0 mx-auto flex justify-center"
                  style={{ gap: `${BAR_GAP}px` }}
                >
                  {barValues.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-md bg-gradient-to-b from-[#0A214A] to-[#07152E]"
                      style={{
                        width: `${BAR_WIDTH}px`,
                        height: `${Math.max(10, v * 260)}px`,
                        opacity: 0.85,
                        filter: "blur(1px)",
                        transition: "height 60ms linear"
                      }}
                    />
                  ))}
                </div>

                {/* Subtitles */}
                <div className="absolute bottom-10 w-full text-center px-4">
                  <p className="text-white text-lg font-semibold drop-shadow-lg">
                    {subtitle}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Demo;
