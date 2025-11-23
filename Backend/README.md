# 🦷 Super Secretary / AI Receptionist MVP

**Super Secretary** (a.k.a. *AI Receptionist*) is a real-time voice AI that answers inbound calls for service-based businesses — starting with dental clinics.

It can **book**, **reschedule**, and **cancel** appointments directly into Google Calendar, handle **FAQs**, and **transfer calls** for emergencies or billing — all with a natural Irish accent.

---

## 🎯 Vision

> Never miss a call again.  
> Free up staff time.  
> Automate bookings, cancellations, and reminders — 24/7.

This MVP is a working prototype designed to demonstrate:
- Real-time AI receptionist via **LiveKit + Twilio SIP**
- FastAPI backend integrating **Google Calendar** & **Supabase Realtime**
- Voice pipeline powered by **OpenAI Realtime** (for STT/LLM) + **ElevenLabs** (for TTS)
- Live call logs and analytics dashboard via **Next.js** or **Retool**

---

## ⚙️ Tech Stack

| Layer | Tool | Purpose |
|-------|------|----------|
| **Voice / Realtime** | LiveKit Cloud | Handles SIP calls, real-time audio |
| **Speech-to-Text + LLM** | OpenAI Realtime (GPT-4o) | Conversation logic |
| **Text-to-Speech** | ElevenLabs (Irish accent) | Natural human voice |
| **Telephony** | Twilio SIP | Incoming call routing |
| **Backend** | FastAPI | Core business logic + APIs |
| **Database** | Supabase (Postgres + Realtime) | Call logs + analytics |
| **Calendar** | Google Calendar API | Book/reschedule/cancel appointments |
| **Frontend** | Next.js / Retool | Demo dashboard |
| **Region** | Europe/Dublin | Local timezone |

---

