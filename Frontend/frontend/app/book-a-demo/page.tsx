"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, Users, Building2, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Step = 1 | 2 | 3 | 'success';

export default function () {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    clinicName: '',
    clinicType: 'Private',
    chairs: '1-3',
    fullName: '',
    role: '',
    email: '',
    phone: '',
  });

  const nextStep = () => setStep((prev) => (prev as number) + 1 as Step);
  const prevStep = () => setStep((prev) => (prev as number) - 1 as Step);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Content: High Trust Info */}
            <div className="lg:col-span-5 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-6">
                  Experience the <br />
                  <span className="text-primary">Future of Reception.</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  Join 250+ clinics reclaiming their time. See how Sonva handles your unique workflow in a 15-minute personalized tour.
                </p>
              </motion.div>

              <div className="space-y-8">
                {[
                  { icon: Zap, title: "15-Minute Personalized Demo", desc: "No fluff. We show you exactly how Sonva books patients for your clinic." },
                  { icon: ShieldCheck, title: "GDPR & HIPAA Ready", desc: "We take medical data seriously. All security protocols are fully transparent." },
                  { icon: Users, title: "Multi-Chair Scaling", desc: "Learn how to manage high call volumes without adding payroll." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex gap-5"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                      <p className="text-slate-500 font-medium leading-snug">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <p className="text-lg font-medium italic relative z-10 mb-6">
                  "Sonva didn't just answer our calls; she understood our patients. It's the best investment our practice has made this year."
                </p>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" />
                  <div>
                    <p className="font-bold text-sm">Dr. Sarah O'Connor</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Principal, Dublin Dental</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Content: Booking Form Card */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5 p-8 md:p-12 relative"
              >
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 block">Step 01/03</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tell us about your clinic</h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Practice Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Riverside Dental Studio"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                            value={formData.clinicName}
                            onChange={(e) => updateField('clinicName', e.target.value)}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Clinic Type</label>
                            <select 
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none"
                              value={formData.clinicType}
                              onChange={(e) => updateField('clinicType', e.target.value)}
                            >
                              <option>Private</option>
                              <option>NHS</option>
                              <option>Mixed</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Number of Chairs</label>
                            <select 
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium appearance-none"
                              value={formData.chairs}
                              onChange={(e) => updateField('chairs', e.target.value)}
                            >
                              <option>1-2 Chairs</option>
                              <option>3-5 Chairs</option>
                              <option>6-10 Chairs</option>
                              <option>10+ Chairs</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={nextStep}
                        disabled={!formData.clinicName}
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        Next Step <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">
                        <ArrowLeft size={16} /> Back to Clinic Details
                      </button>
                      <div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 block">Step 02/03</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Information</h2>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                            <input 
                              type="text" 
                              placeholder="Jane Doe"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                              value={formData.fullName}
                              onChange={(e) => updateField('fullName', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Job Title</label>
                            <input 
                              type="text" 
                              placeholder="Practice Manager"
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                              value={formData.role}
                              onChange={(e) => updateField('role', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Work Email</label>
                          <input 
                            type="email" 
                            placeholder="jane@riversidedental.com"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Phone Number</label>
                          <input 
                            type="tel" 
                            placeholder="+353 1 234 5678"
                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                          />
                        </div>
                      </div>

                      <button 
                        onClick={nextStep}
                        disabled={!formData.fullName || !formData.email}
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        Select Demo Time <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <button onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm">
                        <ArrowLeft size={16} /> Back to Contact Info
                      </button>
                      <div>
                        <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-2 block">Step 03/03</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Preferred Timeframe</h2>
                        <p className="text-slate-500 font-medium">When is best for us to reach out?</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {['As soon as possible', 'Today Afternoon', 'Tomorrow Morning', 'Tomorrow Afternoon', 'Next Week', 'Sometime Else'].map((time) => (
                          <button 
                            key={time}
                            onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                            className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-primary hover:text-primary font-bold text-sm text-slate-700 transition-all text-center"
                          >
                            {time}
                          </button>
                        ))}
                      </div>

                      <div className="pt-6 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-400 font-medium">By clicking any option, you agree to our Terms and acknowledge our Privacy Policy.</p>
                      </div>
                    </motion.div>
                  )}

                  {step === 'success' && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle2 size={40} />
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Request Received!</h2>
                      <p className="text-xl text-slate-500 font-medium mb-12 max-w-sm mx-auto">
                        One of our specialists will reach out to <strong>{formData.email}</strong> shortly to confirm your slot.
                      </p>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="px-10 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all"
                      >
                        Back to Homepage
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}