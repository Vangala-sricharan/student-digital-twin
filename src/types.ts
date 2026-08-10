export type ProficiencyLevel = 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced';

export type SkillCategory = 
  | 'Programming'
  | 'AI/ML'
  | 'Web Development'
  | 'Databases'
  | 'Data Structures'
  | 'Tools'
  | 'Soft Skills'
  | 'Other';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  numericScore: number; // 0 - 100
  notes?: string;
}

export type ProjectStatus = 'Planned' | 'In Progress' | 'Completed';
export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  skills: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
  difficulty: ProjectDifficulty;
  completionDate?: string;
}

export type AchievementType = 
  | 'Certificate'
  | 'Hackathon'
  | 'Workshop'
  | 'Internship'
  | 'Competition'
  | 'Event'
  | 'Award'
  | 'Other';

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  type: AchievementType;
  description: string;
  credentialUrl?: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetSkills: Record<string, number>; // skillName -> required 0-100 score
  recommendedCourses?: string[];
}

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface Recommendation {
  id: string;
  title: string;
  priority: PriorityLevel;
  category: string;
  reason: string;
  action: string;
  completed?: boolean;
}

export interface SkillGap {
  skillName: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  status: 'High Gap' | 'Medium Gap' | 'Low Gap' | 'On Track';
}

export interface CategoryScore {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number; // percentage, e.g. 15
  status: 'Strong' | 'On Track' | 'Needs Attention' | 'Critical Gap';
  explanation: string;
}

export interface ProgressSnapshot {
  id: string;
  date: string;
  overallScore: number;
  categoryScores: Record<string, number>;
  note?: string;
}

export interface StudentProfile {
  name: string;
  degree: string;
  branch: string;
  university: string;
  year: string;
  semester: string;
  cgpa: string;
  careerGoal: string;
  bio: string;
  linkedIn: string;
  gitHub: string;
  portfolio: string;
  email: string;
  location: string;
  academicFocus: string[];
}

export interface ResumeCheckitem {
  id: string;
  label: string;
  category: string;
  checked: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: PriorityLevel;
  dueDate?: string;
  completed: boolean;
  notes?: string;
}

export interface AIConversationItem {
  id: string;
  feature: string;
  question: string;
  response: string;
  createdAt: string;
}

export type CloudSyncStatus = 'synced' | 'saving' | 'offline' | 'local' | 'error';

export interface DigitalTwinState {
  profile: StudentProfile;
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  activeCareerGoalId: string;
  careerGoals: CareerGoal[];
  progressHistory: ProgressSnapshot[];
  resumeChecklist: ResumeCheckitem[];
  customRecommendations: Recommendation[];
  tasks?: TaskItem[];
}

export interface StudentRecord extends DigitalTwinState {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MultiStudentState {
  students: StudentRecord[];
  activeStudentId: string;
}


