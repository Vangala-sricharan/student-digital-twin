import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  User,
  GraduationCap,
  Code,
  FolderGit2,
  Target,
  Globe,
  Briefcase
} from 'lucide-react';
import { DigitalTwinState, StudentProfile, Skill, Project } from '../types';
import { calculateCareerReadiness } from '../services/scoringEngine';

interface OnboardingWizardProps {
  userEmail: string;
  userName?: string;
  onComplete: (newState: DigitalTwinState) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  userEmail,
  userName = '',
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Personal & Education
  const [name, setName] = useState(userName || '');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [university, setUniversity] = useState('University');
  const [year, setYear] = useState('2nd Year');
  const [semester, setSemester] = useState('4th Semester');

  // Step 2: Technical Skills & Languages
  const [progLanguages, setProgLanguages] = useState('C++, Python, JavaScript');
  const [techSkills, setTechSkills] = useState('OOP, Data Structures, SQL, Web Development');
  const [strongestAreas, setStrongestAreas] = useState('Object-Oriented Programming, Logic Building');
  const [areasToImprove, setAreasToImprove] = useState('Advanced Algorithms, Machine Learning');

  // Step 3: Projects
  const [projectName, setProjectName] = useState('Management System Project');
  const [projectDesc, setProjectDesc] = useState('Built a software application handling file records, user inputs, and structured data handling.');
  const [projectTech, setProjectTech] = useState('C++, OOP, File Handling');

  // Step 4: Career Goals & Links
  const [careerGoal, setCareerGoal] = useState('Software Engineer / AI Developer');
  const [targetCompanies, setTargetCompanies] = useState('Tech Product Companies & Startups');
  const [internshipGoals, setInternshipGoals] = useState('Looking for 3-6 month Software Developer Internship');
  const [gitHub, setGitHub] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [preferredLang, setPreferredLang] = useState('English');

  const totalSteps = 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert skills text into structured Skill items
    const parsedProg = progLanguages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedSkills = techSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const generatedSkills: Skill[] = [
      ...parsedProg.map((p, idx) => ({
        id: `user-sk-p-${idx}`,
        name: p,
        category: 'Programming' as const,
        proficiency: 'Intermediate' as const,
        numericScore: 75,
      })),
      ...parsedSkills.map((s, idx) => ({
        id: `user-sk-t-${idx}`,
        name: s,
        category: 'Web Development' as const,
        proficiency: 'Basic' as const,
        numericScore: 65,
      })),
    ];

    const generatedProjects: Project[] = [
      {
        id: `user-proj-1`,
        name: projectName || 'Primary Portfolio Project',
        description: projectDesc || 'Project demonstrating core programming concepts.',
        technologies: projectTech.split(',').map((t) => t.trim()).filter(Boolean),
        skills: [projectName],
        status: 'Completed' as const,
        difficulty: 'Intermediate' as const,
        completionDate: new Date().toISOString().split('T')[0],
      },
    ];

    const profile: StudentProfile = {
      name: name || 'Student',
      degree: degree || 'B.Tech',
      branch: branch || 'Computer Science',
      university: university || 'University',
      year: year || '2nd Year',
      semester: semester || '4th Semester',
      cgpa: '8.0',
      careerGoal: careerGoal || 'Software Engineer',
      bio: `Enthusiastic student pursuing ${degree} in ${branch}. Skilled in ${progLanguages}. Targeting roles in ${careerGoal}.`,
      linkedIn: '',
      gitHub: gitHub || '',
      portfolio: '',
      email: userEmail || 'user@example.com',
      location: 'India',
      academicFocus: [branch, careerGoal, 'Programming'],
    };

    const newState: DigitalTwinState = {
      profile,
      skills: generatedSkills.length > 0 ? generatedSkills : [
        { id: 'sk-1', name: 'Programming Fundamentals', category: 'Programming', proficiency: 'Intermediate', numericScore: 70 }
      ],
      projects: generatedProjects,
      achievements: [
        {
          id: 'ach-1',
          title: 'Student Digital Twin Onboarding Completed',
          organization: 'Digital Twin AI',
          date: new Date().toISOString().split('T')[0],
          type: 'Award',
          description: 'Successfully initialized student career profile and verified technical skill twin.',
        }
      ],
      activeCareerGoalId: 'cg-1',
      careerGoals: [
        {
          id: 'cg-1',
          title: careerGoal || 'Software Engineer',
          description: `Targeting ${careerGoal} role at product companies.`,
          targetSkills: { 'C++': 80, 'Data Structures': 75, 'DBMS': 70 },
        }
      ],
      progressHistory: [
        {
          id: 'sn-1',
          date: new Date().toISOString().split('T')[0],
          overallScore: 60,
          categoryScores: { Programming: 65, Web: 60 },
          note: 'Initial Digital Twin profile created',
        }
      ],
      resumeChecklist: [
        { id: 'rc-1', category: 'Header & Contact', label: 'Contact Information Included', checked: true },
        { id: 'rc-2', category: 'Education', label: 'Degree & University Listed', checked: true },
        { id: 'rc-3', category: 'Technical Skills', label: 'Programming Languages Highlighted', checked: true },
      ],
      customRecommendations: [],
      tasks: [
        { id: 'task-1', title: 'Complete initial skill self-assessment', completed: false, category: 'Skills', priority: 'High' }
      ]
    };

    onComplete(newState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-200/50 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Initialize Your Student Digital Twin
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Step {step} of {totalSteps} — {step === 1 ? 'Personal Info' : step === 2 ? 'Skills & Languages' : step === 3 ? 'Projects' : 'Career Goals'}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-300/40">
            {Math.round((step / totalSteps) * 100)}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
          {/* STEP 1: Personal & Education */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <User className="h-4 w-4 text-sky-500" />
                <span>Personal & Academic Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Degree / Course *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Tech / B.E."
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Specialization / Branch *
                  </label>
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science (AI/ML)"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    University / College *
                  </label>
                  <input
                    type="text"
                    required
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Marwadi University"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Year *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Semester *
                  </label>
                  <input
                    type="text"
                    required
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    placeholder="e.g. 4th Semester"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Skills & Languages */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Code className="h-4 w-4 text-sky-500" />
                <span>Technical Skills & Strengths</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Programming Languages You Know (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={progLanguages}
                  onChange={(e) => setProgLanguages(e.target.value)}
                  placeholder="e.g. C++, Python, Java, JavaScript"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technical Concepts & Tools (comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={techSkills}
                  onChange={(e) => setTechSkills(e.target.value)}
                  placeholder="e.g. OOP, Data Structures, DBMS, SQL, Git, React"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Strongest Technical Areas
                  </label>
                  <input
                    type="text"
                    value={strongestAreas}
                    onChange={(e) => setStrongestAreas(e.target.value)}
                    placeholder="e.g. Logic building, C++ OOP"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Areas You Want to Improve
                  </label>
                  <input
                    type="text"
                    value={areasToImprove}
                    onChange={(e) => setAreasToImprove(e.target.value)}
                    placeholder="e.g. System Design, Neural Networks"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Projects */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-sky-500" />
                <span>Featured Project</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. E-Commerce Billing System"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brief Project Description
                </label>
                <textarea
                  rows={3}
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Describe key features, data handling, or architecture..."
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technologies Used (comma separated)
                </label>
                <input
                  type="text"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                  placeholder="e.g. C++, OOP, File Handling, SQL"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Career Goals & Links */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Target className="h-4 w-4 text-sky-500" />
                <span>Career Target & Links</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g. AI/ML Engineer / Full Stack Developer"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Companies / Industries
                  </label>
                  <input
                    type="text"
                    value={targetCompanies}
                    onChange={(e) => setTargetCompanies(e.target.value)}
                    placeholder="e.g. Product SaaS, AI Startups"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Internship Goals
                </label>
                <input
                  type="text"
                  value={internshipGoals}
                  onChange={(e) => setInternshipGoals(e.target.value)}
                  placeholder="e.g. Seeking Summer 2026 Developer Internship"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={gitHub}
                    onChange={(e) => setGitHub(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Resume Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Learning Language
                </label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Gujarati">Gujarati</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-sky-200/50 dark:border-white/10">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{step === totalSteps ? 'Generate My Student Twin' : 'Continue'}</span>
              {step === totalSteps ? <CheckCircle2 className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
