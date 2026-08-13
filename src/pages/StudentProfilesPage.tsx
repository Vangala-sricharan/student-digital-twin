import React, { useState, useRef } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  AlertTriangle,
  Building2,
  GraduationCap,
  Briefcase,
  X,
  FileJson,
  FileText,
  RefreshCw,
  ChevronDown,
  Check,
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { StudentRecord, StudentProfile } from '../types';
import { CAREER_GOAL_PRESETS, INITIAL_RESUME_CHECKLIST } from '../data/initialData';
import { generateStudentPDF } from '../utils/pdfGenerator';

interface StudentProfilesPageProps {
  students: StudentRecord[];
  activeStudentId: string;
  onSelectStudent: (id: string) => void;
  onAddStudent: (newStudent: StudentRecord) => void;
  onUpdateStudent: (updatedStudent: StudentRecord) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentProfilesPage: React.FC<StudentProfilesPageProps> = ({
  students,
  activeStudentId,
  onSelectStudent,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // PDF Generation State
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data Management Dropdown State
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);

  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<StudentRecord | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    name: '',
    degree: 'B.Tech',
    branch: 'Computer Science & Engineering',
    university: '',
    year: '1st Year',
    semester: '1st Semester',
    cgpa: 'Not added',
    careerGoal: 'AI/ML Engineer',
    bio: '',
    linkedIn: '',
    gitHub: '',
    portfolio: '',
    email: '',
    location: '',
  });

  const activeStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.profile.name.toLowerCase().includes(q) ||
      s.profile.university.toLowerCase().includes(q) ||
      s.profile.careerGoal.toLowerCase().includes(q) ||
      s.profile.branch.toLowerCase().includes(q)
    );
  });

  const handleDownloadPDF = async (targetStudent?: StudentRecord) => {
    const studentToExport = targetStudent || activeStudent;
    if (!studentToExport) return;

    setIsGeneratingPDF(true);
    setPdfNotice(null);

    try {
      await generateStudentPDF(studentToExport);
      setPdfNotice({
        type: 'success',
        message: `PDF report for ${studentToExport.profile.name} downloaded successfully!`,
      });
      setTimeout(() => setPdfNotice(null), 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setPdfNotice({
        type: 'error',
        message: 'Unable to generate PDF. Please try again.',
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      university: '',
      year: '1st Year',
      semester: '1st Semester',
      cgpa: 'Not added',
      careerGoal: 'AI/ML Engineer',
      bio: '',
      linkedIn: '',
      gitHub: '',
      portfolio: '',
      email: '',
      location: '',
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentRecord) => {
    setFormData({ ...student.profile });
    setEditingStudent(student);
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.university?.trim()) return;

    if (editingStudent) {
      const updated: StudentRecord = {
        ...editingStudent,
        profile: {
          ...editingStudent.profile,
          ...formData,
          name: formData.name.trim(),
          university: formData.university.trim(),
        } as StudentProfile,
        updatedAt: new Date().toISOString(),
      };
      onUpdateStudent(updated);
    } else {
      const newId = `student-${Date.now()}`;
      const createdProfile: StudentProfile = {
        name: formData.name.trim(),
        degree: formData.degree || 'B.Tech',
        branch: formData.branch || 'CSE',
        university: formData.university.trim(),
        year: formData.year || '1st Year',
        semester: formData.semester || '1st Semester',
        cgpa: formData.cgpa || 'Not added',
        careerGoal: formData.careerGoal || 'AI/ML Engineer',
        bio: formData.bio || '',
        linkedIn: formData.linkedIn || '',
        gitHub: formData.gitHub || '',
        portfolio: formData.portfolio || '',
        email: formData.email || '',
        location: formData.location || '',
        academicFocus: ['Computer Science', 'Software Development'],
      };

      const newRecord: StudentRecord = {
        id: newId,
        profile: createdProfile,
        skills: [],
        projects: [],
        achievements: [],
        activeCareerGoalId: 'cg-aiml',
        careerGoals: CAREER_GOAL_PRESETS,
        progressHistory: [
          {
            id: `snap-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            overallScore: 35,
            categoryScores: {},
            note: 'Initial Digital Twin initialization.',
          },
        ],
        resumeChecklist: INITIAL_RESUME_CHECKLIST.map((item) => ({ ...item, checked: false })),
        customRecommendations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onAddStudent(newRecord);
      onSelectStudent(newId);
    }

    setIsAddModalOpen(false);
  };

  const handleExportJSON = (student: StudentRecord) => {
    const filename = `student-digital-twin-${student.profile.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')}.json`;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(student, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object' || !parsed.profile || !parsed.profile.name) {
          setImportError('Invalid Digital Twin file. Missing student profile structure.');
          return;
        }

        const importedRecord: StudentRecord = {
          id: `student-imported-${Date.now()}`,
          profile: parsed.profile,
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
          activeCareerGoalId: parsed.activeCareerGoalId || 'cg-aiml',
          careerGoals: Array.isArray(parsed.careerGoals) ? parsed.careerGoals : CAREER_GOAL_PRESETS,
          progressHistory: Array.isArray(parsed.progressHistory) ? parsed.progressHistory : [],
          resumeChecklist: Array.isArray(parsed.resumeChecklist) ? parsed.resumeChecklist : INITIAL_RESUME_CHECKLIST,
          customRecommendations: Array.isArray(parsed.customRecommendations) ? parsed.customRecommendations : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setImportPreview(importedRecord);
      } catch (err) {
        setImportError('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    onAddStudent(importPreview);
    onSelectStudent(importPreview.id);
    setImportPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for JSON Restore */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-md">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Student Profiles</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-extrabold">
                  {students.length} Registered
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Manage profiles, download PDF reports, or maintain data backups.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Primary Action 1: Download PDF */}
            <button
              onClick={() => handleDownloadPDF(activeStudent)}
              disabled={isGeneratingPDF}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isGeneratingPDF ? (
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
              ) : (
                <FileText className="h-4 w-4 text-white" />
              )}
              <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            {/* Primary Action 2: + Add Student */}
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>+ Add Student</span>
            </button>

            {/* Secondary Action: Backup / Restore Data Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-all border border-slate-200/80 dark:border-white/10 cursor-pointer"
                title="Backup & Restore Data (JSON)"
              >
                <FileJson className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Data Management</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>

              {isDataMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl z-30 p-2 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Backup / Restore Data
                  </div>
                  <button
                    onClick={() => {
                      setIsDataMenuOpen(false);
                      if (activeStudent) handleExportJSON(activeStudent);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 font-medium text-left cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Export JSON Backup</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDataMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 font-medium text-left cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Import JSON Restore</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* PDF Generation Notification Toast */}
      {pdfNotice && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between shadow-md transition-all ${
            pdfNotice.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {pdfNotice.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <span className="font-semibold">{pdfNotice.message}</span>
          </div>
          <button
            onClick={() => setPdfNotice(null)}
            className="text-xs font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Import Error Message */}
      {importError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{importError}</span>
          </div>
          <button onClick={() => setImportError(null)} className="text-xs font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students by name, university, branch, or career goal..."
          className="w-full rounded-2xl bg-slate-100 dark:bg-white/5 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 border border-slate-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        />
      </div>

      {/* Student Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const isActive = student.id === activeStudentId;

          return (
            <GlassCard
              key={student.id}
              className={`p-6 flex flex-col justify-between transition-all duration-300 ${
                isActive
                  ? 'ring-2 ring-cyan-500 shadow-xl shadow-cyan-500/10 border-cyan-500/40'
                  : 'hover:border-cyan-500/30'
              }`}
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-extrabold text-base shadow-md">
                      {student.profile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {student.profile.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 shrink-0" />
                        <span className="truncate">{student.profile.degree} • {student.profile.year}</span>
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                      <CheckCircle2 className="h-3 w-3" /> ACTIVE
                    </span>
                  )}
                </div>

                {/* Info Fields */}
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                    <span className="truncate font-medium">{student.profile.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="truncate font-medium text-cyan-600 dark:text-cyan-400">
                      {student.profile.careerGoal}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Branch: <span className="text-slate-800 dark:text-slate-200 font-semibold">{student.profile.branch}</span>
                  </div>
                </div>

                {/* Digital Twin Summary Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                    <span className="block font-black text-xs text-slate-900 dark:text-white">
                      {student.skills.length}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">Skills</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                    <span className="block font-black text-xs text-slate-900 dark:text-white">
                      {student.projects.length}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">Projects</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                    <span className="block font-black text-xs text-slate-900 dark:text-white">
                      {student.achievements.length}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">Achievements</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-2">
                {!isActive ? (
                  <button
                    onClick={() => onSelectStudent(student.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold text-xs hover:bg-cyan-500/20 transition-all cursor-pointer"
                  >
                    Activate Profile
                  </button>
                ) : (
                  <span className="flex-1 text-center py-2 px-3 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    Currently Selected
                  </span>
                )}

                <div className="flex items-center gap-1">
                  {/* Card PDF Download */}
                  <button
                    onClick={() => handleDownloadPDF(student)}
                    title={`Download PDF Report for ${student.profile.name}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold text-xs transition-all cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>PDF</span>
                  </button>

                  {/* Card JSON Backup */}
                  <button
                    onClick={() => handleExportJSON(student)}
                    title="Export JSON Backup"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-white/10 transition-all cursor-pointer"
                  >
                    <FileJson className="h-4 w-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEditModal(student)}
                    title="Edit Student Info"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-cyan-500 border border-slate-200/60 dark:border-white/10 transition-all cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeletingStudentId(student.id)}
                    disabled={students.length <= 1}
                    title={students.length <= 1 ? 'Cannot delete only student' : 'Delete Student'}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-rose-500 hover:bg-rose-500/10 border border-slate-200/60 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
          <GlassCard className="w-full max-w-xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-cyan-500" />
                <span>{editingStudent ? 'Edit Student Profile' : 'Add New Student Profile'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create or update an independent Student Digital Twin record.
              </p>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    University / College *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.university || ''}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g. Marwadi University"
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={formData.degree || ''}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. B.Tech"
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    value={formData.branch || ''}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    placeholder="e.g. Computer Science & Engineering (AI/ML)"
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={formData.year || '1st Year'}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  >
                    <option value="1st Year" className="dark:bg-slate-900">1st Year</option>
                    <option value="2nd Year" className="dark:bg-slate-900">2nd Year</option>
                    <option value="3rd Year" className="dark:bg-slate-900">3rd Year</option>
                    <option value="4th Year" className="dark:bg-slate-900">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Career Goal
                  </label>
                  <select
                    value={formData.careerGoal || 'AI/ML Engineer'}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  >
                    {CAREER_GOAL_PRESETS.map((goal) => (
                      <option key={goal.id} value={goal.title} className="dark:bg-slate-900">
                        {goal.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio / Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief academic bio and career focus..."
                  className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedIn || ''}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={formData.gitHub || ''}
                    onChange={(e) => setFormData({ ...formData, gitHub: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-cyan-500/40 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20"
                >
                  {editingStudent ? 'Save Changes' : 'Create Student Twin'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Import Preview Modal */}
      {importPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <GlassCard className="w-full max-w-md p-6 space-y-4 relative">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <FileJson className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Confirm Digital Twin Restore
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Restore backup data as an independent student profile.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Student Name: </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {importPreview.profile.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400">University: </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {importPreview.profile.university}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Career Goal: </span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">
                  {importPreview.profile.careerGoal}
                </span>
              </div>
              <div className="pt-2 flex gap-4 text-slate-500 border-t border-slate-200/60 dark:border-white/10">
                <span>{importPreview.skills.length} Skills</span>
                <span>{importPreview.projects.length} Projects</span>
                <span>{importPreview.achievements.length} Achievements</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setImportPreview(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/10 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
              >
                Restore & Activate
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <GlassCard className="w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Student Profile?
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete this student digital twin? All associated skills, projects, and progress snapshots will be permanently removed.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingStudentId(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteStudent(deletingStudentId);
                  setDeletingStudentId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 shadow-md shadow-rose-500/20 cursor-pointer"
              >
                Delete Profile
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
