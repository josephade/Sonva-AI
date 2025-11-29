"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

{/* Device detection (used for audio bar count + size)*/}
const isMobileDevice =
  typeof window !== "undefined" && window.innerWidth < 768;

{/* Subtitle timing (t = timestamp in seconds) */}
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

{/*  Audio visualizer bar settings (mobile vs desktop) */}
const BAR_COUNT = isMobileDevice ? 12 : 24;
const BAR_WIDTH = isMobileDevice ? 12 : 20;
const BAR_GAP = isMobileDevice ? 6 : 12;

interface DemoProps {
  isActive: boolean;
  onClose: () => void;
}

{/* Fallback wrapper to avoid Safari crashes when calling getByteFrequencyData on stopped analyzers */}
function safeGetFreq(analyser: AnalyserNode, arr: Uint8Array) {
  (analyser as any).getByteFrequencyData(arr);
}

const Demo = ({ isActive, onClose }: DemoProps) => {
  const [step, setStep] = useState(0);

  // Current subtitle text
  const [subtitle, setSubtitle] = useState("");

  // Visualizer bar heights
  const [barValues, setBarValues] = useState<number[]>(Array(BAR_COUNT).fill(0));

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const animationRef = useRef<number | null>(null);
  const subtitleInterval = useRef<number | null>(null);

  {/*  Stop everything (audio + animations + subtitles) */}
  const stopAll = () => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;

    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;

    if (subtitleInterval.current !== null) {
      clearInterval(subtitleInterval.current);
      subtitleInterval.current = null;
    }
  };

  /* AUDIO VISUALIZER BAR ANIMATION LOOP */
  let frameSkip = 0;
  const animateBars = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const analyser = analyserRef.current;
    const arr = dataArrayRef.current;

    safeGetFreq(analyser, arr);

    // Reduce animation workload on mobile
    if (isMobileDevice) {
      frameSkip++;
      if (frameSkip % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animateBars);
        return;
      }
    }

    // Map frequency bins to symmetrical bar layout
    const mid = Math.floor(BAR_COUNT / 2);
    const mapped = Array(BAR_COUNT).fill(0);

    for (let i = 0; i < BAR_COUNT; i++) {
      const idx = Math.abs(i - mid);
      mapped[i] = arr[idx] / 255;
    }

    setBarValues(mapped);
    animationRef.current = requestAnimationFrame(animateBars);
  };

  /*  SUBTITLE SYNC LOOP */
  const startSubtitles = () => {
    if (!audioRef.current) return;

    // Faster subtitle checks on desktop, slower on mobile
    const speed = isMobileDevice ? 200 : 120;

    subtitleInterval.current = window.setInterval(() => {
      const t = audioRef.current!.currentTime;
      let text = "";

      // Determine the last subtitle whose timestamp has passed
      for (let s of SUBTITLES) if (t >= s.t) text = s.text;

      setSubtitle(text);
    }, speed);
  };

  /* START AUDIO + ANALYSER CONNECTION (step 3) */
  const startAudio = async () => {
    try {
      const audio = audioRef.current!;
      const ACtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new ACtx();

      await ctx.resume();

      // Create analyzer + connections only once
      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();

        analyser.fftSize = isMobileDevice ? 32 : 64;
        analyserRef.current = analyser;

        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        sourceRef.current.connect(analyser);
        analyser.connect(ctx.destination);
      }

      // iOS requires audio to begin muted
      audio.muted = true;
      await audio.play();
      audio.muted = false;

      animateBars();
      startSubtitles();

      audio.onended = () => {
        stopAll();
        onClose();
      };
    } catch (err) {
      console.warn("Audio blocked:", err);
    }
  };

  /* Handle transition through steps when modal opens */
  useEffect(() => {
    if (!isActive) {
      stopAll();
      return;
    }

    setStep(1);

    const t2 = setTimeout(() => setStep(2), 700);
    const t3 = setTimeout(() => setStep(3), 1600);

    return () => {
      stopAll();
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isActive]);

  /* Begin audio playback exactly at Step 3 */
  useEffect(() => {
    if (step === 3) startAudio();
  }, [step]);

  return (
    <>
      {/* Hidden audio element used by the visualizer */}
      <audio
        id="demo-audio"
        src="/demo-call.mp3"
        preload="auto"
        muted
        playsInline
        ref={audioRef}
      />

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center text-white"
            style={{ background: "#06112B" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Skip button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 px-4 py-2 rounded-md bg-white/10 border border-white/20 hover:bg-white/20"
            >
              Skip
            </button>

            {/* STEP 1 — Loading */}
            {step === 1 && (
              <div className="text-center space-y-4">
                <p className="text-3xl font-semibold">Starting demo…</p>
                <p className="text-lg opacity-70">Turn your volume up.</p>
              </div>
            )}

            {/* STEP 2 — Simulating busy reception */}
            {step === 2 && (
              <div className="text-center space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                <p className="text-xl opacity-70">Front desk is busy…</p>
              </div>
            )}

            {/* STEP 3 — Audio + visualizer + subtitles */}
            {step === 3 && (
              <>
                {/* AUDIO BARS */}
                <div
                  className="absolute bottom-[120px] left-0 right-0 mx-auto flex justify-center"
                  style={{
                    gap: `${BAR_GAP}px`,
                    transform: "translateZ(0)", 
                  }}
                >
                  {barValues.map((v, i) => (
                    <div
                      key={i}
                      className="rounded-md"
                      style={{
                        width: `${BAR_WIDTH}px`,
                        height: `${Math.max(10, v * 260)}px`,
                        background: isMobileDevice
                          ? "#0A214A"
                          : "linear-gradient(to bottom, #0A214A, #07152E)",
                        opacity: 0.9,
                        transition: "height 80ms linear",
                      }}
                    />
                  ))}
                </div>

                {/* SUBTITLES */}
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
