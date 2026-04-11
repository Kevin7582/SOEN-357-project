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
  payload: Partial<ParticipantSession> | null;
};

type SupabaseTestResultRow = {
  session_id: string;
  phase: TestPhase;
  completed_at: string;
  correct_count: number;
  total_count: number;
  accuracy: number;
  average_response_time_ms: number;
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

function normalizeSessionRow(
  row: SupabaseSessionRow,
  testResultsBySession: Map<string, Record<TestPhase, TestResult>>,
): ParticipantSession {
  const payload = row.payload ?? {};
  const sessionTests = testResultsBySession.get(row.id);
  const immediateTest = payload.immediateTest ?? sessionTests?.immediate ?? null;
  const delayedTest = payload.delayedTest ?? sessionTests?.delayed ?? null;
  const completedAt = payload.completedAt ?? row.completed_at ?? null;
  const evaluationStatus =
    payload.evaluationStatus ??
    row.evaluation_status ??
    (delayedTest || completedAt ? "completed" : "in_progress");
  return {
    id: payload.id ?? row.id,
    participantId: payload.participantId ?? row.participant_id,
    group: payload.group ?? row.group_label,
    learningMode: payload.learningMode ?? row.learning_mode,
    createdAt: payload.createdAt ?? row.created_at,
    learningStartedAt: payload.learningStartedAt ?? null,
    learningCompletedAt: payload.learningCompletedAt ?? null,
    studyAttempts: payload.studyAttempts ?? [],
    reviewFrequencyByWord: payload.reviewFrequencyByWord ?? {},
    immediateTest,
    delayedTest,
    evaluationStatus,
    completedAt,
  };
}

export async function hydrateCompletedSessionsFromSupabase() {
  const { supabase } = await import("../../utils/supabase");
  if (!supabase) return;
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select(
        "id, participant_id, group_label, learning_mode, created_at, updated_at, evaluation_status, completed_at, payload",
      )
      .eq("evaluation_status", "completed");
    if (error || !data) return;
    const sessionIds = (data as SupabaseSessionRow[]).map((row) => row.id);
    const testResultsBySession = new Map<string, Record<TestPhase, TestResult>>();
    if (sessionIds.length > 0) {
      const { data: testRows, error: testError } = await supabase
        .from("test_results")
        .select(
          "session_id, phase, completed_at, correct_count, total_count, accuracy, average_response_time_ms",
        )
        .in("session_id", sessionIds);
      if (!testError && testRows) {
        for (const row of testRows as SupabaseTestResultRow[]) {
          const existing = testResultsBySession.get(row.session_id) ?? ({} as Record<TestPhase, TestResult>);
          existing[row.phase] = {
            completedAt: row.completed_at,
            correctCount: row.correct_count,
            totalCount: row.total_count,
            accuracy: row.accuracy,
            averageResponseTimeMs: row.average_response_time_ms,
            responses: [],
          };
          testResultsBySession.set(row.session_id, existing);
        }
      }
    }
    const merged = new Map<string, ParticipantSession>();
    for (const session of loadSessions()) {
      merged.set(session.id, session);
    }
    for (const row of data as SupabaseSessionRow[]) {
      const normalized = normalizeSessionRow(row, testResultsBySession);
      merged.set(normalized.id, normalized);
    }
    saveSessions([...merged.values()]);
  } catch {
    // Ignore hydration errors; local operation remains available.
  }
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
