import { ArrowRight, CalendarClock, CheckCircle2, CircleAlert, ClipboardList, Clock3, FilePlus2, Filter, Search, ShieldCheck, Users } from "lucide-react";
import "./assignment-dashboard.css";
import { AssignmentList } from "./AssignmentList";
import { useMemo, useState } from "react";

export type DashboardAssignment = {
  id: string;
  name: string;
  chapter: string;
  subject: string;
  count: number;
  batch: string;
  due: string;
  created?: string;
  lifecycleStatus?: "DRAFT" | "PUBLISHED";
};

type Props = {
  assignments: DashboardAssignment[];
  onBackToMatrix: () => void;
  onCreateAssignment: (draft: DashboardAssignment & { classLevel: string; stream: string; sourceType: string; instructions: string; owner: string }) => void;
  onOpenAssignment: (id: string) => void;
};

const sampleWorkflow = ["Draft", "Awaiting review", "Approved", "Scheduled", "Published", "Overdue", "Legacy record"] as const;
type Workflow = typeof sampleWorkflow[number];

function workflowFor(item: DashboardAssignment): Workflow {
  if (item.lifecycleStatus === "DRAFT") return "Draft";
  if (item.lifecycleStatus === "PUBLISHED") return "Published";
  // Existing prototype records predate the approval workflow; do not infer approval or publication.
  return "Legacy record";
}

const statusClass: Record<Workflow, string> = {
  Draft: "draft",
  "Awaiting review": "review",
  Approved: "approved",
  Scheduled: "scheduled",
  Published: "published",
  Overdue: "overdue",
  "Legacy record": "legacy",
};

export function WorkAssignmentDashboard({ assignments, onBackToMatrix, onCreateAssignment, onOpenAssignment }: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [subject, setSubject] = useState("All subjects");
  const [showList, setShowList] = useState(false);

  const rows = useMemo(() => assignments.map(item => ({ ...item, workflow: workflowFor(item) }))
    .filter(item => (status === "All statuses" || item.workflow === status)
      && (subject === "All subjects" || item.subject === subject)
      && (item.name + " " + item.chapter + " " + item.batch).toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.workflow === "Overdue" ? -1 : b.workflow === "Overdue" ? 1 : a.due.localeCompare(b.due)), [assignments, search, status, subject]);

  const counts = useMemo(() => {
    const all = assignments.map(item => workflowFor(item));
    return {
      draft: all.filter(x => x === "Draft").length,
      review: all.filter(x => x === "Awaiting review").length,
      approved: all.filter(x => x === "Approved").length,
      scheduled: all.filter(x => x === "Scheduled").length,
      published: all.filter(x => x === "Published").length,
      overdue: all.filter(x => x === "Overdue").length,
    };
  }, [assignments]);

  const subjects = Array.from(new Set(assignments.map(x => x.subject))).sort();

  if (showList) return <AssignmentList assignments={assignments} onBack={() => setShowList(false)} onOpen={onOpenAssignment} onCreate={onCreateAssignment} />;

  return <div className="assignment-dashboard">
    <header className="assignment-topline">
      <div className="assignment-brand"><span className="assignment-brand-mark">P</span><div><b>PULSE</b><small>STUDENT WORK TRACKING</small></div></div>
      <div className="assignment-top-actions"><span className="assignment-demo-tag">LOCAL PREVIEW · DEMO DATA</span><button className="assignment-back" onClick={() => setShowList(true)}>Assignment list</button><button className="assignment-back" onClick={onBackToMatrix}>← Abhyas Matrix</button></div>
    </header>
    <main className="assignment-main">
      <div className="assignment-breadcrumb">SYSTEM A <span>/</span> ASSIGNMENT MANAGEMENT <span>/</span> OVERVIEW</div>
      <section className="assignment-heading">
        <div><div className="assignment-eyebrow">ACADEMIC OPERATIONS</div><h1>Work Assignment Dashboard</h1><p>Monitor assignment workload, approval progress, publication and allocation exceptions.</p></div>
        <button className="assignment-primary" onClick={onCreateAssignment}><FilePlus2 size={16}/> Create assignment</button>
      </section>
      <div className="assignment-scope"><ShieldCheck size={16}/><span>Demo Learning Institute</span><i/> <span>All demo batches</span><i/> <span>Academic year 2026–27</span></div>
      <section className="assignment-kpis">
        {([
          ["Draft", counts.draft, "draft", ClipboardList],
          ["Awaiting review", counts.review, "review", Clock3],
          ["Approved", counts.approved, "approved", ShieldCheck],
          ["Scheduled", counts.scheduled, "scheduled", CalendarClock],
          ["Published", counts.published, "published", CheckCircle2],
          ["Overdue", counts.overdue, "overdue", CircleAlert],
        ] as const).map(([label, value, tone, Icon]) => <button key={label} className={`assignment-kpi ${tone}`} onClick={() => setStatus(status === label ? "All statuses" : label)}>
          <span className="assignment-kpi-icon"><Icon size={17}/></span><span className="assignment-kpi-label">{label}</span><b>{value}</b><small>{status === label ? "FILTER ACTIVE · CLEAR" : "View assignments"} <ArrowRight size={11}/></small>
        </button>)}
      </section>
      <section className="assignment-content-grid">
        <div className="assignment-panel">
          <div className="assignment-panel-head"><div><h2>Assignment activity</h2><p>Recent work across your authorised demo scope</p></div><span className="assignment-count">{assignments.length} records</span></div>
          <div className="assignment-filters">
            <label className="assignment-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search assignment, chapter or batch"/></label>
            <label className="assignment-select"><Filter size={14}/><select value={subject} onChange={e=>setSubject(e.target.value)}><option>All subjects</option>{subjects.map(s=><option key={s}>{s}</option>)}</select></label>
            <label className="assignment-select"><select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option>{sampleWorkflow.map(s=><option key={s}>{s}</option>)}</select></label>
            {(search || subject !== "All subjects" || status !== "All statuses") && <button className="assignment-clear" onClick={()=>{setSearch("");setSubject("All subjects");setStatus("All statuses");}}>Clear</button>}
          </div>
          <div className="assignment-table-wrap"><table className="assignment-table"><thead><tr><th>ASSIGNMENT</th><th>SUBJECT / CHAPTER</th><th>BATCH</th><th>VERSION</th><th>STATUS</th><th>DUE DATE</th><th/></tr></thead><tbody>
            {rows.map(item=><tr key={item.id} onClick={()=>onOpenAssignment(item.id)}><td><b>{item.name}</b><small>{item.count} question slots · {item.created || "Demo record"}</small></td><td>{item.subject}<small>{item.chapter}</small></td><td>{item.batch}</td><td><span className="assignment-version">Local</span></td><td><span className={`assignment-status ${statusClass[item.workflow]}`}>{item.workflow}</span></td><td>{item.due || "—"}</td><td><ArrowRight size={15}/></td></tr>)}
            {!rows.length && <tr><td colSpan={7} className="assignment-empty">No assignments match these filters.</td></tr>}
          </tbody></table></div>
          <div className="assignment-panel-foot">Showing {rows.length} of {assignments.length} demo assignments. Legacy records are not assigned inferred approval states. Workflow services are not connected.</div>
        </div>
        <aside className="assignment-attention">
          <div className="assignment-panel-head"><div><h2>Attention required</h2><p>Items that may need staff action</p></div><span className="assignment-alert-icon"><CircleAlert size={16}/></span></div>
          <div className="assignment-attention-item"><span className="assignment-attention-symbol review"><Clock3 size={15}/></span><div><b>Approval queue</b><small>Approval queue data is not connected. Legacy records are not treated as awaiting review.</small></div></div>
          <div className="assignment-attention-item"><span className="assignment-attention-symbol overdue"><Users size={15}/></span><div><b>Allocation exceptions</b><small>Live allocation exception data is not connected in this prototype.</small></div></div>
          <div className="assignment-attention-note"><ShieldCheck size={15}/><span>Only server-authorised assignments and counts should appear here in production.</span></div>
        </aside>
      </section>
      <footer className="assignment-footer"><span>PULSE · MODULE 08 · M08-01</span><span>Assignment dashboard · prototype implementation</span></footer>
    </main>
  </div>;
}
