"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { supabase } from "../integrations/supabase/client";

const VoiceDemo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const demoScript = `Hello! Thank you for calling Bright Smile Dental. This is Sarah, how may I help you today?...`;

  const generateAndPlayAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Generating demo audio...");

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: {
          text: demoScript,
          voiceId: "9BWtsMINqrJLrRacOk9x",
        },
      });

      if (error) throw error;

      if (data?.audioContent) {
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        const blob = new Blob([bytes], { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } else setError("No audio content received from Supabase function.");
    } catch (err: any) {
      console.error("Error generating audio:", err);
      setError("Failed to generate demo audio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current && audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      generateAndPlayAudio();
    }
  };

  const handleEnded = () => setIsPlaying(false);

  return (
    <motion.section
      className="relative py-28 bg-gradient-to-b from-secondary/40 to-background overflow-hidden"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeOut" }}
      id="voice-demo"
    >
      {/* Floating Gradient Blobs */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] bg-primary/30"
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[5%] right-[5%] w-[350px] h-[350px] rounded-full blur-[120px] bg-accent/30"
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* Demo Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Live Demo</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Hear <span className="text-primary">Sonva AI</span> In Action
          </motion.h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Listen to how our AI handles a real dental appointment booking call
            with a natural, professional voice.
          </motion.p>

          {/* Audio Player Card */}
          <motion.div
            className="relative rounded-2xl border bg-card/60 text-card-foreground shadow-md p-10 border-border backdrop-blur-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          >
            {/* Glowing rotating ring behind button */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 border-primary/40"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1],
                    opacity: 1,
                  }}
                  transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity },
                  }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            {/* Center button */}
            <div className="flex flex-col items-center gap-8">
              <motion.div
                className="relative w-28 h-28 flex items-center justify-center rounded-full bg-primary/10 border border-primary/30 shadow-inner"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/30 blur-2xl"
                  animate={{
                    opacity: isPlaying ? [0.4, 0.8, 0.4] : 0.2,
                    scale: isPlaying ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                />

                <button
                  onClick={togglePlay}
                  disabled={isLoading}
                  className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-md"
                >
                  {isLoading ? (
                    <Volume2 className="w-6 h-6 animate-pulse" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>
              </motion.div>

              {/* Animated waveform bars */}
              <div className="flex items-end justify-center gap-1 h-8">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary/70 rounded-sm"
                    animate={
                      isPlaying
                        ? {
                            height: [
                              "20%",
                              `${40 + Math.random() * 60}%`,
                              "20%",
                            ],
                            opacity: [0.7, 1, 0.7],
                          }
                        : { height: "20%", opacity: 0.5 }
                    }
                    transition={{
                      duration: 0.5 + i * 0.05,
                      repeat: isPlaying ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <div className="space-y-1 text-center">
                <h3 className="text-lg font-semibold">
                  Sample Call: New Patient Booking
                </h3>
                <p className="text-sm text-muted-foreground">
                  Patient calls to schedule a teeth cleaning appointment
                </p>
              </div>

              {error && (
                <div className="w-full px-4 py-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <audio ref={audioRef} onEnded={handleEnded} className="hidden" />

              <div className="pt-4 text-xs text-muted-foreground">
                🎧 Use headphones for the best experience
              </div>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p
            className="text-sm text-muted-foreground pt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            This is an actual call handled by Sonva — no human receptionist
            needed.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};

export default VoiceDemo;
