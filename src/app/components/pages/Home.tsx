import { useNavigate } from "react-router";
import {
  Eye,
  Brain,
  Zap,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers,
  Image,
  Languages,
} from "lucide-react";
import { vocab } from "../../data/vocab";

const featureCards = [
  {
    icon: Image,
    title: "Image-First Learning",
    description:
      "Words are presented through vivid visual cues, forming direct neural associations without relying on translation.",
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Brain,
    title: "Dual Coding Theory",
    description:
      "Processing vocabulary both visually and verbally creates stronger memory traces and improves long-term retention.",
    color: "from-violet-500 to-pink-500",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Zap,
    title: "Minimal Cognitive Load",
    description:
      "A distraction-free interface encourages fast recall and reduces extraneous processing during learning.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      {/* Hero */}
      <div
        className="relative overflow-hidden px-8 py-16 motion-reveal"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-0 right-0 rounded-full opacity-10 motion-orb"
          style={{
            width: 400,
            height: 400,
            background: "radial-gradient(circle, #6366f1, transparent)",
            transform: "translate(100px, -100px)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 rounded-full opacity-10 motion-orb motion-orb-slow motion-orb-reverse"
          style={{
            width: 300,
            height: 300,
            background: "radial-gradient(circle, #8b5cf6, transparent)",
            transform: "translateY(100px)",
          }}
        />

        <div className="relative max-w-4xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-400/30 bg-indigo-400/10 mb-6 motion-reveal-fast"
            style={{ animationDelay: "90ms" }}
          >
            <Layers size={13} className="text-indigo-400" />
            <span className="text-indigo-300 text-xs font-medium tracking-wide">
              HCI Research Project · 2026
            </span>
          </div>

          <h1
            className="text-white mb-4 motion-reveal-fast"
            style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.15, animationDelay: "150ms" }}
          >
            Image-Based Vocabulary
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #a5b4fc, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Learning Prototype
            </span>
          </h1>

          <p
            className="text-slate-300 max-w-2xl mb-8 motion-reveal-fast"
            style={{ lineHeight: 1.7, animationDelay: "220ms" }}
          >
            This project investigates whether vocabulary learning through image-based associations
            leads to better retention compared to traditional translation-based methods — grounded in
            Dual Coding Theory and HCI principles.
          </p>

          <div className="flex flex-wrap gap-3 motion-reveal-fast" style={{ animationDelay: "280ms" }}>
            <button
              onClick={() => navigate("/study")}
              className="motion-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <BookOpen size={16} />
              Start Studying
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Preview cards floating */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex gap-3 motion-stagger">
          {vocab.slice(0, 3).map((word, i) => (
            <div
              key={word.id}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm motion-card motion-card-soft"
              style={{
                width: 120,
                transform: `rotate(${[-4, 0, 4][i]}deg) translateY(${[-8, 0, -8][i]}px)`,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={word.image}
                alt={word.word}
                className="w-full object-cover"
                style={{ height: 90 }}
              />
              <div className="p-2">
                <div className="text-white text-xs font-medium">{word.word}</div>
                <div className="text-indigo-300 text-xs">{word.translation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-8 py-6 bg-white border-b border-slate-100 motion-reveal-fast" style={{ animationDelay: "160ms" }}>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800" style={{ fontWeight: 700 }}>
              10
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Vocabulary Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800" style={{ fontWeight: 700 }}>
              2
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Learning Modes</div>
          </div>
        </div>
      </div>

      <div className="px-8 py-10 max-w-5xl space-y-12">
        {/* Features */}
        <section className="motion-reveal-fast" style={{ animationDelay: "220ms" }}>
          <div className="mb-6">
            <h2 className="text-slate-800 mb-1" style={{ fontWeight: 700 }}>
              Core Design Principles
            </h2>
            <p className="text-slate-500 text-sm">
              Three key pillars that guide the interaction design of this prototype.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 motion-stagger">
            {featureCards.map(({ icon: Icon, title, description, bg, iconColor }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all motion-card"
              >
                <div className={`inline-flex p-2.5 rounded-xl mb-4 ${bg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <h3 className="text-slate-800 mb-2 text-sm" style={{ fontWeight: 600 }}>
                  {title}
                </h3>
                <p className="text-slate-500 text-sm" style={{ lineHeight: 1.6 }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Method Comparison */}
        <section className="motion-reveal-fast" style={{ animationDelay: "280ms" }}>
          <div className="mb-6">
            <h2 className="text-slate-800 mb-1" style={{ fontWeight: 700 }}>
              Method Comparison
            </h2>
            <p className="text-slate-500 text-sm">
              How image-based learning compares to traditional translation-based methods.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 motion-stagger">
            {/* Image-based */}
            <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5 relative motion-card">
              <div className="absolute top-4 right-4">
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: "#e0e7ff", color: "#4338ca" }}
                >
                  This Prototype
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-50">
                  <Eye size={20} className="text-indigo-600" />
                </div>
                <h3 className="text-slate-800 text-sm" style={{ fontWeight: 600 }}>
                  Image-Based Learning
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Visual cues trigger direct word associations",
                  "No translation — strengthens mental image link",
                  "Engages dual processing channels",
                  "Reduces interference from L1 language",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Translation-based */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 motion-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <Languages size={20} className="text-slate-500" />
                </div>
                <h3 className="text-slate-700 text-sm" style={{ fontWeight: 600 }}>
                  Translation-Based Learning
                </h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Word paired with L1 equivalent",
                  "Relies on rote memorisation",
                  "Single processing channel (verbal only)",
                  "Risk of L1 interference and shallow learning",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-500">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="motion-reveal-fast" style={{ animationDelay: "340ms" }}>
          <div
            className="rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 motion-card"
            style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81)" }}
          >
            <div>
              <h2 className="text-white mb-2" style={{ fontWeight: 700 }}>
                Try the Prototype
              </h2>
              <p className="text-indigo-200 text-sm max-w-md" style={{ lineHeight: 1.6 }}>
                Experience image-based vocabulary learning firsthand. Study 10 Spanish words using
                visual cues, then test your recall in quiz mode.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => navigate("/study")}
                className="motion-button inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                <BookOpen size={16} />
                Study Cards
              </button>
              <button
                onClick={() => navigate("/quiz")}
                className="motion-button inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                <Brain size={16} />
                Take Quiz
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
