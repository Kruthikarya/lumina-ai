// Real branded data sources for course thumbnails, company logos & hackathon banners.
import { gradientCoverDataUri } from "@/components/safe-image";

/** Company/university favicon. Google's S2 service is the most reliable. */
export function clearbit(domain: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
}

/** Royalty-free Unsplash photo by id. */
export function unsplash(id: string, w = 800) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

/** Curated royalty-free photo pools, keyed by topic. */
const PHOTOS: Record<string, string[]> = {
  ai: ["1677442136019-21780ecad995", "1620712943543-bcc4688e7485", "1526374965328-7f61d4dc18c5", "1555949963-aa79dcee981c"],
  code: ["1498050108023-c5249f4df085", "1461749280684-dccba630e2f6", "1550751827-4bd374c3f58b", "1517180102446-f3ece451e9d8"],
  cloud: ["1451187580459-43490279c0fa", "1544197150-b99a580bb7a8", "1518770660439-4636190af475", "1558494949-ef010cbdcc31"],
  data: ["1551288049-bebda4e38f71", "1543286386-713bdd548da4", "1504868584819-f8e8b4b6d7e3", "1460925895917-afdab827c52f"],
  design: ["1561070791-2526d30994b5", "1581291518857-4e27b48ff24e", "1559028012-481c04fa702d", "1586717791821-3f44a563fa4c"],
  hardware: ["1518770660439-4636190af475", "1591696205602-2f950c417cb9", "1580927752452-89d86da3fa0a", "1563986768609-322da13575f3"],
  space: ["1451187580459-43490279c0fa", "1446776877081-d282a0f896e2", "1454789548928-9efd52dc4031", "1516339901601-2e1b62dc0c45"],
  web3: ["1639762681485-074b7f938ba0", "1621761191319-c6fb62004040", "1518546305927-5a555bb7020d", "1640340434855-6084b1f4901c"],
  finance: ["1554224155-6726b3ff858f", "1579621970563-ebec7560ff3e", "1611974789855-9c2a0a7236a3", "1590283603385-17ffb3a7f29f"],
  team: ["1522071820081-009f0129c71c", "1531482615713-2afd69097998", "1552664730-d307ca884978", "1517245386807-bb43f82c33c4"],
  office: ["1497366216548-37526070297c", "1497366754035-f200968a6e72", "1524758631624-e2822e304c36", "1600880292203-757bb62b4baf"],
  campus: ["1523050854058-8df90110c9f1", "1541339907198-e08756dedf3f", "1562774053-701939374585", "1498243691581-b145c3f54a5a"],
  event: ["1540575467063-178a50c2df87", "1505373877841-8d25f7d46678", "1511578314322-379afb476865", "1475721027785-f74eccf877e2"],
};

function hash(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic themed photograph for a seed + topic. */
export function photo(seed: string, topic: keyof typeof PHOTOS | string = "code", w = 800) {
  const pool = PHOTOS[topic] ?? PHOTOS.code;
  return unsplash(pool[hash(seed) % pool.length], w);
}

/** Picks a topic from free text (skills, themes, roles). */
export function topicFor(text: string): string {
  const t = text.toLowerCase();
  const rules: [RegExp, string][] = [
    [/ai|ml|machine|deep|llm|gpt|neural|data scien|nlp|vision|kaggle/, "ai"],
    [/web3|blockchain|eth|zk|defi|crypto|depin/, "web3"],
    [/cloud|azure|aws|devops|kubernetes|infra|terraform|oci/, "cloud"],
    [/data|analytics|sql|spark|bi|tabular/, "data"],
    [/design|figma|ux|ui|product design/, "design"],
    [/embedded|hardware|robot|iot|silicon|verilog|chip|modem|dsp|5g/, "hardware"],
    [/space|nasa|earth|satellite/, "space"],
    [/fintech|payment|finance|bank|upi|stripe/, "finance"],
    [/hack|competition|contest|challenge|summit/, "event"],
    [/campus|college|university|student|edtech/, "campus"],
  ];
  for (const [re, topic] of rules) if (re.test(t)) return topic;
  return "code";
}

/** Real YouTube thumbnail. */
export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Deterministic themed cover art — no network, never breaks (used as fallback). */
export function cover(seed: string, label?: string) {
  return gradientCoverDataUri(seed, label);
}


export type Course = {
  title: string;
  provider: "YouTube" | "Coursera" | "Udemy" | "freeCodeCamp" | "NPTEL" | "edX";
  providerDomain: string;
  instructor: string;
  rating: number;
  learners: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  url: string;
  tags: string[];
};

export const roadmapCourses: Record<string, Course[]> = {
  foundations: [
    {
      title: "CS50: Introduction to Computer Science",
      provider: "edX",
      providerDomain: "edx.org",
      instructor: "David Malan · Harvard",
      rating: 4.9,
      learners: "4.2M",
      duration: "12 weeks",
      level: "Beginner",
      thumbnail: youtubeThumb("8mAITcNt710"),
      url: "https://cs50.harvard.edu/x/",
      tags: ["CS Fundamentals", "C", "Python"],
    },
    {
      title: "Data Structures & Algorithms — Full Course",
      provider: "freeCodeCamp",
      providerDomain: "freecodecamp.org",
      instructor: "freeCodeCamp.org",
      rating: 4.8,
      learners: "3.1M",
      duration: "8 hours",
      level: "Intermediate",
      thumbnail: youtubeThumb("8hly31xKli0"),
      url: "https://www.youtube.com/watch?v=8hly31xKli0",
      tags: ["DSA", "JavaScript"],
    },
  ],
  specialization: [
    {
      title: "Machine Learning Specialization",
      provider: "Coursera",
      providerDomain: "coursera.org",
      instructor: "Andrew Ng · DeepLearning.AI",
      rating: 4.9,
      learners: "780K",
      duration: "3 months",
      level: "Intermediate",
      thumbnail: youtubeThumb("vStJoetOxJg"),
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      tags: ["ML", "Python", "TensorFlow"],
    },
    {
      title: "The Complete Web Developer Bootcamp",
      provider: "Udemy",
      providerDomain: "udemy.com",
      instructor: "Colt Steele",
      rating: 4.7,
      learners: "920K",
      duration: "62 hours",
      level: "Beginner",
      thumbnail: youtubeThumb("nu_pCVPKzTk"),
      url: "https://www.udemy.com/course/the-web-developer-bootcamp/",
      tags: ["HTML", "CSS", "Node.js"],
    },
    {
      title: "Deep Learning — IIT Madras",
      provider: "NPTEL",
      providerDomain: "nptel.ac.in",
      instructor: "Prof. Mitesh Khapra",
      rating: 4.8,
      learners: "180K",
      duration: "12 weeks",
      level: "Advanced",
      thumbnail: youtubeThumb("aPfkYu_qiF4"),
      url: "https://nptel.ac.in/courses/106106184",
      tags: ["Deep Learning", "PyTorch"],
    },
  ],
  production: [
    {
      title: "System Design — Concepts to Patterns",
      provider: "YouTube",
      providerDomain: "youtube.com",
      instructor: "Gaurav Sen",
      rating: 4.9,
      learners: "1.2M",
      duration: "20 hours",
      level: "Advanced",
      thumbnail: youtubeThumb("xpDnVSmNFX0"),
      url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX",
      tags: ["System Design", "Microservices"],
    },
    {
      title: "Docker & Kubernetes: The Practical Guide",
      provider: "Udemy",
      providerDomain: "udemy.com",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.8,
      learners: "210K",
      duration: "27 hours",
      level: "Intermediate",
      thumbnail: youtubeThumb("3c-iBn73dDE"),
      url: "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/",
      tags: ["DevOps", "Docker", "K8s"],
    },
  ],
  placement: [
    {
      title: "Cracking the Coding Interview — Patterns",
      provider: "YouTube",
      providerDomain: "youtube.com",
      instructor: "NeetCode",
      rating: 4.9,
      learners: "2.4M",
      duration: "30 hours",
      level: "Intermediate",
      thumbnail: youtubeThumb("KLlXCFG5TnA"),
      url: "https://neetcode.io/practice",
      tags: ["LeetCode", "DSA"],
    },
    {
      title: "Behavioral Interview Masterclass",
      provider: "YouTube",
      providerDomain: "youtube.com",
      instructor: "Jeff H Sipe",
      rating: 4.8,
      learners: "640K",
      duration: "6 hours",
      level: "Beginner",
      thumbnail: youtubeThumb("PJKYqLP6MRE"),
      url: "https://www.youtube.com/@JeffHSipePracticeInterviews",
      tags: ["Interview", "STAR"],
    },
  ],
};

export type Project = {
  title: string;
  description: string;
  stack: string[];
  github: string;
  demo?: string;
  image: string;
  stars: string;
};

export const featuredProjects: Project[] = [
  {
    title: "Lumina Resume Parser",
    description: "AI-powered ATS-style resume scoring using Gemini.",
    stack: ["React", "Vite", "Gemini API", "Tailwind"],
    github: "https://github.com/lumina-ai/resume-parser",
    demo: "https://resume.lumina.ai",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80&auto=format&fit=crop",
    stars: "1.2k",
  },
  {
    title: "Realtime Collab Whiteboard",
    description: "Yjs + WebRTC powered design canvas for student teams.",
    stack: ["Next.js", "Yjs", "WebRTC", "tRPC"],
    github: "https://github.com/lumina-ai/collab-board",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80&auto=format&fit=crop",
    stars: "842",
  },
  {
    title: "Campus Placement Predictor",
    description: "Scikit-learn model predicting placement probability per student.",
    stack: ["Python", "FastAPI", "scikit-learn", "Recharts"],
    github: "https://github.com/lumina-ai/placement-ml",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop",
    stars: "560",
  },
];

export type RichHackathon = {
  name: string;
  organizer: string;
  organizerDomain: string;
  date: string;
  deadline: string;
  location: string;
  mode: "Online" | "Hybrid" | "On-campus";
  prize: string;
  banner: string;
  registered: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  themes: string[];
  match: number;
  url: string;
};

const HACK_ROWS: [string, string, string, string, string, string, RichHackathon["mode"], string, number, RichHackathon["difficulty"], string[], number, string][] = [
  ["Smart India Hackathon 2026", "Govt. of India · AICTE", "mygov.in", "Mar 14–16, 2026", "Feb 20, 2026", "Multiple nodal centres, IN", "Hybrid", "₹1,00,000", 142300, "Intermediate", ["GovTech", "Sustainability", "EdTech"], 94, "https://sih.gov.in/"],
  ["HackMIT 2026", "Massachusetts Institute of Technology", "mit.edu", "Sep 19–21, 2026", "Aug 30, 2026", "Cambridge, MA, USA", "On-campus", "$15,000", 8400, "Advanced", ["AI", "Hardware", "Healthcare"], 88, "https://hackmit.org/"],
  ["HackHarvard 2026", "Harvard University", "harvard.edu", "Oct 10–12, 2026", "Sep 25, 2026", "Cambridge, MA, USA", "On-campus", "$20,000", 6100, "Advanced", ["FinTech", "AI", "Social Impact"], 84, "https://hackharvard.io/"],
  ["ETHGlobal Bengaluru", "ETHGlobal", "ethglobal.com", "Aug 02–04, 2026", "Jul 18, 2026", "Bengaluru, IN", "On-campus", "$50,000", 3200, "Advanced", ["Web3", "ZK", "DeFi"], 76, "https://ethglobal.com/events"],
  ["MLH Hack Weekend", "Major League Hacking", "mlh.io", "Rolling weekends, 2026", "Rolling", "Global · Online", "Online", "$5,000 + Swag", 54200, "Beginner", ["Beginner-friendly", "Open Innovation"], 90, "https://mlh.io/seasons/2026/events"],
  ["Google Solution Challenge", "Google Developer Student Clubs", "google.com", "Jan – Apr 2026", "Mar 31, 2026", "Global · Online", "Online", "$3,000 + Gear", 21500, "Intermediate", ["SDGs", "Android", "Firebase"], 91, "https://developers.google.com/community/gdsc-solution-challenge"],
  ["Microsoft Imagine Cup", "Microsoft", "microsoft.com", "Oct 2025 – May 2026", "Jan 20, 2026", "Global · Online + Finals", "Hybrid", "$100,000", 34800, "Advanced", ["Azure", "AI", "Startup"], 87, "https://imaginecup.microsoft.com/"],
  ["NASA Space Apps Challenge", "NASA", "nasa.gov", "Oct 03–04, 2026", "Sep 28, 2026", "300+ cities worldwide", "Hybrid", "Global Award + NASA Visit", 57000, "Intermediate", ["Space", "Earth Data", "Open Science"], 82, "https://www.spaceappschallenge.org/"],
  ["Devfolio Hacker House", "Devfolio", "devfolio.co", "Jun 05–09, 2026", "May 22, 2026", "Goa, IN", "On-campus", "₹15,00,000 pool", 9400, "Advanced", ["Web3", "Infra", "DePIN"], 79, "https://devfolio.co/hackathons"],
  ["HackerEarth Deep Learning Challenge", "HackerEarth", "hackerearth.com", "Apr 12 – May 10, 2026", "May 10, 2026", "Online", "Online", "₹2,00,000", 18700, "Intermediate", ["Deep Learning", "CV", "Kaggle-style"], 86, "https://www.hackerearth.com/challenges/"],
  ["CodeChef Starters Series", "CodeChef", "codechef.com", "Every Wednesday, 2026", "Weekly", "Online", "Online", "Laddus + Goodies", 96000, "Beginner", ["Competitive Programming", "DSA"], 93, "https://www.codechef.com/contests"],
  ["Kaggle Community Competition", "Kaggle · Google", "kaggle.com", "Feb – May 2026", "May 15, 2026", "Online", "Online", "$25,000", 41200, "Advanced", ["ML", "Tabular", "NLP"], 85, "https://www.kaggle.com/competitions"],
  ["IEEE TechXchange Hackathon", "IEEE", "ieee.org", "Nov 07–09, 2026", "Oct 25, 2026", "Hyderabad, IN", "Hybrid", "₹5,00,000", 12600, "Intermediate", ["Embedded", "5G", "Robotics"], 80, "https://ieee.org/"],
];

export const richHackathons: RichHackathon[] = HACK_ROWS.map(
  ([name, organizer, organizerDomain, date, deadline, location, mode, prize, registered, difficulty, themes, match, url]) => ({
    name, organizer, organizerDomain, date, deadline, location, mode, prize,
    banner: photo(name, topicFor(name + ' ' + themes.join(' ')), 1200), registered, difficulty, themes, match, url,
  }),
);

export type RichInternship = {
  role: string;
  company: string;
  companyDomain: string;
  location: string;
  type: "Remote" | "Hybrid" | "On-site";
  stipend: string;
  duration: string;
  eligibility: string;
  deadline: string;
  banner: string;
  posted: string;
  match: number;
  skills: string[];
  url: string;
};

const INTERN_ROWS: [string, string, string, string, RichInternship["type"], string, string, string, string, string, number, string[], string][] = [
  ["SWE Intern — Search Infrastructure", "Google", "google.com", "Bengaluru, IN", "Hybrid", "₹1,50,000 / month", "6 months", "B.E/B.Tech 2027 · CGPA ≥ 8.0", "Sep 15, 2026", "2 days ago", 92, ["C++", "Distributed Systems", "DSA"], "https://careers.google.com/students/"],
  ["Software Engineer Intern", "Microsoft", "microsoft.com", "Bengaluru, IN", "Hybrid", "₹1,10,000 / month", "6 months", "Pre-final year · CGPA ≥ 7.5", "Sep 02, 2026", "3 days ago", 89, ["React", "TypeScript", "Azure"], "https://careers.microsoft.com/students"],
  ["Applied Scientist Intern", "Amazon", "amazon.com", "Hyderabad, IN", "On-site", "₹1,20,000 / month", "12 weeks", "M.Tech/PhD · ML coursework", "Aug 28, 2026", "5 days ago", 87, ["ML", "Python", "AWS"], "https://amazon.jobs/en/teams/internships-for-students"],
  ["Software Engineer Intern", "Meta", "meta.com", "London, UK", "On-site", "£5,500 / month", "12 weeks", "Any year · strong DSA", "Sep 10, 2026", "1 week ago", 84, ["Hack", "React", "GraphQL"], "https://www.metacareers.com/careerprograms/students"],
  ["SWE Intern — Core OS", "Apple", "apple.com", "Hyderabad, IN", "On-site", "₹1,30,000 / month", "6 months", "Pre-final year CS/ECE", "Sep 20, 2026", "4 days ago", 81, ["C", "Swift", "Systems"], "https://www.apple.com/careers/us/students.html"],
  ["Data Engineering Intern", "Netflix", "netflix.com", "Remote", "Remote", "$6,500 / month", "12 weeks", "Final year · SQL proficiency", "Aug 30, 2026", "6 days ago", 78, ["Spark", "Python", "Airflow"], "https://jobs.netflix.com/"],
  ["Deep Learning Intern", "NVIDIA", "nvidia.com", "Pune, IN", "Hybrid", "₹1,25,000 / month", "6 months", "CGPA ≥ 8.5 · CUDA basics", "Sep 05, 2026", "1 day ago", 90, ["CUDA", "PyTorch", "C++"], "https://www.nvidia.com/en-us/about-nvidia/careers/university-recruiting/"],
  ["Product Design Intern", "Adobe", "adobe.com", "Noida, IN", "Hybrid", "₹90,000 / month", "6 months", "Design portfolio required", "Sep 12, 2026", "3 days ago", 74, ["Figma", "Design Systems", "Prototyping"], "https://careers.adobe.com/us/en/students"],
  ["Cloud Engineering Intern", "Oracle", "oracle.com", "Bengaluru, IN", "Hybrid", "₹80,000 / month", "6 months", "Pre-final year · CGPA ≥ 7.0", "Aug 25, 2026", "1 week ago", 72, ["Java", "OCI", "Kubernetes"], "https://www.oracle.com/careers/students-grads/"],
  ["Platform Intern — Agentforce", "Salesforce", "salesforce.com", "Hyderabad, IN", "Hybrid", "₹1,00,000 / month", "6 months", "CGPA ≥ 7.5", "Sep 08, 2026", "2 days ago", 77, ["Apex", "LWC", "Node.js"], "https://www.salesforce.com/company/careers/university-recruiting/"],
  ["Research Intern — watsonx", "IBM", "ibm.com", "Bengaluru, IN", "Hybrid", "₹75,000 / month", "6 months", "M.Tech preferred", "Sep 18, 2026", "5 days ago", 73, ["Python", "LLMs", "RAG"], "https://www.ibm.com/careers/internships"],
  ["Silicon Software Intern", "Intel", "intel.com", "Bengaluru, IN", "On-site", "₹85,000 / month", "6 months", "ECE/CS · CGPA ≥ 7.5", "Aug 27, 2026", "1 week ago", 70, ["C", "Verilog", "Linux"], "https://www.intel.com/content/www/us/en/jobs/students.html"],
  ["Network Software Intern", "Cisco", "cisco.com", "Bengaluru, IN", "Hybrid", "₹95,000 / month", "6 months", "Pre-final year", "Sep 01, 2026", "4 days ago", 71, ["Go", "Networking", "Python"], "https://www.cisco.com/c/en/us/about/careers/we-are-cisco/students-and-new-graduate.html"],
  ["Android Platform Intern", "Samsung R&D", "samsung.com", "Noida, IN", "On-site", "₹70,000 / month", "6 months", "CGPA ≥ 8.0", "Sep 22, 2026", "2 days ago", 75, ["Kotlin", "AOSP", "C++"], "https://research.samsung.com/careers"],
  ["Modem Systems Intern", "Qualcomm", "qualcomm.com", "Hyderabad, IN", "On-site", "₹1,05,000 / month", "6 months", "ECE · signal processing", "Aug 29, 2026", "1 week ago", 68, ["C", "DSP", "MATLAB"], "https://www.qualcomm.com/company/careers/university"],
  ["Backend Engineer Intern", "Uber", "uber.com", "Bengaluru, IN", "Hybrid", "₹1,40,000 / month", "6 months", "CGPA ≥ 8.0 · strong DSA", "Sep 06, 2026", "3 days ago", 86, ["Go", "Kafka", "Microservices"], "https://university.uber.com/"],
  ["Full Stack Intern", "Airbnb", "airbnb.com", "Remote", "Remote", "$7,000 / month", "12 weeks", "Final year · portfolio", "Sep 14, 2026", "6 days ago", 79, ["React", "Ruby", "GraphQL"], "https://careers.airbnb.com/university/"],
  ["Product Engineer Intern", "Stripe", "stripe.com", "Remote", "Remote", "$4,500 / month", "10 weeks", "Any year · shipped projects", "Sep 03, 2026", "1 week ago", 83, ["TypeScript", "Ruby", "APIs"], "https://stripe.com/jobs/university"],
  ["Software Intern — Jira Cloud", "Atlassian", "atlassian.com", "Bengaluru, IN", "Remote", "₹1,00,000 / month", "6 months", "Pre-final year", "Sep 11, 2026", "4 days ago", 76, ["Java", "React", "AWS"], "https://www.atlassian.com/company/careers/students"],
  ["SDE Intern — Marketplace", "Flipkart", "flipkart.com", "Bengaluru, IN", "Hybrid", "₹1,00,000 / month", "6 months", "CGPA ≥ 7.5", "Aug 26, 2026", "2 days ago", 85, ["Java", "Spring", "Kafka"], "https://www.flipkartcareers.com/"],
  ["Backend Intern — Payments", "PhonePe", "phonepe.com", "Bengaluru, IN", "On-site", "₹90,000 / month", "6 months", "CGPA ≥ 7.0", "Sep 04, 2026", "3 days ago", 82, ["Java", "Redis", "MySQL"], "https://www.phonepe.com/careers/"],
  ["SDE Intern — Payment Gateway", "Razorpay", "razorpay.com", "Bengaluru, IN", "Hybrid", "₹80,000 / month", "6 months", "Any year · projects", "Sep 09, 2026", "5 days ago", 84, ["Node.js", "Go", "Postgres"], "https://razorpay.com/jobs/"],
  ["Software Intern — Delivery Tech", "Swiggy", "swiggy.com", "Bengaluru, IN", "Hybrid", "₹75,000 / month", "6 months", "Pre-final year", "Aug 31, 2026", "1 week ago", 80, ["Java", "Kotlin", "Kafka"], "https://careers.swiggy.com/"],
  ["Data Science Intern", "Zomato", "zomato.com", "Gurugram, IN", "On-site", "₹70,000 / month", "6 months", "Stats/ML coursework", "Sep 07, 2026", "4 days ago", 78, ["Python", "SQL", "A/B Testing"], "https://www.zomato.com/careers"],
  ["Member Technical Staff Intern", "Zoho", "zoho.com", "Chennai, IN", "On-site", "₹40,000 / month", "6 months", "Any degree · aptitude test", "Sep 16, 2026", "6 days ago", 69, ["Java", "JavaScript", "MySQL"], "https://www.zoho.com/careers/"],
  ["Digital Technology Intern", "TCS", "www.tcs.com", "Multiple, IN", "Hybrid", "₹35,000 / month", "3 months", "CGPA ≥ 6.0 · no backlogs", "Aug 24, 2026", "1 week ago", 66, ["Java", "SQL", "Cloud"], "https://www.tcs.com/careers"],
  ["InStep Research Intern", "Infosys", "infosys.com", "Bengaluru, IN", "Hybrid", "₹45,000 / month", "3 months", "CGPA ≥ 7.0", "Sep 13, 2026", "5 days ago", 67, ["Python", "Data", "Cloud"], "https://www.infosys.com/careers/instep.html"],
  ["Engineering Intern", "Wipro", "wipro.com", "Pune, IN", "Hybrid", "₹30,000 / month", "3 months", "Final year · no backlogs", "Sep 19, 2026", "1 week ago", 64, ["Java", "Testing", "SQL"], "https://careers.wipro.com/"],
  ["Technology Analyst Intern", "Accenture", "accenture.com", "Hyderabad, IN", "Hybrid", "₹40,000 / month", "3 months", "Any branch · CGPA ≥ 6.5", "Sep 17, 2026", "3 days ago", 65, ["Cloud", "SQL", "Automation"], "https://www.accenture.com/in-en/careers/local/students-graduates"],
  ["Consulting Tech Intern", "Deloitte", "deloitte.com", "Bengaluru, IN", "Hybrid", "₹50,000 / month", "3 months", "CGPA ≥ 7.0", "Sep 21, 2026", "2 days ago", 68, ["Analytics", "SQL", "Power BI"], "https://www2.deloitte.com/in/en/careers.html"],
  ["Cloud Intern — Engineering", "Capgemini", "capgemini.com", "Mumbai, IN", "Hybrid", "₹35,000 / month", "3 months", "CGPA ≥ 6.5", "Sep 23, 2026", "4 days ago", 63, ["Azure", "Python", "DevOps"], "https://www.capgemini.com/careers/"],
];

export const richInternships: RichInternship[] = INTERN_ROWS.map(
  ([role, company, companyDomain, location, type, stipend, duration, eligibility, deadline, posted, match, skills, url]) => ({
    role, company, companyDomain, location, type, stipend, duration, eligibility, deadline,
    banner: photo(role + company, topicFor(role + ' ' + skills.join(' ')), 1200), posted, match, skills, url,
  }),
);


