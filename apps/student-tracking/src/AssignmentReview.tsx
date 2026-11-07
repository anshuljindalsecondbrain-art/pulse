import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ShieldAlert, UserRoundCheck } from "lucide-react";
import type { AssignmentConfigurationValue } from "./WorkAssignmentDashboard";
import "./assignment-review.css";

type ReviewSnapshot = {
  title:string; subject:string; classLevel:string; stream:string; chapter:string; sourceType:string; sourceLabel:string;
  owner:string; instructions:string; selectedCount:number; sourceGroups:string[]; questionRefs:string[];
  configuration:AssignmentConfigurationValue;
};
type Props = { snapshot:ReviewSnapshot; onBack:()=>void; onSaveDraft:()=>void; };
type Decision = "APPROVE"|"RETURN"|"REJECT";

export function AssignmentReview({snapshot,onBack,onSaveDraft}:Props){
 const [reviewer,setReviewer]=useState("");
 const [decision,setDecision]=useState<Decision>("APPROVE");
 const [reason,setReason]=useState("");
 const [acknowledged,setAcknowledged]=useState(false);
 const [message,setMessage]=useState("");
 const validations=useMemo(()=>{
  const c=snapshot.configuration;
  const rows=[
   {label:"Academic scope is complete",ok:Boolean(snapshot.title&&snapshot.subject&&snapshot.classLevel&&snapshot.stream),severity:"critical"},
   {label:"At least one stable source slot is selected",ok:snapshot.questionRefs.length>0,severity:"critical"},
   {label:"At least one recipient batch is selected",ok:c.recipientBatches.length>0,severity:"critical"},
   {label:"Institute timezone is explicit",ok:Boolean(c.instituteTimezone),severity:"critical"},
   {label:"Scheduled release precedes due timestamp",ok:c.releaseMode!=="SCHEDULED"||new Date(c.releaseAt).getTime()<new Date(c.dueAt).getTime(),severity:"critical"},
   {label:"Late-submission rule is configured",ok:c.lateSubmissionRule!=="UNCONFIGURED",severity:"warning"},
   {label:"Correction policy is configured",ok:c.resubmissionPolicy!=="UNCONFIGURED",severity:"warning"},
   {label:"Recipient exclusions have an explicit reason",ok:c.excludedIndividuals.length===0,severity:"warning"},
  ];
  return rows;
 },[snapshot]);
 const critical=validations.filter(x=>!x.ok&&x.severity==="critical");
 const warnings=validations.filter(x=>!x.ok&&x.severity==="warning");
 const creatorConflict=Boolean(reviewer.trim()&&reviewer.trim().toLowerCase()===snapshot.owner.trim().toLowerCase());
 function recordDecision(){
  setMessage("");
  if(!reviewer.trim()){setMessage("Reviewer identity is required.");return;}
  if(creatorConflict){setMessage("Creator self-approval is prohibited. Assign an independent authorised reviewer.");return;}
  if(decision==="APPROVE"&&critical.length){setMessage("Approval is blocked by critical validation failures.");return;}
  if(decision!=="APPROVE"&&!reason.trim()){setMessage("A reason is required for Return or Reject.");return;}
  if(warnings.length&&!acknowledged){setMessage("Acknowledge the outstanding warnings before recording this preview decision.");return;}
  setMessage("Decision preview validated. This prototype does not persist reviewer identity, authority, decision or approval state.");
 }
 return <div className="ar-page">
  <header className="ar-heading"><div><span>M08-06 · ASSIGNMENT REVIEW & VALIDATION</span><h2>Review assignment snapshot</h2><p>Inspect completeness and validation before an independent approval decision.</p></div><b>LOCAL PREVIEW</b></header>
  <div className="ar-grid">
   <section className="ar-card ar-summary"><div className="ar-card-title"><ClipboardCheck size={17}/><b>Read-only assignment summary</b></div>
    <div className="ar-pairs">{[["Assignment",snapshot.title],["Academic scope",`${snapshot.subject} · Class ${snapshot.classLevel} · ${snapshot.stream}`],["Chapter",snapshot.chapter||"Not specified"],["Source",`${snapshot.sourceType} · ${snapshot.sourceLabel}`],["Creator / owner",snapshot.owner],["Selected question slots",String(snapshot.selectedCount)],["Source groups",snapshot.sourceGroups.join(" · ")||"—"],["Recipient batches",snapshot.configuration.recipientBatches.join(" · ")||"—"],["Individual inclusions",String(snapshot.configuration.includedIndividuals.length)],["Individual exclusions",String(snapshot.configuration.excludedIndividuals.length)],["Default deadline",snapshot.configuration.dueAt],["Institute timezone",snapshot.configuration.instituteTimezone],["Release mode",snapshot.configuration.releaseMode],["Scheduled release",snapshot.configuration.releaseAt||"Immediate after later publication"],["Late-submission rule",snapshot.configuration.lateSubmissionRule],["Correction policy",snapshot.configuration.resubmissionPolicy],["Deadline exceptions",String(snapshot.configuration.individualExceptions.length)]].map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div>
    <div className="ar-source-list"><b>Selected stable source references</b>{snapshot.questionRefs.slice(0,12).map((ref,i)=><span key={ref}>{i+1}. {ref}</span>)}{snapshot.questionRefs.length>12&&<small>+ {snapshot.questionRefs.length-12} more references</small>}</div>
    {snapshot.instructions&&<div className="ar-instructions"><b>Student instructions</b><p>{snapshot.instructions}</p></div>}
   </section>
   <section className="ar-card"><div className="ar-card-title"><ShieldAlert size={17}/><b>Validation summary</b></div>
    <div className="ar-validation-counts"><div><b>{validations.filter(x=>x.ok).length}</b><span>Passed</span></div><div><b>{critical.length}</b><span>Critical failures</span></div><div><b>{warnings.length}</b><span>Warnings</span></div></div>
    <div className="ar-validation-list">{validations.map((item,i)=><div key={i} className={item.ok?"pass":"fail"}><span>{item.ok?<CheckCircle2 size={15}/>:<AlertTriangle size={15}/>}</span><div><b>{item.label}</b><small>{item.ok?"Passed":item.severity==="critical"?"Critical · approval blocked":"Warning · acknowledgement required"}</small></div></div>)}</div>
    <div className="ar-obligation"><b>Obligation impact preview</b><strong>Not authoritatively calculated</strong><p>Exact learner-level obligations require server-side eligibility resolution at publication. No obligations are created by review or approval.</p></div>
   </section>
  </div>
  <section className="ar-card ar-decision"><div className="ar-card-title"><UserRoundCheck size={17}/><b>Independent reviewer decision</b></div>
   <div className="ar-demo-warning">Reviewer authority, creator conflict and scope must be verified by the server. The identity below is only a local prototype input.</div>
   <label className="ar-field">Reviewer identity<input value={reviewer} onChange={e=>setReviewer(e.target.value)} placeholder="Enter assigned reviewer identity"/></label>
   <label className="ar-field">Decision<select value={decision} onChange={e=>setDecision(e.target.value as Decision)}><option value="APPROVE">Approve</option><option value="RETURN">Return to creator</option><option value="REJECT">Reject</option></select></label>
   {decision!=="APPROVE"&&<label className="ar-field">Reason (required)<textarea rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Explain required changes or rejection reason"/></label>}
   {warnings.length>0&&<label className="ar-ack"><input type="checkbox" checked={acknowledged} onChange={e=>setAcknowledged(e.target.checked)}/> I acknowledge the listed validation warnings.</label>}
   {creatorConflict&&<div className="ar-error">Creator and reviewer identities match. Self-approval is prohibited.</div>}
   {message&&<div className={message.startsWith("Decision preview validated")?"ar-notice":"ar-error"} role="status">{message}</div>}
   <div className="ar-actions"><button className="ar-secondary" onClick={onBack}>Back to configuration</button><button className="ar-secondary" onClick={onSaveDraft}>Save draft instead</button><button className="ar-primary" onClick={recordDecision} disabled={decision==="APPROVE"&&critical.length>0}>Validate decision preview</button></div>
  </section>
 </div>;
}
