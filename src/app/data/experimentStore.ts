export type StudyGroup = "A" | "B";
export type LearningMode = "image" | "word";
export type TestPhase = "immediate" | "delayed";
export type EvaluationStatus = "in_progress" | "completed";

export interface StudyAttempt {
  wordId: number;
  known: boolean;
  responseTimeMs: number;
  reviewedAt: string;
}

export interface QuizResponse {
  wordId: number;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface TestResult {
  completedAt: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
  averageResponseTimeMs: number;
  responses: QuizResponse[];
}

export interface ParticipantSession {
  id: string;
  participantId: string;
  group: StudyGroup;
  learningMode: LearningMode;
  createdAt: string;
  learningStartedAt: string | null;
  learningCompletedAt: string | null;
  studyAttempts: StudyAttempt[];
  reviewFrequencyByWord: Record<number, number>;
  immediateTest: TestResult | null;
  delayedTest: TestResult | null;
  evaluationStatus: EvaluationStatus;
  completedAt: string | null;
}

interface StudyMetrics {
  totalRecalls: number;
  correctRecalls: number;
  averageResponseTimeMs: number;
  totalReviews: number;
}

const SUPABASE_TABLE = "study_sessions";
let sessionsCache: ParticipantSession[] = [];
let activeSessionId: string | null = null;

type SupabaseSessionRow = {
  id: string;
  participant_id: string;
  group_label: StudyGroup;
  learning_mode: LearningMode;
  created_at: string;
  updated_at: string;
  evaluation_status: EvaluationStatus;
  completed_at: string | null;
  payload: ParticipantSession;
};

async function syncSessionToSupabase(session: ParticipantSession) {
  const { supabase } = await import("../../utils/supabase");
  if (!supabase) return;
  const row: SupabaseSessionRow = {
    id: session.id,
    participant_id: session.participantId,
    group_label: session.group,
    learning_mode: session.learningMode,
    created_at: session.createdAt,
    updated_at: new Date().toISOString(),
    evaluation_status: session.evaluationStatus,
    completed_at: session.completedAt,
    payload: session,
  };
  try {
    await supabase.from(SUPABASE_TABLE).upsert(row, { onConflict: "id" });
  } catch {
    // Keep in-memory capture even if remote sync fails.
  }
}

function loadSessions(): ParticipantSession[] {
  return sessionsCache;
}

function saveSessions(sessions: ParticipantSession[]) {
  sessionsCache = sessions;
}

function buildSessionId() {
  return `session-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function getAllSessions(): ParticipantSession[] {
  return loadSessions().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getActiveSessionId(): string | null {
  return activeSessionId;
}

export function setActiveSessionId(sessionId: string | null) {
  activeSessionId = sessionId;
}

export function getSessionById(sessionId: string): ParticipantSession | null {
  const sessions = loadSessions();
  return sessions.find((s) => s.id === sessionId) ?? null;
}

export function getActiveSession(): ParticipantSession | null {
  const sessionId = getActiveSessionId();
  if (!sessionId) return null;
  return getSessionById(sessionId);
}

export function createSession(participantId: string, group: StudyGroup): ParticipantSession {
  const learningMode: LearningMode = group === "A" ? "image" : "word";
  const now = new Date().toISOString();
  const session: ParticipantSession = {
    id: buildSessionId(),
    participantId: participantId.trim(),
    group,
    learningMode,
    createdAt: now,
    learningStartedAt: null,
    learningCompletedAt: null,
    studyAttempts: [],
    reviewFrequencyByWord: {},
    immediateTest: null,
    delayedTest: null,
    evaluationStatus: "in_progress",
    completedAt: null,
  };

  const sessions = loadSessions();
  sessions.push(session);
  saveSessions(sessions);
  setActiveSessionId(session.id);
  return session;
}

function updateSession(
  sessionId: string,
  updater: (session: ParticipantSession) => ParticipantSession,
  options?: { sync?: boolean },
) {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return;
  sessions[idx] = updater(sessions[idx]);
  saveSessions(sessions);
  if (options?.sync) {
    void syncSessionToSupabase(sessions[idx]);
  }
}

export function markLearningStarted(sessionId: string) {
  updateSession(sessionId, (session) => {
    if (session.learningStartedAt) return session;
    return { ...session, learningStartedAt: new Date().toISOString() };
  });
}

export function markLearningCompleted(sessionId: string) {
  updateSession(sessionId, (session) => ({
    ...session,
    learningCompletedAt: new Date().toISOString(),
  }));
}

export function recordReview(sessionId: string, wordId: number) {
  updateSession(sessionId, (session) => ({
    ...session,
    reviewFrequencyByWord: {
      ...session.reviewFrequencyByWord,
      [wordId]: (session.reviewFrequencyByWord[wordId] ?? 0) + 1,
    },
  }));
}

export function recordStudyAttempt(sessionId: string, attempt: StudyAttempt) {
  updateSession(sessionId, (session) => ({
    ...session,
    studyAttempts: [...session.studyAttempts, attempt],
  }));
}

export function saveTestResult(sessionId: string, phase: TestPhase, result: TestResult) {
  updateSession(
    sessionId,
    (session) => {
      const delayedTest = phase === "delayed" ? result : session.delayedTest;
      const isCompleted = delayedTest !== null;
      return {
        ...session,
        immediateTest: phase === "immediate" ? result : session.immediateTest,
        delayedTest,
        evaluationStatus: isCompleted ? "completed" : "in_progress",
        completedAt: isCompleted ? result.completedAt : null,
      };
    },
    { sync: phase === "delayed" },
  );
}

export function clearAllSessions() {
  sessionsCache = [];
  activeSessionId = null;
}

export function calculateStudyMetrics(session: ParticipantSession): StudyMetrics {
  const attempts = session.studyAttempts;
  const totalRecalls = attempts.length;
  const correctRecalls = attempts.filter((a) => a.known).length;
  const averageResponseTimeMs =
    totalRecalls === 0
      ? 0
      : attempts.reduce((sum, attempt) => sum + attempt.responseTimeMs, 0) / totalRecalls;
  const totalReviews = Object.values(session.reviewFrequencyByWord).reduce(
    (sum, count) => sum + count,
    0,
  );

  return {
    totalRecalls,
    correctRecalls,
    averageResponseTimeMs,
    totalReviews,
  };
}

export function calculateGroupAverages(sessions: ParticipantSession[]) {
  const byGroup: Record<StudyGroup, ParticipantSession[]> = {
    A: sessions.filter((s) => s.group === "A" && s.evaluationStatus === "completed"),
    B: sessions.filter((s) => s.group === "B" && s.evaluationStatus === "completed"),
  };

  const getAverage = (values: number[]) =>
    values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length;

  return {
    A: {
      participants: byGroup.A.length,
      immediateAccuracy: getAverage(
        byGroup.A
          .map((s) => s.immediateTest?.accuracy ?? null)
          .filter((v): v is number => v !== null),
      ),
      delayedAccuracy: getAverage(
        byGroup.A
          .map((s) => s.delayedTest?.accuracy ?? null)
          .filter((v): v is number => v !== null),
      ),
      immediateResponseTimeMs: getAverage(
        byGroup.A
          .map((s) => s.immediateTest?.averageResponseTimeMs ?? null)
          .filter((v): v is number => v !== null),
      ),
      delayedResponseTimeMs: getAverage(
        byGroup.A
          .map((s) => s.delayedTest?.averageResponseTimeMs ?? null)
          .filter((v): v is number => v !== null),
      ),
    },
    B: {
      participants: byGroup.B.length,
      immediateAccuracy: getAverage(
        byGroup.B
          .map((s) => s.immediateTest?.accuracy ?? null)
          .filter((v): v is number => v !== null),
      ),
      delayedAccuracy: getAverage(
        byGroup.B
          .map((s) => s.delayedTest?.accuracy ?? null)
          .filter((v): v is number => v !== null),
      ),
      immediateResponseTimeMs: getAverage(
        byGroup.B
          .map((s) => s.immediateTest?.averageResponseTimeMs ?? null)
          .filter((v): v is number => v !== null),
      ),
      delayedResponseTimeMs: getAverage(
        byGroup.B
          .map((s) => s.delayedTest?.averageResponseTimeMs ?? null)
          .filter((v): v is number => v !== null),
      ),
    },
  };
}
