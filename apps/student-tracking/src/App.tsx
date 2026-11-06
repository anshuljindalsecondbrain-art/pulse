import { useEffect, useMemo, useState } from "react";\nimport type { FormEvent, KeyboardEvent, ReactNode } from "react";
import { Activity, ArrowRight, Bell, BookOpen, CalendarDays, Check, CheckCheck, ChevronDown, CircleHelp, ClipboardList, Command, Download, GraduationCap, LayoutDashboard, Plus, Search, Settings2, ShieldCheck, Sparkles, Users, X } from "lucide-react";

type Status = "U" | "C" | "I" | "D" | "T";
type Student = { id: string; name: string; roll: string; batch: string };
type Exercise = { id: string; name: string; chapter: string; subject: string; count: number; batch: string; due: string; created: string };
type Marks = Record<string, Status>;
const statusMeta: Record<Status, { label: string; tone: string; next: Status }> = {
  U: { label: "Unattempted", tone: "neutral", next: "C" },
  C: { label: "Correct", tone: "green", next: "I" },
  I: { label: "Incorrect", tone: "red", next: "D" },
  D: { label: "Doubt", tone: "amber", next: "T" },
  T: { label: "Solved by teacher", tone: "violet", next: "U" }
};
const initialStudents: Student[] = [
  { id: "s1", name: "Aarav Sharma", roll: "P-021", batch: "JEE XII · Alpha" },
  { id: "s2", name: "Ananya Gupta", roll: "P-024", batch: "JEE XII · Alpha" },
  { id: "s3", name: "Dev Mehta", roll: "P-028", batch: "JEE XII · Alpha" },
  { id: "s4", name: "Ishita Jain", roll: "P-031", batch: "JEE XII · Alpha" },
  { id: "s5", name: "Kabir Rathore", roll: "P-037", batch: "JEE XII · Alpha" },
  { id: "s6", name: "Meera Soni", roll: "P-042", batch: "JEE XII · Alpha" },
  { id: "s7", name: "Raghav Bansal", roll: "P-046", batch: "JEE XII · Alpha" },
  { id: "s8", name: "Sara Khan", roll: "P-051", batch: "JEE XII · Alpha" }
];
const initialExercises: Exercise[] = [
  { id: "e1", name: "DPP-08 · Rotational Motion", chapter: "Rotational Motion", subject: "Physics", count: 12, batch: "JEE XII · Alpha", due: "2026-11-07", created: "Today" },
  { id: "e2", name: "DPP-07 · Work, Energy & Power", chapter: "Work, Energy & Power", subject: "Physics", count: 10, batch: "JEE XII · Alpha", due: "2026-11-06", created: "Yesterday" },
  { id: "e3", name: "Practice Set · Electrostatics", chapter: "Electrostatics", subject: "Physics", count: 15, batch: "JEE XII · Alpha", due: "2026-11-05", created: "Nov 3" }
];
const seedMarks: Marks = Object.fromEntries([
  ["s1-e1-1","C"],["s1-e1-2","C"],["s1-e1-3","I"],["s1-e1-4","D"],["s1-e1-5","C"],
  ["s2-e1-1","C"],["s2-e1-2","I"],["s2-e1-3","I"],["s2-e1-4","D"],["s2-e1-5","C"],
  ["s3-e1-1","C"],["s3-e1-2","C"],["s3-e1-3","C"],["s3-e1-4","T"],["s3-e1-5","U"],
  ["s4-e1-1","I"],["s4-e1-2","D"],["s4-e1-3","I"],["s4-e1-4","U"],["s4-e1-5","U"],
  ["s5-e1-1","C"],["s5-e1-2","C"],["s5-e1-3","D"],["s5-e1-4","C"],["s5-e1-5","C"],
  ["s6-e1-1","C"],["s6-e1-2","I"],["s6-e1-3","D"],["s6-e1-4","D"],["s6-e1-5","U"],
  ["s7-e1-1","C"],["s7-e1-2","C"],["s7-e1-3","C"],["s7-e1-4","C"],["s7-e1-5","C"],
  ["s8-e1-1","I"],["s8-e1-2","D"],["s8-e1-3","I"],["s8-e1-4","U"],["s8-e1-5","U"]
] as [string, Status][]);

function readStore<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function App() {
  const [students, setStudents] = useState<Student[]>(() => readStore("pulse.students", initialStudents));
  const [exercises, setExercises] = useState<Exercise[]>(() => readStore("pulse.exercises", initialExercises));
  const [marks, setMarks] = useState<Marks>(() => readStore("pulse.marks", seedMarks));
  const [activeExercise, setActiveExercise] = useState("e1");
  const [query, setQuery] = useState("");
  const [showCreator, setShowCreator] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [tab, setTab] = useState<"matrix" | "overview">("matrix");
  const [chapter, setChapter] = useState("Rotational Motion");
  const [exerciseName, setExerciseName] = useState("");
  const [questionCount, setQuestionCount] = useState(20);
  const [batch, setBatch] = useState("JEE XII · Alpha");
  const [due, setDue] = useState("2026-11-08");
  const [toast, setToast] = useState("");
  const [filter, setFilter] = useState("All students");
  const [experiment, setExperiment] = useState<"A" | "B">("B");

  useEffect(() => { localStorage.setItem("pulse.students", JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem("pulse.exercises", JSON.stringify(exercises)); }, [exercises]);
  useEffect(() => { localStorage.setItem("pulse.marks", JSON.stringify(marks)); }, [marks]);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(""), 2500); return () => window.clearTimeout(t); }, [toast]);

  const exercise = exercises.find(e => e.id === activeExercise) ?? exercises[0];
  const roster = students.filter(s => s.batch === (exercise?.batch ?? batch));
  const visibleStudents = roster.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.roll.toLowerCase().includes(query.toLowerCase())).filter(s => filter === "All students" || (filter === "Needs attention" && Array.from({length: exercise?.count ?? 0}, (_,i) => marks[`${s.id}-${exercise?.id}-${i+1}`] ?? "U").some(v => v === "D" || v === "I")));
  const questionStats = useMemo(() => Array.from({length: exercise?.count ?? 0}, (_,i) => {
    const states = roster.map(s => marks[`${s.id}-${exercise?.id}-${i+1}`] ?? "U");
    return { q: i+1, wrong: states.filter(s => s === "I").length, doubt: states.filter(s => s === "D").length, done: states.filter(s => s !== "U").length, total: states.length };
  }), [exercise, roster, marks]);
  const totalCells = roster.length * (exercise?.count ?? 0);
  const doneCells = questionStats.reduce((n,q) => n + q.done, 0);
  const completion = totalCells ? Math.round(doneCells / totalCells * 100) : 0;
  const doubts = questionStats.reduce((n,q) => n + q.doubt, 0);
  const incorrect = questionStats.reduce((n,q) => n + q.wrong, 0);
  const flaggedQuestions = questionStats.filter(q => q.total && (q.wrong + q.doubt) / q.total >= .4);

  function updateMark(studentId: string, q: number, next?: Status) {
    const key = `${studentId}-${exercise.id}-${q}`;
    setMarks(prev => ({...prev, [key]: next ?? statusMeta[prev[key] ?? "U"].next}));
  }
  function createExercise(e: FormEvent) {
    e.preventDefault();
    if (!exerciseName.trim() || questionCount < 1 || questionCount > 100) return;
    const item: Exercise = { id: `e${Date.now()}`, name: exerciseName.trim(), chapter, subject: "Physics", count: questionCount, batch, due, created: "Just now" };
    setExercises(prev => [item, ...prev]); setActiveExercise(item.id); setShowCreator(false); setExerciseName(""); setTab("matrix");
    setToast(`Created ${item.name} with ${questionCount} numbered slots.`);
  }
  function exportCsv() {
    const rows = [["Student","Roll",...Array.from({length:exercise.count},(_,i)=>`Q${i+1}`)]];
    roster.forEach(s => rows.push([s.name,s.roll,...Array.from({length:exercise.count},(_,i)=>statusMeta[marks[`${s.id}-${exercise.id}-${i+1}`] ?? "U"].label)]));
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); const a=document.createElement("a"); a.href=url; a.download=`${exercise.name.replaceAll(" ","-")}-matrix.csv`; a.click(); URL.revokeObjectURL(url);
  }
  function addStudent(e: React.FormEvent) {
    e.preventDefault(); const form = e.currentTarget as HTMLFormElement; const data = new FormData(form);
    const name=String(data.get("name")||"").trim(); if(!name) return;
    setStudents(prev=>[...prev,{id:`s${Date.now()}`,name,roll:String(data.get("roll")||`P-${String(prev.length+1).padStart(3,"0")}`),batch}]); form.reset(); setShowStudents(false); setToast("Student added to the selected batch.");
  }
  function handleKeys(e: KeyboardEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "SELECT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
    if (["1","2","3","4","5"].includes(e.key)) { e.preventDefault(); const states:Status[]=["U","C","I","D","T"]; const el=document.activeElement as HTMLElement; const sid=el?.dataset?.student; const q=Number(el?.dataset?.question); if(sid&&q) updateMark(sid,q,states[Number(e.key)-1]); }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Activity size={19}/></div><div><b>PULSE</b><span>ACADEMIC OS</span></div></div>
      <div className="workspace"><div className="workspace-avatar">V</div><div><b>Virasat Foundations</b><span>Jodhpur · Main Campus</span></div><ChevronDown size={14}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>
        <button className="nav-item"><LayoutDashboard size={17}/> Overview</button>
        <button className="nav-item active"><ClipboardList size={17}/> Abhyas Matrix <span className="nav-count">A</span></button>
        <button className="nav-item" onClick={()=>setShowStudents(true)}><Users size={17}/> Students</button>
        <button className="nav-item"><BookOpen size={17}/> Exercises & DPPs</button>
        <button className="nav-item"><CircleHelp size={17}/> Doubt Radar <span className="nav-badge">{doubts}</span></button>
        <button className="nav-item"><GraduationCap size={17}/> Academic Review</button>
      </nav>
      <div className="nav-label second">MANAGEMENT</div>
      <nav><button className="nav-item"><CalendarDays size={17}/> Attendance</button><button className="nav-item"><Activity size={17}/> Insights</button><button className="nav-item"><Settings2 size={17}/> Settings</button></nav>
      <div className="sidebar-bottom"><div className="status-dot"></div><div><b>System operational</b><span>Local preview · Demo data</span></div></div>
      <div className="user-profile"><div className="user-avatar">AJ</div><div><b>Anshul Jindal</b><span>Physics Faculty</span></div><ChevronDown size={15}/></div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="breadcrumbs">PULSE <span>/</span> WORKSPACE <span>/</span> <b>ABHYAS MATRIX</b></div><div className="top-actions"><span className="date-chip"><CalendarDays size={14}/> Friday, 06 Nov 2026</span><button className="icon-btn" aria-label="Notifications"><Bell size={17}/><i/></button><div className="top-avatar">AJ</div></div></header>
      <div className="content">
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> SYSTEM A · STUDENT WORK TRACKING</div><h1>Abhyas Matrix</h1><p>One view of every student's practice. Capture work in class, identify roadblocks, and keep every learning signal traceable.</p></div><div className="heading-actions"><button className="btn secondary" onClick={exportCsv}><Download size={15}/> Export matrix</button><button className="btn primary" onClick={()=>setShowCreator(true)}><Plus size={16}/> Quick DPP</button></div></div>
        <div className="notice"><div className="notice-icon"><ShieldCheck size={17}/></div><div><b>Operational tracking is independent of deep tagging.</b><span>Exercises can be created and tracked with chapter scope and numbered slots. Topic, concept and archetype enrichment can be connected later without changing original student evidence.</span></div><span className="notice-tag">SYSTEM A</span></div>
        <div className="metric-grid">
          <Metric icon={<ClipboardList size={17}/>} label="Active exercises" value={String(exercises.length).padStart(2,"0")} detail="Across selected batch" />
          <Metric icon={<CheckCheck size={17}/>} label="Work recorded" value={completion+"%"} detail={`${doneCells.toLocaleString()} of ${totalCells.toLocaleString()} cells`} accent="green"/>
          <Metric icon={<CircleHelp size={17}/>} label="Open doubts" value={String(doubts).padStart(2,"0")} detail="Awaiting teacher attention" accent="amber"/>
          <Metric icon={<Users size={17}/>} label="Needs attention" value={String(flaggedQuestions.length).padStart(2,"0")} detail="Questions with ≥40% wrong / doubt" accent="red"/>
        </div>
        <div className="section-toolbar"><div className="tabs"><button className={tab==="matrix"?"selected":""} onClick={()=>setTab("matrix")}>Question matrix</button><button className={tab==="overview"?"selected":""} onClick={()=>setTab("overview")}>Exercise overview</button></div><div className="toolbar-right"><span className="live-indicator"><i/> LIVE WORKSPACE</span><span className="divider-v"/><button className="text-btn" onClick={()=>setShowStudents(true)}><Users size={15}/> Manage roster</button></div></div>
        {tab==="matrix" ? <section className="panel">
          <div className="panel-head"><div><div className="panel-kicker">LIVE TRACKING GRID</div><h2>Student performance matrix</h2><p>Tap a cell to cycle through the five operational states.</p></div><div className="panel-controls"><label className="select-wrap"><span>Exercise</span><select value={activeExercise} onChange={e=>setActiveExercise(e.target.value)}>{exercises.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select><ChevronDown size={14}/></label><label className="select-wrap batch-select"><span>Batch</span><select value={exercise?.batch??batch} onChange={e=>{const selected=exercises.find(x=>x.id===activeExercise); if(selected){setExercises(prev=>prev.map(x=>x.id===selected.id?{...x,batch:e.target.value}:x));}}}><option>JEE XII · Alpha</option><option>JEE XII · Beta</option><option>JEE XI · Alpha</option></select><ChevronDown size={14}/></label></div></div>
          <div className="exercise-strip"><div className="exercise-symbol"><BookOpen size={18}/></div><div className="exercise-info"><b>{exercise?.name}</b><span>{exercise?.subject} <i>·</i> {exercise?.chapter} <i>·</i> {exercise?.count} questions</span></div><div className="exercise-meta"><span><Users size={14}/> {roster.length} students</span><span><CalendarDays size={14}/> Due {exercise?.due}</span></div><div className="completion-mini"><b>{completion}%</b><span>RECORDED</span><div><i style={{width:completion+"%"}}/></div></div></div>
          <div className="matrix-toolbar"><div className="legend">{(["C","I","D","T","U"] as Status[]).map(s=><span key={s}><i className={"legend-dot "+statusMeta[s].tone}/>{statusMeta[s].label}</span>)}</div><div className="matrix-tools"><label className="search-box"><Search size={14}/><input placeholder="Find student..." value={query} onChange={e=>setQuery(e.target.value)}/></label><select className="filter-select" value={filter} onChange={e=>setFilter(e.target.value)}><option>All students</option><option>Needs attention</option></select><button className="icon-btn small" title="Export CSV" onClick={exportCsv}><Download size={15}/></button></div></div>
          <div className="table-wrap" tabIndex={0} onKeyDown={handleKeys}><table className="matrix-table"><thead><tr><th className="student-col"><span>STUDENT / ROLL NO.</span></th>{Array.from({length:exercise?.count??0},(_,i)=><th key={i}><span>Q{i+1}</span></th>)}<th className="summary-col"><span>DONE</span></th></tr></thead><tbody>
            {visibleStudents.map((s,index)=>{const states=Array.from({length:exercise.count},(_,i)=>marks[`${s.id}-${exercise.id}-${i+1}`]??"U");const done=states.filter(x=>x!=="U").length;return <tr key={s.id}><td className="student-cell"><div className="student-ident"><div className={"student-avatar av-"+(index%5)}>{s.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><div><b>{s.name}</b><span>{s.roll}</span></div></div></td>{states.map((state,i)=><td key={i}><button className={"status-cell "+statusMeta[state].tone} title={statusMeta[state].label+" · click to change"} aria-label={s.name+" question "+(i+1)+": "+statusMeta[state].label} data-student={s.id} data-question={i+1} onClick={()=>updateMark(s.id,i+1)}>{state==="U"?"—":state}</button></td>)}<td className="done-cell"><b>{done}</b><span>/{exercise.count}</span></td></tr>})}
            <tr className="aggregate-row"><td><b>COHORT SIGNAL</b><span> Wrong + doubt concentration</span></td>{questionStats.map(q=><td key={q.q}><div className={"signal "+((q.wrong+q.doubt)/Math.max(1,q.total)>=.4?"hot":"")}><b>{q.wrong+q.doubt}</b><span>/{q.total}</span></div></td>)}<td><span className="aggregate-total">{incorrect+doubts}</span></td></tr>
          </tbody></table></div>
          <div className="panel-foot"><span>Showing <b>{visibleStudents.length}</b> of <b>{roster.length}</b> students · Changes persist in this browser preview</span><span className="keyboard-hint"><Command size={12}/> Shortcuts: <kbd>1</kbd>–<kbd>5</kbd> status · <kbd>←</kbd><kbd>→</kbd> navigate</span></div>
        </section> : <section className="panel overview-panel"><div className="panel-head"><div><div className="panel-kicker">EXERCISE LIBRARY</div><h2>Assigned practice</h2><p>Quickly reopen a DPP or inspect its cohort signals.</p></div><button className="btn primary" onClick={()=>setShowCreator(true)}><Plus size={15}/> New exercise</button></div><div className="exercise-list">{exercises.map(x=><button className="exercise-row" key={x.id} onClick={()=>{setActiveExercise(x.id);setTab("matrix");}}><div className="exercise-symbol"><BookOpen size={18}/></div><div><b>{x.name}</b><span>{x.chapter} · {x.count} questions · {x.batch}</span></div><span className="exercise-due">Due {x.due}</span><ArrowRight size={16}/></button>)}</div></section>}
        <div className="bottom-grid"><section className="panel radar-panel"><div className="subpanel-head"><div><div className="panel-kicker">COHORT DIAGNOSTICS</div><h3>Doubt Radar</h3></div><span className="panel-icon amber"><CircleHelp size={17}/></span></div><p className="subcopy">Questions where the cohort needs intervention.</p>{questionStats.filter(q=>q.doubt>0||q.wrong>0).sort((a,b)=>(b.doubt+b.wrong)-(a.doubt+a.wrong)).slice(0,3).map(q=><div className="radar-row" key={q.q}><div className="q-bubble">Q{q.q}</div><div className="radar-detail"><b>{q.doubt} doubts · {q.wrong} incorrect</b><span>{q.total?Math.round((q.doubt+q.wrong)/q.total*100):0}% of cohort flagged</span></div><div className="radar-track"><i style={{width:`${Math.min(100,(q.doubt+q.wrong)/Math.max(1,q.total)*100)}%`}}/></div></div>)}{!questionStats.some(q=>q.doubt||q.wrong)&&<div className="empty-state">No cohort roadblocks detected.</div>}<button className="inline-link" onClick={()=>setFilter("Needs attention")}>Filter students needing attention <ArrowRight size={14}/></button></section>
        <section className="panel experiment-panel"><div className="subpanel-head"><div><div className="panel-kicker">PRODUCT EXPERIMENT</div><h3>Faculty logging workflow</h3></div><span className="experiment-pill"><Sparkles size={12}/> A/B TEST</span></div><p className="subcopy">Compare the traditional matrix against the tactile fast-log interaction.</p><div className="experiment-switch"><button className={experiment==="A"?"on":""} onClick={()=>setExperiment("A")}>Variant A · Classic</button><button className={experiment==="B"?"on":""} onClick={()=>setExperiment("B")}>Variant B · Fast-log</button></div><div className="variant-card"><div className="variant-icon">{experiment==="A"?<ClipboardList size={17}/>:<Command size={17}/>}</div><div><b>{experiment==="A"?"Classic batch table":"Keyboard + tap workflow"}</b><span>{experiment==="A"?"Select a state from each cell, then review the batch.":"Tap to cycle status; use 1–5 for direct status entry."}</span></div></div><div className="metric-target"><span>PRIMARY METRIC</span><b>{experiment==="A"?"Baseline completion time":"Median roll-call time"}</b><strong>{experiment==="A"?"Measure baseline":"Target < 45 sec"}</strong></div><div className="experiment-note">Experiment assignment is a visual prototype only. Deterministic cohort allocation and telemetry require backend integration.</div></section></div>
        <footer className="footer"><span>© 2026 PULSE Academic OS</span><span>ABHYAS MATRIX <i>·</i> SYSTEM A</span><span>Built for focused academic operations</span></footer>
      </div>
    </main>
    {showCreator&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowCreator(false);}}><form className="modal" onSubmit={createExercise}><div className="modal-head"><div><div className="panel-kicker">15-SECOND EXERCISE SCAFFOLDER</div><h2>Create a quick DPP</h2><p>Start tracking now. Question identities and deep tags can be linked later.</p></div><button type="button" className="icon-btn" onClick={()=>setShowCreator(false)}><X size={18}/></button></div><label>Exercise name<input autoFocus required placeholder="DPP-09 · Centre of Mass" value={exerciseName} onChange={e=>setExerciseName(e.target.value)}/></label><div className="form-grid"><label>Subject<select defaultValue="Physics"><option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option></select></label><label>Chapter<select value={chapter} onChange={e=>setChapter(e.target.value)}><option>Rotational Motion</option><option>Work, Energy & Power</option><option>Electrostatics</option><option>Current Electricity</option><option>Kinematics</option><option>Thermodynamics</option><option>Full Syllabus</option></select></label></div><div className="form-grid"><label>Question count<input type="number" min="1" max="100" value={questionCount} onChange={e=>setQuestionCount(Number(e.target.value))}/></label><label>Assign to batch<select value={batch} onChange={e=>setBatch(e.target.value)}><option>JEE XII · Alpha</option><option>JEE XII · Beta</option><option>JEE XI · Alpha</option></select></label></div><label>Due date<input type="date" value={due} onChange={e=>setDue(e.target.value)}/></label><div className="slot-preview"><div><b>Auto-generated slots</b><span>Numbered Q1–Q{questionCount||0} · no QBMS dependency</span></div><div className="slot-samples"><span>Q1</span><span>Q2</span><span>Q3</span><i>···</i><span>Q{questionCount||0}</span></div></div><div className="modal-actions"><button type="button" className="btn secondary" onClick={()=>setShowCreator(false)}>Cancel</button><button type="submit" className="btn primary"><Plus size={15}/> Create & open matrix</button></div></form></div>}
    {showStudents&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowStudents(false);}}><form className="modal compact-modal" onSubmit={addStudent}><div className="modal-head"><div><div className="panel-kicker">ROSTER MANAGEMENT</div><h2>Add a student</h2><p>Add a learner to the currently selected batch.</p></div><button type="button" className="icon-btn" onClick={()=>setShowStudents(false)}><X size={18}/></button></div><label>Student name<input name="name" autoFocus required placeholder="Full name"/></label><label>Roll number<input name="roll" placeholder="e.g. P-064"/></label><label>Batch<select value={batch} onChange={e=>setBatch(e.target.value)}><option>JEE XII · Alpha</option><option>JEE XII · Beta</option><option>JEE XI · Alpha</option></select></label><div className="modal-actions"><button type="button" className="btn secondary" onClick={()=>setShowStudents(false)}>Cancel</button><button type="submit" className="btn primary"><Plus size={15}/> Add student</button></div></form></div>}
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}
function Metric({icon,label,value,detail,accent=""}:{icon:ReactNode;label:string;value:string;detail:string;accent?:string}) { return <div className="metric-card"><div className={"metric-icon "+accent}>{icon}</div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-detail">{detail}</div></div>; }
export default App;