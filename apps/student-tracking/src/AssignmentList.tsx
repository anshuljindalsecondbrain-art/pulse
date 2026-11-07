import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpDown, MoreHorizontal, Search, SlidersHorizontal, X } from "lucide-react";
import type { DashboardAssignment } from "./WorkAssignmentDashboard";
import "./assignment-list.css";

type Props = {
  assignments: DashboardAssignment[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onCreate: () => void;
};

type Tab = "All assignments" | "My assignments" | "Approval queue" | "Scheduled" | "Published" | "Archived";
type Status = "Draft" | "Published" | "Legacy record";

function statusFor(item: DashboardAssignment): Status {
  if (item.lifecycleStatus === "DRAFT") return "Draft";
  if (item.lifecycleStatus === "PUBLISHED") return "Published";
  return "Legacy record";
}

export function AssignmentList({ assignments, onBack, onOpen, onCreate }: Props) {
  const [tab, setTab] = useState<Tab>("All assignments");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [batch, setBatch] = useState("All batches");
  const [status, setStatus] = useState("All statuses");
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const subjects = Array.from(new Set(assignments.map(x => x.subject))).sort();
  const batches = Array.from(new Set(assignments.map(x => x.batch))).sort();
  const rows = useMemo(() => assignments.map(item => ({ ...item, workflow: statusFor(item) }))
    .filter(item => {
      const matchesTab =
        tab === "All assignments" ||
        (tab === "My assignments" && item.workflow !== "Published") ||
        (tab === "Published" && item.workflow === "Published") ||
        (tab === "Approval queue" && false) ||
        (tab === "Scheduled" && false) ||
        (tab === "Archived" && false);
      const haystack = [item.name, item.chapter, item.subject, item.batch, item.id].join(" ").toLowerCase();
      return matchesTab && haystack.includes(search.toLowerCase()) &&
        (subject === "All subjects" || item.subject === subject) &&
        (batch === "All batches" || item.batch === batch) &&
        (status === "All statuses" || item.workflow === status);
    }), [assignments, tab, search, subject, batch, status]);

  const clearFilters = () => { setSearch(""); setSubject("All subjects"); setBatch("All batches"); setStatus("All statuses"); };
  const unavailable = (action: string) => {
    setMenuFor(null);
    setNotice(`${action} is unavailable for legacy demo records. A persisted assignment workflow and permission check are not connected.`);
  };

  return <div className="assignment-list-page">
    <header className="al-topbar">
      <div className="al-brand"><span>P</span><div><b>PULSE</b><small>STUDENT WORK TRACKING</small></div></div>
      <div className="al-topright"><span className="al-demo">LOCAL PREVIEW · DEMO DATA</span><button onClick={onBack}><ArrowLeft size={15}/> Dashboard</button></div>
    </header>
    <main className="al-main">
      <div className="al-breadcrumb">SYSTEM A <i>/</i> ASSIGNMENT MANAGEMENT <i>/</i> ASSIGNMENT LIST</div>
      <section className="al-heading">
        <div><div className="al-eyebrow">ACADEMIC OPERATIONS</div><h1>Assignment List</h1><p>Search, compare and manage assignments without opening each record.</p></div>
        <button className="al-primary" onClick={onCreate}>＋ Create assignment</button>
      </section>
      <div className="al-scope">◈ <b>Demo Learning Institute</b><span>All demo batches</span><span>Academic year 2026–27</span></div>
      <nav className="al-tabs" aria-label="Assignment views">
        {(["All assignments", "My assignments", "Approval queue", "Scheduled", "Published", "Archived"] as Tab[]).map(label =>
          <button key={label} className={tab === label ? "active" : ""} onClick={() => setTab(label)}>{label}{label === "All assignments" && <b>{assignments.length}</b>}</button>)}
      </nav>
      <section className="al-panel">
        <div className="al-panelhead"><div><h2>Assignments</h2><p>{rows.length} records in this view</p></div><span className="al-localtag">LOCAL DATA</span></div>
        <div className="al-filters">
          <label className="al-search"><Search size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title, source, chapter or batch"/></label>
          <label><span>Subject</span><select value={subject} onChange={e => setSubject(e.target.value)}><option>All subjects</option>{subjects.map(s => <option key={s}>{s}</option>)}</select></label>
          <label><span>Batch</span><select value={batch} onChange={e => setBatch(e.target.value)}><option>All batches</option>{batches.map(s => <option key={s}>{s}</option>)}</select></label>
          <label><span>Status</span><select value={status} onChange={e => setStatus(e.target.value)}><option>All statuses</option><option>Draft</option><option>Published</option><option>Legacy record</option></select></label>
          <button className="al-clear" onClick={clearFilters}><X size={14}/> Clear</button>
        </div>
        <div className="al-tablewrap"><table className="al-table"><thead><tr><th>ASSIGNMENT <ArrowUpDown size={12}/></th><th>SOURCE / MATERIAL</th><th>SUBJECT</th><th>CLASS / BATCH</th><th>OWNER</th><th>VERSION</th><th>WORKFLOW STATUS</th><th>PUBLISH TIME</th><th>DUE DATE</th><th>STUDENTS</th><th/></tr></thead>
          <tbody>{rows.map(item => <tr key={item.id}>
            <td><button className="al-title" onClick={() => onOpen(item.id)}>{item.name}</button><small>{item.id}</small></td>
            <td>{item.chapter}<small>Exercise / question range not linked</small></td><td>{item.subject}</td><td>{item.batch}</td><td>—<small>Owner not recorded</small></td>
            <td><span className="al-version">Unversioned</span></td><td><span className={`al-status ${item.workflow === "Legacy record" ? "legacy" : item.workflow.toLowerCase()}`}>{item.workflow}</span></td>
            <td>—</td><td>{item.due || "—"}</td><td>—</td>
            <td className="al-menu-cell"><button aria-label={`Actions for ${item.name}`} className="al-menu" onClick={() => setMenuFor(menuFor === item.id ? null : item.id)}><MoreHorizontal size={17}/></button>
              {menuFor === item.id && <div className="al-popmenu"><button onClick={() => onOpen(item.id)}>Open detail</button><button onClick={() => unavailable("Duplicate as draft")}>Duplicate as draft</button><button disabled>Edit draft</button><button disabled>Submit for review</button><button disabled>Version history</button><button disabled>Archive / cancel</button><small>Actions depend on persisted workflow state and permissions.</small></div>}
            </td>
          </tr>)}
          {!rows.length && <tr><td colSpan={11} className="al-empty"><SlidersHorizontal size={20}/><b>No assignments found</b><span>Try changing the search or filters.</span><button onClick={clearFilters}>Clear all filters</button></td></tr>}
          </tbody></table></div>
        <div className="al-foot">Showing {rows.length} of {assignments.length} local records. Publish time, owner, version and student allocation are not present in the connected demo model.</div>
      </section>
      {notice && <div className="al-notice" role="status">{notice}<button onClick={() => setNotice("")}>Dismiss</button></div>}
      <footer className="al-footer">PULSE · MODULE 08 · M08-02 <span>Assignment list · prototype implementation</span></footer>
    </main>
  </div>;
}
