import {
  StudentProfile,
  Skill,
  Project,
  Achievement,
  CareerGoal,
  ResumeCheckitem,
  DigitalTwinState,
} from '../types';

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Vangala Sricharan',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering (AI/ML)',
  university: 'Marwadi University',
  year: '2nd Year',
  semester: '4th Semester',
  cgpa: 'Not added',
  careerGoal: 'AI/ML Engineer',
  bio: 'Passionate 2nd-year B.Tech CSE (AI/ML) student at Marwadi University actively engineering software solutions in C++, developing core Machine Learning & Neural Network fundamentals, and working on modern web and DBMS projects.',
  linkedIn: '',
  gitHub: '',
  portfolio: '',
  email: 'vangalasricharan7@gmail.com',
  location: 'Rajkot, Gujarat, India',
  academicFocus: [
    'Artificial Intelligence',
    'Machine Learning',
    'Programming',
    'Web Development',
    'Database Management',
    'Software Development',
  ],
};

export const INITIAL_SKILLS: Skill[] = [
  // Programming
  { id: 'sk-1', name: 'C', category: 'Programming', proficiency: 'Basic', numericScore: 65, notes: 'Pointers, structures, memory management' },
  { id: 'sk-2', name: 'C++', category: 'Programming', proficiency: 'Intermediate', numericScore: 82, notes: 'STL, OOP, templates, memory optimization' },
  { id: 'sk-3', name: 'Python', category: 'Programming', proficiency: 'Intermediate', numericScore: 75, notes: 'Core Python, scripting, data handling' },

  // Object-Oriented Programming
  { id: 'sk-4', name: 'Classes & Objects', category: 'Programming', proficiency: 'Intermediate', numericScore: 85 },
  { id: 'sk-5', name: 'Constructors & Destructors', category: 'Programming', proficiency: 'Intermediate', numericScore: 82 },
  { id: 'sk-6', name: 'File Handling in C++', category: 'Programming', proficiency: 'Intermediate', numericScore: 80, notes: 'fstream, binary logs, persistent records' },
  { id: 'sk-7', name: 'Exception Handling', category: 'Programming', proficiency: 'Basic', numericScore: 68 },
  { id: 'sk-8', name: 'OOP Concepts (Inheritance, Polymorphism, Abstraction)', category: 'Programming', proficiency: 'Intermediate', numericScore: 83 },

  // Web Development
  { id: 'sk-9', name: 'HTML5', category: 'Web Development', proficiency: 'Basic', numericScore: 72 },
  { id: 'sk-10', name: 'CSS3', category: 'Web Development', proficiency: 'Basic', numericScore: 68 },
  { id: 'sk-11', name: 'Basic JavaScript', category: 'Web Development', proficiency: 'Basic', numericScore: 64 },
  { id: 'sk-12', name: 'Responsive Web Development', category: 'Web Development', proficiency: 'Basic', numericScore: 66 },

  // Databases
  { id: 'sk-13', name: 'SQL Querying', category: 'Databases', proficiency: 'Basic', numericScore: 68 },
  { id: 'sk-14', name: 'DBMS Fundamentals', category: 'Databases', proficiency: 'Intermediate', numericScore: 74, notes: 'Relational schemas, normalization, ER diagrams' },

  // AI / ML
  { id: 'sk-15', name: 'Python for AI/ML', category: 'AI/ML', proficiency: 'Basic', numericScore: 70, notes: 'NumPy, Pandas, Matplotlib Basics' },
  { id: 'sk-16', name: 'Machine Learning Fundamentals', category: 'AI/ML', proficiency: 'Basic', numericScore: 62, notes: 'Supervised vs Unsupervised learning, regression models' },
  { id: 'sk-17', name: 'CNN Fundamentals', category: 'AI/ML', proficiency: 'Beginner', numericScore: 48, notes: 'Convolutional neural networks architecture' },

  // Data Structures & Algorithms
  { id: 'sk-18', name: 'Arrays & Strings', category: 'Data Structures', proficiency: 'Intermediate', numericScore: 76 },
  { id: 'sk-19', name: 'Searching & Sorting Algorithms', category: 'Data Structures', proficiency: 'Intermediate', numericScore: 72 },
  { id: 'sk-20', name: 'Linked Lists & Stacks', category: 'Data Structures', proficiency: 'Basic', numericScore: 65 },

  // Developer Tools
  { id: 'sk-21', name: 'Git', category: 'Tools', proficiency: 'Basic', numericScore: 68 },
  { id: 'sk-22', name: 'GitHub', category: 'Tools', proficiency: 'Basic', numericScore: 68 },
  { id: 'sk-23', name: 'VS Code', category: 'Tools', proficiency: 'Intermediate', numericScore: 88 },
  { id: 'sk-24', name: 'GitHub Desktop', category: 'Tools', proficiency: 'Basic', numericScore: 72 },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'C++ Store / POS System',
    description: 'A comprehensive C++ Point of Sale system implementing custom billing engines, item inventory management, and persistent record filing.',
    technologies: ['C++', 'OOP', 'File Handling'],
    skills: ['OOP Concepts', 'Classes & Objects', 'Arrays', 'Billing Logic', 'Inventory Management', 'File Stream I/O'],
    status: 'Completed',
    difficulty: 'Intermediate',
    completionDate: '2025-11-15',
  },
  {
    id: 'proj-2',
    name: 'Restaurant POS System',
    description: 'A dynamic restaurant order & billing software built with C++, featured menu item customization, GST calculation, and structured invoice filing.',
    technologies: ['C++', 'OOP', 'File Stream'],
    skills: ['Menu Management', 'GST Calculation', 'File Handling', 'Input Validation', 'Structured Billing'],
    status: 'Completed',
    difficulty: 'Intermediate',
    completionDate: '2025-12-20',
  },
  {
    id: 'proj-3',
    name: 'ATM Management System',
    description: 'An interactive CLI application simulating secure banking operations including account authentication, PIN management, balance queries, and transaction histories.',
    technologies: ['C++', 'Object-Oriented Programming'],
    skills: ['Account Security', 'PIN Encryption Simulation', 'Transactions Log', 'File Streams', 'Academic Project'],
    status: 'Completed',
    difficulty: 'Intermediate',
    completionDate: '2026-02-10',
  },
  {
    id: 'proj-4',
    name: 'Employee Payroll System',
    description: 'A modular C++ OOP project calculating employee salary structures, tax deductions, attendance logs, and automated pay-slip generation.',
    technologies: ['C++', 'Classes & Objects'],
    skills: ['Employee Management', 'Menu-driven Interface', 'File Handling', 'Salary Computations'],
    status: 'Completed',
    difficulty: 'Intermediate',
    completionDate: '2026-04-05',
  },
  {
    id: 'proj-5',
    name: 'Student & Library Management Systems',
    description: 'Academic database & record management utilities created in C++ for tracking book issuances, student attendance records, and grade reporting.',
    technologies: ['C++', 'DBMS Concepts', 'File Handling'],
    skills: ['Record Filing', 'Data Retrieval', 'Menu Systems', 'Academic Experience'],
    status: 'Completed',
    difficulty: 'Intermediate',
    completionDate: '2026-05-18',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'AI Sparks \'26',
    organization: 'Marwadi University',
    date: 'August 2026',
    type: 'Event',
    description: 'Participated in the premier AI & Technology summit at Marwadi University focusing on cutting-edge Machine Learning and AI advancements.',
  },
  {
    id: 'ach-2',
    title: 'Prompt Wars',
    organization: 'Marwadi University (AI, ML & DS Dept)',
    date: 'March 2026',
    type: 'Competition',
    description: 'Competed in Prompt Wars, an intensive AI prompt engineering & LLM strategy competition evaluating contextual query design and problem solving.',
  },
  {
    id: 'ach-3',
    title: 'Decode Labs',
    organization: 'Decode Labs Tech Community',
    date: '2026',
    type: 'Workshop',
    description: 'Participated in technical development sessions & project building exercises focused on software architecture and developer workflows.',
  },
];

export const CAREER_GOAL_PRESETS: CareerGoal[] = [
  {
    id: 'cg-aiml',
    title: 'AI/ML Engineer',
    description: 'Design, train, deploy, and optimize Machine Learning models, Neural Networks, and AI systems for real-world software applications.',
    targetSkills: {
      'Python': 90,
      'Python for AI/ML': 88,
      'Machine Learning Fundamentals': 85,
      'CNN Fundamentals': 80,
      'Mathematics / Statistics': 80,
      'Data Structures & Algorithms': 80,
      'SQL Querying': 78,
      'Git & GitHub': 82,
      'C++': 75,
      'Model Deployment': 75,
      'Problem Solving': 85,
    },
    recommendedCourses: [
      'Machine Learning Specialization by Andrew Ng',
      'Deep Learning & Convolutional Neural Networks (CNNs)',
      'FastAPI & PyTorch Model Deployment',
      'Data Structures and Algorithms in C++ / Python',
    ],
  },
  {
    id: 'cg-swe',
    title: 'Software Engineer',
    description: 'Build scalable, reliable, and high-performance software systems and application architectures.',
    targetSkills: {
      'C++': 88,
      'Python': 85,
      'OOP Concepts (Inheritance, Polymorphism, Abstraction)': 90,
      'Data Structures & Algorithms': 88,
      'DBMS Fundamentals': 82,
      'Git': 85,
      'GitHub': 85,
      'Software Engineering Principles': 80,
    },
    recommendedCourses: [
      'Advanced Data Structures & Algorithms Mastery',
      'System Design Fundamentals',
      'Database Systems & Query Optimization',
    ],
  },
  {
    id: 'cg-ds',
    title: 'Data Scientist',
    description: 'Extract actionable insights from complex datasets using statistical modeling, data visualization, and predictive analytics.',
    targetSkills: {
      'Python': 92,
      'Python for AI/ML': 90,
      'SQL Querying': 88,
      'Machine Learning Fundamentals': 85,
      'DBMS Fundamentals': 82,
      'Mathematics / Statistics': 85,
    },
  },
  {
    id: 'cg-da',
    title: 'Data Analyst',
    description: 'Analyze business metrics, build interactive dashboards, and drive decision making with SQL and BI tools.',
    targetSkills: {
      'SQL Querying': 90,
      'DBMS Fundamentals': 85,
      'Python': 78,
      'Basic JavaScript': 65,
      'HTML5': 70,
    },
  },
  {
    id: 'cg-webdev',
    title: 'Web Developer',
    description: 'Develop responsive, high-performance web applications using modern frontend frameworks and backend databases.',
    targetSkills: {
      'HTML5': 92,
      'CSS3': 88,
      'Basic JavaScript': 88,
      'Responsive Web Development': 90,
      'SQL Querying': 80,
      'Git': 85,
    },
  },
  {
    id: 'cg-cyber',
    title: 'Cybersecurity Engineer',
    description: 'Secure software applications, analyze network traffic, and safeguard systems against cyber threats.',
    targetSkills: {
      'C++': 85,
      'Python': 82,
      'File Handling in C++': 85,
      'Git': 80,
    },
  },
  {
    id: 'cg-entrepreneur',
    title: 'Entrepreneur / Founder',
    description: 'Build innovative products from scratch, combine technical capabilities with strategic product leadership.',
    targetSkills: {
      'Python': 80,
      'C++': 80,
      'Responsive Web Development': 80,
      'Git & GitHub': 80,
    },
  },
];

export const INITIAL_RESUME_CHECKLIST: ResumeCheckitem[] = [
  { id: 'res-1', label: 'Full Name & Contact Information (Email, Phone, Location)', category: 'Profile', checked: true },
  { id: 'res-2', label: 'University, Degree (B.Tech CSE AI/ML) & Graduation Year', category: 'Education', checked: true },
  { id: 'res-3', label: 'C++ OOP & POS Systems Projects listed with detailed tech stacks', category: 'Projects', checked: true },
  { id: 'res-4', label: 'Programming Skills (C, C++, Python, OOP) highlighted', category: 'Skills', checked: true },
  { id: 'res-5', label: 'AI/ML & CNN Foundations specified', category: 'Skills', checked: true },
  { id: 'res-6', label: 'AI Sparks \'26 & Prompt Wars participations documented', category: 'Achievements', checked: true },
  { id: 'res-7', label: 'GitHub Profile Link added to header', category: 'Links', checked: false },
  { id: 'res-8', label: 'LinkedIn Profile Link added to header', category: 'Links', checked: false },
  { id: 'res-9', label: 'Deployed ML Model / Web Project URL included', category: 'Projects', checked: false },
  { id: 'res-10', label: 'Data Structures & Competitive Programming handles linked', category: 'Profiles', checked: false },
];

export const INITIAL_TASKS = [
  { id: 'task-1', title: 'Solve 5 Data Structures & Algorithms problems in C++', category: 'Data Structures', priority: 'High' as const, dueDate: '2026-08-15', completed: true, notes: 'Arrays and String manipulation' },
  { id: 'task-2', title: 'Complete Convolutional Neural Network (CNN) tutorial', category: 'AI/ML', priority: 'High' as const, dueDate: '2026-08-18', completed: false, notes: 'Focus on PyTorch / TensorFlow basics' },
  { id: 'task-3', title: 'Upload C++ POS projects to GitHub with README.md', category: 'GitHub', priority: 'Medium' as const, dueDate: '2026-08-20', completed: false, notes: 'Add screenshots and execution instructions' },
  { id: 'task-4', title: 'Practice 10 SQL queries on Join and Aggregations', category: 'Databases', priority: 'Medium' as const, dueDate: '2026-08-22', completed: false, notes: 'Subqueries and Group By' },
];

export const INITIAL_STATE: DigitalTwinState = {
  profile: INITIAL_PROFILE,
  skills: INITIAL_SKILLS,
  projects: INITIAL_PROJECTS,
  achievements: INITIAL_ACHIEVEMENTS,
  activeCareerGoalId: 'cg-aiml',
  careerGoals: CAREER_GOAL_PRESETS,
  progressHistory: [
    {
      id: 'snap-1',
      date: '2026-06-01',
      overallScore: 62,
      categoryScores: {
        Programming: 72,
        DSA: 58,
        'AI/ML': 48,
        Projects: 70,
        GitHub: 50,
        Certifications: 60,
        Resume: 50,
        'Career Preparation': 65,
      },
      note: 'Baseline snapshot upon entering 2nd Year B.Tech CSE (AI/ML).',
    },
    {
      id: 'snap-2',
      date: '2026-07-15',
      overallScore: 68,
      categoryScores: {
        Programming: 78,
        DSA: 65,
        'AI/ML': 58,
        Projects: 76,
        GitHub: 55,
        Certifications: 68,
        Resume: 60,
        'Career Preparation': 70,
      },
      note: 'Completed C++ Restaurant POS system and Prompt Wars participation.',
    },
  ],
  resumeChecklist: INITIAL_RESUME_CHECKLIST,
  customRecommendations: [],
  tasks: INITIAL_TASKS,
};

