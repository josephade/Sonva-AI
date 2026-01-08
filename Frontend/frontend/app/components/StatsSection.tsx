import React from 'react';
import { motion, useInView } from 'framer-motion';

const StatCounter: React.FC<{ value: number; suffix: string; label: string }> = ({ value, suffix, label }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = duration / end;

      const timer = setInterval(() => {
        start += Math.ceil(end / 50); // Increment speed
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{label}</div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/50">
          <StatCounter value={97} suffix="%" label="Call Handling Rate" />
          <StatCounter value={40} suffix="+" label="Hours Saved Monthly" />
          <StatCounter value={25} suffix="+" label="Practices Onboarded" />
          <StatCounter value={99} suffix="%" label="Uptime Reliability" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;