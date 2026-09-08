export const skills = [
  { name: "React", level: 88 },
  { name: "Python", level: 82 },
  { name: "Data Structures", level: 76 },
  { name: "System Design", level: 58 },
  { name: "SQL", level: 71 },
  { name: "Machine Learning", level: 64 },
];

export const recommendedSkills = [
  { name: "Kubernetes", reason: "Trending in 64% of DevOps internships" },
  { name: "TypeScript", reason: "Required by 8 of your eligible companies" },
  { name: "LangChain", reason: "High-growth AI engineering skill" },
  { name: "GraphQL", reason: "Complements your React expertise" },
];

export const recommendedProjects = [
  { title: "AI Resume Critique Bot", stack: ["Next.js", "OpenAI", "Postgres"], difficulty: "Intermediate" },
  { title: "Real-time Collaboration Whiteboard", stack: ["React", "WebRTC", "Yjs"], difficulty: "Advanced" },
  { title: "Personal Finance Dashboard", stack: ["Vue", "FastAPI", "Chart.js"], difficulty: "Beginner" },
];

export const eligibleCompanies = [
  { name: "Google", role: "SWE Intern", match: 92, ctc: "₹28 LPA" },
  { name: "Microsoft", role: "PM Intern", match: 86, ctc: "₹24 LPA" },
  { name: "Stripe", role: "Backend Engineer", match: 81, ctc: "₹32 LPA" },
  { name: "Figma", role: "Frontend Engineer", match: 79, ctc: "₹26 LPA" },
  { name: "Linear", role: "Product Engineer", match: 74, ctc: "₹22 LPA" },
];

export const internships = [
  { title: "ML Research Intern", company: "OpenAI", location: "Remote", stipend: "$8000/mo", tags: ["ML", "Research"] },
  { title: "Frontend Intern", company: "Vercel", location: "Remote", stipend: "$5500/mo", tags: ["React", "Next.js"] },
  { title: "Data Engineering Intern", company: "Snowflake", location: "Bangalore", stipend: "₹1.2L/mo", tags: ["Python", "SQL"] },
  { title: "Mobile Intern", company: "Razorpay", location: "Hybrid", stipend: "₹80k/mo", tags: ["Flutter"] },
];

export const hackathons = [
  { name: "Smart India Hackathon", date: "Dec 14", prize: "₹1L", mode: "Offline" },
  { name: "HackMIT", date: "Sep 20", prize: "$10k", mode: "Hybrid" },
  { name: "Devfolio AI Jam", date: "Aug 10", prize: "$5k", mode: "Online" },
];

export const competitions = [
  { name: "Google Code Jam", category: "Algorithms", deadline: "Mar 22" },
  { name: "Kaggle Titanic Plus", category: "ML", deadline: "Apr 02" },
];

export const scholarships = [
  { name: "Google Generation Scholarship", amount: "$10,000", deadline: "Jul 30" },
  { name: "Reliance Foundation UG", amount: "₹2L/yr", deadline: "Aug 12" },
];

export const research = [
  { lab: "Stanford NLP", topic: "Reasoning in small LMs", advisor: "Dr. Manning" },
  { lab: "IISc Bangalore", topic: "Edge ML for IoT", advisor: "Dr. Mehta" },
];

export const roadmap = [
  { quarter: "Q1 2026", title: "Foundations", milestones: ["Master DSA", "Build 2 portfolio projects"], done: true },
  { quarter: "Q2 2026", title: "Specialization", milestones: ["Pick ML or Web", "Complete 1 paid internship"], done: true },
  { quarter: "Q3 2026", title: "Production", milestones: ["Ship open-source contribution", "Mock 5 interviews"], done: false, active: true },
  { quarter: "Q4 2026", title: "Placement", milestones: ["Apply to 20 companies", "Convert offer"], done: false },
];

export const assignments = [
  { title: "Two Sum & variants", subject: "DSA", due: "Tomorrow", progress: 80, status: "In Progress" },
  { title: "Build CRUD API in FastAPI", subject: "Backend", due: "3 days", progress: 40, status: "In Progress" },
  { title: "Linear Regression from scratch", subject: "ML", due: "Done", progress: 100, status: "Submitted" },
  { title: "System Design: URL Shortener", subject: "System Design", due: "5 days", progress: 10, status: "Not Started" },
];

export const interviewHistory = [
  { type: "Behavioral", score: 86, date: "Jun 18", duration: "32m" },
  { type: "Technical · DSA", score: 78, date: "Jun 14", duration: "45m" },
  { type: "System Design", score: 64, date: "Jun 10", duration: "50m" },
  { type: "HR Round", score: 92, date: "Jun 04", duration: "20m" },
];

export const activities = [
  { text: "Resume scored 87 — added new keywords", time: "2h ago" },
  { text: "Completed Mock Interview: Behavioral", time: "1d ago" },
  { text: "Applied to Stripe Backend Engineer Intern", time: "2d ago" },
  { text: "Earned 'System Design Foundations' badge", time: "4d ago" },
];

export const performanceTrend = [
  { month: "Jan", score: 58, mock: 62 },
  { month: "Feb", score: 63, mock: 65 },
  { month: "Mar", score: 70, mock: 71 },
  { month: "Apr", score: 74, mock: 76 },
  { month: "May", score: 80, mock: 79 },
  { month: "Jun", score: 87, mock: 84 },
];

export const candidates = [
  { name: "Priya Verma", role: "Frontend", match: 94, skills: ["React", "TS", "GraphQL"], cgpa: 9.1, location: "Bangalore" },
  { name: "Rohan Iyer", role: "ML", match: 91, skills: ["Python", "PyTorch", "LLMs"], cgpa: 8.9, location: "Hyderabad" },
  { name: "Sneha Kapoor", role: "Backend", match: 88, skills: ["Go", "K8s", "Postgres"], cgpa: 8.7, location: "Remote" },
  { name: "Arjun Patel", role: "Full Stack", match: 85, skills: ["Node", "React", "AWS"], cgpa: 8.4, location: "Pune" },
  { name: "Meera Nair", role: "Data", match: 83, skills: ["SQL", "Spark", "Airflow"], cgpa: 8.6, location: "Chennai" },
];

export const skillDistribution = [
  { name: "Web", value: 320 },
  { name: "ML/AI", value: 240 },
  { name: "DevOps", value: 110 },
  { name: "Mobile", value: 95 },
  { name: "Data", value: 180 },
];

export const placementStats = [
  { month: "Jan", placed: 24, offers: 31 },
  { month: "Feb", placed: 30, offers: 38 },
  { month: "Mar", placed: 41, offers: 49 },
  { month: "Apr", placed: 52, offers: 64 },
  { month: "May", placed: 60, offers: 72 },
  { month: "Jun", placed: 71, offers: 88 },
];

export const recruiterActivity = [
  { day: "Mon", views: 124, shortlists: 18 },
  { day: "Tue", views: 168, shortlists: 22 },
  { day: "Wed", views: 142, shortlists: 17 },
  { day: "Thu", views: 201, shortlists: 28 },
  { day: "Fri", views: 188, shortlists: 31 },
  { day: "Sat", views: 96, shortlists: 9 },
  { day: "Sun", views: 72, shortlists: 6 },
];

export const sessions = [
  { name: "Fall 2026 Placements", students: 412, recruiters: 38, status: "Active" },
  { name: "Summer Internship Drive", students: 287, recruiters: 22, status: "Active" },
  { name: "Winter 2025 Drive", students: 391, recruiters: 41, status: "Closed" },
];
