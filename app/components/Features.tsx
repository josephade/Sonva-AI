"use client";

import {
  Phone,
  Calendar,
  MessageSquare,
  BarChart3,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  Zap,
  LayoutDashboard
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
    title: "PMS\nIntegration",
    description:
      "Connects with your existing dental software - DenGro, Dentrix, Open Dental, Eaglesoft and more.",
    gradient: "from-indigo-500 via-violet-500 to-indigo-600",
    position: "left",
  },
];

const Features = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative pb-12 py-32 overflow-hidden bg-background">
      {/* Gradient Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-5xl mx-auto mb-32">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 backdrop-blur-sm mb-10">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-base font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Product Features
            </span>
          </div>

          <h2 className="text-7xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.85] tracking-tight">
            <span className="block text-foreground">Everything</span>
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Automated
            </span>
          </h2>

          <p className="text-2xl md:text-3xl text-muted-foreground font-light max-w-3xl mx-auto">
            Faster. Smarter. Efficient.
          </p>
        </div>

        {/* Features Layout */}
        <div className="max-w-7xl mx-auto space-y-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-start gap-8 ${
                feature.position === "right" ? "flex-row-reverse" : ""
              }`}
              style={{
                animation: `fade-in 0.8s ease-out ${index * 0.15}s both`,
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Icon */}
              <div className="flex-shrink-0 relative group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-700`}
                  style={{
                    transform:
                      activeIndex === index ? "scale(1.5)" : "scale(1)",
                  }}
                />
                <div
                  className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${feature.gradient} p-1 transition-all duration-500`}
                  style={{
                    transform:
                      activeIndex === index
                        ? "scale(1.1) rotate(10deg)"
                        : "scale(1) rotate(0deg)",
                  }}
                >
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <feature.icon
                      className="h-10 w-10 md:h-14 md:w-14 text-foreground transition-transform duration-500"
                      style={{
                        transform:
                          activeIndex === index ? "scale(1.2)" : "scale(1)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Title + Description */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  {/* Connecting Line */}
                  <div
                    className={`absolute ${
                      feature.position === "right" ? "right-0" : "left-0"
                    } top-1/2 -translate-y-1/2 w-0 h-[2px] bg-gradient-to-r ${
                      feature.gradient
                    } transition-all duration-700`}
                    style={{
                      width: activeIndex === index ? "60px" : "0px",
                      opacity: activeIndex === index ? 1 : 0,
                    }}
                  />

                  {/* Text Stack */}
                  <div
                    className={`flex flex-col ${
                      feature.position === "right"
                        ? "items-end text-right"
                        : "items-start text-left"
                    } transition-all duration-500`}
                    style={{
                      transform:
                        activeIndex === index
                          ? "translateX(0)"
                          : feature.position === "right"
                          ? "translateX(-20px)"
                          : "translateX(20px)",
                      opacity: activeIndex === index ? 1 : 0.7,
                    }}
                  >
                    <h3
                      className={`text-4xl md:text-6xl lg:text-7xl font-black leading-[0.9] whitespace-pre-line mb-3 transition-all duration-500 ${
                        activeIndex === index
                          ? `bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`
                          : "text-foreground"
                      }`}
                    >
                      {feature.title}
                    </h3>

                    <div
                      className={`overflow-hidden transition-all duration-500 w-full ${
                        feature.position === "right" ? "text-right" : "text-left"
                      }`}
                      style={{
                        maxHeight: activeIndex === index ? "200px" : "0px",
                        opacity: activeIndex === index ? 1 : 0,
                      }}
                    >
                      <p
                        className={`text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl ${
                          feature.position === "right" ? "ml-auto" : "mr-auto"
                        }`}
                      >
                        {feature.description}
                      </p>

                      {/* <div
                        className={`flex items-center gap-2 mt-4 text-primary font-semibold ${
                          feature.position === "right" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-sm">Explore feature</span>
                        <ArrowRight className="w-4 h-4 animate-pulse" />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-32">
          <p className="text-muted-foreground text-lg mb-4">
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
};

export default Features;
