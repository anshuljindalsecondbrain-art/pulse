import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import type { DashboardAssignment, AssignmentConfigurationValue } from "./WorkAssignmentDashboard";
import { ContentSelector, type SelectedContentSlot } from "./ContentSelector";
import { AssignmentConfiguration } from "./AssignmentConfiguration";
import { AssignmentReview } from "./AssignmentReview";

type Props = {
  onCancel: () => void;
  onSaveDraft: (draft: DashboardAssignment & { classLevel: string; stream: string; sourceType: string; instructions: string; owner: string; configuration: AssignmentConfigurationValue }) => void;
};
const steps = ["Academic scope", "Source / material", "Content selection", "Configuration", "Review & validation"];

export function CreateAssignment({ onCancel, onSaveDraft }: Props) {
  const [step,setStep]=useState(0);
  const [title,setTitle]=useState("");
  const [subject,setSubject]=useState("Physics");
  const [classLevel,setClassLevel]=useState("XII");
  const [stream,setStream]=useState("JEE");
  const [chapter,setChapter]=useState("");
  const [sourceType,setSourceType]=useState("Physical module");
  const [sourceLabel,setSourceLabel]=useState("");
  const [instructions,setInstructions]=useState("");
  const [owner,setOwner]=useState("Demo Faculty");
  const [selectedContent,setSelectedContent]=useState<SelectedContentSlot[]>([]);
  const [configuration,setConfiguration]=useState<AssignmentConfigurationValue|null>(null);
  const [saved,setSaved]=useState(false);
  const [error,setError]=useState("");
  const scopeValid=Boolean(title.trim()&&subject&&classLevel&&stream);
  const sourceValid=Boolean(sourceLabel.trim());
  function continueStep(){
    setError("");
    if(step===0&&!scopeValid){setError("Complete title, subject, class and stream.");return;}
    if(step===1&&!sourceValid){setError("Enter a stable source/material label.");return;}
    setStep(s=>Math.min(4,s+1));
  }
  function saveDraft(){
    if(!scopeValid||!sourceValid||!selectedContent.length||!configuration){setError("Complete scope, source, content selection and assignment configuration.");return;}
    const due=configuration.dueAt.slice(0,10);
    onSaveDraft({
      id:`assignment-draft-${Date.now()}`,name:title.trim(),chapter:chapter.trim()||"Chapter context not specified",
      subject,count:selectedContent.length,batch:configuration.recipientBatches.join(", "),
      due,created:"Just now",lifecycleStatus:"DRAFT",
      questionRefs:selectedContent.map(slot=>slot.sourceRef),
      sourceGroups:[...new Set(selectedContent.map(slot=>slot.sourceLabel))],
      classLevel,stream,sourceType,instructions:instructions.trim(),owner,configuration,
    });
    setSaved(true);
  }
  if(step===2)return <ContentSelector subject={subject} classLevel={classLevel} stream={stream} initialSelection={selectedContent} onBack={()=>setStep(1)} onContinue={slots=>{setSelectedContent(slots);setStep(3);}}/>;
  if(step===3)return <div className="ca-page"><header className="ca-header"><button onClick={()=>setStep(2)}><ArrowLeft size={15}/> Back to content</button><span>LOCAL PREVIEW · DEMO DATA</span></header><main className="ca-main"><AssignmentConfiguration initialBatch="JEE XII · Alpha" initialDue="2026-11-14" onBack={()=>setStep(2)} onContinue={value=>{setConfiguration(value);setError("");setStep(4);}}/></main></div>;
  if(step===4&&configuration&&!saved)return <div className="ca-page"><header className="ca-header"><button onClick={()=>setStep(3)}><ArrowLeft size={15}/> Back to configuration</button><span>LOCAL PREVIEW · DEMO DATA</span></header><main className="ca-main"><AssignmentReview snapshot={{title,subject,classLevel,stream,chapter,sourceType,sourceLabel,owner,instructions,selectedCount:selectedContent.length,sourceGroups:[...new Set(selectedContent.map(slot=>slot.sourceLabel))],questionRefs:selectedContent.map(slot=>slot.sourceRef),configuration}} onBack={()=>setStep(3)} onSaveDraft={saveDraft}/></main></div>;
  if(saved)return <div className="ca-page"><div className="ca-success"><div className="ca-success-icon"><Check size={25}/></div><h1>Draft saved locally</h1><p>Configuration and selected physical slot references are stored in this browser preview. No obligations were created, no approval was requested and nothing was published.</p><button onClick={onCancel}>Return to assignments</button></div></div>;
  return <div className="ca-page">
    <header className="ca-header"><button onClick={onCancel}><ArrowLeft size={15}/> Back to assignments</button><span>LOCAL PREVIEW · DEMO DATA</span></header>
    <main className="ca-main">
      <div className="ca-breadcrumb">SYSTEM A <i>/</i> ASSIGNMENT MANAGEMENT <i>/</i> CREATE ASSIGNMENT</div>
      <div className="ca-title"><div><div className="ca-eyebrow">M08-03 · ASSIGNMENT BUILDER</div><h1>Create Assignment</h1><p>Define academic scope, source material, selected work and configuration.</p></div><span className="ca-draft-tag">DRAFT · NOT PUBLISHED</span></div>
      <nav className="ca-steps">{steps.map((label,index)=><button key={label} className={index===step?"current":index<step?"complete":""} onClick={()=>index<step&&setStep(index)}><span>{index<step?<Check size={13}/>:index+1}</span>{label}</button>)}</nav>
      <section className="ca-panel">
        {step===0&&<><h2>1. Academic scope</h2><p className="ca-help">Set the academic context first. Content selection remains unavailable until this scope is valid.</p><label>Assignment title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Rotational Motion · Practice Assignment"/></label><div className="ca-grid"><label>Subject<select value={subject} onChange={e=>setSubject(e.target.value)}>{["Physics","Chemistry","Mathematics","Biology"].map(x=><option key={x}>{x}</option>)}</select></label><label>Class<select value={classLevel} onChange={e=>setClassLevel(e.target.value)}>{["XI","XII","VI","VII","VIII","IX","X"].map(x=><option key={x}>{x}</option>)}</select></label><label>Stream<select value={stream} onChange={e=>setStream(e.target.value)}>{["JEE","NEET","COMMON","School"].map(x=><option key={x}>{x}</option>)}</select></label><label>Chapter context (optional)<input value={chapter} onChange={e=>setChapter(e.target.value)} placeholder="e.g. Rotational Motion"/></label></div></>}
        {step===1&&<><h2>2. Source / material</h2><p className="ca-help">A stable source label is required. Question taxonomy and QBMS identifiers are not mandatory.</p><label>Source type<select value={sourceType} onChange={e=>setSourceType(e.target.value)}>{["Physical module","Exercise","DPP","Selected question range","Manual / teacher-created"].map(x=><option key={x}>{x}</option>)}</select></label><label>Source / material label<input value={sourceLabel} onChange={e=>setSourceLabel(e.target.value)} placeholder="e.g. Module 04 · Exercise 2 · Q1–20"/></label><label>Instructions / description<textarea rows={4} value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Instructions visible to assigned learners…"/></label><div className="ca-info">Source content is referenced by its display label in this prototype. No question-bank content is copied or created here.</div><label>Assignment owner<input value={owner} onChange={e=>setOwner(e.target.value)}/></label></>}
        {step===4&&<><h2>5. Review draft</h2><p className="ca-help">Review configuration before saving the local draft.</p><div className="ca-review">{[["Title",title],["Subject",subject],["Class / stream",`${classLevel} · ${stream}`],["Chapter",chapter||"Not specified"],["Source",`${sourceType} · ${sourceLabel}`],["Selected work",`${selectedContent.length} slots across ${new Set(selectedContent.map(slot=>slot.sourceId)).size} sources`],["Recipient batches",configuration?.recipientBatches.join(", ")||"Not configured"],["Release",configuration?.releaseMode||"Not configured"],["Due timestamp",configuration?.dueAt||"Not configured"],["Timezone",configuration?.instituteTimezone||"Not configured"],["Late rule",configuration?.lateSubmissionRule||"Not configured"],["Correction",configuration?.resubmissionPolicy||"Not configured"],["Individual exceptions",String(configuration?.individualExceptions.length||0)]].map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div><div className="ca-info">Saving creates only a local draft. Publication, approval, obligation creation and authoritative recipient resolution are not performed.</div></>}
        {error&&<div className="ca-error" role="alert">{error}</div>}
        <div className="ca-actions"><button className="ca-secondary" onClick={step===0?onCancel:()=>{setError("");setStep(s=>s-1)}}>{step===0?"Cancel":"Previous"}</button>{step<4?<button className="ca-primary" onClick={continueStep}>{step===1?"Continue to Content Selector":"Continue"} <ArrowRight size={15}/></button>:<button className="ca-primary" onClick={saveDraft}><Save size={15}/> Save draft</button>}</div>
      </section><footer className="ca-footer">PULSE · MODULE 08 · M08-05 <span>Configuration · local draft only</span></footer>
    </main>
  </div>;
}
