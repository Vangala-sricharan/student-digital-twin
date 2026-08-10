export type LanguageCode = 'en' | 'hi' | 'te' | 'gu';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Brand & Tagline
    app_title: 'Student Digital Twin',
    app_subtitle: 'Know where you are. Know where you are going. Know what to do next.',
    demo_student_name: 'Vangala Sricharan',
    
    // Navigation Groups
    nav_main: 'Main OS',
    nav_ai_os: 'AI Career OS',
    nav_readiness: 'Career & Readiness',
    nav_system: 'System & Plan',

    // Navigation Pages
    nav_dashboard: 'Dashboard',
    nav_profile: 'My Profile',
    nav_skills: 'Skills Matrix',
    nav_projects: 'Projects',
    nav_achievements: 'Achievements',
    nav_goals: 'Career Goals',
    nav_progress: 'Progress Analytics',
    nav_assistant: 'AI Career Assistant',
    nav_resume_analyzer: 'Resume Analyzer',
    nav_syllabus_analyzer: 'Syllabus Analyzer',
    nav_project_analyzer: 'Project Analyzer',
    nav_ai_roadmap: 'AI Roadmap',
    nav_internship: 'Internship Readiness',
    nav_simulator: 'Career Simulator',
    nav_github: 'GitHub Readiness',
    nav_upgrade: 'Upgrade to Pro',
    nav_settings: 'Settings',

    // Subscription & Plan
    plan_free: 'Free Plan',
    plan_pro: 'Pro Plan',
    plan_pro_annual: 'Pro Annual',
    plan_badge_free: 'FREE',
    plan_badge_pro: 'PRO',
    upgrade_cta: 'Upgrade to Pro',
    demo_mode_active: 'Demo Mode Active',
    pro_unlocked: 'Pro Features Unlocked',
    unlock_pro_title: 'Pro AI Feature',
    unlock_pro_desc: 'Upgrade to Student Digital Twin Pro to unlock this advanced AI system.',

    // Common UI
    loading: 'Processing...',
    analyze: 'Analyze Now',
    submit: 'Submit',
    reset: 'Reset',
    cancel: 'Cancel',
    save: 'Save Changes',
    export_json: 'Export JSON',
    import_json: 'Import JSON',
    clear_data: 'Clear All Data',
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    language: 'Language',
    
    // Dashboard V2
    ai_insight_title: 'AI Career Insight',
    internship_readiness_title: 'Internship Readiness',
    ai_next_step_title: 'Recommended Next Step',
    readiness_score: 'Overall Readiness',
    category_scores: 'Category Breakdown',

    // Pricing
    price_free: '₹0',
    price_pro_monthly: '₹499',
    price_pro_annual: '₹3,999',
    per_month: '/month',
    per_year: '/year',
    save_annual: 'Save 33% annually',

    // AI Assistant
    ai_assistant_title: 'AI Career Assistant',
    ai_assistant_subtitle: 'Ask personalized career, skill, or roadmapping questions backed by your Digital Twin data.',
    ai_ask_placeholder: 'Ask your AI career assistant (e.g., "Am I ready for an AI/ML internship?")...',

    // Resume Analyzer
    resume_analyzer_title: 'AI Resume Analyzer',
    resume_analyzer_subtitle: 'Evaluate your resume completeness, keyword alignment, and career readiness score.',
    
    // Syllabus Analyzer
    syllabus_analyzer_title: 'AI Syllabus Analyzer',
    syllabus_analyzer_subtitle: 'Convert your course syllabus into a personalized day-by-day study roadmap.',

    // Project Analyzer
    project_analyzer_title: 'AI Project Analyzer',
    project_analyzer_subtitle: 'Analyze project depth, technical skills demonstrated, and resume impact.',

    // Internship Readiness
    internship_title: 'Internship Readiness Score',
    internship_blocking: "What's Blocking You?",
    internship_boosters: 'Score Booster Actions',

    // Career Simulator
    simulator_title: 'Career What-If Simulator',
    simulator_subtitle: 'Simulate skill improvements and project additions to see projected readiness score.',
    projected_score: 'Projected Readiness',
    simulator_disclaimer: 'Projected score based on your selected improvements.',
  },

  hi: {
    app_title: 'स्टूडेंट डिजिटल ट्विन',
    app_subtitle: 'जानें कि आप कहाँ हैं। जानें कि आप कहाँ जा रहे हैं। जानें कि आगे क्या करना है।',
    demo_student_name: 'वंगला श्रीचरण',
    
    nav_main: 'मुख्य ओएस',
    nav_ai_os: 'एआई करियर ओएस',
    nav_readiness: 'करियर और तैयारी',
    nav_system: 'सिस्टम और प्लान',

    nav_dashboard: 'डैशबोर्ड',
    nav_profile: 'मेरी प्रोफाइल',
    nav_skills: 'स्किल मैट्रिक्स',
    nav_projects: 'प्रोजेक्ट्स',
    nav_achievements: 'उपलब्धियां',
    nav_goals: 'करियर लक्ष्य',
    nav_progress: 'प्रगति विश्लेषण',
    nav_assistant: 'एआई करियर सहायक',
    nav_resume_analyzer: 'रेज्यूमे विश्लेषक',
    nav_syllabus_analyzer: 'सिलेबस विश्लेषक',
    nav_project_analyzer: 'प्रोजेक्ट विश्लेषक',
    nav_ai_roadmap: 'एआई रोडमैप',
    nav_internship: 'इंटर्नशिप तैयारी',
    nav_simulator: 'करियर सिमुलेटर',
    nav_github: 'गिटहब तैयारी',
    nav_upgrade: 'प्रो में अपग्रेड करें',
    nav_settings: 'सेटिंग्स',

    plan_free: 'फ्री प्लान',
    plan_pro: 'प्रो प्लान',
    plan_pro_annual: 'प्रो वार्षिक',
    plan_badge_free: 'फ्री',
    plan_badge_pro: 'प्रो',
    upgrade_cta: 'प्रो में अपग्रेड करें',
    demo_mode_active: 'डेमो मोड सक्रिय',
    pro_unlocked: 'प्रो फीचर्स अनलॉक',
    unlock_pro_title: 'प्रो एआई फीचर',
    unlock_pro_desc: 'इस उन्नत एआई सिस्टम को अनलॉक करने के लिए स्टूडेंट डिजिटल ट्विन प्रो में अपग्रेड करें।',

    loading: 'प्रोसेसिंग...',
    analyze: 'अभी विश्लेषण करें',
    submit: 'सबमिट करें',
    reset: 'रीसेट करें',
    cancel: 'रद्द करें',
    save: 'बदलाव सहेजें',
    export_json: 'JSON एक्सपोर्ट करें',
    import_json: 'JSON इम्पोर्ट करें',
    clear_data: 'सभी डेटा साफ़ करें',
    dark_mode: 'डार्क मोड',
    light_mode: 'लाइट मोड',
    language: 'भाषा',
    
    ai_insight_title: 'एआई करियर इनसाइट',
    internship_readiness_title: 'इंटर्नशिप तैयारी',
    ai_next_step_title: 'अनुशंसित अगला कदम',
    readiness_score: 'कुल तैयारी',
    category_scores: 'श्रेणी विवरण',

    price_free: '₹0',
    price_pro_monthly: '₹499',
    price_pro_annual: '₹3,999',
    per_month: '/माह',
    per_year: '/वर्ष',
    save_annual: 'वार्षिक 33% बचाएं',

    ai_assistant_title: 'एआई करियर सहायक',
    ai_assistant_subtitle: 'अपने डिजिटल ट्विन डेटा द्वारा समर्थित करियर या स्किल के सवाल पूछें।',
    ai_ask_placeholder: 'अपने एआई करियर सहायक से पूछें (उदा. "क्या मैं एआई/एमएल इंटर्नशिप के लिए तैयार हूं?")...',

    resume_analyzer_title: 'एआई रेज्यूमे विश्लेषक',
    resume_analyzer_subtitle: 'अपने रेज्यूमे की पूर्णता और करियर स्कोर का मूल्यांकन करें।',

    syllabus_analyzer_title: 'एआई सिलेबस विश्लेषक',
    syllabus_analyzer_subtitle: 'अपने कोर्स सिलेबस को दिन-प्रतिदिन के अध्ययन रोडमैप में बदलें।',

    project_analyzer_title: 'एआई प्रोजेक्ट विश्लेषक',
    project_analyzer_subtitle: 'प्रोजेक्ट की गहराई और रेज्यूमे प्रभाव का मूल्यांकन करें।',

    internship_title: 'इंटर्नशिप तैयारी स्कोर',
    internship_blocking: 'आपको क्या रोक रहा है?',
    internship_boosters: 'स्कोर बढ़ाने वाले कदम',

    simulator_title: 'करियर सिमुलेटर',
    simulator_subtitle: 'अनुमानित तैयारी स्कोर देखने के लिए कौशल में सुधार का सिमुलेशन करें।',
    projected_score: 'अनुमानित तैयारी',
    simulator_disclaimer: 'आपके द्वारा चुने गए सुधारों पर आधारित अनुमानित स्कोर।',
  },

  te: {
    app_title: 'స్టూడెంట్ డిజిటల్ ట్విన్',
    app_subtitle: 'మీరు ఎక్కడ ఉన్నారో తెలుసుకోండి. ఎక్కడికి వెళ్లాలో తెలుసుకోండి. తర్వాత ఏమి చేయాలో తెలుసుకోండి.',
    demo_student_name: 'వంగల శ్రీచరణ్',
    
    nav_main: 'ప్రధాన OS',
    nav_ai_os: 'AI కెరీర్ OS',
    nav_readiness: 'కెరీర్ & సిద్ధత',
    nav_system: 'సిస్టమ్ & ప్లాన్',

    nav_dashboard: 'డాష్‌బోర్డ్',
    nav_profile: 'నా ప్రొఫైల్',
    nav_skills: 'స్కిల్స్ మ్యాట్రిక్స్',
    nav_projects: 'ప్రాజెక్ట్‌లు',
    nav_achievements: 'సాధనలు',
    nav_goals: 'కెరీర్ లక్ష్యాలు',
    nav_progress: 'పురోగతి విశ్లేషణ',
    nav_assistant: 'AI కెరీర్ అసిస్టెంట్',
    nav_resume_analyzer: 'రెజ్యూమ్ విశ్లేషకుడు',
    nav_syllabus_analyzer: 'సిలబస్ విశ్లేషకుడు',
    nav_project_analyzer: 'ప్రాజెక్ట్ విశ్లేషకుడు',
    nav_ai_roadmap: 'AI రోడ్‌మ్యాప్',
    nav_internship: 'ఇంటర్న్‌షిప్ సిద్ధత',
    nav_simulator: 'కెరీర్ సిమ్యులేటర్',
    nav_github: 'GitHub సిద్ధత',
    nav_upgrade: 'Pro కి అప్‌గ్రేడ్ చేయండి',
    nav_settings: 'సెట్టింగ్‌లు',

    plan_free: 'ఉచిత ప్లాన్',
    plan_pro: 'Pro ప్లాన్',
    plan_pro_annual: 'Pro వార్షిక',
    plan_badge_free: 'FREE',
    plan_badge_pro: 'PRO',
    upgrade_cta: 'Pro కి అప్‌గ్రేడ్ చేయండి',
    demo_mode_active: 'డెమో మోడ్ యాక్టివ్',
    pro_unlocked: 'Pro ఫీచర్లు అన్‌లాక్ అయ్యాయి',
    unlock_pro_title: 'Pro AI ఫీచర్',
    unlock_pro_desc: 'ఈ AI సిస్టమ్‌ను అన్‌లాక్ చేయడానికి స్టూడెంట్ డిజిటల్ ట్విన్ Pro కి అప్‌గ్రేడ్ చేయండి.',

    loading: 'ప్రాసెస్ అవుతోంది...',
    analyze: 'ఇప్పుడే విశ్లేషించండి',
    submit: 'సబ్‌మిట్ చేయండి',
    reset: 'రీసెట్ చేయండి',
    cancel: 'రద్దు చేయండి',
    save: 'మార్పులను సేవ్ చేయండి',
    export_json: 'JSON ఎగుమతి చేయండి',
    import_json: 'JSON దిగుమతి చేయండి',
    clear_data: 'డేటాను క్లియర్ చేయండి',
    dark_mode: 'డార్క్ మోడ్',
    light_mode: 'లైట్ మోడ్',
    language: 'భాష',
    
    ai_insight_title: 'AI కెరీర్ ఇన్‌సైట్',
    internship_readiness_title: 'ఇంటర్న్‌షిప్ సిద్ధత',
    ai_next_step_title: 'సిఫార్సు చేసిన తదుపరి చర్య',
    readiness_score: 'మొత్తం సిద్ధత',
    category_scores: 'వర్గాల వివరాలు',

    price_free: '₹0',
    price_pro_monthly: '₹499',
    price_pro_annual: '₹3,999',
    per_month: '/నెల',
    per_year: '/సంవత్సరం',
    save_annual: 'సంవత్సరానికి 33% ఆదా చేయండి',

    ai_assistant_title: 'AI కెరీర్ అసిస్టెంట్',
    ai_assistant_subtitle: 'మీ డిజిటల్ ట్విన్ డేటా ఆధారంగా కెరీర్ ప్రశ్నలు అడగండి.',
    ai_ask_placeholder: 'మీ AI కెరీర్ అసిస్టెంట్‌ని అడగండి (ఉదా. "నేను AI/ML ఇంటర్న్‌షిప్‌కు సిద్ధంగా ఉన్నానా?")...',

    resume_analyzer_title: 'AI రెజ్యూమ్ విశ్లేషకుడు',
    resume_analyzer_subtitle: 'మీ రెజ్యూమ్ పరిపూర్ణత మరియు స్కోర్‌ను అంచనా వేయండి.',

    syllabus_analyzer_title: 'AI సిలబస్ విశ్లేషకుడు',
    syllabus_analyzer_subtitle: 'మీ కోర్సు సిలబస్‌ను రోజువారీ స్టడీ రోడ్‌మ్యాప్‌గా మార్చండి.',

    project_analyzer_title: 'AI ప్రాజెక్ట్ విశ్లేషకుడు',
    project_analyzer_subtitle: 'ప్రాజెక్ట్ లోతు మరియు సాంకేతిక నైపుణ్యాలను అంచనా వేయండి.',

    internship_title: 'ఇంటర్న్‌షిప్ సిద్ధత స్కోరు',
    internship_blocking: 'మిమ్మల్ని నిరోధిస్తున్నది ఏమిటి?',
    internship_boosters: 'స్కోర్ పెంచే చర్యలు',

    simulator_title: 'కెరీర్ సిమ్యులేటర్',
    simulator_subtitle: 'అంచనా వేసిన స్కోర్‌ను చూడటానికి నైపుణ్యాల మెరుగుదలలను సిమ్యులేట్ చేయండి.',
    projected_score: 'అంచనా వేసిన సిద్ధత',
    simulator_disclaimer: 'మీరు ఎంచుకున్న మెరుగుదలల ఆధారంగా అంచనా వేసిన స్కోరు.',
  },

  gu: {
    app_title: 'સ્ટુડન્ટ ડિજિટલ ટ્વિન',
    app_subtitle: 'જાણો તમે ક્યાં છો. જાણો તમે ક્યાં જઈ રહ્યા છો. જાણો આગળ શું કરવું.',
    demo_student_name: 'વંગલા શ્રીચરણ',
    
    nav_main: 'મુખ્ય OS',
    nav_ai_os: 'AI કરિયર OS',
    nav_readiness: 'કરિયર અને તૈયારી',
    nav_system: 'સિસ્ટમ અને પ્લાન',

    nav_dashboard: 'ડેશબોર્ડ',
    nav_profile: 'મારી પ્રોફાઇલ',
    nav_skills: 'સ્કિલ્સ મેટ્રિક્સ',
    nav_projects: 'પ્રોજેક્ટ્સ',
    nav_achievements: 'સિદ્ધિઓ',
    nav_goals: 'કરિયર લક્ષ્યો',
    nav_progress: 'પ્રગતિ વિશ્લેષણ',
    nav_assistant: 'AI કરિયર સહાયક',
    nav_resume_analyzer: 'રેઝ્યૂમે વિશ્લેષક',
    nav_syllabus_analyzer: 'સિલેબસ વિશ્લેષક',
    nav_project_analyzer: 'પ્રોજેક્ટ વિશ્લેષક',
    nav_ai_roadmap: 'AI રોડમેપ',
    nav_internship: 'ઇન્ટર્નશિપ તૈયારી',
    nav_simulator: 'કરિયર સિમ્યુલેટર',
    nav_github: 'GitHub તૈયારી',
    nav_upgrade: 'Pro માં અપગ્રેડ કરો',
    nav_settings: 'સેટિંગ્સ',

    plan_free: 'ફ્રી પ્લાન',
    plan_pro: 'Pro પ્લાન',
    plan_pro_annual: 'Pro વાર્ષિક',
    plan_badge_free: 'FREE',
    plan_badge_pro: 'PRO',
    upgrade_cta: 'Pro માં અપગ્રેડ કરો',
    demo_mode_active: 'ડેમો મોડ સક્રિય',
    pro_unlocked: 'Pro ફીચર્સ અનલૉક',
    unlock_pro_title: 'Pro AI ફીચર',
    unlock_pro_desc: 'આ એડવાન્સ્ડ AI સિસ્ટમને અનલૉક કરવા માટે પ્રોમાં અપગ્રેડ કરો.',

    loading: 'પ્રોસેસિંગ...',
    analyze: 'હમણાં વિશ્લેષણ કરો',
    submit: 'સબમિટ કરો',
    reset: 'રીસેટ કરો',
    cancel: 'રદ કરો',
    save: 'ફેરફારો સાચવો',
    export_json: 'JSON નિકાસ કરો',
    import_json: 'JSON આયાત કરો',
    clear_data: 'બધો ડેટા સાફ કરો',
    dark_mode: 'ડાર્ક મોડ',
    light_mode: 'લાઇટ મોડ',
    language: 'ભાષા',
    
    ai_insight_title: 'AI કરિયર ઇનસાઇટ',
    internship_readiness_title: 'ઇન્ટર્નશિપ તૈયારી',
    ai_next_step_title: 'ભલામણ કરેલ આગળનું પગલું',
    readiness_score: 'કુલ તૈયારી',
    category_scores: 'કેટેગરી વિગતો',

    price_free: '₹0',
    price_pro_monthly: '₹499',
    price_pro_annual: '₹3,999',
    per_month: '/મહિનો',
    per_year: '/વર્ષ',
    save_annual: 'વાર્ષિક 33% બચાવો',

    ai_assistant_title: 'AI કરિયર સહાયક',
    ai_assistant_subtitle: 'તમારા ડિજિટલ ટ્વિન ડેટાના આધારે કરિયર પ્રશ્નો પૂછો.',
    ai_ask_placeholder: 'તમારા AI કરિયર સહાયકને પૂછો (દા.ત. "શું હું AI/ML ઇન્ટર્નશિપ માટે તૈયાર છું?")...',

    resume_analyzer_title: 'AI રેઝ્યૂમે વિશ્લેષક',
    resume_analyzer_subtitle: 'તમારા રેઝ્યૂમેની પૂર્ણતા અને સ્કોરનું મૂલ્યાંકન કરો.',

    syllabus_analyzer_title: 'AI સિલેબસ વિશ્લેષક',
    syllabus_analyzer_subtitle: 'તમારા અભ્યાસક્રમને દૈનિક અભ્યાસ રોડમેપમાં બદલો.',

    project_analyzer_title: 'AI પ્રોજેક્ટ વિશ્લેષક',
    project_analyzer_subtitle: 'પ્રોજેક્ટની ઊંડાણ અને ટેકનિકલ કૌશલ્યોનું મૂલ્યાંકન કરો.',

    internship_title: 'ઇન્ટર્નશિપ તૈયારી સ્કોર',
    internship_blocking: 'તમને શું રોકી રહ્યું છે?',
    internship_boosters: 'સ્કોર વધારતા પગલાં',

    simulator_title: 'કરિયર સિમ્યુલેટર',
    simulator_subtitle: 'અંદાજિત તૈયારી સ્કોર જોવા માટે કૌશલ્ય સુધારણાનું સિમ્યુલેશન કરો.',
    projected_score: 'અંદાજિત તૈયારી',
    simulator_disclaimer: 'તમારા પસંદ કરેલા સુધારા પર આધારિત અંદાજિત સ્કોર.',
  },
};
