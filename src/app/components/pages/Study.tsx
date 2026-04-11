import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Brain,
  Trophy,
  RefreshCw,
  Languages,
  Image as ImageIcon,
  FlaskConical,
} from "lucide-react";
import { vocab } from "../../data/vocab";
import {
  getSessionById,
  markLearningCompleted,
  markLearningStarted,
  recordReview,
  recordStudyAttempt,
} from "../../data/experimentStore";

type Status = "unanswered" | "known" | "unknown";
type StudyMode = "image" | "word";

export default function Study() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const modeParam = params.get("mode");
  const sessionId = params.get("session");
  const session = sessionId ? getSessionById(sessionId) : null;
  const mode: StudyMode =
    session?.learningMode ?? (modeParam === "word" ? "word" : "image");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>(vocab.map(() => "unanswered"));
  const [isComplete, setIsComplete] = useState(false);
  const [recallStartTime, setRecallStartTime] = useState<number | null>(null);

  const current = vocab[currentIndex];
  const known = statuses.filter((s) => s === "known").length;
  const unknown = statuses.filter((s) => s === "unknown").length;
  const progress = ((known + unknown) / vocab.length) * 100;
  const modeLabel = mode === "word" ? "Word to Word" : "Image to Word";

  useEffect(() => {
    if (sessionId) {
      markLearningStarted(sessionId);
    }
  }, [sessionId]);

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => {
      const next = !f;
      if (next) {
        setRecallStartTime(Date.now());
        if (sessionId) {
          recordReview(sessionId, current.id);
        }
      } else {
        setRecallStartTime(null);
      }
      return next;
    });
  }, [sessionId, current.id]);

  const handleModeChange = (nextMode: StudyMode) => {
    if (session && nextMode !== session.learningMode) return;
    if (nextMode === mode) return;
    setIsFlipped(false);
    if (sessionId) {
      navigate(`/study?mode=${nextMode}&session=${sessionId}`);
      return;
    }
    navigate(`/study?mode=${nextMode}`);
  };

  const handleMark = (status: "known" | "unknown") => {
    const updated = [...statuses];
    updated[currentIndex] = status;
    setStatuses(updated);

    if (sessionId) {
      const responseTimeMs = recallStartTime ? Date.now() - recallStartTime : 0;
      recordStudyAttempt(sessionId, {
        wordId: current.id,
        known: status === "known",
        responseTimeMs,
        reviewedAt: new Date().toISOString(),
      });
    }

    setRecallStartTime(null);
    setTimeout(() => {
      if (currentIndex < vocab.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsFlipped(false);
      } else {
        if (sessionId) {
          markLearningCompleted(sessionId);
        }
        setIsComplete(true);
      }
    }, 300);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setIsFlipped(false);
      setRecallStartTime(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocab.length - 1) {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
      setRecallStartTime(null);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStatuses(vocab.map(() => "unanswered"));
    setRecallStartTime(null);
    setIsComplete(false);
    if (sessionId) {
      navigate(`/study?mode=${mode}&session=${sessionId}`);
      return;
    }
    navigate(`/study?mode=${mode}`);
  };

  if (isComplete) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-8 py-16 bg-slate-50">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center border border-slate-100 shadow-xl motion-reveal">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            <Trophy size={36} color="white" />
          </div>
          <h2 className="text-slate-800 mb-2" style={{ fontWeight: 700, fontSize: 24 }}>
            Session Complete
          </h2>
          <div className="text-xs font-medium text-indigo-600 mb-2">{modeLabel} Mode</div>
          <p className="text-slate-500 text-sm mb-8">
            You have reviewed all {vocab.length} vocabulary cards.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-2xl p-4 text-center" style={{ background: "#f0fdf4" }}>
              <div className="text-3xl font-bold text-green-600 mb-1">{known}</div>
              <div className="text-xs text-green-700">Remembered</div>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: "#fef2f2" }}>
              <div className="text-3xl font-bold text-red-500 mb-1">{unknown}</div>
              <div className="text-xs text-red-600">Need Review</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() =>
                navigate(
                  sessionId
                    ? `/quiz?mode=${mode}&session=${sessionId}&phase=immediate`
                    : `/quiz?mode=${mode}`,
                )
              }
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 motion-button"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <Brain size={16} />
              Immediate Recall Test
            </button>
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 font-medium transition-all motion-button"
            >
              <RefreshCw size={16} />
              Study Again
            </button>
            {sessionId && (
              <button
                onClick={() => navigate("/evaluation")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 font-medium transition-all motion-button"
              >
                <FlaskConical size={16} />
                Back to Evaluation
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-8 py-4 motion-reveal-fast">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
            <div>
              <h1 className="text-slate-800 text-base" style={{ fontWeight: 700 }}>
                Study Cards
              </h1>
              <p className="text-slate-400 text-xs">
                {modeLabel} - Card {currentIndex + 1} of {vocab.length} - Click card to reveal
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleModeChange("image")}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all inline-flex items-center gap-1"
                  style={{
                    borderColor: mode === "image" ? "#6366f1" : "#cbd5e1",
                    background: mode === "image" ? "#eef2ff" : "white",
                    color: mode === "image" ? "#4338ca" : "#64748b",
                    opacity: session && session.learningMode !== "image" ? 0.45 : 1,
                  }}
                >
                  <ImageIcon size={12} />
                  Image to Word
                </button>
                <button
                  onClick={() => handleModeChange("word")}
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all inline-flex items-center gap-1"
                  style={{
                    borderColor: mode === "word" ? "#6366f1" : "#cbd5e1",
                    background: mode === "word" ? "#eef2ff" : "white",
                    color: mode === "word" ? "#4338ca" : "#64748b",
                    opacity: session && session.learningMode !== "word" ? 0.45 : 1,
                  }}
                >
                  <Languages size={12} />
                  Word to Word
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-slate-600">{known} Known</span>
              </div>
              <div className="flex items-center gap-1.5">
                <XCircle size={14} className="text-red-400" />
                <span className="text-slate-600">{unknown} Review</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {vocab.map((_, i) => {
              const s = statuses[i];
              return (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsFlipped(false);
                    setRecallStartTime(null);
                  }}
                  className="cursor-pointer rounded-full transition-all"
                  style={{
                    width: 8,
                    height: 8,
                    background:
                      i === currentIndex
                        ? "#6366f1"
                        : s === "known"
                          ? "#10b981"
                          : s === "unknown"
                            ? "#ef4444"
                            : "#e2e8f0",
                    transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <div className="max-w-md w-full motion-reveal-fast" style={{ animationDelay: "120ms" }}>
          <div className="flex justify-center mb-4">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: "#e0e7ff", color: "#4338ca" }}
            >
              {current.category}
            </span>
          </div>

          <div
            className="cursor-pointer"
            style={{ perspective: "1000px", height: 380 }}
            onClick={handleFlip}
          >
            <div
              className="relative w-full h-full transition-transform"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                transition: "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl motion-card"
                style={{ backfaceVisibility: "hidden" }}
              >
                {mode === "image" ? (
                  <>
                    <div
                      className="w-full h-full p-8 flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle at 30% 20%, #eef2ff 0%, #ffffff 65%)",
                      }}
                    >
                      <img
                        src={current.image}
                        alt={current.word}
                        className="w-full h-full object-contain object-center"
                      />
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/60 text-xs mb-1 uppercase tracking-wider">
                            What is the Spanish word?
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/70 text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                          <Eye size={12} />
                          Tap to reveal
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full h-full p-8 flex flex-col items-center justify-center"
                    style={{
                      background: "radial-gradient(circle at 30% 20%, #eef2ff 0%, #ffffff 65%)",
                    }}
                  >
                    <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">English</div>
                    <div
                      className="text-slate-800 text-center mb-4"
                      style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}
                    >
                      {current.word}
                    </div>
                    <div className="text-slate-500 text-sm">What is the Spanish translation?</div>
                    <div className="mt-6 flex items-center gap-1.5 text-indigo-500 text-xs bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                      <Eye size={12} />
                      Tap to reveal
                    </div>
                  </div>
                )}
              </div>

              <div
                className="absolute inset-0 rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center p-8 motion-card"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  border: "2px solid #e0e7ff",
                }}
              >
                {mode === "image" && (
                  <img
                    src={current.image}
                    alt={current.word}
                    className="w-20 h-20 rounded-2xl object-contain object-center mb-6 shadow-lg bg-slate-50 p-1.5"
                  />
                )}
                <div className="text-center">
                  <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">Spanish</div>
                  <div
                    className="text-slate-800 mb-2"
                    style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1 }}
                  >
                    {current.translation}
                  </div>
                  <div className="text-slate-400 text-sm">{current.word} in English</div>
                </div>
                <div className="mt-8 flex items-center gap-1 text-indigo-400 text-xs bg-indigo-50 px-3 py-1.5 rounded-full">
                  <EyeOff size={11} />
                  Tap to flip back
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {isFlipped && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button
                  onClick={() => handleMark("unknown")}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-200 text-red-500 bg-red-50 font-medium text-sm hover:bg-red-100 hover:border-red-300 transition-all"
                >
                  <XCircle size={16} />
                  Still Learning
                </button>
                <button
                  onClick={() => handleMark("known")}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-green-200 text-green-600 bg-green-50 font-medium text-sm hover:bg-green-100 hover:border-green-300 transition-all"
                >
                  <CheckCircle size={16} />
                  Got It
                </button>
              </div>
            )}

            {!isFlipped && (
              <button
                onClick={handleFlip}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold transition-all hover:opacity-90 motion-button"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                <RotateCcw size={16} />
                Reveal Translation
              </button>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors py-2 px-3 rounded-xl hover:bg-white"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="text-xs text-slate-400">
                {currentIndex + 1} / {vocab.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentIndex === vocab.length - 1}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors py-2 px-3 rounded-xl hover:bg-white"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-white border-t border-slate-100 px-8 py-4 motion-reveal-fast"
        style={{ animationDelay: "200ms" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-xs text-slate-400 mb-2">All Cards</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {vocab.map((word, i) => {
              const s = statuses[i];
              return (
                <button
                  key={word.id}
                  onClick={() => {
                    setCurrentIndex(i);
                    setIsFlipped(false);
                    setRecallStartTime(null);
                  }}
                  className="shrink-0 relative rounded-xl overflow-hidden border-2 transition-all"
                  style={{
                    width: 56,
                    height: 40,
                    borderColor:
                      i === currentIndex
                        ? "#6366f1"
                        : s === "known"
                          ? "#10b981"
                          : s === "unknown"
                            ? "#ef4444"
                            : "#e2e8f0",
                    background: mode === "word" ? "#f8fafc" : undefined,
                  }}
                >
                  {mode === "image" ? (
                    <img
                      src={word.image}
                      alt={word.word}
                      className="w-full h-full object-contain object-center bg-slate-50"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center px-1 text-[10px] font-semibold text-slate-700 text-center leading-tight">
                      {word.word}
                    </div>
                  )}
                  {s === "known" && (
                    <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
                      <CheckCircle size={12} color="white" />
                    </div>
                  )}
                  {s === "unknown" && (
                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                      <XCircle size={12} color="white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
