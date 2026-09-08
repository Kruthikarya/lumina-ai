import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ClipboardList, Calendar, CheckCircle2, FileText, Search, Download,
  Upload, X, Filter, Sparkles, Eye, RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { assignments as seedAssignments } from "@/lib/mock-data";
import { useMockData, MOCK_KEYS } from "@/lib/mock-api";

export const Route = createFileRoute("/assignments")({
  head: () => ({ meta: [{ title: "Assignments · LUMINA AI" }] }),
  component: Assignments,
});

type Status = "Not Started" | "In Progress" | "Submitted";

export type Assignment = {
  id: string;
  title: string;
  subject: string;
  description: string;
  due: string;
  progress: number;
  status: Status;
  score?: number;
  feedback?: string;
  faculty?: string;
  resources?: { name: string; url: string }[];
  attachment?: { name: string; size: number };
};

const uid = () => Math.random().toString(36).slice(2, 9);

const FACULTY = ["Dr. R. Sharma", "Prof. A. Menon", "Dr. K. Iyer", "Prof. S. Rao"];

const SEED: Assignment[] = seedAssignments.map((a, idx) => ({
  id: uid(),
  title: a.title,
  subject: a.subject,
  description: `Managed by the ${a.subject} faculty. Review the brief, download the resources, and upload your submission before the deadline.`,
  due: a.due,
  progress: a.progress,
  status: a.status as Status,
  score: a.status === "Submitted" ? 84 : undefined,
  feedback: a.status === "Submitted"
    ? "Solid approach and clean structure. Add edge-case handling and improve time complexity notes for full marks."
    : undefined,
  faculty: FACULTY[idx % FACULTY.length],
  resources: [
    { name: `${a.subject}-brief.pdf`, url: "#" },
    { name: `${a.subject}-starter.zip`, url: "#" },
  ],
}));

export function Assignments() {
  const [items, setItems] = useMockData<Assignment[]>(MOCK_KEYS.assignments, SEED);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [viewing, setViewing] = useState<Assignment | null>(null);
  const [uploading, setUploading] = useState<Assignment | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q);
      const matchS = statusFilter === "all" || a.status === statusFilter;
      return matchQ && matchS;
    });
  }, [items, query, statusFilter]);

  const submitted = items.filter((a) => a.status === "Submitted");
  const avg = submitted.length
    ? Math.round(submitted.reduce((s, a) => s + (a.score ?? 0), 0) / submitted.length)
    : 0;
  const dueSoon = items.filter((a) => a.status !== "Submitted" && /day|tomorrow|today/i.test(a.due)).length;

  const download = (name: string) => toast.success("Download started", { description: name });

  const saveSubmission = (a: Assignment, file: { name: string; size: number }) => {
    setItems(items.map((x) => x.id === a.id ? {
      ...x,
      attachment: file,
      status: "Submitted" as Status,
      progress: 100,
      score: x.score ?? Math.floor(75 + Math.random() * 20),
    } : x));
    setUploading(null);
    toast.success(a.attachment ? "Submission replaced" : "Submission uploaded", {
      description: "Faculty feedback will appear once reviewed.",
    });
  };

  return (
    <DashboardLayout title="Assignments" subtitle="View briefs, download resources and upload your submissions before the deadline.">
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Total", v: items.length, c: "bg-primary/10 text-primary", i: ClipboardList },
          { l: "Submitted", v: submitted.length, c: "bg-success/15 text-success", i: CheckCircle2 },
          { l: "Due soon", v: dueSoon, c: "bg-gold/15 text-gold", i: Calendar },
          { l: "Avg. marks", v: avg ? `${avg}%` : "—", c: "bg-primary/10 text-primary", i: FileText },
        ].map((s) => (
          <Card key={s.l} className="p-5 hover-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</p>
                <p className="mt-2 font-display text-3xl font-bold">{s.v}</p>
              </div>
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.c}`}><s.i className="h-5 w-5" /></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or subject…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Badge variant="secondary" className="ml-auto text-[10px]">Managed by Admin / Faculty</Badge>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h3 className="font-display text-lg font-semibold">
          Assignment list
          <span className="ml-2 text-xs font-normal text-muted-foreground">({filtered.length})</span>
        </h3>
        {filtered.length === 0 ? (
          <div className="mt-8 grid place-items-center rounded-xl border border-dashed border-border p-10 text-center">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No assignments match your filter.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-xl border border-border p-4 transition hover:border-primary/40 hover:shadow-elegant">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject} · Due {a.due} · {a.faculty}</p>
                    {a.description && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{a.description}</p>}
                    {a.attachment && (
                      <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary">
                        <Upload className="h-3 w-3" />{a.attachment.name} · {(a.attachment.size / 1024).toFixed(0)}KB
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant={a.status === "Submitted" ? "default" : "secondary"}
                      className={
                        a.status === "Submitted" ? "bg-success/15 text-success hover:bg-success/15"
                        : a.status === "In Progress" ? "bg-gold/15 text-gold hover:bg-gold/15"
                        : ""
                      }
                    >{a.status}</Badge>
                    {typeof a.score === "number" && (
                      <span className="text-xs text-muted-foreground">Marks {a.score}%</span>
                    )}
                  </div>
                </div>
                <Progress value={a.progress} className="mt-3 h-2" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-full" onClick={() => setViewing(a)}>
                    <Eye className="mr-1 h-3.5 w-3.5" />View
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => download(a.resources?.[0]?.name ?? "resources.zip")}>
                    <Download className="mr-1 h-3.5 w-3.5" />Resources
                  </Button>
                  <Button size="sm" className="rounded-full gradient-emerald text-white transition hover:shadow-glow" onClick={() => setUploading(a)}>
                    {a.attachment
                      ? <><RefreshCw className="mr-1 h-3.5 w-3.5" />Replace submission</>
                      : <><Upload className="mr-1 h-3.5 w-3.5" />Upload submission</>}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display text-lg">{viewing?.title}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <p className="text-xs text-muted-foreground">{viewing.subject} · Due {viewing.due} · {viewing.faculty}</p>
              <p className="text-muted-foreground">{viewing.description}</p>
              <div>
                <Label className="text-xs">Resources</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {viewing.resources?.map((r) => (
                    <Button key={r.name} size="sm" variant="outline" className="rounded-full" onClick={() => download(r.name)}>
                      <Download className="mr-1 h-3.5 w-3.5" />{r.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Submission status</p>
                <p className="mt-1">{viewing.status}{viewing.attachment ? ` · ${viewing.attachment.name}` : ""}</p>
                {typeof viewing.score === "number" && <p className="mt-1">Marks: <span className="font-semibold">{viewing.score}%</span></p>}
              </div>
              {viewing.feedback && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                  <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
                  <span className="font-medium text-foreground">Faculty feedback: </span>{viewing.feedback}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <UploadDialog
        key={uploading?.id ?? "none"}
        assignment={uploading}
        onClose={() => setUploading(null)}
        onSave={saveSubmission}
      />
    </DashboardLayout>
  );
}

function UploadDialog({
  assignment, onClose, onSave,
}: {
  assignment: Assignment | null;
  onClose: () => void;
  onSave: (a: Assignment, file: { name: string; size: number }) => void;
}) {
  const [file, setFile] = useState<{ name: string; size: number } | undefined>(assignment?.attachment);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("File larger than 5MB"); return; }
    setFile({ name: f.name, size: f.size });
  };

  return (
    <Dialog open={!!assignment} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            {assignment?.attachment ? "Replace submission" : "Upload submission"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{assignment?.title}</p>
          <Label htmlFor="submission" className="cursor-pointer">
            <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-border px-3 py-2 text-xs hover:border-primary/40">
              <Upload className="h-3.5 w-3.5" />
              {file ? `${file.name} · ${(file.size/1024).toFixed(0)}KB` : "Choose file (PDF/ZIP · max 5MB)"}
            </span>
            <input id="submission" type="file" className="sr-only" onChange={onFile} />
          </Label>
          {file && (
            <Button size="sm" variant="ghost" className="ml-2 h-7 text-red-500" onClick={() => setFile(undefined)}>
              <X className="mr-1 h-3 w-3" />Remove
            </Button>
          )}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            <Sparkles className="mr-1 inline h-3 w-3 text-primary" />
            AI pre-checks your submission and faculty publishes final marks and feedback.
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            className="gradient-emerald text-white"
            onClick={() => {
              if (!file) { toast.error("Please choose a file"); return; }
              if (assignment) onSave(assignment, file);
            }}
          >Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
