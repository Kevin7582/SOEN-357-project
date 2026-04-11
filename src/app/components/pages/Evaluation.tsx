import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BarChart3,
  Clock3,
  Eraser,
  FlaskConical,
  PlayCircle,
  TimerReset,
  UserPlus,
} from "lucide-react";
import {
  calculateGroupAverages,
  calculateStudyMetrics,
  clearAllSessions,
  createSession,
  getActiveSession,
  getAllSessions,
  setActiveSessionId,
  type ParticipantSession,
  type StudyGroup,
} from "../../data/experimentStore";

function formatPct(value: number) {
  return `${Math.round(value)}%`;
}

function formatMs(value: number) {
  if (!value) return "-";
  return `${(value / 1000).toFixed(2)}s`;
}

function dateLabel(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
}

export default function Evaluation() {
  const navigate = useNavigate();
  const [participantId, setParticipantId] = useState("");
  const [group, setGroup] = useState<StudyGroup>("A");
  const [refreshKey, setRefreshKey] = useState(0);

  const sessions = useMemo(() => getAllSessions(), [refreshKey]);
  const activeSession = useMemo(() => getActiveSession(), [refreshKey]);
  const groupStats = useMemo(() => calculateGroupAverages(sessions), [sessions]);

  const handleStartSession = () => {
    if (!participantId.trim()) return;
    const session = createSession(participantId, group);
    setRefreshKey((k) => k + 1);
    navigate(`/study?mode=${session.learningMode}&session=${session.id}`);
  };

  const handleResume = (session: ParticipantSession) => {
    setActiveSessionId(session.id);
    setRefreshKey((k) => k + 1);
  };

  const activeMetrics = activeSession ? calculateStudyMetrics(activeSession) : null;

  return (
    <div className="min-h-full bg-slate-50 px-8 py-8">
      <div className="max-w-6xl space-y-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical size={18} className="text-indigo-600" />
            <h1 className="text-slate-800 text-xl" style={{ fontWeight: 700 }}>
              Evaluation Dashboard
            </h1>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Run controlled A/B sessions and compare image-based learning against translation-based
            learning using immediate and delayed recall tests.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
              placeholder="Participant ID (example: P-014)"
            />
            <div className="flex rounded-xl overflow-hidden border border-slate-200">
              <button
                onClick={() => setGroup("A")}
                className="flex-1 py-2 text-sm font-semibold"
                style={{
                  background: group === "A" ? "#e0e7ff" : "white",
                  color: group === "A" ? "#4338ca" : "#64748b",
                }}
              >
                Group A (Image)
              </button>
              <button
                onClick={() => setGroup("B")}
                className="flex-1 py-2 text-sm font-semibold border-l border-slate-200"
                style={{
                  background: group === "B" ? "#e0e7ff" : "white",
                  color: group === "B" ? "#4338ca" : "#64748b",
                }}
              >
                Group B (Translation)
              </button>
            </div>
            <button
              onClick={handleStartSession}
              disabled={!participantId.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl text-white py-2.5 px-4 text-sm font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <UserPlus size={16} />
              Start Session
            </button>
          </div>
        </div>

        {activeSession && (
          <div className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-slate-800 text-base" style={{ fontWeight: 700 }}>
                  Active Session: {activeSession.participantId}
                </h2>
                <p className="text-xs text-slate-500">
                  Group {activeSession.group} | Mode {activeSession.learningMode} | Created{" "}
                  {dateLabel(activeSession.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    navigate(`/study?mode=${activeSession.learningMode}&session=${activeSession.id}`)
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <PlayCircle size={14} />
                  Learning Session
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/quiz?mode=${activeSession.learningMode}&session=${activeSession.id}&phase=immediate`,
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  disabled={!activeSession.learningCompletedAt}
                >
                  <TimerReset size={14} />
                  Immediate Test
                </button>
                <button
                  onClick={() =>
                    navigate(
                      `/quiz?mode=${activeSession.learningMode}&session=${activeSession.id}&phase=delayed`,
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  disabled={!activeSession.immediateTest}
                >
                  <Clock3 size={14} />
                  Delayed Test
                </button>
              </div>
            </div>

            {activeMetrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Correct Recalls</div>
                  <div className="text-xl font-bold text-slate-800">
                    {activeMetrics.correctRecalls}/{activeMetrics.totalRecalls}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Avg Response Time</div>
                  <div className="text-xl font-bold text-slate-800">
                    {formatMs(activeMetrics.averageResponseTimeMs)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Review Frequency</div>
                  <div className="text-xl font-bold text-slate-800">{activeMetrics.totalReviews}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Immediate / Delayed</div>
                  <div className="text-sm font-semibold text-slate-700">
                    {activeSession.immediateTest ? formatPct(activeSession.immediateTest.accuracy) : "-"} /{" "}
                    {activeSession.delayedTest ? formatPct(activeSession.delayedTest.accuracy) : "-"}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-600" />
              <h2 className="text-slate-800 text-base" style={{ fontWeight: 700 }}>
                Group Comparison
              </h2>
            </div>
            <button
              onClick={() => {
                clearAllSessions();
                setRefreshKey((k) => k + 1);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 border border-red-200 rounded-md px-2.5 py-1.5"
            >
              <Eraser size={12} />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-indigo-100 p-4 bg-indigo-50/40">
              <div className="text-sm font-semibold text-indigo-700 mb-2">Group A: Image-Based</div>
              <div className="text-xs text-slate-600">
                Participants: {groupStats.A.participants}
                <br />
                Immediate Accuracy: {formatPct(groupStats.A.immediateAccuracy)}
                <br />
                Delayed Accuracy: {formatPct(groupStats.A.delayedAccuracy)}
                <br />
                Immediate Response Time: {formatMs(groupStats.A.immediateResponseTimeMs)}
                <br />
                Delayed Response Time: {formatMs(groupStats.A.delayedResponseTimeMs)}
              </div>
            </div>
            <div className="rounded-xl border border-amber-100 p-4 bg-amber-50/40">
              <div className="text-sm font-semibold text-amber-700 mb-2">Group B: Translation-Based</div>
              <div className="text-xs text-slate-600">
                Participants: {groupStats.B.participants}
                <br />
                Immediate Accuracy: {formatPct(groupStats.B.immediateAccuracy)}
                <br />
                Delayed Accuracy: {formatPct(groupStats.B.delayedAccuracy)}
                <br />
                Immediate Response Time: {formatMs(groupStats.B.immediateResponseTimeMs)}
                <br />
                Delayed Response Time: {formatMs(groupStats.B.delayedResponseTimeMs)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6">
          <h2 className="text-slate-800 text-base mb-3" style={{ fontWeight: 700 }}>
            Recorded Sessions
          </h2>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {sessions.length === 0 && <p className="text-sm text-slate-500">No sessions recorded yet.</p>}
            {sessions.map((session) => (
              <div
                key={session.id}
                className="border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="text-xs text-slate-600">
                  <div className="text-sm font-semibold text-slate-800">
                    {session.participantId} | Group {session.group}
                  </div>
                  Learning done: {dateLabel(session.learningCompletedAt)}
                  <br />
                  Immediate: {session.immediateTest ? formatPct(session.immediateTest.accuracy) : "-"} | Delayed:{" "}
                  {session.delayedTest ? formatPct(session.delayedTest.accuracy) : "-"}
                </div>
                <button
                  onClick={() => handleResume(session)}
                  className="text-xs border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700"
                >
                  Set Active
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
