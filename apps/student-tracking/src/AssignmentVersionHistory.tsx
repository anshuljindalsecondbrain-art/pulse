import { useMemo, useState } from "react";
import { ArrowLeft, Clock3, GitCompareArrows, History, LockKeyhole, Plus, ShieldAlert, Users } from "lucide-react";
import type { DashboardAssignment } from "./WorkAssignmentDashboard";
import "./assignment-version-history.css";

type Props = { assignments: DashboardAssignment[]; onBack: () => void };
type VersionGroup = "All events" | "Drafts" | "Approved" | "Published";

export function AssignmentVersionHistory({ assignments, onBack }: Props) {
  const [assignmentId, setAssignmentId] = useState(assignments[0]?.id || "");
  const [group, setGroup] = useState<VersionGroup>("All events");
  const [leftVersion, setLeftVersion] = useState("");
  const [rightVersion, setRightVersion] = useState("");
  const selected = assignments.find(item => item.id === assignmentId);
  const versions = useMemo(() => {
    // The current prototype model contains assignment drafts only; it has no immutable version/event records.
    return [] as { id: string; label: string; status: string; author: string; reviewer: string; createdAt: string; approvedAt?: string; publishedAt?: string }[];
  }, [assignmentId]);
  const filteredVersions = versions.filter(version => group === "All events" || version.status.toLowerCase() === group.slice(0, -1).toLowerCase());
  const canCompare = Boolean(leftVersion && rightVersion && leftVersion !== rightVersion);
  return <div className="avh-page">
    <header className="avh-topbar"><button onClick={onBack}><ArrowLeft size={15}/> Back to assignments</button><span>LOCAL PREVIEW · NO VERSION EVENT STORE</span></header>
    <main className="avh-main">
      <div className="avh-breadcrumb">SYSTEM A <i>/</i> ASSIGNMENT MANAGEMENT <i>/</i> VERSION HISTORY</div>
      <div className="avh-heading"><div><span>M08-08 · VERSION CONTROL</span><h1>Assignment Version History</h1><p>Inspect immutable assignment snapshots and understand the changes between versions.</p></div><b>READ-ONLY HISTORY</b></div>
      <section className="avh-scope">
        <label>Assignment<select value={assignmentId} onChange={e=>{setAssignmentId(e.target.value);setLeftVersion("");setRightVersion("");}}><option value="">Select assignment</option>{assignments.map(item=><option key={item.id} value={item.id}>{item.name} · {item.id}</option>)}</select></label>
        <div><span>Current record</span><b>{selected?.name || "No assignment selected"}</b><small>{selected ? selected.subject + " · " + selected.batch : "Choose an assignment to inspect its history"}</small></div>
      </section>
      <section className="avh-callout"><LockKeyhole size={18}/><div><b>Historical snapshots are not available in the connected model</b><p>The current assignment record has no version identity, immutable snapshot, event timeline, reviewer metadata or publication event. This screen will not invent historical versions from draft records or infer approval/publication.</p></div></section>
      <div className="avh-layout">
        <section className="avh-card avh-timeline">
          <div className="avh-card-head"><div><History size={17}/><b>Version timeline</b></div><span>{filteredVersions.length} events</span></div>
          <div className="avh-filters">{(["All events","Drafts","Approved","Published"] as VersionGroup[]).map(item=><button key={item} className={group===item?"active":""} onClick={()=>setGroup(item)}>{item}</button>)}</div>
          {filteredVersions.length ? <div className="avh-events">{filteredVersions.map(version=><article key={version.id}><span className="avh-dot"/><div><b>{version.label}</b><small>{version.status} · {version.createdAt}</small><p>Author: {version.author} · Reviewer: {version.reviewer}</p></div></article>)}</div> : <div className="avh-empty"><Clock3 size={24}/><b>No recorded version events</b><p>{selected ? "This assignment is present only as a local prototype record. Its creation history and any approval or publication events are not persisted." : "Select an assignment to inspect its version timeline."}</p></div>}
        </section>
        <section className="avh-card avh-compare">
          <div className="avh-card-head"><div><GitCompareArrows size={17}/><b>Compare versions</b></div><span>Grouped diff</span></div>
          <label>Earlier version<select value={leftVersion} onChange={e=>setLeftVersion(e.target.value)} disabled={!versions.length}><option value="">Choose version</option>{versions.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}</select></label>
          <label>Later version<select value={rightVersion} onChange={e=>setRightVersion(e.target.value)} disabled={!versions.length}><option value="">Choose version</option>{versions.map(v=><option key={v.id} value={v.id}>{v.label}</option>)}</select></label>
          <div className="avh-diff-groups">{[["Additions","New questions or source slots"],["Removals","Removed work retained in history"],["Deadline changes","Due timestamp and exceptions"],["Recipient changes","Batch and individual inclusion/exclusion"],["Policy changes","Late submission and correction rules"]].map(([title,description])=><div key={title}><b>{title}</b><span>{description}</span><small>Diff unavailable until immutable snapshots are connected</small></div>)}</div>
          <button className="avh-primary" disabled={!canCompare}>Compare selected versions</button>
        </section>
      </div>
      <div className="avh-lower">
        <section className="avh-card"><div className="avh-card-head"><div><Users size={17}/><b>Affected obligations</b></div><span>Linked history</span></div><div className="avh-empty compact"><ShieldAlert size={20}/><b>Obligation impact is not connected</b><p>Version-to-obligation lineage, removed-question denominator rules and re-added-work policy must come from authoritative allocation records.</p></div></section>
        <section className="avh-card avh-actions"><div className="avh-card-head"><div><Plus size={17}/><b>Continue from a version</b></div></div><p>Create a new editable draft from a selected snapshot. The source version remains unchanged.</p><button className="avh-primary" disabled={!versions.length}>Create new draft from current version</button><small>Unavailable until a version snapshot can be loaded and copied by the server.</small></section>
      </div>
      <footer className="avh-footer">PULSE · MODULE 08 · M08-08 <span>Version history · immutable snapshot viewer prototype</span></footer>
    </main>
  </div>;
}
