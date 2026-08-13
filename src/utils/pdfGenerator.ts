import { jsPDF } from 'jspdf';
import { StudentRecord, CareerGoal } from '../types';
import { calculateCareerReadiness } from '../services/scoringEngine';

export async function generateStudentPDF(student: StudentRecord): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  let y = margin;

  // Colors
  const primaryColor = '#0284c7'; // Cyan-600
  const darkColor = '#0f172a'; // Slate-900
  const grayColor = '#475569'; // Slate-600
  const lightBg = '#f8fafc'; // Slate-50
  const borderColor = '#cbd5e1'; // Slate-300

  // Helper function to check vertical space and add new page
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      doc.addPage();
      y = margin;
      drawHeaderBanner(false);
    }
  };

  const drawHeaderBanner = (isFirstPage = true) => {
    if (isFirstPage) {
      // Top Primary Bar
      doc.setFillColor(2, 132, 199); // Primary Cyan
      doc.rect(margin, y, contentWidth, 22, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('STUDENT DIGITAL TWIN', margin + 6, y + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Career Readiness & Academic Profile Report', margin + 6, y + 16);

      const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      doc.setFontSize(8);
      doc.text(`Generated: ${today}`, pageWidth - margin - 6, y + 16, { align: 'right' });

      y += 28;
    } else {
      // Subtle header for subsequent pages
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text(`STUDENT DIGITAL TWIN — ${student.profile.name.toUpperCase()}`, margin, y + 4);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y + 6, pageWidth - margin, y + 6);
      y += 12;
    }
  };

  // 1. Initial Page Header
  drawHeaderBanner(true);

  // 2. Active Goal Resolution for Scoring
  const activeGoal: CareerGoal =
    student.careerGoals.find((g) => g.id === student.activeCareerGoalId) ||
    student.careerGoals[0] || {
      id: 'default',
      title: student.profile.careerGoal || 'Software Engineer',
      description: 'Career goal target',
      targetSkills: {},
    };

  const readiness = calculateCareerReadiness(
    student.profile,
    student.skills,
    student.projects,
    student.achievements,
    activeGoal,
    student.resumeChecklist || []
  );

  // 3. Student Personal Details Card
  checkPageBreak(50);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 48, 3, 3, 'FD');

  // Name & Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(student.profile.name || 'Student Name Not Provided', margin + 6, y + 9);

  doc.setTextColor(2, 132, 199);
  doc.setFontSize(10);
  doc.text(`Target Role: ${student.profile.careerGoal || 'Not specified'}`, margin + 6, y + 15);

  // Score Badge on Right
  doc.setFillColor(2, 132, 199);
  doc.roundedRect(pageWidth - margin - 38, y + 6, 32, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${Math.round(readiness.overallScore)}%`, pageWidth - margin - 22, y + 14, { align: 'center' });
  doc.setFontSize(6);
  doc.text('READINESS SCORE', pageWidth - margin - 22, y + 19, { align: 'center' });

  // Grid Info
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const col1X = margin + 6;
  const col2X = margin + 90;

  doc.text(`University: ${student.profile.university || 'Not provided'}`, col1X, y + 24);
  doc.text(`Degree: ${student.profile.degree || 'Not provided'} (${student.profile.branch || 'N/A'})`, col1X, y + 30);
  doc.text(`Year/Sem: ${student.profile.year || 'N/A'} • ${student.profile.semester || 'N/A'}`, col1X, y + 36);

  doc.text(`CGPA / Score: ${student.profile.cgpa || 'Not added'}`, col2X, y + 24);
  doc.text(`Email: ${student.profile.email || 'Not provided'}`, col2X, y + 30);
  doc.text(`GitHub: ${student.profile.gitHub || 'Not linked'}`, col2X, y + 36);

  if (student.profile.bio) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    const splitBio = doc.splitTextToSize(`Bio: ${student.profile.bio}`, contentWidth - 12);
    doc.text(splitBio[0] || '', col1X, y + 43);
  }

  y += 54;

  // Helper Section Header Renderer
  const renderSectionHeader = (title: string) => {
    checkPageBreak(14);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(2, 132, 199);
    doc.rect(margin, y, 2, 7, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), margin + 6, y + 5);
    y += 10;
  };

  // 4. CAREER READINESS BREAKDOWN
  renderSectionHeader('Career Readiness Breakdown');

  checkPageBreak(30);
  const colWidth = (contentWidth - 6) / 3;
  readiness.categoryScores.forEach((cat, index) => {
    const colIndex = index % 3;
    const rowIndex = Math.floor(index / 3);

    const xPos = margin + colIndex * (colWidth + 3);
    const yPos = y + rowIndex * 16;

    if (rowIndex > 0 && colIndex === 0) {
      checkPageBreak(18);
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(xPos, yPos, colWidth, 14, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(cat.name, xPos + 4, yPos + 5);

    doc.setFontSize(8);
    doc.setTextColor(2, 132, 199);
    doc.text(`${Math.round(cat.score)}%`, xPos + colWidth - 4, yPos + 5, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Status: ${cat.status}`, xPos + 4, yPos + 10);
  });

  const totalRows = Math.ceil(readiness.categoryScores.length / 3);
  y += totalRows * 16 + 4;

  // 5. SKILLS & COMPETENCIES
  if (student.skills && student.skills.length > 0) {
    renderSectionHeader('Technical & Professional Skills');

    checkPageBreak(20);
    // Group skills by category
    const skillsByCategory: Record<string, typeof student.skills> = {};
    student.skills.forEach((s) => {
      const cat = s.category || 'General';
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(s);
    });

    Object.entries(skillsByCategory).forEach(([category, skillList]) => {
      checkPageBreak(12 + skillList.length * 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(2, 132, 199);
      doc.text(`• ${category}`, margin + 2, y);
      y += 5;

      skillList.forEach((sk) => {
        checkPageBreak(6);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(sk.name, margin + 6, y);

        doc.setTextColor(100, 116, 139);
        doc.text(`${sk.proficiency} (${sk.numericScore}%)`, pageWidth - margin - 6, y, { align: 'right' });

        // Dotted line separator
        doc.setDrawColor(226, 232, 240);
        doc.line(margin + 6, y + 1.5, pageWidth - margin - 6, y + 1.5);
        y += 5.5;
      });

      y += 2;
    });
  }

  // 6. PROJECTS PORTFOLIO
  if (student.projects && student.projects.length > 0) {
    renderSectionHeader('Projects & Implementations');

    student.projects.forEach((proj) => {
      checkPageBreak(25);

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.name, margin + 4, y + 5);

      // Status Pill
      doc.setFontSize(7.5);
      doc.setTextColor(2, 132, 199);
      doc.text(`[${proj.status.toUpperCase()}]`, pageWidth - margin - 4, y + 5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(proj.description || 'No description provided.', contentWidth - 8);
      doc.text(descLines[0] || '', margin + 4, y + 10);

      const techStr = proj.technologies && proj.technologies.length > 0
        ? `Tech Stack: ${proj.technologies.join(', ')}`
        : 'Tech Stack: Not specified';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(techStr, margin + 4, y + 16);

      if (proj.githubUrl) {
        doc.text(`GitHub: ${proj.githubUrl}`, pageWidth - margin - 4, y + 16, { align: 'right' });
      }

      y += 26;
    });
  }

  // 7. ACHIEVEMENTS & CERTIFICATIONS
  if (student.achievements && student.achievements.length > 0) {
    renderSectionHeader('Achievements & Certifications');

    student.achievements.forEach((ach) => {
      checkPageBreak(18);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`• ${ach.title}`, margin + 2, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`${ach.organization} (${ach.date || 'N/A'})`, pageWidth - margin - 2, y, { align: 'right' });

      if (ach.description) {
        y += 4.5;
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        doc.text(ach.description, margin + 6, y);
      }

      y += 6;
    });
  }

  // 8. RECOMMENDATIONS & ACTION PLAN
  if (readiness.recommendations && readiness.recommendations.length > 0) {
    renderSectionHeader('Target Career Action Plan');

    readiness.recommendations.slice(0, 4).forEach((rec) => {
      checkPageBreak(16);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(2, 132, 199);
      doc.text(`[${rec.priority.toUpperCase()} PRIORITY] ${rec.title}`, margin + 2, y);

      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const actionText = doc.splitTextToSize(rec.action, contentWidth - 4);
      doc.text(actionText[0] || '', margin + 2, y);

      y += 6;
    });
  }

  // Page Numbers Footer
  const totalPages = (doc as any).getNumberOfPages ? (doc as any).getNumberOfPages() : 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Generated by Student Digital Twin • Confidential Academic Report', margin, pageHeight - 7);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Generate File Name
  const cleanName = student.profile.name
    .trim()
    .replace(/[^a-zA-Z0-9_\s-]/g, '')
    .replace(/\s+/g, '_');
  const fileName = `Student_Digital_Twin_${cleanName || 'Report'}.pdf`;

  doc.save(fileName);
}
