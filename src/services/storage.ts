import { DigitalTwinState, StudentRecord, MultiStudentState } from '../types';
import { INITIAL_STATE } from '../data/initialData';

const SINGLE_STORAGE_KEY = 'student_digital_twin_data_v1';
const MULTI_STORAGE_KEY = 'student_digital_twin_multi_v1';

export const DEFAULT_SRICHARAN_RECORD: StudentRecord = {
  id: 'student-sricharan',
  ...INITIAL_STATE,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

export function loadMultiStudentState(): MultiStudentState {
  try {
    const rawMulti = localStorage.getItem(MULTI_STORAGE_KEY);
    if (rawMulti) {
      const parsed = JSON.parse(rawMulti) as MultiStudentState;
      if (Array.isArray(parsed.students) && parsed.students.length > 0) {
        const activeId = parsed.students.some((s) => s.id === parsed.activeStudentId)
          ? parsed.activeStudentId
          : parsed.students[0].id;
        return {
          students: parsed.students,
          activeStudentId: activeId,
        };
      }
    }

    // Fallback migration from single student key
    const rawSingle = localStorage.getItem(SINGLE_STORAGE_KEY);
    let migratedRecord: StudentRecord = { ...DEFAULT_SRICHARAN_RECORD };

    if (rawSingle) {
      try {
        const parsedSingle = JSON.parse(rawSingle) as DigitalTwinState;
        migratedRecord = {
          id: 'student-sricharan',
          profile: { ...INITIAL_STATE.profile, ...(parsedSingle.profile || {}) },
          skills: Array.isArray(parsedSingle.skills) ? parsedSingle.skills : INITIAL_STATE.skills,
          projects: Array.isArray(parsedSingle.projects) ? parsedSingle.projects : INITIAL_STATE.projects,
          achievements: Array.isArray(parsedSingle.achievements) ? parsedSingle.achievements : INITIAL_STATE.achievements,
          activeCareerGoalId: parsedSingle.activeCareerGoalId || INITIAL_STATE.activeCareerGoalId,
          careerGoals: Array.isArray(parsedSingle.careerGoals) ? parsedSingle.careerGoals : INITIAL_STATE.careerGoals,
          progressHistory: Array.isArray(parsedSingle.progressHistory) ? parsedSingle.progressHistory : INITIAL_STATE.progressHistory,
          resumeChecklist: Array.isArray(parsedSingle.resumeChecklist) ? parsedSingle.resumeChecklist : INITIAL_STATE.resumeChecklist,
          customRecommendations: Array.isArray(parsedSingle.customRecommendations) ? parsedSingle.customRecommendations : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } catch (e) {
        console.error('Error migrating single student state:', e);
      }
    }

    const initialMulti: MultiStudentState = {
      students: [migratedRecord],
      activeStudentId: migratedRecord.id,
    };

    saveMultiStudentState(initialMulti);
    return initialMulti;
  } catch (error) {
    console.error('Failed to load multi-student state from localStorage:', error);
    return {
      students: [DEFAULT_SRICHARAN_RECORD],
      activeStudentId: DEFAULT_SRICHARAN_RECORD.id,
    };
  }
}

export function saveMultiStudentState(state: MultiStudentState): void {
  try {
    localStorage.setItem(MULTI_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save multi-student state:', error);
  }
}

export function resetToDemoData(): MultiStudentState {
  const resetState: MultiStudentState = {
    students: [DEFAULT_SRICHARAN_RECORD],
    activeStudentId: DEFAULT_SRICHARAN_RECORD.id,
  };
  try {
    localStorage.setItem(MULTI_STORAGE_KEY, JSON.stringify(resetState));
  } catch (error) {
    console.error('Failed to reset multi-student state:', error);
  }
  return resetState;
}

// Backward compatibility helper
export function loadState(): DigitalTwinState {
  const multi = loadMultiStudentState();
  const active = multi.students.find((s) => s.id === multi.activeStudentId) || multi.students[0];
  return active;
}

export function saveState(state: DigitalTwinState): void {
  const multi = loadMultiStudentState();
  const updatedStudents = multi.students.map((s) => (s.id === multi.activeStudentId ? { ...s, ...state } : s));
  saveMultiStudentState({ ...multi, students: updatedStudents });
}

export function clearAllData(): DigitalTwinState {
  return resetToDemoData().students[0];
}

