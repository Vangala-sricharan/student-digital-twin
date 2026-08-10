import {
  Skill,
  Project,
  Achievement,
  StudentProfile,
  CareerGoal,
  ResumeCheckitem,
  CategoryScore,
  SkillGap,
  Recommendation,
} from '../types';

export interface CareerReadinessResult {
  overallScore: number;
  categoryScores: CategoryScore[];
  skillGaps: SkillGap[];
  recommendations: Recommendation[];
}

export interface InternshipCategoryScore {
  id: string;
  name: string;
  score: number;
  weight: number;
  status: string;
  explanation: string;
}

export interface InternshipReadinessResult {
  overallScore: number;
  statusLabel: 'Needs Development' | 'Building Foundation' | 'Getting Ready' | 'Strongly Prepared' | 'Highly Prepared';
  categoryScores: InternshipCategoryScore[];
  strongestAreas: InternshipCategoryScore[];
  biggestBlockers: InternshipCategoryScore[];
  recommendations: string[];
}

export function calculateInternshipReadiness(
  profile: StudentProfile,
  skills: Skill[],
  projects: Project[],
  achievements: Achievement[],
  resumeChecklist: ResumeCheckitem[]
): InternshipReadinessResult {
  // 1. Technical Skills — 20%
  const techSkills = skills.filter(
    (s) => s.category === 'Programming' || s.category === 'Web Development' || s.category === 'Databases'
  );
  const techAvg =
    techSkills.length > 0
      ? techSkills.reduce((acc, s) => acc + s.numericScore, 0) / techSkills.length
      : 55;

  // 2. DSA — 15%
  const dsaSkills = skills.filter(
    (s) =>
      s.category === 'Data Structures' ||
      s.name.toLowerCase().includes('dsa') ||
      s.name.toLowerCase().includes('data structure') ||
      s.name.toLowerCase().includes('algorithm')
  );
  const dsaAvg =
    dsaSkills.length > 0
      ? dsaSkills.reduce((acc, s) => acc + s.numericScore, 0) / dsaSkills.length
      : Math.max(40, techAvg * 0.85);

  // 3. AI/ML Skills — 15%
  const aimlSkills = skills.filter(
    (s) =>
      s.category === 'AI/ML' ||
      s.name.toLowerCase().includes('machine learning') ||
      s.name.toLowerCase().includes('ai') ||
      s.name.toLowerCase().includes('python') ||
      s.name.toLowerCase().includes('cnn')
  );
  const aimlAvg =
    aimlSkills.length > 0
      ? aimlSkills.reduce((acc, s) => acc + s.numericScore, 0) / aimlSkills.length
      : 45;

  // 4. Projects — 15%
  let projScore = 25;
  if (projects.length > 0) {
    const completed = projects.filter((p) => p.status === 'Completed').length;
    const inProgress = projects.filter((p) => p.status === 'In Progress').length;
    const techVariety = new Set(projects.flatMap((p) => p.technologies)).size;
    const withGithub = projects.filter((p) => p.githubUrl && p.githubUrl.trim().length > 0).length;
    projScore = Math.min(100, completed * 20 + inProgress * 12 + techVariety * 4 + withGithub * 8);
  }

  // 5. Resume Readiness — 10%
  let resumeScore = 40;
  if (resumeChecklist && resumeChecklist.length > 0) {
    const checked = resumeChecklist.filter((item) => item.checked).length;
    resumeScore = Math.round((checked / resumeChecklist.length) * 100);
  }

  // 6. GitHub Readiness — 10%
  let githubScore = 30;
  if (profile.gitHub) {
    githubScore += 30;
  }
  const projectsWithGithub = projects.filter((p) => p.githubUrl && p.githubUrl.trim().length > 0).length;
  githubScore += Math.min(30, projectsWithGithub * 15);
  const gitSkill = skills.find((s) => s.name.toLowerCase().includes('git'));
  if (gitSkill) {
    githubScore = Math.round((githubScore + gitSkill.numericScore) / 2);
  }
  githubScore = Math.min(100, Math.max(25, githubScore));

  // 7. Career Preparation — 10%
  let prepScore = 40;
  let filledFields = 0;
  if (profile.name) filledFields++;
  if (profile.degree) filledFields++;
  if (profile.university) filledFields++;
  if (profile.branch) filledFields++;
  if (profile.year) filledFields++;
  if (profile.cgpa && profile.cgpa !== 'Not added') filledFields++;
  if (profile.linkedIn) filledFields++;
  if (profile.gitHub) filledFields++;
  if (profile.portfolio) filledFields++;
  if (profile.bio) filledFields++;
  prepScore = Math.min(100, 30 + filledFields * 7);


  // 8. Achievements/Certifications — 5%
  let certScore = 30;
  if (achievements.length > 0) {
    const count = achievements.length;
    const types = new Set(achievements.map((a) => a.type)).size;
    certScore = Math.min(100, 40 + count * 15 + types * 10);
  }

  const categoryScores: InternshipCategoryScore[] = [
    {
      id: 'cat-tech',
      name: 'Technical Skills',
      score: Math.round(techAvg),
      weight: 20,
      status: techAvg >= 75 ? 'Strong' : techAvg >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Core programming languages, syntax, and foundational engineering knowledge.',
    },
    {
      id: 'cat-dsa',
      name: 'DSA',
      score: Math.round(dsaAvg),
      weight: 15,
      status: dsaAvg >= 75 ? 'Strong' : dsaAvg >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Data structures, algorithmic problem solving, and interview readiness.',
    },
    {
      id: 'cat-aiml',
      name: 'AI/ML Skills',
      score: Math.round(aimlAvg),
      weight: 15,
      status: aimlAvg >= 75 ? 'Strong' : aimlAvg >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Machine learning fundamentals, model development, and framework proficiency.',
    },
    {
      id: 'cat-projects',
      name: 'Projects',
      score: Math.round(projScore),
      weight: 15,
      status: projScore >= 75 ? 'Strong' : projScore >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Practical portfolio projects, implementation complexity, and completion.',
    },
    {
      id: 'cat-resume',
      name: 'Resume Readiness',
      score: Math.round(resumeScore),
      weight: 10,
      status: resumeScore >= 75 ? 'Strong' : resumeScore >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Resume section completeness, formatting, and outcome metrics.',
    },
    {
      id: 'cat-github',
      name: 'GitHub Readiness',
      score: Math.round(githubScore),
      weight: 10,
      status: githubScore >= 75 ? 'Strong' : githubScore >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Public repository presence, source links, and version control activity.',
    },
    {
      id: 'cat-prep',
      name: 'Career Preparation',
      score: Math.round(prepScore),
      weight: 10,
      status: prepScore >= 75 ? 'Strong' : prepScore >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Student profile, professional links, and career goal alignment.',
    },
    {
      id: 'cat-achieve',
      name: 'Achievements',
      score: Math.round(certScore),
      weight: 5,
      status: certScore >= 75 ? 'Strong' : certScore >= 60 ? 'Building' : 'Needs Attention',
      explanation: 'Hackathon awards, verified certifications, and extracurricular milestones.',
    },
  ];

  // Weighted sum
  const weightedSum = categoryScores.reduce((acc, cat) => acc + cat.score * cat.weight, 0);
  const overallScore = Math.round(weightedSum / 100);

  let statusLabel: InternshipReadinessResult['statusLabel'] = 'Needs Development';
  if (overallScore >= 90) statusLabel = 'Highly Prepared';
  else if (overallScore >= 75) statusLabel = 'Strongly Prepared';
  else if (overallScore >= 60) statusLabel = 'Getting Ready';
  else if (overallScore >= 40) statusLabel = 'Building Foundation';

  // Sorted categories for strongest and weakest
  const sorted = [...categoryScores].sort((a, b) => b.score - a.score);
  const strongestAreas = sorted.slice(0, 3);
  const biggestBlockers = [...sorted].reverse().slice(0, 3);

  // Deterministic recommendations from weak areas
  const recommendations: string[] = [];
  categoryScores.forEach((cat) => {
    if (cat.id === 'cat-dsa' && cat.score < 60) {
      recommendations.push('Practice arrays, strings, searching, sorting and basic problem solving.');
    }
    if (cat.id === 'cat-projects' && cat.score < 60) {
      recommendations.push('Build at least one strong project aligned with your AI/ML career goal.');
    }
    if (cat.id === 'cat-resume' && cat.score < 60) {
      recommendations.push('Complete your resume and add measurable project outcomes.');
    }
    if (cat.id === 'cat-github' && cat.score < 60) {
      recommendations.push('Improve your GitHub profile and add README files to your strongest projects.');
    }
    if (cat.id === 'cat-aiml' && cat.score < 60) {
      recommendations.push('Strengthen machine learning fundamentals and build one ML project.');
    }
    if (cat.id === 'cat-tech' && cat.score < 60) {
      recommendations.push('Focus on strengthening core programming languages and system design fundamentals.');
    }
    if (cat.id === 'cat-prep' && cat.score < 60) {
      recommendations.push('Complete your profile details, LinkedIn URL, and portfolio link in settings.');
    }
    if (cat.id === 'cat-achieve' && cat.score < 60) {
      recommendations.push('Earn certifications or participate in hackathons to showcase verified accomplishments.');
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Maintain your current momentum by building advanced AI system architectures and preparing for technical interviews.');
  }

  return {
    overallScore,
    statusLabel,
    categoryScores,
    strongestAreas,
    biggestBlockers,
    recommendations,
  };
}


export function calculateCareerReadiness(
  profile: StudentProfile,
  skills: Skill[],
  projects: Project[],
  achievements: Achievement[],
  activeGoal: CareerGoal,
  resumeChecklist: ResumeCheckitem[]
): CareerReadinessResult {
  // 1. Programming Score (15%)
  const progSkills = skills.filter((s) => s.category === 'Programming');
  const progAvg = progSkills.length > 0
    ? progSkills.reduce((acc, s) => acc + s.numericScore, 0) / progSkills.length
    : 50;

  // 2. DSA Score (15%)
  const dsaSkills = skills.filter((s) => s.category === 'Data Structures');
  const dsaAvg = dsaSkills.length > 0
    ? dsaSkills.reduce((acc, s) => acc + s.numericScore, 0) / dsaSkills.length
    : Math.max(40, progAvg * 0.8);

  // 3. AI/ML Score (15%)
  const aimlSkills = skills.filter((s) => s.category === 'AI/ML');
  const aimlAvg = aimlSkills.length > 0
    ? aimlSkills.reduce((acc, s) => acc + s.numericScore, 0) / aimlSkills.length
    : 40;

  // 4. Projects Score (15%)
  let projectScore = 0;
  if (projects.length > 0) {
    const completedCount = projects.filter((p) => p.status === 'Completed').length;
    const inProgressCount = projects.filter((p) => p.status === 'In Progress').length;
    const techVariety = new Set(projects.flatMap((p) => p.technologies)).size;

    const baseScore = Math.min(100, (completedCount * 18) + (inProgressCount * 10) + (techVariety * 4));
    projectScore = Math.min(100, Math.max(45, baseScore));
  } else {
    projectScore = 20;
  }

  // 5. GitHub Score (10%)
  let githubScore = 30; // base score
  if (profile.gitHub && profile.gitHub.trim().length > 0) {
    githubScore += 30;
  }
  const projectsWithGithub = projects.filter((p) => p.githubUrl && p.githubUrl.trim().length > 0).length;
  githubScore += Math.min(30, projectsWithGithub * 15);
  const gitSkills = skills.filter((s) => s.name.toLowerCase().includes('git'));
  if (gitSkills.length > 0) {
    const gitSkillAvg = gitSkills.reduce((a, b) => a + b.numericScore, 0) / gitSkills.length;
    githubScore = Math.round((githubScore + gitSkillAvg) / 2);
  }
  githubScore = Math.min(100, Math.max(25, githubScore));

  // 6. Certifications & Achievements Score (10%)
  let certScore = 25;
  if (achievements.length > 0) {
    const count = achievements.length;
    const types = new Set(achievements.map((a) => a.type)).size;
    certScore = Math.min(100, 40 + (count * 15) + (types * 10));
  }

  // 7. Resume Score (10%)
  let resumeScore = 40;
  if (resumeChecklist && resumeChecklist.length > 0) {
    const checked = resumeChecklist.filter((item) => item.checked).length;
    resumeScore = Math.round((checked / resumeChecklist.length) * 100);
  }

  // 8. Career Preparation Score (10%)
  let prepScore = 50;
  let filledFields = 0;
  if (profile.name) filledFields++;
  if (profile.degree) filledFields++;
  if (profile.university) filledFields++;
  if (profile.branch) filledFields++;
  if (profile.year) filledFields++;
  if (profile.cgpa && profile.cgpa !== 'Not added') filledFields++;
  if (profile.linkedIn) filledFields++;
  if (profile.gitHub) filledFields++;
  if (profile.portfolio) filledFields++;
  if (profile.bio) filledFields++;

  prepScore = Math.min(100, 40 + (filledFields * 6));

  const categoryScores: CategoryScore[] = [
    {
      id: 'cat-prog',
      name: 'Programming',
      score: Math.round(progAvg),
      weight: 15,
      status: progAvg >= 80 ? 'Strong' : progAvg >= 65 ? 'On Track' : 'Needs Attention',
      explanation: `Proficiency across C, C++, Python, and OOP constructs.`,
    },
    {
      id: 'cat-dsa',
      name: 'DSA',
      score: Math.round(dsaAvg),
      weight: 15,
      status: dsaAvg >= 75 ? 'Strong' : dsaAvg >= 60 ? 'On Track' : 'Needs Attention',
      explanation: `Data structures, arrays, searching & sorting mastery.`,
    },
    {
      id: 'cat-aiml',
      name: 'AI/ML',
      score: Math.round(aimlAvg),
      weight: 15,
      status: aimlAvg >= 75 ? 'Strong' : aimlAvg >= 60 ? 'On Track' : 'Critical Gap',
      explanation: `Python for AI, ML models, and Neural Networks/CNN foundations.`,
    },
    {
      id: 'cat-projects',
      name: 'Projects',
      score: Math.round(projectScore),
      weight: 15,
      status: projectScore >= 80 ? 'Strong' : projectScore >= 65 ? 'On Track' : 'Needs Attention',
      explanation: `Practical applications built in C++, POS systems, and DBMS.`,
    },
    {
      id: 'cat-github',
      name: 'GitHub',
      score: Math.round(githubScore),
      weight: 10,
      status: githubScore >= 75 ? 'Strong' : githubScore >= 55 ? 'On Track' : 'Needs Attention',
      explanation: `Repository maintenance, code commits, and project source links.`,
    },
    {
      id: 'cat-certs',
      name: 'Certifications',
      score: Math.round(certScore),
      weight: 10,
      status: certScore >= 75 ? 'Strong' : certScore >= 55 ? 'On Track' : 'Needs Attention',
      explanation: `Participation in AI Sparks '26, Prompt Wars, and tech workshops.`,
    },
    {
      id: 'cat-resume',
      name: 'Resume',
      score: Math.round(resumeScore),
      weight: 10,
      status: resumeScore >= 80 ? 'Strong' : resumeScore >= 60 ? 'On Track' : 'Needs Attention',
      explanation: `Checklist completeness across education, skills, and links.`,
    },
    {
      id: 'cat-prep',
      name: 'Career Preparation',
      score: Math.round(prepScore),
      weight: 10,
      status: prepScore >= 80 ? 'Strong' : prepScore >= 65 ? 'On Track' : 'Needs Attention',
      explanation: `Student profile completeness, target goals, and professional links.`,
    },
  ];

  // Calculate Weighted Overall Score
  const weightedSum = categoryScores.reduce((acc, cat) => acc + (cat.score * cat.weight), 0);
  const overallScore = Math.round(weightedSum / 100);

  // 2. Calculate Skill Gaps based on active career goal
  const skillGaps: SkillGap[] = [];
  const targetMap = activeGoal.targetSkills;

  Object.entries(targetMap).forEach(([targetSkillName, requiredLevel]) => {
    // Find matching skill in student's skills
    const match = skills.find(
      (s) => s.name.toLowerCase().includes(targetSkillName.toLowerCase()) ||
             targetSkillName.toLowerCase().includes(s.name.toLowerCase())
    );

    const currentLevel = match ? match.numericScore : 35; // default beginner level if missing
    const gap = Math.max(0, requiredLevel - currentLevel);

    let status: 'High Gap' | 'Medium Gap' | 'Low Gap' | 'On Track' = 'On Track';
    if (gap >= 25) {
      status = 'High Gap';
    } else if (gap >= 15) {
      status = 'Medium Gap';
    } else if (gap > 5) {
      status = 'Low Gap';
    }

    skillGaps.push({
      skillName: targetSkillName,
      category: match ? match.category : 'AI/ML',
      currentLevel,
      requiredLevel,
      gap,
      status,
    });
  });

  // Sort skill gaps by largest gap first
  skillGaps.sort((a, b) => b.gap - a.gap);

  // 3. Generate Next Best Actions
  const recommendations: Recommendation[] = [];

  // Inspect high skill gaps
  const highGaps = skillGaps.filter((g) => g.status === 'High Gap');
  highGaps.slice(0, 2).forEach((g, idx) => {
    recommendations.push({
      id: `rec-gap-${idx}`,
      title: `Improve ${g.skillName}`,
      priority: 'High',
      category: g.category,
      reason: `Current ${g.skillName} proficiency (${g.currentLevel}%) is below the expected level (${g.requiredLevel}%) for a ${activeGoal.title}.`,
      action: `Practice core concepts of ${g.skillName}, complete dedicated tutorials, and build a hands-on project demonstrating this capability.`,
    });
  });

  // Check DSA
  if (dsaAvg < 70 && !recommendations.some((r) => r.title.includes('Data Structures'))) {
    recommendations.push({
      id: 'rec-dsa',
      title: 'Improve Data Structures & Algorithms',
      priority: 'High',
      category: 'Data Structures',
      reason: `Current DSA proficiency is below the expected benchmark for competitive tech interviews and AI engineering roles.`,
      action: `Practice arrays, strings, searching, sorting, recursion, and basic problem solving on LeetCode or GeeksforGeeks.`,
    });
  }

  // Check Deep Learning / CNN
  const cnnSkill = skills.find((s) => s.name.toLowerCase().includes('cnn'));
  if (cnnSkill && cnnSkill.numericScore < 65) {
    recommendations.push({
      id: 'rec-cnn',
      title: 'Advance Deep Learning & CNN Knowledge',
      priority: 'Medium',
      category: 'AI/ML',
      reason: `Neural network fundamentals and CNN architectures are critical core requirements for an AI/ML Engineer.`,
      action: `Learn PyTorch or TensorFlow basics, build an image classification project using CNNs, and document the accuracy metrics.`,
    });
  }

  // Check Deployment
  recommendations.push({
    id: 'rec-deploy',
    title: 'Deploy an ML Model or Web Application',
    priority: 'Medium',
    category: 'Projects',
    reason: `Live deployment demonstrates end-to-end software delivery and real-world project readiness.`,
    action: `Package a Python ML model with FastAPI or Flask and deploy it on Vercel or Render with a web frontend interface.`,
  });

  // Check GitHub & Profile Links
  if (!profile.gitHub || profile.gitHub.trim() === '') {
    recommendations.push({
      id: 'rec-github',
      title: 'Add GitHub Profile Link to Twin',
      priority: 'Medium',
      category: 'GitHub',
      reason: `Recruiters and AI lead engineers evaluate source code quality through GitHub activity and open-source contributions.`,
      action: `Upload your C++ store POS and ATM management repositories to GitHub and link your profile in Student Digital Twin settings.`,
    });
  }

  if (!profile.linkedIn || profile.linkedIn.trim() === '') {
    recommendations.push({
      id: 'rec-linkedin',
      title: 'Add LinkedIn Profile Link',
      priority: 'Low',
      category: 'Career Preparation',
      reason: `Professional networking on LinkedIn enhances visibility to tech recruiters and academic peers.`,
      action: `Add your LinkedIn URL in the My Profile tab to increase your Career Preparation score.`,
    });
  }

  return {
    overallScore,
    categoryScores,
    skillGaps,
    recommendations,
  };
}
