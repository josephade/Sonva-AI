"use client";

import {
  Phone,
  Calendar,
  MessageSquare,
  BarChart3,
  Clock,
  Users,
  Sparkles,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: Phone,
    title: "Answer Every\nDental Inquiry",
    description:
      "Sonva handles new patient calls, emergency requests, and routine questions while you're with patients.",
    gradient: "from-blue-500 via-cyan-500 to-blue-600",
    position: "left",
  },
  {
    icon: Calendar,
    title: "Appointment\nScheduling",
    description:
      "Books cleanings, exams, root canals and consultations, even manages same-day emergency slots.",
    gradient: "from-purple-500 via-pink-500 to-purple-600",
    position: "right",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard\nManagement",
    description:
      "Gain full visibility into your clinic’s performance with a real-time admin dashboard. Track missed calls, conversion rates, call volumes by time, and key sales metrics, all visualized through intuitive charts and insights.",
    gradient: "from-purple-500 via-pink-500 to-purple-600",
    position: "left",
  },
  {
    icon: MessageSquare,
    title: "Insurance &\nTreatment Info",
    description:
      "Answers questions about insurance coverage, treatment costs, and available dental procedures.",
    gradient: "from-green-500 via-emerald-500 to-green-600",
    position: "right",
  },
  {
    icon: BarChart3,
    title: "Track\nConversions",
    description:
      "See exactly which calls become appointments and which inquiries need follow-up from your team.",
    gradient: "from-orange-500 via-amber-500 to-orange-600",
    position: "left",
  },
  {
    icon: Clock,
    title: "After-Hours\nEmergency Line",
    description:
      "Handles evening and weekend calls when your dental office is closed, never lose an emergency patient.",
    gradient: "from-red-500 via-rose-500 to-red-600",
    position: "right",
  },
  {
    icon: Users,
    title: "Practice\nIntegration",
    description:
      "Connects with your existing dental software – DenGro, Dentrix, Open Dental, Eaglesoft and more.",
    gradient: "from-indigo-500 via-violet-500 to-indigo-600",
    position: "left",
  },
];

export default function Features() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      {/* Soft Animating Glow Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-5xl mx-auto mb-28">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 backdrop-blur-sm mb-10">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Complete Dental Reception Automation
            </span>
          </div>

          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black leading-[1] tracking-tight mb-8">
            <span className="block text-foreground">Everything</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Automated
            </span>
          </h2>

          <p className="text-2xl md:text-3xl text-muted-foreground font-light max-w-3xl mx-auto">
            Sonva handles your entire reception desk – instantly
          </p>
        </div>

        {/* Feature Rows */}
        <div className="max-w-7xl mx-auto space-y-16">
          {features.map((f, i) => {
            const isActive = active === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`flex items-start gap-8 ${
                  f.position === "right" ? "flex-row-reverse" : ""
                } transition-all`}
              >
                {/* Icon Section */}
                <div className="relative group flex-shrink-0">
                  <div
                    className={`absolute inset-0 rounded-full blur-3xl bg-gradient-to-br ${f.gradient} transition-opacity duration-500 ${
                      isActive ? "opacity-60 scale-110" : "opacity-0 scale-100"
                    }`}
                  />

                  <div
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${f.gradient} p-1 transition-all duration-500 ${
                      isActive ? "scale-[1.12] rotate-6" : "scale-100 rotate-0"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <f.icon
                        className={`h-10 w-10 md:h-14 md:w-14 text-foreground transition-transform duration-500 ${
                          isActive ? "scale-110" : "scale-100"
                        }`}  
                      />
                    </div>
                  </div>
                </div>

                {/* Text Section */}
                <div className="flex-1 min-w-0 relative">
                  {/* Connecting line */}
                  {/* <div
                    className={`absolute top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r ${f.gradient} transition-all duration-500 ${
                      f.position === "right" ? "right-0" : "left-0"
                    }`}
                    style={{
                      width: isActive ? "70px" : "0px",
                      opacity: isActive ? 1 : 0,
                    }}
                  /> */}

                  <div
                    className={`flex flex-col ${
                      f.position === "right"
                        ? "items-end text-right"
                        : "items-start text-left"
                    } transition-all duration-500 ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-80"
                    }`}
                  >
                    <h3
                      className={`text-4xl md:text-6xl lg:text-7xl font-black leading-snug whitespace-pre-line mb-4 transition-all duration-500 ${
                        isActive
                          ? `bg-gradient-to-r ${f.gradient} bg-clip-text text-transparent`
                          : "text-foreground"
                      }`}
                    >
                      {f.title}
                    </h3>

                    <div
                      className="overflow-hidden transition-all duration-500"
                      style={{
                        maxHeight: isActive ? "180px" : "0px",
                        opacity: isActive ? 1 : 0,
                      }}
                    >
                      <p className="no-underline text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl ">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtext */}
        <div className="text-center mt-32">
          <p className="text-muted-foreground text-lg mb-3">
            Hover over features to learn more
          </p>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Powered by Advanced AI
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
