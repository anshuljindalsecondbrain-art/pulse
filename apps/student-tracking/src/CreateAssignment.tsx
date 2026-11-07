import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import type { DashboardAssignment } from "./WorkAssignmentDashboard";
import { ContentSelector, type SelectedContentSlot } from "./ContentSelector";

type Props = {
  onCancel: () => void;
  onSaveDraft: (draft: DashboardAssignment & { classLevel: string; stream: string; sourceType: string; instructions: string; owner: string }) => void;
};

const steps = ["Academic scope", "Source / material", "Content selection", "Recipients", "Deadline", "Review"] as const;
const batches = ["JEE XII · Alpha", "JEE XII · Beta", "JEE XI · Alpha", "NEET XII · Alpha", "NEET XI · Alpha"];

export function CreateAssignment({ onCancel, onSaveDraft }: Props) {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [classLevel, setClassLevel] = useState("XII");
  const [stream, setStream] = useState("JEE");
  const [chapter, setChapter] = useState("");
  const [sourceType, setSourceType] = useState("Physical module");
  const [sourceLabel, setSourceLabel] = useState("");
  const [instructions, setInstructions] = useState("");
  const [batch, setBatch] = useState("JEE XII · Alpha");
  const [recipientDraft, setRecipientDraft] = useState(true);
  const [due, setDue] = useState("2026-11-14");
  const [owner, setOwner] = useState("Demo Faculty");
  const [selectedContent, setSelectedContent] = useState<SelectedContentSlot[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const scopeValid = Boolean(title.trim() && subject && classLevel && stream);
  const sourceValid = Boolean(sourceLabel.trim());
  const recipientValid = recipientDraft && Boolean(batch);
  const stepValid = step === 0 ? scopeValid : step === 1 ? sourceValid : step === 3 ? recipientValid : step === 4 ? Boolean(due) : true;
  const canContinue = stepValid;
  const previewCount = useMemo(() => batch.includes("XII") ? 8 : 8, [batch]);

  function continueStep() {
    setError("");
    if (!stepValid) {
      setError(step === 0 ? "Complete title, subject, class and stream before selecting source." : step === 1 ? "Enter a stable source/material label." : step === 3 ? "Select at least one recipient batch or save a recipient draft." : "Set a due date.");
      return;
    }
    setStep(current => Math.min(5, current + 1));
  }

  function saveDraft() {
    if (!scopeValid || !sourceValid || selectedContent.length === 0 || !recipientValid || !due) {
      setError("Complete academic scope, source label, recipient batch and deadline before saving.");
      return;
    }
    onSaveDraft({
      id: `assignment-draft-${Date.now()}`,
      name: title.trim(),
      chapter: chapter.trim() || "Chapter context not specified",
      subject,
      count: selectedContent.length,
      batch,
      due,
      created: "Just now",
      lifecycleStatus: "DRAFT",
      questionRefs: selectedContent.map(slot => slot.sourceRef),
      sourceGroups: [...new Set(selectedContent.map(slot => slot.sourceLabel))],
      classLevel,
      stream,
      sourceType,
      instructions: instructions.trim(),
      owner,
    });
    setSaved(true);
  }

  if (step === 2) return <ContentSelector subject={subject} classLevel={classLevel} stream={stream} initialSelection={selectedContent} onBack={() => setStep(1)} onContinue={slots => { setSelectedContent(slots); setStep(3); }} />;

  if (saved) return <div className="ca-page"><div className="ca-success"><div className="ca-success-icon"><Check size={25}/></div><h1>Draft saved locally</h1><p>The assignment draft is stored in this browser preview. No student obligations were created and nothing was published.</p><button onClick={onCancel}>Return to assignments</button></div></div>;

  return <div className="ca-page">
    <header className="ca-header"><button onClick={onCancel}><ArrowLeft size={15}/> Back to assignments</button><span>LOCAL PREVIEW · DEMO DATA</span></header>
    <main className="ca-main">
      <div className="ca-breadcrumb">SYSTEM A <i>/</i> ASSIGNMENT MANAGEMENT <i>/</i> CREATE ASSIGNMENT</div>
      <div className="ca-title"><div><div className="ca-eyebrow">M08-03 · ASSIGNMENT BUILDER</div><h1>Create Assignment</h1><p>Define the academic scope, choose source material, select recipients and set a deadline.</p></div><span className="ca-draft-tag">DRAFT · NOT PUBLISHED</span></div>
      <nav className="ca-steps">{steps.map((label,index)=><button key={label} className={index===step?"current":index<step?"complete":""} onClick={()=>index<step&&setStep(index)}><span>{index<step?<Check size={13}/>:index+1}</span>{label}</button>)}</nav>
      <section className="ca-panel">
        {step===0 && <><h2>1. Academic scope</h2><p className="ca-help">Set the academic context first. Content selection remains unavailable until this scope is valid.</p>
          <label>Assignment title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Rotational Motion · Practice Assignment"/></label>
          <div className="ca-grid"><label>Subject<select value={subject} onChange={e=>setSubject(e.target.value)}>{["Physics","Chemistry","Mathematics","Biology"].map(x=><option key={x}>{x}</option>)}</select></label><label>Class<select value={classLevel} onChange={e=>setClassLevel(e.target.value)}><option>XI</option><option>XII</option><option>VI</option><option>VII</option><option>VIII</option><option>IX</option><option>X</option></select></label><label>Stream<select value={stream} onChange={e=>setStream(e.target.value)}><option>JEE</option><option>NEET</option><option>COMMON</option><option>School</option></select></label><label>Chapter context (optional)<input value={chapter} onChange={e=>setChapter(e.target.value)} placeholder="e.g. Rotational Motion"/></label></div>
        </>}
        {step===1 && <><h2>2. Source / material</h2><p className="ca-help">A stable source label is required. Question taxonomy and QBMS identifiers are not mandatory.</p><label>Source type<select value={sourceType} onChange={e=>setSourceType(e.target.value)}><option>Physical module</option><option>Exercise</option><option>DPP</option><option>Selected question range</option><option>Manual / teacher-created</option></select></label><label>Source / material label<input value={sourceLabel} onChange={e=>setSourceLabel(e.target.value)} placeholder="e.g. Module 04 · Exercise 2 · Q1–20"/></label><label>Instructions / description<textarea rows={4} value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Instructions visible to the assigned learners…"/></label><div className="ca-info">Source content is referenced by its display label in this prototype. No question-bank content is copied or created here.</div></>}
        {step===3 && <><h2>4. Recipients</h2><p className="ca-help">Choose a recipient batch or retain a saved recipient draft. Eligibility preview is illustrative until the server-side eligibility service is connected.</p><label>Recipient batch<select value={batch} onChange={e=>setBatch(e.target.value)}>{batches.map(x=><option key={x}>{x}</option>)}</select></label><label className="ca-check"><input type="checkbox" checked={recipientDraft} onChange={e=>setRecipientDraft(e.target.checked)}/> Save this batch as the recipient draft</label><div className="ca-preview"><div><b>{previewCount}</b><span>demo learners in selected batch (illustrative)</span></div><small>Not an authoritative eligible-recipient count. No obligations are created at draft creation.</small></div></>}
        {step===4 && <><h2>5. Deadline</h2><p className="ca-help">Set the common due date. Individual overrides and institute timezone require backend support and are not available in this preview.</p><label>Common due date<input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label><label>Assignment owner<input value={owner} onChange={e=>setOwner(e.target.value)} placeholder="Owner name"/></label><div className="ca-info">Timezone: institute timezone not configured in local preview.</div></>}
        {step===5 && <><h2>6. Review draft</h2><p className="ca-help">Review the assignment details before saving a local draft.</p><div className="ca-review">{[["Title",title],["Subject",subject],["Class / stream",`${classLevel} · ${stream}`],["Chapter",chapter||"Not specified"],["Source",`${sourceType} · ${sourceLabel}`],["Selected work",`${selectedContent.length} slots across ${new Set(selectedContent.map(slot => slot.sourceId)).size} sources`],["Recipient batch",batch],["Due date",due],["Owner",owner]].map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div><div className="ca-info">Saving creates only a draft record in local preview storage. It retains selected physical slot references; it does not create obligations, submit for review, schedule or publish.</div></>}
        {error && <div className="ca-error" role="alert">{error}</div>}
        <div className="ca-actions"><button className="ca-secondary" onClick={step===0?onCancel:()=>{setError("");setStep(s=>s-1)}}>{step===0?"Cancel":"Previous"}</button>{step<5?<button className="ca-primary" onClick={continueStep} disabled={!canContinue}>{step===1 ? "Continue to Content Selector" : "Continue"} <ArrowRight size={15}/></button>:<button className="ca-primary" onClick={saveDraft}><Save size={15}/> Save draft</button>}</div>
      </section>
      <footer className="ca-footer">PULSE · MODULE 08 · M08-03 <span>Assignment creation · local draft only</span></footer>
    </main>
  </div>;
}
