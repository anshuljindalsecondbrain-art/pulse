import { useMemo, useState } from "react";
import { ArrowLeft, CalendarClock, CheckCircle2, Clock3, LockKeyhole, ShieldAlert, Users } from "lucide-react";
import type { DashboardAssignment } from "./WorkAssignmentDashboard";
import "./publication-scheduling.css";

type Props = { assignments: DashboardAssignment[]; onBack: () => void };

function formatTimestamp(value: string, timezone: string) {
  if (!value) return "Not configured";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  try { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: timezone || "UTC" }).format(date); }
  catch { return value; }
}

export function PublicationScheduling({ assignments, onBack }: Props) {
  const [selectedId, setSelectedId] = useState("");
  const [mode, setMode] = useState<"NOW" | "SCHEDULED">("NOW");
  const [releaseAt, setReleaseAt] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const approved = useMemo(() => assignments.filter(item => item.lifecycleStatus === "APPROVED"), [assignments]);
  const scheduled = useMemo(() => assignments.filter(item => item.lifecycleStatus === "SCHEDULED"), [assignments]);
  const selected = approved.find(item => item.id === selectedId) ?? approved[0];
  const config = selected?.configuration;
  const releaseTimestamp = mode === "NOW" ? "Immediately after server confirmation" : formatTimestamp(releaseAt, config?.instituteTimezone || "UTC");
  const dueTimestamp = config ? formatTimestamp(config.dueAt, config.instituteTimezone) : "Unavailable";
  const hasAuthoritativeSnapshot = Boolean(selected && selected.questionRefs?.length && config?.recipientBatches.length && config?.instituteTimezone);
  const canRelease = false;

  return <div className="ps-page">
    <header className="ps-topbar"><button onClick={onBack}><ArrowLeft size={15}/> Back to assignments</button><span>LOCAL PREVIEW · NO PUBLICATION SERVICE</span></header>
    <main className="ps-main">
      <div className="ps-breadcrumb">SYSTEM A <i>/</i> ASSIGNMENT MANAGEMENT <i>/</i> PUBLICATION & SCHEDULING</div>
      <div className="ps-heading"><div><span>M08-07 · PUBLISHER WORKSPACE</span><h1>Publication & Scheduling</h1><p>Release only an independently approved assignment version to its authorised audience.</p></div><b>SERVER GATE REQUIRED</b></div>
      <div className="ps-kpis"><div><span>Approved queue</span><b>{approved.length}</b><small>Eligible status records</small></div><div><span>Scheduled queue</span><b>{scheduled.length}</b><small>Pending release records</small></div><div><span>Publication service</span><b>Not connected</b><small>No release execution</small></div></div>
      <section className="ps-gate"><LockKeyhole size={18}/><div><b>Publication is fail-closed in this prototype</b><p>Approval state, publisher authority, immutable version identity, effective roster resolution and idempotent obligation creation must be confirmed by the server. This screen cannot publish, schedule, reschedule or cancel a release.</p></div></section>
      <div className="ps-layout">
        <section className="ps-card"><div className="ps-card-head"><div><Users size={17}/><b>Approved assignments</b></div><span>{approved.length} available</span></div>
          {approved.length ? <div className="ps-queue">{approved.map(item=><button key={item.id} className={selected?.id===item.id?"selected":""} onClick={()=>setSelectedId(item.id)}><b>{item.name}</b><span>{item.subject} · {item.batch}</span><small>{item.count} selected slots · {item.id}</small></button>)}</div> : <div className="ps-empty"><ShieldAlert size={22}/><b>No server-approved assignments available</b><p>Drafts and legacy records are intentionally excluded. M08-06 currently records only a local decision preview; it does not create an authoritative Approved state.</p></div>}
        </section>
        <section className="ps-card"><div className="ps-card-head"><div><CalendarClock size={17}/><b>Release configuration</b></div><span>Read-only preview</span></div>
          <label className="ps-field">Release action<select value={mode} onChange={e=>setMode(e.target.value as "NOW"|"SCHEDULED")} disabled={!selected}><option value="NOW">Publish now</option><option value="SCHEDULED">Schedule release</option></select></label>
          {mode==="SCHEDULED"&&<label className="ps-field">Scheduled release timestamp<input type="datetime-local" value={releaseAt} onChange={e=>setReleaseAt(e.target.value)} disabled={!selected}/></label>}
          <div className="ps-summary">
            <div><span>Approved version</span><b>{selected?"Version identity not available":"—"}</b></div>
            <div><span>Target audience</span><b>{config?.recipientBatches.join(", ")||"—"}</b></div>
            <div><span>Institute timezone</span><b>{config?.instituteTimezone||"—"}</b></div>
            <div><span>Release timestamp</span><b>{selected?releaseTimestamp:"—"}</b></div>
            <div><span>Due timestamp</span><b>{config?dueTimestamp:"—"}</b></div>
            <div><span>Expected recipients</span><b>Server resolution required</b></div>
            <div><span>Obligation count</span><b>Not authoritatively calculated</b></div>
          </div>
          <label className="ps-confirm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} disabled={!selected}/> I have reviewed the exact version, audience, release time, due time and impact summary.</label>
          <div className="ps-validation">{hasAuthoritativeSnapshot?"Local assignment fields are present; authoritative approval and recipient evidence are still missing.":"Select an approved assignment with a complete publication snapshot."}</div>
          <div className="ps-actions"><button disabled={!canRelease || !selected || !confirmed || (mode==="SCHEDULED"&&!releaseAt)}>{mode==="NOW"?"Publish now":"Schedule release"}</button><small>Action remains disabled until a server-backed publisher workflow is integrated.</small></div>
        </section>
      </div>
      <section className="ps-card ps-rules"><div className="ps-card-head"><div><Clock3 size={17}/><b>Release lifecycle safeguards</b></div></div><ul><li>Scheduled assignments remain hidden from students until the approved release time.</li><li>Release time and due time remain independent timestamps in the institute timezone.</li><li>Reschedule and cancel are permitted only before release and require server-authorised state transitions.</li><li>Publication resolves the effective roster at release time using the approved immutable roster policy.</li><li>Retries use an idempotency key; a retry must never create duplicate obligations.</li><li>Success is shown only after the server confirms publication and returns a correlation reference.</li></ul></section>
      <footer className="ps-footer">PULSE · MODULE 08 · M08-07 <span>Publication and scheduling · fail-closed prototype</span></footer>
    </main>
  </div>;
}
