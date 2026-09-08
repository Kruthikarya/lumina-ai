import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, Plus, Trash2, Save, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fetchStudentProfile, saveStudentProfile, uploadStudentAvatar } from "@/lib/profile-api";

type Chip = { id: string; label: string };
type Experience = { id: string; company: string; role: string; duration: string; description: string };
type Education = { id: string; degree: string; college: string; year: string; score: string };
type Certification = { id: string; name: string; org: string; date: string; url: string };
type Achievement = { id: string; title: string; type: string; year: string };

const uid = () => Math.random().toString(36).slice(2, 9);

export type ProfileData = {
  avatar: string;
  fullName: string; username: string; email: string; phone: string; dob: string;
  gender: string; city: string; stateName: string; country: string; address: string;
  languages: Chip[];
  college: string; university: string; department: string; branch: string;
  semester: string; usn: string; gradYear: string; cgpa: string; backlogs: string;
  objective: string; about: string; portfolio: string; github: string; linkedin: string;
  leetcode: string; hackerrank: string; codechef: string; codeforces: string; kaggle: string;
  langs: Chip[]; frameworks: Chip[]; databases: Chip[]; cloud: Chip[];
  devops: Chip[]; aiSkills: Chip[]; soft: Chip[];
  experience: Experience[]; education: Education[];
  certs: Certification[]; achievements: Achievement[];
  darkMode: boolean; notifications: boolean; emailPrefs: boolean;
  publicProfile: boolean; placementVisible: boolean;
};

const DEFAULT_PROFILE: ProfileData = {
  avatar: "https://i.pravatar.cc/200?img=15",
  fullName: "Aarav Sharma", username: "aarav.sh", email: "aarav@lumina.ai",
  phone: "+91 98••• ••421", dob: "2003-08-14", gender: "male",
  city: "Bengaluru", stateName: "Karnataka", country: "India", address: "",
  languages: [{id:uid(),label:"English"},{id:uid(),label:"Hindi"},{id:uid(),label:"Kannada"}],
  college: "SJC Institute of Technology",
  university: "Visvesvaraya Technological University",
  department: "Computer Science & Engineering", branch: "CSE",
  semester: "7", usn: "1SJ22CS004", gradYear: "2026", cgpa: "9.1", backlogs: "0",
  objective: "SDE / Applied-ML roles where I can sweat the details and own systems end-to-end.",
  about: "Full-stack engineer with a soft spot for product polish.",
  portfolio: "https://aarav.dev", github: "https://github.com/aarav",
  linkedin: "https://linkedin.com/in/aarav",
  leetcode: "aarav", hackerrank: "aarav", codechef: "aarav_ch",
  codeforces: "aarav_cf", kaggle: "aarav_kg",
  langs: [{id:uid(),label:"TypeScript"},{id:uid(),label:"Python"},{id:uid(),label:"Go"}],
  frameworks: [{id:uid(),label:"React"},{id:uid(),label:"Next.js"},{id:uid(),label:"FastAPI"}],
  databases: [{id:uid(),label:"PostgreSQL"},{id:uid(),label:"Redis"}],
  cloud: [{id:uid(),label:"AWS"},{id:uid(),label:"Vercel"}],
  devops: [{id:uid(),label:"Docker"},{id:uid(),label:"GitHub Actions"}],
  aiSkills: [{id:uid(),label:"LangChain"},{id:uid(),label:"PyTorch"}],
  soft: [{id:uid(),label:"Ownership"},{id:uid(),label:"Communication"}],
  experience: [{ id: uid(), company: "Razorpay", role: "SDE Intern", duration: "May 2025 – Aug 2025", description: "Shipped fraud-alert dashboard used by 200+ merchants." }],
  education: [
    { id: uid(), degree: "B.E. Computer Science", college: "SJCIT", year: "2022–2026", score: "9.1 CGPA" },
    { id: uid(), degree: "12th CBSE", college: "DPS Bangalore North", year: "2020–2022", score: "94.6%" },
  ],
  certs: [{ id: uid(), name: "Google Cloud Associate Engineer", org: "Google Cloud", date: "Aug 2025", url: "" }],
  achievements: [{ id: uid(), title: "Smart India Hackathon Winner", type: "Hackathon", year: "2025" }],
  darkMode: true, notifications: true, emailPrefs: true,
  publicProfile: true, placementVisible: true,
};

export function EditProfileDialog({ trigger, onSaved }: { trigger: React.ReactNode; onSaved?: () => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const initial = DEFAULT_PROFILE;

  const [avatar, setAvatar] = useState(initial.avatar);

  // Personal
  const [fullName, setFullName] = useState(initial.fullName);
  const [username, setUsername] = useState(initial.username);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [dob, setDob] = useState(initial.dob);
  const [gender, setGender] = useState(initial.gender);
  const [city, setCity] = useState(initial.city);
  const [stateName, setStateName] = useState(initial.stateName);
  const [country, setCountry] = useState(initial.country);
  const [address, setAddress] = useState(initial.address);
  const [languages, setLanguages] = useState<Chip[]>(initial.languages);

  // Academic
  const [college, setCollege] = useState(initial.college);
  const [university, setUniversity] = useState(initial.university);
  const [department, setDepartment] = useState(initial.department);
  const [branch, setBranch] = useState(initial.branch);
  const [semester, setSemester] = useState(initial.semester);
  const [usn, setUsn] = useState(initial.usn);
  const [gradYear, setGradYear] = useState(initial.gradYear);
  const [cgpa, setCgpa] = useState(initial.cgpa);
  const [backlogs, setBacklogs] = useState(initial.backlogs);

  // Professional
  const [objective, setObjective] = useState(initial.objective);
  const [about, setAbout] = useState(initial.about);
  const [portfolio, setPortfolio] = useState(initial.portfolio);
  const [github, setGithub] = useState(initial.github);
  const [linkedin, setLinkedin] = useState(initial.linkedin);
  const [leetcode, setLeetcode] = useState(initial.leetcode);
  const [hackerrank, setHackerrank] = useState(initial.hackerrank);
  const [codechef, setCodechef] = useState(initial.codechef);
  const [codeforces, setCodeforces] = useState(initial.codeforces);
  const [kaggle, setKaggle] = useState(initial.kaggle);

  // Skills groups
  const [langs, setLangs] = useState<Chip[]>(initial.langs);
  const [frameworks, setFrameworks] = useState<Chip[]>(initial.frameworks);
  const [databases, setDatabases] = useState<Chip[]>(initial.databases);
  const [cloud, setCloud] = useState<Chip[]>(initial.cloud);
  const [devops, setDevops] = useState<Chip[]>(initial.devops);
  const [aiSkills, setAiSkills] = useState<Chip[]>(initial.aiSkills);
  const [soft, setSoft] = useState<Chip[]>(initial.soft);

  const [experience, setExperience] = useState<Experience[]>(initial.experience);
  const [education, setEducation] = useState<Education[]>(initial.education);
  const [certs, setCerts] = useState<Certification[]>(initial.certs);
  const [achievements, setAchievements] = useState<Achievement[]>(initial.achievements);

  // Prefs
  const [darkMode, setDarkMode] = useState(initial.darkMode);
  const [notifications, setNotifications] = useState(initial.notifications);
  const [emailPrefs, setEmailPrefs] = useState(initial.emailPrefs);
  const [publicProfile, setPublicProfile] = useState(initial.publicProfile);
  const [placementVisible, setPlacementVisible] = useState(initial.placementVisible);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetchStudentProfile().then((p) => {
      if (cancelled) return;
      setAvatar(p.avatar);
      setFullName(p.fullName); setUsername(p.username); setEmail(p.email);
      setPhone(p.phone); setDob(p.dob); setGender(p.gender);
      setCity(p.city); setStateName(p.stateName); setCountry(p.country); setAddress(p.address);
      setLanguages(p.languages);
      setCollege(p.college); setUniversity(p.university); setDepartment(p.department);
      setBranch(p.branch); setSemester(p.semester); setUsn(p.usn);
      setGradYear(p.gradYear); setCgpa(p.cgpa); setBacklogs(p.backlogs);
      setObjective(p.objective); setAbout(p.about); setPortfolio(p.portfolio);
      setGithub(p.github); setLinkedin(p.linkedin); setLeetcode(p.leetcode);
      setHackerrank(p.hackerrank); setCodechef(p.codechef);
      setCodeforces(p.codeforces); setKaggle(p.kaggle);
      setLangs(p.langs); setFrameworks(p.frameworks); setDatabases(p.databases);
      setCloud(p.cloud); setDevops(p.devops); setAiSkills(p.aiSkills); setSoft(p.soft);
      setExperience(p.experience); setEducation(p.education);
      setCerts(p.certs); setAchievements(p.achievements);
      setDarkMode(p.darkMode); setNotifications(p.notifications);
      setEmailPrefs(p.emailPrefs); setPublicProfile(p.publicProfile);
      setPlacementVisible(p.placementVisible);
    }).catch((err) => {
      toast.error(err instanceof Error ? err.message : "Could not load profile.");
    });
    return () => { cancelled = true; };
  }, [open]);

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file (PNG or JPG).");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      toast.error("Image is larger than 2MB. Please choose a smaller file.");
      return;
    }
    toast.promise(uploadStudentAvatar(f).then((url) => { setAvatar(url); return url; }), {
      loading: "Uploading photo…",
      success: "Profile photo uploaded",
      error: (err) => err instanceof Error ? err.message : "Could not upload that image.",
    });
  };

  const save = async () => {
    setSaving(true);
    const payload: ProfileData = {
      avatar, fullName, username, email, phone, dob, gender,
      city, stateName, country, address, languages,
      college, university, department, branch, semester, usn, gradYear, cgpa, backlogs,
      objective, about, portfolio, github, linkedin,
      leetcode, hackerrank, codechef, codeforces, kaggle,
      langs, frameworks, databases, cloud, devops, aiSkills, soft,
      experience, education, certs, achievements,
      darkMode, notifications, emailPrefs, publicProfile, placementVisible,
    };
    try {
      await saveStudentProfile(payload);
      toast.success("Profile updated", { description: "Your changes have been saved." });
      onSaved?.();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
    return;
    try {
      /* unreachable: keeps previous catch shape unused */
    } catch {
      toast.error("Could not save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 bg-gradient-to-r from-primary/5 via-transparent to-gold/5 p-5">
          <DialogTitle className="font-display text-xl">Edit Profile</DialogTitle>
          <p className="text-xs text-muted-foreground">Keep your public portfolio and placement profile up to date.</p>
        </DialogHeader>

        <Tabs defaultValue="personal" className="flex flex-col overflow-hidden">
          <TabsList className="mx-5 mt-4 h-auto flex-wrap justify-start gap-1 rounded-full bg-muted/60 p-1">
            {[
              ["personal", "Personal"], ["academic", "Academic"], ["professional", "Professional"],
              ["skills", "Skills"], ["experience", "Experience"], ["education", "Education"],
              ["certs", "Certifications"], ["achievements", "Achievements"], ["prefs", "Preferences"],
            ].map(([v, l]) => (
              <TabsTrigger key={v} value={v} className="h-7 rounded-full px-3 text-xs">{l}</TabsTrigger>
            ))}
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto p-5">
            {/* PERSONAL */}
            <TabsContent value="personal" className="mt-0 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="h-20 w-20 ring-2 ring-primary/30">
                  <AvatarImage src={avatar} />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar" className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/40">
                      <Upload className="h-3 w-3" /> Change photo
                    </span>
                    <input id="avatar" type="file" accept="image/*" onChange={onAvatar} className="sr-only" />
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">PNG / JPG · max 2MB · square recommended</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full Name" v={fullName} set={setFullName} />
                <Field label="Username" v={username} set={setUsername} />
                <Field label="Email" v={email} set={setEmail} type="email" />
                <Field label="Phone Number" v={phone} set={setPhone} />
                <Field label="Date of Birth" v={dob} set={setDob} type="date" />
                <div className="space-y-1.5">
                  <Label className="text-xs">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="na">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Field label="City" v={city} set={setCity} />
                <Field label="State" v={stateName} set={setStateName} />
                <Field label="Country" v={country} set={setCountry} />
                <div className="sm:col-span-2">
                  <Label className="text-xs">Address</Label>
                  <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
                </div>
              </div>
              <ChipInput label="Languages Known" chips={languages} setChips={setLanguages} />
            </TabsContent>

            <TabsContent value="academic" className="mt-0 grid gap-3 sm:grid-cols-2">
              <Field label="College Name" v={college} set={setCollege} />
              <Field label="University" v={university} set={setUniversity} />
              <Field label="Department" v={department} set={setDepartment} />
              <Field label="Branch" v={branch} set={setBranch} />
              <Field label="Semester" v={semester} set={setSemester} type="number" />
              <Field label="USN / Roll Number" v={usn} set={setUsn} />
              <Field label="Graduation Year" v={gradYear} set={setGradYear} type="number" />
              <Field label="Current CGPA" v={cgpa} set={setCgpa} />
              <Field label="Backlogs" v={backlogs} set={setBacklogs} type="number" />
            </TabsContent>

            <TabsContent value="professional" className="mt-0 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Career Objective</Label>
                <Textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">About Me</Label>
                <Textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={3} />
              </div>
              <div className="rounded-xl border border-dashed border-border/60 p-4 text-center">
                <Upload className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-1 text-sm font-medium">Upload Resume (PDF)</p>
                <p className="text-xs text-muted-foreground">Max 5MB · will be AI-scored automatically</p>
                <Button size="sm" variant="outline" className="mt-2 rounded-full">Choose file</Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Portfolio Website" v={portfolio} set={setPortfolio} />
                <Field label="GitHub" v={github} set={setGithub} />
                <Field label="LinkedIn" v={linkedin} set={setLinkedin} />
                <Field label="LeetCode" v={leetcode} set={setLeetcode} />
                <Field label="HackerRank" v={hackerrank} set={setHackerrank} />
                <Field label="CodeChef" v={codechef} set={setCodechef} />
                <Field label="Codeforces" v={codeforces} set={setCodeforces} />
                <Field label="Kaggle" v={kaggle} set={setKaggle} />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="mt-0 space-y-4">
              <ChipInput label="Programming Languages" chips={langs} setChips={setLangs} />
              <ChipInput label="Frameworks" chips={frameworks} setChips={setFrameworks} />
              <ChipInput label="Databases" chips={databases} setChips={setDatabases} />
              <ChipInput label="Cloud Platforms" chips={cloud} setChips={setCloud} />
              <ChipInput label="DevOps Tools" chips={devops} setChips={setDevops} />
              <ChipInput label="AI / ML Skills" chips={aiSkills} setChips={setAiSkills} />
              <ChipInput label="Soft Skills" chips={soft} setChips={setSoft} />
            </TabsContent>

            <TabsContent value="experience" className="mt-0 space-y-3">
              {experience.map((x) => (
                <div key={x.id} className="rounded-xl border border-border p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input placeholder="Company" value={x.company} onChange={(e) => update(experience, setExperience, x.id, { company: e.target.value })} />
                    <Input placeholder="Role" value={x.role} onChange={(e) => update(experience, setExperience, x.id, { role: e.target.value })} />
                    <Input placeholder="Duration" value={x.duration} onChange={(e) => update(experience, setExperience, x.id, { duration: e.target.value })} className="sm:col-span-2" />
                    <Textarea placeholder="Description & skills used" value={x.description} onChange={(e) => update(experience, setExperience, x.id, { description: e.target.value })} className="sm:col-span-2" rows={2} />
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setExperience(experience.filter((y) => y.id !== x.id))} className="mt-2 h-7 text-red-500"><Trash2 className="mr-1 h-3 w-3" />Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setExperience([...experience, { id: uid(), company: "", role: "", duration: "", description: "" }])} className="rounded-full"><Plus className="mr-1 h-3 w-3" />Add experience</Button>
            </TabsContent>

            <TabsContent value="education" className="mt-0 space-y-3">
              {education.map((x) => (
                <div key={x.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2">
                  <Input placeholder="Degree" value={x.degree} onChange={(e) => update(education, setEducation, x.id, { degree: e.target.value })} />
                  <Input placeholder="College" value={x.college} onChange={(e) => update(education, setEducation, x.id, { college: e.target.value })} />
                  <Input placeholder="Year" value={x.year} onChange={(e) => update(education, setEducation, x.id, { year: e.target.value })} />
                  <Input placeholder="Percentage / CGPA" value={x.score} onChange={(e) => update(education, setEducation, x.id, { score: e.target.value })} />
                  <Button size="sm" variant="ghost" onClick={() => setEducation(education.filter((y) => y.id !== x.id))} className="h-7 justify-start text-red-500 sm:col-span-2"><Trash2 className="mr-1 h-3 w-3" />Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setEducation([...education, { id: uid(), degree: "", college: "", year: "", score: "" }])} className="rounded-full"><Plus className="mr-1 h-3 w-3" />Add education</Button>
            </TabsContent>

            <TabsContent value="certs" className="mt-0 space-y-3">
              {certs.map((x) => (
                <div key={x.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2">
                  <Input placeholder="Certificate Name" value={x.name} onChange={(e) => update(certs, setCerts, x.id, { name: e.target.value })} />
                  <Input placeholder="Organization" value={x.org} onChange={(e) => update(certs, setCerts, x.id, { org: e.target.value })} />
                  <Input placeholder="Date" value={x.date} onChange={(e) => update(certs, setCerts, x.id, { date: e.target.value })} />
                  <Input placeholder="Credential URL" value={x.url} onChange={(e) => update(certs, setCerts, x.id, { url: e.target.value })} />
                  <Button size="sm" variant="ghost" onClick={() => setCerts(certs.filter((y) => y.id !== x.id))} className="h-7 justify-start text-red-500 sm:col-span-2"><Trash2 className="mr-1 h-3 w-3" />Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setCerts([...certs, { id: uid(), name: "", org: "", date: "", url: "" }])} className="rounded-full"><Plus className="mr-1 h-3 w-3" />Add certification</Button>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0 space-y-3">
              {achievements.map((x) => (
                <div key={x.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-3">
                  <Input placeholder="Title" value={x.title} onChange={(e) => update(achievements, setAchievements, x.id, { title: e.target.value })} className="sm:col-span-2" />
                  <Input placeholder="Year" value={x.year} onChange={(e) => update(achievements, setAchievements, x.id, { year: e.target.value })} />
                  <Select value={x.type} onValueChange={(v) => update(achievements, setAchievements, x.id, { type: v })}>
                    <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hackathon">Hackathon</SelectItem>
                      <SelectItem value="Competition">Competition</SelectItem>
                      <SelectItem value="Award">Award</SelectItem>
                      <SelectItem value="Publication">Publication</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="ghost" onClick={() => setAchievements(achievements.filter((y) => y.id !== x.id))} className="h-7 justify-start text-red-500"><Trash2 className="mr-1 h-3 w-3" />Remove</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setAchievements([...achievements, { id: uid(), title: "", type: "Hackathon", year: "" }])} className="rounded-full"><Plus className="mr-1 h-3 w-3" />Add achievement</Button>
            </TabsContent>

            <TabsContent value="prefs" className="mt-0 space-y-4">
              <PrefRow label="Dark Mode" hint="Use the dark theme across your dashboard." v={darkMode} set={setDarkMode} />
              <PrefRow label="In-app Notifications" hint="Placement alerts, hackathons, roadmap nudges." v={notifications} set={setNotifications} />
              <PrefRow label="Email Preferences" hint="Weekly digest and recruiter reach-outs." v={emailPrefs} set={setEmailPrefs} />
              <PrefRow label="Public Profile" hint="Allow recruiters outside your college to find you." v={publicProfile} set={setPublicProfile} />
              <PrefRow label="Placement Visibility" hint="Include me in placement drives this cycle." v={placementVisible} set={setPlacementVisible} />
              <Separator />
              <div className="space-y-2">
                <p className="font-display font-semibold">Account Settings</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">Change Password</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Two-Factor Authentication</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Login Devices</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Privacy Settings</Button>
                  <Button variant="outline" size="sm" className="rounded-full text-red-500 hover:text-red-500">Delete Account</Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="border-t border-border/60 bg-muted/30 p-4">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving} className="rounded-full">Cancel</Button>
          <Button onClick={save} disabled={saving} className="rounded-full gradient-emerald text-white shadow-elegant">
            {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function update<T extends { id: string }>(list: T[], set: (v: T[]) => void, id: string, patch: Partial<T>) {
  set(list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
}

function Field({ label, v, set, type = "text" }: any) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={v} onChange={(e) => set(e.target.value)} />
    </div>
  );
}

function PrefRow({ label, hint, v, set }: any) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch checked={v} onCheckedChange={set} />
    </div>
  );
}

function ChipInput({ label, chips, setChips }: { label: string; chips: Chip[]; setChips: (c: Chip[]) => void }) {
  const [val, setVal] = useState("");
  const add = () => {
    const t = val.trim();
    if (!t) return;
    setChips([...chips, { id: uid(), label: t }]);
    setVal("");
  };
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5 flex flex-wrap gap-1.5 rounded-xl border border-border p-2">
        {chips.map((c) => (
          <motion.div key={c.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
            <Badge variant="secondary" className="gap-1 rounded-full pr-1 text-xs">
              {c.label}
              <button onClick={() => setChips(chips.filter((x) => x.id !== c.id))} className="grid h-4 w-4 place-items-center rounded-full hover:bg-background/60"><X className="h-2.5 w-2.5" /></button>
            </Badge>
          </motion.div>
        ))}
        <div className="flex items-center gap-1">
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            placeholder="Add and press Enter"
            className="min-w-[140px] flex-1 bg-transparent px-1 text-xs outline-none placeholder:text-muted-foreground"
          />
          <Button size="sm" variant="ghost" onClick={add} className="h-6 w-6 p-0"><Plus className="h-3 w-3" /></Button>
        </div>
      </div>
    </div>
  );
}

export function ProfileCompletion({ percent, missing }: { percent: number; missing: string[] }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="pc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-gold)" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={r} strokeWidth="8" fill="none" className="stroke-muted" />
          <motion.circle
            cx="50" cy="50" r={r}
            strokeWidth="8" fill="none"
            stroke="url(#pc)"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-display text-2xl font-bold">{percent}%</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Complete</p>
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <p className="font-display text-sm font-semibold">Profile Strength</p>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">Add these to reach 100% and unlock recruiter reach-outs:</p>
        <ul className="mt-2 space-y-1">
          {missing.map((m) => (
            <li key={m} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary" />{m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
