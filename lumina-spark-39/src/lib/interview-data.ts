/** Interview simulator catalog: companies, roles, difficulties, types, languages. */

export type Company = { name: string; domain: string; tags: string[] };

export const COMPANIES: Company[] = [
  { name: "Google", domain: "google.com", tags: ["DSA", "Algorithms", "System Design", "Behavioral"] },
  { name: "Microsoft", domain: "microsoft.com", tags: ["Problem Solving", "DSA", "System Design", "Behavioral"] },
  { name: "Amazon", domain: "amazon.com", tags: ["Leadership Principles", "DSA", "System Design", "Behavioral"] },
  { name: "Apple", domain: "apple.com", tags: ["DSA", "Low-level", "System Design"] },
  { name: "Meta", domain: "meta.com", tags: ["DSA", "Product Sense", "System Design"] },
  { name: "NVIDIA", domain: "nvidia.com", tags: ["C++", "CUDA", "Algorithms"] },
  { name: "Netflix", domain: "netflix.com", tags: ["System Design", "Culture", "Backend"] },
  { name: "Adobe", domain: "adobe.com", tags: ["DSA", "OOP", "Design"] },
  { name: "Salesforce", domain: "salesforce.com", tags: ["Apex", "System Design", "Behavioral"] },
  { name: "Oracle", domain: "oracle.com", tags: ["Java", "SQL", "DBMS"] },
  { name: "IBM", domain: "ibm.com", tags: ["Cloud", "Java", "HR"] },
  { name: "Intel", domain: "intel.com", tags: ["C", "OS", "Architecture"] },
  { name: "Cisco", domain: "cisco.com", tags: ["Networking", "C", "System Engineering"] },
  { name: "Accenture", domain: "accenture.com", tags: ["Java", "SQL", "Spring Boot", "HR"] },
  { name: "Deloitte", domain: "deloitte.com", tags: ["Aptitude", "SQL", "HR"] },
  { name: "TCS", domain: "tcs.com", tags: ["Java", "DBMS", "OOP", "Aptitude", "HR"] },
  { name: "Infosys", domain: "infosys.com", tags: ["Java", "DBMS", "Aptitude", "HR"] },
  { name: "Wipro", domain: "wipro.com", tags: ["C", "DBMS", "HR"] },
  { name: "Capgemini", domain: "capgemini.com", tags: ["Java", "Cloud", "HR"] },
  { name: "Flipkart", domain: "flipkart.com", tags: ["DSA", "System Design", "Backend"] },
  { name: "PhonePe", domain: "phonepe.com", tags: ["DSA", "Low Latency", "Backend"] },
  { name: "Razorpay", domain: "razorpay.com", tags: ["Payments", "Backend", "System Design"] },
  { name: "Zoho", domain: "zoho.com", tags: ["C", "Aptitude", "Programming"] },
  { name: "Swiggy", domain: "swiggy.com", tags: ["DSA", "System Design", "Backend"] },
  { name: "Zomato", domain: "zomato.com", tags: ["DSA", "Product", "Backend"] },
  { name: "Uber", domain: "uber.com", tags: ["DSA", "System Design", "Distributed Systems"] },
  { name: "Atlassian", domain: "atlassian.com", tags: ["DSA", "Frontend", "System Design"] },
  { name: "Startup / Custom", domain: "", tags: ["Full Stack", "Ownership", "Product"] },
];

export const ROLES = [
  "Java Backend Developer",
  "Full Stack Developer",
  "Frontend Developer",
  "React Developer",
  "Software Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Data Analyst",
  "Data Scientist",
  "AI/ML Engineer",
  "Cybersecurity Engineer",
  "Android Developer",
  "iOS Developer",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "System Engineer",
] as const;

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "FAANG/Top Company"] as const;

export const INTERVIEW_TYPES = [
  "HR",
  "Behavioral",
  "Technical",
  "DSA",
  "System Design",
  "Company Specific",
  "Full Interview",
] as const;

export const LANGUAGES = [
  "Java", "Python", "C", "C++", "JavaScript", "TypeScript",
  "Go", "Rust", "C#", "Kotlin", "Swift", "PHP",
] as const;

export type Difficulty = (typeof DIFFICULTIES)[number];
export type InterviewType = (typeof INTERVIEW_TYPES)[number];
export type Role = (typeof ROLES)[number];
export type Language = (typeof LANGUAGES)[number];

export function companyLogo(domain: string) {
  return domain
    ? `https://www.google.com/s2/favicons?sz=128&domain=${domain}`
    : "";
}

export function findCompany(name: string) {
  return COMPANIES.find((c) => c.name === name);
}

/** Coding-round focus areas driven by company + role. */
export function codingFocus(company: string, role: string): string[] {
  const r = role.toLowerCase();
  if (/frontend|react/.test(r)) return ["JavaScript", "TypeScript", "React", "DOM", "API handling"];
  if (/devops/.test(r)) return ["Linux", "Bash", "Docker", "Kubernetes", "Cloud", "Automation"];
  if (/cloud/.test(r)) return ["Cloud Architecture", "IaC", "Networking", "Scripting"];
  if (/data analyst/.test(r)) return ["SQL", "Pandas", "Statistics", "Visualisation"];
  if (/data scien|ai\/ml/.test(r)) return ["Python", "NumPy", "Model Design", "Feature Engineering"];
  if (/cyber/.test(r)) return ["Crypto", "Network Security", "Secure Coding", "Threat Modelling"];
  if (/android/.test(r)) return ["Kotlin", "Android SDK", "Concurrency", "UI State"];
  if (/ios/.test(r)) return ["Swift", "UIKit/SwiftUI", "Memory", "Concurrency"];
  if (/qa/.test(r)) return ["Test Design", "Automation", "Selenium", "Edge Cases"];
  if (/ui\/ux|product manager/.test(r)) return ["Case Study", "Metrics", "Prioritisation"];
  if (/java backend/.test(r)) return ["Arrays", "HashMap", "Strings", "Trees", "Graphs", "Dynamic Programming", "Backend design"];
  if (/full stack/.test(r)) return ["APIs", "Databases", "JavaScript", "System Basics"];
  if (/system engineer/.test(r)) return ["OS", "Networking", "C", "Scripting"];
  if (/^google$/i.test(company)) return ["Advanced DSA", "Algorithms", "Optimization", "Graphs", "Dynamic Programming"];
  return ["Arrays", "Strings", "HashMap", "Trees", "Graphs", "Dynamic Programming"];
}

export type RecommendedInterview = {
  id: string;
  company: string;
  role: Role;
  difficulty: Difficulty;
  type: InterviewType;
  questions: number;
  minutes: number;
  skills: string[];
  match: number;
};

function mk(
  company: string, role: Role, difficulty: Difficulty, type: InterviewType,
  questions: number, minutes: number, skills: string[], match: number,
): RecommendedInterview {
  return { id: `${company}-${role}-${type}`.toLowerCase().replace(/\s+/g, "-"), company, role, difficulty, type, questions, minutes, skills, match };
}

export const RECOMMENDED: RecommendedInterview[] = [
  mk("Google", "Software Engineer", "FAANG/Top Company", "Full Interview", 8, 60, ["DSA", "Algorithms", "System Design", "Behavioral"], 94),
  mk("Amazon", "Software Engineer", "FAANG/Top Company", "Behavioral", 6, 45, ["Leadership Principles", "DSA", "System Design", "Behavioral"], 91),
  mk("Microsoft", "Software Engineer", "Advanced", "Technical", 7, 50, ["Problem Solving", "DSA", "System Design", "Behavioral"], 89),
  mk("Accenture", "Java Backend Developer", "Intermediate", "Company Specific", 6, 40, ["Java", "SQL", "Spring Boot", "HR"], 87),
  mk("TCS", "Software Engineer", "Beginner", "Company Specific", 6, 35, ["Java", "DBMS", "OOP", "Aptitude", "HR"], 85),
  mk("Meta", "Frontend Developer", "FAANG/Top Company", "Technical", 6, 45, ["JavaScript", "React", "DSA", "Product Sense"], 84),
  mk("Flipkart", "Full Stack Developer", "Advanced", "System Design", 5, 45, ["APIs", "Scalability", "Databases"], 83),
  mk("Razorpay", "Java Backend Developer", "Advanced", "Technical", 6, 45, ["Java", "Payments", "Concurrency", "System Design"], 82),
  mk("Infosys", "System Engineer", "Beginner", "HR", 6, 30, ["Aptitude", "DBMS", "Communication"], 80),
  mk("Uber", "Software Engineer", "FAANG/Top Company", "System Design", 5, 50, ["Distributed Systems", "DSA", "Scalability"], 79),
  mk("NVIDIA", "AI/ML Engineer", "Advanced", "Technical", 6, 45, ["Python", "CUDA", "Deep Learning"], 78),
  mk("Atlassian", "React Developer", "Intermediate", "Technical", 6, 40, ["React", "TypeScript", "DOM", "Testing"], 77),
  mk("Deloitte", "Data Analyst", "Intermediate", "Company Specific", 6, 35, ["SQL", "Excel", "Statistics", "HR"], 76),
  mk("IBM", "Cloud Engineer", "Intermediate", "Technical", 6, 40, ["Cloud", "Docker", "Kubernetes"], 75),
  mk("Zoho", "Software Engineer", "Beginner", "DSA", 6, 40, ["C", "Programming", "Aptitude"], 74),
  mk("Wipro", "QA Engineer", "Beginner", "HR", 5, 30, ["Test Design", "SQL", "Communication"], 72),
];
