import { DigitalTwinState, StudentRecord, MultiStudentState } from '../types';
import { INITIAL_STATE } from '../data/initialData';

export const DEFAULT_SRICHARAN_RECORD: StudentRecord = {
  id: 'student-sricharan',
  ...INITIAL_STATE,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: new Date().toISOString(),
};

export function getStorageKey(userId?: string): string {
  if (userId && userId.trim() !== '') {
    return `student_digital_twin_user_${userId}`;
  }
  return 'student_digital_twin_guest';
}

export function loadMultiStudentState(userId?: string): MultiStudentState {
  try {
    const key = getStorageKey(userId);
    const rawMulti = localStorage.getItem(key);
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

    const defaultRecord: StudentRecord = userId
      ? {
          id: `usr-${userId}`,
          profile: {
            name: 'Student User',
            degree: 'B.Tech',
            branch: 'Computer Science',
            university: '',
            year: '1st Year',
            semester: '1st Semester',
            cgpa: '',
            careerGoal: 'Software Engineer',
            bio: '',
            linkedIn: '',
            gitHub: '',
            portfolio: '',
            email: '',
            location: '',
            academicFocus: [],
          },
          skills: [],
          projects: [],
          achievements: [],
          activeCareerGoalId: 'cg-swe',
          careerGoals: [
            {
              id: 'cg-swe',
              title: 'Software Engineer',
              description: 'Build robust software applications.',
              targetSkills: { DataStructures: 70, Algorithms: 70 },
              recommendedCourses: ['Data Structures & Algorithms'],
            },
          ],
          progressHistory: [],
          resumeChecklist: [],
          customRecommendations: [],
          tasks: [],
        }
      : { ...DEFAULT_SRICHARAN_RECORD };

    const initialMulti: MultiStudentState = {
      students: [defaultRecord],
      activeStudentId: defaultRecord.id,
    };

    saveMultiStudentState(initialMulti, userId);
    return initialMulti;
  } catch (error) {
    console.error('Failed to load multi-student state from localStorage:', error);
    return {
      students: [DEFAULT_SRICHARAN_RECORD],
      activeStudentId: DEFAULT_SRICHARAN_RECORD.id,
    };
  }
}

export function saveMultiStudentState(state: MultiStudentState, userId?: string): void {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save multi-student state:', error);
  }
}

export function resetToDemoData(userId?: string): MultiStudentState {
  const resetState: MultiStudentState = {
    students: [DEFAULT_SRICHARAN_RECORD],
    activeStudentId: DEFAULT_SRICHARAN_RECORD.id,
  };
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(resetState));
  } catch (error) {
    console.error('Failed to reset multi-student state:', error);
  }
  return resetState;
}

export function clearUserStorage(userId?: string): void {
  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear user storage:', error);
  }
}

// Backward compatibility helper
export function loadState(userId?: string): DigitalTwinState {
  const multi = loadMultiStudentState(userId);
  const active = multi.students.find((s) => s.id === multi.activeStudentId) || multi.students[0];
  return active;
}

export function saveState(state: DigitalTwinState, userId?: string): void {
  const multi = loadMultiStudentState(userId);
  const updatedStudents = multi.students.map((s) => (s.id === multi.activeStudentId ? { ...s, ...state } : s));
  saveMultiStudentState({ ...multi, students: updatedStudents }, userId);
}

export function clearAllData(userId?: string): DigitalTwinState {
  return resetToDemoData(userId).students[0];
}


