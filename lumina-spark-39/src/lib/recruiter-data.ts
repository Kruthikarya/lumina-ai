// Rich mock data for the Recruiter workspace.
import { clearbit } from "./real-data";

export type RichCandidate = {
  id: string;
  name: string;
  initials: string;
  headline: string;
  role: "Frontend" | "Backend" | "Full Stack" | "ML" | "Data" | "Mobile" | "DevOps" | "Design";
  match: number;
  skills: string[];
  cgpa: number;
  university: string;
  universityDomain: string;
  graduationYear: number;
  location: string;
  workMode: "Remote" | "Hybrid" | "Onsite";
  experience: string;
  availability: "Immediate" | "1 month" | "2 months" | "3+ months";
  expectedCtc: string;
  githubStars: number;
  aiSummary: string;
  status: "New" | "Shortlisted" | "Interviewing" | "Offer" | "Rejected";
  lastActive: string;
  photo?: string;
};

export const richCandidates: RichCandidate[] = [
  {
    id: "priya-verma",
    name: "Priya Verma",
    initials: "PV",
    headline: "Frontend Engineer · Next.js + Design Systems",
    role: "Frontend",
    match: 94,
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind"],
    cgpa: 9.1,
    university: "IIT Bombay",
    universityDomain: "iitb.ac.in",
    graduationYear: 2026,
    location: "Bangalore",
    workMode: "Hybrid",
    experience: "2 internships",
    availability: "Immediate",
    expectedCtc: "₹22–28 LPA",
    githubStars: 2400,
    aiSummary: "Production-grade portfolio, 2 paid internships. Strong fit for senior FE intern & new-grad roles.",
    status: "Shortlisted",
    lastActive: "2h ago",
  },
  {
    id: "rohan-iyer",
    name: "Rohan Iyer",
    initials: "RI",
    headline: "ML Engineer · LLM systems & retrieval",
    role: "ML",
    match: 91,
    skills: ["Python", "PyTorch", "LLMs", "LangChain", "FastAPI"],
    cgpa: 8.9,
    university: "IIIT Hyderabad",
    universityDomain: "iiit.ac.in",
    graduationYear: 2026,
    location: "Hyderabad",
    workMode: "Remote",
    experience: "Research + 1 internship",
    availability: "1 month",
    expectedCtc: "₹26–32 LPA",
    githubStars: 810,
    aiSummary: "Published NLP research + shipped an LLM app used by 12K users. Great fit for applied AI roles.",
    status: "Interviewing",
    lastActive: "5h ago",
  },
  {
    id: "sneha-kapoor",
    name: "Sneha Kapoor",
    initials: "SK",
    headline: "Backend Engineer · Go, K8s, distributed systems",
    role: "Backend",
    match: 88,
    skills: ["Go", "Kubernetes", "Postgres", "gRPC", "AWS"],
    cgpa: 8.7,
    university: "BITS Pilani",
    universityDomain: "bits-pilani.ac.in",
    graduationYear: 2026,
    location: "Remote",
    workMode: "Remote",
    experience: "1 internship @ Razorpay",
    availability: "Immediate",
    expectedCtc: "₹24–30 LPA",
    githubStars: 340,
    aiSummary: "Solid systems fundamentals with production K8s exposure. Ready for L3/L4 backend roles.",
    status: "New",
    lastActive: "1d ago",
  },
  {
    id: "arjun-patel",
    name: "Arjun Patel",
    initials: "AP",
    headline: "Full-stack Engineer · Node + React + AWS",
    role: "Full Stack",
    match: 85,
    skills: ["Node.js", "React", "AWS", "MongoDB", "Redis"],
    cgpa: 8.4,
    university: "COEP Pune",
    universityDomain: "coep.org.in",
    graduationYear: 2026,
    location: "Pune",
    workMode: "Onsite",
    experience: "3 freelance products",
    availability: "Immediate",
    expectedCtc: "₹18–22 LPA",
    githubStars: 190,
    aiSummary: "Shipped 3 revenue-generating SaaS products end-to-end. Best fit for early-stage startups.",
    status: "New",
    lastActive: "3h ago",
  },
  {
    id: "meera-nair",
    name: "Meera Nair",
    initials: "MN",
    headline: "Data Engineer · Spark, Airflow, dbt",
    role: "Data",
    match: 83,
    skills: ["SQL", "Spark", "Airflow", "dbt", "Snowflake"],
    cgpa: 8.6,
    university: "NIT Trichy",
    universityDomain: "nitt.edu",
    graduationYear: 2026,
    location: "Chennai",
    workMode: "Hybrid",
    experience: "1 internship @ Swiggy",
    availability: "2 months",
    expectedCtc: "₹18–24 LPA",
    githubStars: 120,
    aiSummary: "Deep data-modeling skills; built pipelines processing 200M+ rows/day at internship.",
    status: "Shortlisted",
    lastActive: "6h ago",
  },
  {
    id: "kabir-shah",
    name: "Kabir Shah",
    initials: "KS",
    headline: "Mobile Engineer · Flutter + native iOS",
    role: "Mobile",
    match: 81,
    skills: ["Flutter", "Swift", "Kotlin", "Firebase"],
    cgpa: 8.2,
    university: "VJTI Mumbai",
    universityDomain: "vjti.ac.in",
    graduationYear: 2026,
    location: "Mumbai",
    workMode: "Hybrid",
    experience: "2 shipped apps · 40K downloads",
    availability: "1 month",
    expectedCtc: "₹16–20 LPA",
    githubStars: 220,
    aiSummary: "Ships polished cross-platform apps with strong UX taste. Great fit for consumer mobile teams.",
    status: "New",
    lastActive: "1d ago",
  },
  {
    id: "ananya-ghosh",
    name: "Ananya Ghosh",
    initials: "AG",
    headline: "Product Designer · design systems + motion",
    role: "Design",
    match: 79,
    skills: ["Figma", "Framer", "Motion", "Prototyping"],
    cgpa: 8.5,
    university: "NID Ahmedabad",
    universityDomain: "nid.edu",
    graduationYear: 2026,
    location: "Ahmedabad",
    workMode: "Remote",
    experience: "Design intern @ Zomato",
    availability: "Immediate",
    expectedCtc: "₹14–18 LPA",
    githubStars: 0,
    aiSummary: "Strong systems thinker with a public design portfolio and 3 case studies.",
    status: "New",
    lastActive: "8h ago",
  },
  {
    id: "vikram-rao",
    name: "Vikram Rao",
    initials: "VR",
    headline: "DevOps Engineer · Terraform + Kubernetes",
    role: "DevOps",
    match: 77,
    skills: ["Terraform", "Kubernetes", "AWS", "GitHub Actions"],
    cgpa: 8.3,
    university: "RVCE Bangalore",
    universityDomain: "rvce.edu.in",
    graduationYear: 2026,
    location: "Bangalore",
    workMode: "Onsite",
    experience: "Cloud intern @ Infosys",
    availability: "2 months",
    expectedCtc: "₹15–19 LPA",
    githubStars: 60,
    aiSummary: "Managed multi-region infra as a solo intern. Solid IaC discipline.",
    status: "New",
    lastActive: "2d ago",
  },
];

export type RichJob = {
  id: string;
  title: string;
  team: string;
  location: string;
  workMode: "Remote" | "Hybrid" | "Onsite";
  type: "Internship" | "Full-time" | "Contract";
  ctc: string;
  postedDays: number;
  applicants: number;
  shortlisted: number;
  interviewing: number;
  offers: number;
  views: number;
  status: "Live" | "Draft" | "Paused" | "Closed";
  skills: string[];
  companyDomain: string;
  companyLogo: string;
};

export const richJobs: RichJob[] = [
  {
    id: "fe-intern",
    title: "Frontend Engineer Intern",
    team: "Web Platform",
    location: "Bangalore",
    workMode: "Hybrid",
    type: "Internship",
    ctc: "₹80k/mo",
    postedDays: 4,
    applicants: 142,
    shortlisted: 18,
    interviewing: 8,
    offers: 2,
    views: 1240,
    status: "Live",
    skills: ["React", "TypeScript", "Next.js"],
    companyDomain: "vercel.com",
    companyLogo: clearbit("vercel.com"),
  },
  {
    id: "ml-intern",
    title: "ML Research Intern",
    team: "Applied AI",
    location: "Remote",
    workMode: "Remote",
    type: "Internship",
    ctc: "$4500/mo",
    postedDays: 7,
    applicants: 88,
    shortlisted: 9,
    interviewing: 4,
    offers: 1,
    views: 720,
    status: "Live",
    skills: ["Python", "PyTorch", "LLMs"],
    companyDomain: "openai.com",
    companyLogo: clearbit("openai.com"),
  },
  {
    id: "be-newgrad",
    title: "Backend SDE — New Grad",
    team: "Payments Core",
    location: "Bangalore",
    workMode: "Onsite",
    type: "Full-time",
    ctc: "₹28 LPA",
    postedDays: 12,
    applicants: 230,
    shortlisted: 27,
    interviewing: 12,
    offers: 4,
    views: 2110,
    status: "Live",
    skills: ["Go", "Postgres", "Kubernetes"],
    companyDomain: "razorpay.com",
    companyLogo: clearbit("razorpay.com"),
  },
  {
    id: "designer",
    title: "Product Designer",
    team: "Design",
    location: "Remote",
    workMode: "Remote",
    type: "Full-time",
    ctc: "₹22 LPA",
    postedDays: 2,
    applicants: 64,
    shortlisted: 6,
    interviewing: 2,
    offers: 0,
    views: 480,
    status: "Draft",
    skills: ["Figma", "Design Systems"],
    companyDomain: "figma.com",
    companyLogo: clearbit("figma.com"),
  },
  {
    id: "data-intern",
    title: "Data Engineer Intern",
    team: "Analytics",
    location: "Hyderabad",
    workMode: "Hybrid",
    type: "Internship",
    ctc: "₹70k/mo",
    postedDays: 15,
    applicants: 51,
    shortlisted: 4,
    interviewing: 1,
    offers: 0,
    views: 390,
    status: "Paused",
    skills: ["SQL", "Airflow", "Spark"],
    companyDomain: "snowflake.com",
    companyLogo: clearbit("snowflake.com"),
  },
  {
    id: "mobile",
    title: "Mobile Engineer",
    team: "Consumer",
    location: "Mumbai",
    workMode: "Hybrid",
    type: "Full-time",
    ctc: "₹24 LPA",
    postedDays: 6,
    applicants: 97,
    shortlisted: 11,
    interviewing: 5,
    offers: 1,
    views: 860,
    status: "Live",
    skills: ["Flutter", "iOS", "Android"],
    companyDomain: "swiggy.com",
    companyLogo: clearbit("swiggy.com"),
  },
];

export const funnelData = [
  { stage: "Sourced", value: 1240, color: "var(--color-primary)" },
  { stage: "Applied", value: 672, color: "var(--color-primary)" },
  { stage: "Shortlisted", value: 132, color: "var(--color-gold)" },
  { stage: "Interviewing", value: 42, color: "var(--color-gold)" },
  { stage: "Offer", value: 14, color: "var(--color-success)" },
];

export const applicantSources = [
  { name: "Direct Search", value: 42 },
  { name: "Job Posting", value: 28 },
  { name: "AI Match", value: 22 },
  { name: "Referral", value: 8 },
];

export const hiringTrend = [
  { week: "W1", applications: 82, offers: 3 },
  { week: "W2", applications: 104, offers: 4 },
  { week: "W3", applications: 141, offers: 5 },
  { week: "W4", applications: 168, offers: 7 },
  { week: "W5", applications: 189, offers: 9 },
  { week: "W6", applications: 212, offers: 11 },
];

export const roleDistribution = [
  { role: "Frontend", count: 38 },
  { role: "Backend", count: 42 },
  { role: "ML", count: 27 },
  { role: "Full Stack", count: 31 },
  { role: "Data", count: 19 },
  { role: "Design", count: 12 },
];
