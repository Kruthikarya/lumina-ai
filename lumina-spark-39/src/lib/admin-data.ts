/**
 * Rich mock dataset powering the Admin flow.
 * Kept separate from student/recruiter data so we can evolve institution-wide
 * analytics without leaking into other role experiences.
 */

export const clearbitLogo = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;

export const richStudents = [
  { id: "s1", name: "Aarav Sharma", branch: "CSE", batch: 2026, cgpa: 8.9, readiness: 87, mockAvg: 84, resumeScore: 91, applications: 14, placed: "Microsoft", status: "Placed", domain: "microsoft.com", email: "aarav@sjcit.ac.in", lastActive: "2h ago" },
  { id: "s2", name: "Priya Verma", branch: "ISE", batch: 2025, cgpa: 9.1, readiness: 92, mockAvg: 90, resumeScore: 95, applications: 22, placed: "Stripe", status: "Placed", domain: "stripe.com", email: "priya@rvce.edu.in", lastActive: "5m ago" },
  { id: "s3", name: "Rohan Iyer", branch: "AI/ML", batch: 2026, cgpa: 8.7, readiness: 89, mockAvg: 82, resumeScore: 88, applications: 11, placed: "—", status: "Interviewing", domain: "", email: "rohan@bmsce.ac.in", lastActive: "1d ago" },
  { id: "s4", name: "Sneha Kapoor", branch: "ECE", batch: 2026, cgpa: 8.3, readiness: 76, mockAvg: 71, resumeScore: 80, applications: 8, placed: "—", status: "Applying", domain: "", email: "sneha@pesu.ac.in", lastActive: "3h ago" },
  { id: "s5", name: "Arjun Patel", branch: "CSE", batch: 2025, cgpa: 8.5, readiness: 81, mockAvg: 78, resumeScore: 84, applications: 17, placed: "Razorpay", status: "Placed", domain: "razorpay.com", email: "arjun@sjcit.ac.in", lastActive: "1h ago" },
  { id: "s6", name: "Meera Nair", branch: "CSE", batch: 2026, cgpa: 8.1, readiness: 73, mockAvg: 68, resumeScore: 76, applications: 6, placed: "—", status: "Applying", domain: "", email: "meera@rvce.edu.in", lastActive: "6h ago" },
  { id: "s7", name: "Kabir Menon", branch: "AI/ML", batch: 2025, cgpa: 9.3, readiness: 94, mockAvg: 92, resumeScore: 96, applications: 19, placed: "OpenAI", status: "Placed", domain: "openai.com", email: "kabir@iisc.ac.in", lastActive: "12m ago" },
  { id: "s8", name: "Ananya Rao", branch: "ISE", batch: 2026, cgpa: 8.0, readiness: 68, mockAvg: 64, resumeScore: 72, applications: 4, placed: "—", status: "Preparing", domain: "", email: "ananya@bmsce.ac.in", lastActive: "2d ago" },
  { id: "s9", name: "Vikram Singh", branch: "CSE", batch: 2025, cgpa: 8.8, readiness: 85, mockAvg: 83, resumeScore: 87, applications: 15, placed: "Figma", status: "Placed", domain: "figma.com", email: "vikram@pesu.ac.in", lastActive: "20m ago" },
  { id: "s10", name: "Diya Shah", branch: "ECE", batch: 2026, cgpa: 7.9, readiness: 71, mockAvg: 69, resumeScore: 74, applications: 5, placed: "—", status: "Applying", domain: "", email: "diya@sjcit.ac.in", lastActive: "4h ago" },
];

export const richRecruiters = [
  { id: "r1", name: "Stripe", domain: "stripe.com", tier: "Platinum", roles: 4, hires: 7, avgCtc: "₹32 LPA", contact: "Vaishnavi K.", status: "Active", joined: "2024" },
  { id: "r2", name: "Microsoft", domain: "microsoft.com", tier: "Platinum", roles: 6, hires: 12, avgCtc: "₹28 LPA", contact: "Rahul M.", status: "Active", joined: "2022" },
  { id: "r3", name: "Razorpay", domain: "razorpay.com", tier: "Gold", roles: 3, hires: 5, avgCtc: "₹24 LPA", contact: "Meera S.", status: "Active", joined: "2023" },
  { id: "r4", name: "OpenAI", domain: "openai.com", tier: "Platinum", roles: 2, hires: 1, avgCtc: "$180k", contact: "David L.", status: "Active", joined: "2025" },
  { id: "r5", name: "Snowflake", domain: "snowflake.com", tier: "Gold", roles: 2, hires: 3, avgCtc: "₹26 LPA", contact: "Priya N.", status: "Onboarding", joined: "2026" },
  { id: "r6", name: "Figma", domain: "figma.com", tier: "Gold", roles: 1, hires: 2, avgCtc: "₹30 LPA", contact: "Aditya P.", status: "Active", joined: "2024" },
  { id: "r7", name: "Vercel", domain: "vercel.com", tier: "Silver", roles: 1, hires: 1, avgCtc: "$140k", contact: "Sam R.", status: "Active", joined: "2025" },
  { id: "r8", name: "Google", domain: "google.com", tier: "Platinum", roles: 5, hires: 8, avgCtc: "₹42 LPA", contact: "Anjali B.", status: "Active", joined: "2021" },
  { id: "r9", name: "Linear", domain: "linear.app", tier: "Silver", roles: 1, hires: 0, avgCtc: "$150k", contact: "Karri J.", status: "Onboarding", joined: "2026" },
];

export const richSessions = [
  { id: "sess1", name: "Fall 2026 Placements", starts: "Sep 1, 2026", ends: "Dec 15, 2026", students: 412, recruiters: 38, offers: 71, status: "Active", eligibility: "CGPA ≥ 7.5, Final year" },
  { id: "sess2", name: "Summer Internship Drive", starts: "May 1, 2026", ends: "Jul 30, 2026", students: 287, recruiters: 22, offers: 46, status: "Active", eligibility: "Pre-final year" },
  { id: "sess3", name: "Winter 2025 Drive", starts: "Nov 1, 2025", ends: "Feb 20, 2026", students: 391, recruiters: 41, offers: 118, status: "Closed", eligibility: "Final year, all branches" },
  { id: "sess4", name: "Spring 2027 Placements", starts: "Feb 15, 2027", ends: "May 30, 2027", students: 0, recruiters: 0, offers: 0, status: "Upcoming", eligibility: "CGPA ≥ 8.0" },
];

export const departmentPerformance = [
  { dept: "CSE", students: 1420, placed: 1287, rate: 91 },
  { dept: "ISE", students: 820, placed: 719, rate: 88 },
  { dept: "AI/ML", students: 480, placed: 442, rate: 92 },
  { dept: "ECE", students: 780, placed: 621, rate: 80 },
  { dept: "EEE", students: 420, placed: 302, rate: 72 },
  { dept: "Mech", students: 298, placed: 190, rate: 64 },
];

export const monthlyRegistrations = [
  { month: "Jan", students: 128, recruiters: 6 },
  { month: "Feb", students: 156, recruiters: 8 },
  { month: "Mar", students: 210, recruiters: 5 },
  { month: "Apr", students: 184, recruiters: 11 },
  { month: "May", students: 240, recruiters: 9 },
  { month: "Jun", students: 218, recruiters: 12 },
];

export const placementFunnel = [
  { stage: "Registered", value: 4218 },
  { stage: "Resume ready", value: 3812 },
  { stage: "Applied", value: 3104 },
  { stage: "Interviewed", value: 2210 },
  { stage: "Offered", value: 1490 },
  { stage: "Placed", value: 1287 },
];

export const topSkills = [
  { skill: "React", students: 1420 },
  { skill: "Python", students: 1698 },
  { skill: "SQL", students: 1284 },
  { skill: "System Design", students: 612 },
  { skill: "PyTorch", students: 480 },
  { skill: "Kubernetes", students: 342 },
];

export const systemAlerts = [
  { id: "a1", tone: "warning", title: "17 students have < 40% readiness", detail: "Nudge them into a mock interview this week.", time: "10m ago" },
  { id: "a2", tone: "success", title: "Stripe closed 3 offers today", detail: "Confirm with placement cell to update dashboard.", time: "1h ago" },
  { id: "a3", tone: "info", title: "New recruiter request — Linear", detail: "Review company profile and approve access.", time: "3h ago" },
  { id: "a4", tone: "warning", title: "Session 'Winter 2025' pending closeout", detail: "Archive results and publish summary report.", time: "1d ago" },
];

export const engagementByHour = [
  { hour: "6a", value: 42 }, { hour: "9a", value: 218 }, { hour: "12p", value: 312 },
  { hour: "3p", value: 380 }, { hour: "6p", value: 421 }, { hour: "9p", value: 268 }, { hour: "12a", value: 96 },
];

export const geoDistribution = [
  { city: "Bangalore", students: 1820 },
  { city: "Hyderabad", students: 812 },
  { city: "Pune", students: 640 },
  { city: "Chennai", students: 512 },
  { city: "Delhi NCR", students: 434 },
];
