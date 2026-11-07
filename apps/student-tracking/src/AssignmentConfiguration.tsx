import { useMemo, useState } from "react";
import { CalendarClock, Clock3, Users, ShieldCheck, AlertTriangle } from "lucide-react";
import "./assignment-configuration.css";

export type AssignmentConfigurationValue = {
  recipientBatches: string[];
  includedIndividuals: string[];
  excludedIndividuals: string[];
  releaseMode: "IMMEDIATE" | "SCHEDULED";
  releaseAt: string;
  dueAt: string;
  instituteTimezone: string;
  lateSubmissionRule: "ACCEPT_AND_FLAG" | "BLOCK_AFTER_DEADLINE" | "UNCONFIGURED";
  resubmissionPolicy: "CORRECTION_ALLOWED" | "NO_CORRECTION" | "UNCONFIGURED";
  defaultDeadline: string;
  individualExceptions: { learner: string; deadline: string; reason: string; authoriser: string }[];
};

type Props = {
  initialBatch: string;
  initialDue: string;
  onBack: () => void;
  onContinue: (value: AssignmentConfigurationValue) => void;
};

const batchOptions = ["JEE XII · Alpha", "JEE XII · Beta", "JEE XI · Alpha", "NEET XII · Alpha", "NEET XI · Alpha"];
const learnerOptions = ["Demo Learner 01", "Demo Learner 02", "Demo Learner 03", "Demo Learner 04"];

export function AssignmentConfiguration({ initialBatch, initialDue, onBack, onContinue }: Props) {
  const [batches, setBatches] = useState<string[]>([initialBatch]);
  const [included, setIncluded] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [releaseMode, setReleaseMode] = useState<"IMMEDIATE" | "SCHEDULED">("IMMEDIATE");
  const [releaseAt, setReleaseAt] = useState("2026-11-09T09:00");
  const [dueAt, setDueAt] = useState(initialDue + "T23:59");
  const [timezone, setTimezone] = useState("");
  const [lateRule, setLateRule] = useState<AssignmentConfigurationValue["lateSubmissionRule"]>("UNCONFIGURED");
  const [resubmission, setResubmission] = useState<AssignmentConfigurationValue["resubmissionPolicy"]>("UNCONFIGURED");
  const [exceptions, setExceptions] = useState<AssignmentConfigurationValue["individualExceptions"]>([]);
  const [learner, setLearner] = useState("");
  const [exceptionDeadline, setExceptionDeadline] = useState(initialDue + "T23:59");
  const [reason, setReason] = useState("");
  const [authoriser, setAuthoriser] = useState("");
  const [error, setError] = useState("");

  const demoObligationCount = useMemo(() => batches.length * 8 + included.length - excluded.length, [batches, included, excluded]);
  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter(item => item !== value) : [...list, value]);
  }
  function addException() {
    if (!learner || !reason.trim() || !authoriser.trim() || !exceptionDeadline) {
      setError("An individual exception requires a learner, deadline, reason and authoriser.");
      return;
    }
    if (exceptions.some(item => item.learner === learner)) {
      setError("Only one active exception per learner is supported in this preview.");
      return;
    }
    setExceptions(items => [...items, { learner, deadline: exceptionDeadline, reason: reason.trim(), authoriser: authoriser.trim() }]);
    setIncluded(items => items.includes(learner) ? items : [...items, learner]);
    setLearner(""); setReason(""); setAuthoriser(""); setError("");
  }
  function continueConfig() {
    if (!batches.length) { setError("Select at least one recipient batch."); return; }
    if (!timezone.trim()) { setError("Select the institute timezone explicitly; no silent timezone conversion is permitted."); return; }
    if (!dueAt || (releaseMode === "SCHEDULED" && !releaseAt)) { setError("Set the release and due timestamps required by the selected release mode."); return; }
    if (releaseMode === "SCHEDULED" && new Date(releaseAt).getTime() >= new Date(dueAt).getTime()) { setError("Scheduled release must be earlier than the due timestamp."); return; }
    onContinue({
      recipientBatches: batches, includedIndividuals: included, excludedIndividuals: excluded,
      releaseMode, releaseAt: releaseMode === "IMMEDIATE" ? "" : releaseAt, dueAt,
      instituteTimezone: timezone, lateSubmissionRule: lateRule, resubmissionPolicy: resubmission,
      defaultDeadline: dueAt, individualExceptions: exceptions,
    });
  }

  return <div className="ac-page">
    <div className="ac-heading"><div><span>M08-05 · ASSIGNMENT CONFIGURATION</span><h2>Recipients, release & operational rules</h2><p>Configure the audience and effective deadlines before reviewing the draft.</p></div><b>LOCAL PREVIEW</b></div>
    <div className="ac-grid">
      <section className="ac-card"><div className="ac-card-title"><Users size={17}/><div><b>Recipient batches</b><small>Choose one or more target batches</small></div></div>
        {batchOptions.map(item=><label className="ac-check" key={item}><input type="checkbox" checked={batches.includes(item)} onChange={()=>toggle(batches,item,setBatches)}/>{item}</label>)}
        <div className="ac-divider"/>
        <b className="ac-subtitle">Individual inclusion / exclusion</b>
        <p className="ac-note">Demo learner identities are illustrative. Server-side relationship and eligibility checks are not connected.</p>
        <div className="ac-person-grid">{learnerOptions.map(item=><div key={item}><span>{item}</span><label><input type="checkbox" checked={included.includes(item)} onChange={()=>toggle(included,item,setIncluded)}/> Include</label><label><input type="checkbox" checked={excluded.includes(item)} onChange={()=>toggle(excluded,item,setExcluded)}/> Exclude</label></div>)}</div>
      </section>
      <section className="ac-card"><div className="ac-card-title"><CalendarClock size={17}/><div><b>Release & due dates</b><small>Release time and due time are independent</small></div></div>
        <label className="ac-field">Release mode<select value={releaseMode} onChange={e=>setReleaseMode(e.target.value as "IMMEDIATE"|"SCHEDULED")}><option value="IMMEDIATE">Immediate (upon later publication)</option><option value="SCHEDULED">Scheduled release</option></select></label>
        {releaseMode==="SCHEDULED" && <label className="ac-field">Scheduled release timestamp<input type="datetime-local" value={releaseAt} onChange={e=>setReleaseAt(e.target.value)}/></label>}
        <label className="ac-field">Default due date & time<input type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)}/></label>
        <label className="ac-field">Institute timezone<select value={timezone} onChange={e=>setTimezone(e.target.value)}><option value="">Select institute timezone</option><option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+05:30)</option><option value="UTC">UTC</option></select></label>
        <div className="ac-note">No timezone is inferred from the device. Timestamps are displayed with the selected institute timezone label.</div>
      </section>
      <section className="ac-card"><div className="ac-card-title"><Clock3 size={17}/><div><b>Submission & correction rules</b><small>Unsettled policy choices remain explicitly unconfigured</small></div></div>
        <label className="ac-field">Late submission<select value={lateRule} onChange={e=>setLateRule(e.target.value as AssignmentConfigurationValue["lateSubmissionRule"])}><option value="UNCONFIGURED">Not configured — policy decision required</option><option value="ACCEPT_AND_FLAG">Accept at any time and calculate late flag</option><option value="BLOCK_AFTER_DEADLINE">Block after deadline</option></select></label>
        <label className="ac-field">Resubmission / correction<select value={resubmission} onChange={e=>setResubmission(e.target.value as AssignmentConfigurationValue["resubmissionPolicy"])}><option value="UNCONFIGURED">Not configured — policy decision required</option><option value="CORRECTION_ALLOWED">Correction permitted within original attempt cycle</option><option value="NO_CORRECTION">Correction not permitted</option></select></label>
        <div className="ac-policy"><ShieldCheck size={16}/><span>Late flag is calculated against each learner's effective deadline. Correction, if enabled, remains within the original attempt cycle and does not create a fresh practice attempt.</span></div>
      </section>
      <section className="ac-card"><div className="ac-card-title"><AlertTriangle size={17}/><div><b>Individual deadline exceptions</b><small>Each override requires a reason and authoriser</small></div></div>
        <div className="ac-exception-form"><label className="ac-field">Learner<select value={learner} onChange={e=>setLearner(e.target.value)}><option value="">Select learner</option>{learnerOptions.map(item=><option key={item}>{item}</option>)}</select></label>
          <label className="ac-field">Override deadline<input type="datetime-local" value={exceptionDeadline} onChange={e=>setExceptionDeadline(e.target.value)}/></label>
          <label className="ac-field">Reason<input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Required reason"/></label>
          <label className="ac-field">Authoriser<input value={authoriser} onChange={e=>setAuthoriser(e.target.value)} placeholder="Authoriser identity"/></label>
          <button type="button" onClick={addException}>Add authorised exception</button></div>
        {exceptions.length>0?<ul className="ac-exceptions">{exceptions.map(item=><li key={item.learner}><b>{item.learner}</b><span>{item.deadline} · {item.reason} · Authorised by {item.authoriser}</span></li>)}</ul>:<div className="ac-empty">No individual deadline overrides added.</div>}
      </section>
    </div>
    <div className="ac-summary"><div><small>OBLIGATION PREVIEW · ILLUSTRATIVE ONLY</small><b>{Math.max(0,demoObligationCount)} learners (estimated)</b><span>Not an authoritative eligibility or obligation count. Publication-time server resolution is required.</span></div><div><small>CONFIGURATION STATE</small><b>{timezone ? "Timezone selected" : "Timezone required"} · {lateRule==="UNCONFIGURED"||resubmission==="UNCONFIGURED"?"Policy decisions pending":"Rules selected"}</b><span>No student obligations are created in this draft screen.</span></div></div>
    {error&&<div className="ac-error" role="alert">{error}</div>}
    <div className="ac-actions"><button type="button" className="ac-back" onClick={onBack}>Back to content selection</button><button type="button" className="ac-continue" onClick={continueConfig}>Continue to review</button></div>
  </div>;
}
