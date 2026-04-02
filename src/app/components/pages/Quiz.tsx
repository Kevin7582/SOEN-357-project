import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Timer,
  CheckCircle2,
  XCircle,
  Trophy,
  RefreshCw,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { vocab, VocabWord } from "../../data/vocab";

interface Question {
  word: VocabWord;
  options: string[];
  correctIndex: number;
}

type QuizMode = "image" | "word";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(): Question[] {
  return shuffle(vocab).map((word) => {
    const distractors = shuffle(vocab.filter((w) => w.id !== word.id))
      .slice(0, 3)
      .map((w) => w.translation);
    const allOptions = shuffle([word.translation, ...distractors]);
    return {
      word,
      options: allOptions,
      correctIndex: allOptions.indexOf(word.translation),
    };
  });
}

const TIMER_PER_QUESTION = 10;

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const modeParam = new URLSearchParams(location.search).get("mode");
  const mode: QuizMode = modeParam === "word" ? "word" : "image";
  const [questions] = useState<Question[]>(() => generateQuestions());
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_PER_QUESTION);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(vocab.map(() => null));

  const current = questions[currentIndex];
  const modeLabel = mode === "word" ? "Word to Word" : "Word to Image";

  const handleTimeUp = useCallback(() => {
    if (selected !== null) return;
    const elapsed = (Date.now() - questionStartTime) / 1000;
    setResponseTimes((prev) => [...prev, elapsed]);
    const updated = [...answers];
    updated[currentIndex] = -1;
    setAnswers(updated);
    setSelected(-1);
  }, [selected, questionStartTime, answers, currentIndex]);

  useEffect(() => {
    if (!hasStarted || selected !== null || isComplete) return;
    setTimeLeft(TIMER_PER_QUESTION);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, hasStarted, selected, isComplete, handleTimeUp]);

  const handleStartQuiz = () => {
    setHasStarted(true);
    setQuestionStartTime(Date.now());
    setTimeLeft(TIMER_PER_QUESTION);
  };

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    const elapsed = (Date.now() - questionStartTime) / 1000;
    setResponseTimes((prev) => [...prev, Math.min(elapsed, TIMER_PER_QUESTION)]);
    setSelected(idx);
    const updated = [...answers];
    updated[currentIndex] = idx;
    setAnswers(updated);
    if (idx === current.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setQuestionStartTime(Date.now());
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const percentage = Math.round((score / vocab.length) * 100);
  const avgTime =
    responseTimes.length > 0
      ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1)
      : "—";

  if (isComplete) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-8 py-16 bg-slate-50">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-slate-100 shadow-xl motion-reveal">
          <div className="text-center mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background:
                  percentage >= 70
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            >
              <Trophy size={40} color="white" />
            </div>
            <h2 className="text-slate-800 mb-1" style={{ fontWeight: 700, fontSize: 26 }}>
              Quiz Complete!
            </h2>
            <div className="text-xs font-medium text-indigo-600 mb-1">{modeLabel} Mode</div>
            <p className="text-slate-400 text-sm">
              {percentage >= 80
                ? mode === "word"
                  ? "Excellent work! Your translation recall is strong."
                  : "Excellent work! Your visual memory is strong."
                : percentage >= 60
                ? "Good progress! Keep practicing."
                : "Keep studying — you'll improve!"}
            </p>
          </div>

          {/* Score ring */}
          <div className="flex justify-center mb-8">
            <div className="relative" style={{ width: 120, height: 120 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={percentage >= 70 ? "#10b981" : "#f59e0b"}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(percentage / 100) * 314} 314`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
                <span className="text-xs text-slate-400">accuracy</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="text-center p-3 rounded-xl bg-slate-50">
              <div className="text-xl font-bold text-slate-800">{score}/{vocab.length}</div>
              <div className="text-xs text-slate-500">Correct</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-50">
              <div className="text-xl font-bold text-slate-800">{avgTime}s</div>
              <div className="text-xs text-slate-500">Avg Time</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-slate-50">
              <div className="text-xl font-bold text-slate-800">{vocab.length - score}</div>
              <div className="text-xs text-slate-500">Missed</div>
            </div>
          </div>

          {/* Per-question review */}
          <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
            {questions.map((q, i) => {
              const ans = answers[i];
              const correct = ans === q.correctIndex;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl border"
                  style={{
                    borderColor: correct ? "#bbf7d0" : "#fecaca",
                    background: correct ? "#f0fdf4" : "#fef2f2",
                  }}
                >
                  {mode === "image" ? (
                    <img
                      src={q.word.image}
                      alt={q.word.word}
                      className="w-8 h-8 rounded-lg object-contain object-center bg-slate-50 p-0.5"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-semibold flex items-center justify-center">
                      W
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-700 font-medium">{q.word.word}</div>
                    <div className="text-xs text-slate-400">→ {q.word.translation}</div>
                  </div>
                  {correct ? (
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-red-400 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 motion-button"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            <button
              onClick={() => navigate("/study")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 font-medium transition-all motion-button"
            >
              <BookOpen size={16} />
              Back to Study Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  const timerPct = (timeLeft / TIMER_PER_QUESTION) * 100;
  const timerColor = timeLeft > 6 ? "#10b981" : timeLeft > 3 ? "#f59e0b" : "#ef4444";

  if (!hasStarted) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-8 py-16 bg-slate-50">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full border border-slate-100 shadow-xl motion-reveal">
          <h1 className="text-slate-800 text-2xl mb-2" style={{ fontWeight: 700 }}>
            Quiz Mode
          </h1>
          <div className="text-xs font-medium text-indigo-600 mb-2">{modeLabel} Mode</div>
          <p className="text-slate-500 text-sm mb-8" style={{ lineHeight: 1.6 }}>
            You will answer {questions.length} questions with {TIMER_PER_QUESTION} seconds per
            question. Start when you are ready.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleStartQuiz}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 motion-button"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              Start Quiz
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate("/study")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 font-medium transition-all motion-button"
            >
              <BookOpen size={16} />
              Back to Study Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-4 motion-reveal-fast">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-slate-800 text-base" style={{ fontWeight: 700 }}>
              Quiz Mode
            </h1>
            <p className="text-slate-400 text-xs">
              {modeLabel} - Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <Timer size={14} style={{ color: timerColor }} />
            <div className="relative w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${timerPct}%`, background: timerColor }}
              />
            </div>
            <span className="text-sm font-semibold w-6 text-right" style={{ color: timerColor }}>
              {timeLeft}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-500" />
            <span className="text-sm text-slate-600 font-medium">
              {score}/{currentIndex + (selected !== null ? 1 : 0)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mt-3">
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full transition-all"
                style={{
                  background:
                    i < currentIndex
                      ? answers[i] === questions[i].correctIndex
                        ? "#10b981"
                        : "#ef4444"
                      : i === currentIndex
                      ? "#6366f1"
                      : "#e2e8f0",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <div className="max-w-lg w-full motion-reveal-fast" style={{ animationDelay: "120ms" }}>
          {/* Question */}
          <p className="text-center text-slate-500 text-sm mb-6">
            {mode === "image" ? (
              <>
                What is the <span className="text-indigo-600 font-semibold">Spanish</span> word for
                this image?
              </>
            ) : (
              <>
                What is the <span className="text-indigo-600 font-semibold">Spanish</span> word for{" "}
                <span className="font-semibold text-slate-700">{current.word.word}</span>?
              </>
            )}
          </p>

          {mode === "image" ? (
            <div
              className="rounded-3xl overflow-hidden shadow-2xl mb-8 mx-auto motion-card p-6 flex items-center justify-center"
              style={{ height: 260, maxWidth: 380 }}
            >
              <div
                className="w-full h-full flex items-center justify-center rounded-2xl"
                style={{
                  background: "radial-gradient(circle at 30% 20%, #eef2ff 0%, #ffffff 65%)",
                }}
              >
                <img
                  src={current.word.image}
                  alt="vocabulary"
                  className="w-full h-full object-contain object-center"
                />
              </div>
            </div>
          ) : (
            <div
              className="rounded-3xl shadow-2xl mb-8 mx-auto motion-card p-8 flex items-center justify-center"
              style={{
                height: 220,
                maxWidth: 380,
                background: "radial-gradient(circle at 30% 20%, #eef2ff 0%, #ffffff 65%)",
              }}
            >
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">English</div>
                <div className="text-4xl font-extrabold text-slate-800">{current.word.word}</div>
              </div>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {current.options.map((option, idx) => {
              const isCorrect = idx === current.correctIndex;
              const isSelected = selected === idx;
              const showResult = selected !== null;

              let borderColor = "#e2e8f0";
              let bgColor = "white";
              let textColor = "#334155";

              if (showResult) {
                if (isCorrect) {
                  borderColor = "#10b981";
                  bgColor = "#f0fdf4";
                  textColor = "#15803d";
                } else if (isSelected && !isCorrect) {
                  borderColor = "#ef4444";
                  bgColor = "#fef2f2";
                  textColor = "#dc2626";
                }
              } else if (isSelected) {
                borderColor = "#6366f1";
                bgColor = "#eef2ff";
                textColor = "#4338ca";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className="motion-card-soft relative flex items-center justify-between gap-2 p-4 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:cursor-default disabled:hover:scale-100"
                  style={{
                    borderColor,
                    background: bgColor,
                    color: textColor,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: showResult && isCorrect
                          ? "#10b981"
                          : showResult && isSelected && !isCorrect
                          ? "#ef4444"
                          : "#f1f5f9",
                        color:
                          showResult && (isCorrect || (isSelected && !isCorrect))
                            ? "white"
                            : "#64748b",
                      }}
                    >
                      {["A", "B", "C", "D"][idx]}
                    </div>
                    <span>{option}</span>
                  </div>
                  {showResult && isCorrect && (
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle size={16} className="text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback + Next */}
          {selected !== null && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div
                className="flex items-center justify-between p-4 rounded-2xl mb-4"
                style={{
                  background:
                    selected === current.correctIndex ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${
                    selected === current.correctIndex ? "#bbf7d0" : "#fecaca"
                  }`,
                }}
              >
                <div className="flex items-center gap-3">
                  {selected === current.correctIndex ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : (
                    <XCircle size={20} className="text-red-400" />
                  )}
                  <div>
                    <div
                      className="text-sm font-semibold"
                      style={{
                        color:
                          selected === current.correctIndex ? "#15803d" : "#dc2626",
                      }}
                    >
                      {selected === current.correctIndex ? "Correct!" : selected === -1 ? "Time's up!" : "Incorrect"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {current.word.word} → {current.word.translation}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-semibold transition-all hover:opacity-90 motion-button"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    See Results
                    <Trophy size={16} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

