import { useState } from "react";
import { createExerciseRecord, type ExerciseDraft } from "./exercise-builder-domain";

type Props = { onCancel: () => void; onCreate: (draft: ExerciseDraft) => void };

export function ExerciseBuilder({ onCancel, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Physics");
  const [scope, setScope] = useState<ExerciseDraft["scope"]>("SINGLE_CHAPTER");
  const [chaptersText, setChaptersText] = useState("");
  const [assessmentMode, setAssessmentMode] = useState<ExerciseDraft["assessmentMode"]>("QUESTION_LEVEL");
  const [slotCount, setSlotCount] = useState("10");
  const [correct, setCorrect] = useState("4");
  const [incorrect, setIncorrect] = useState("-1");
  const [partial, setPartial] = useState("2");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const chapters = chaptersText.split(",").map(value => value.trim()).filter(Boolean);
      const count = Number(slotCount);
      if (!Number.isInteger(count) || count < 1 || count > 200) throw new Error("Question slots must be between 1 and 200.");
      const draft: ExerciseDraft = {
        id: `exercise-${Date.now()}`,
        title: title.trim(),
        subject,
        scope,
        chapters,
        assessmentMode,
        slots: Array.from({ length: count }, (_, index) => ({
          id: `manual-${index + 1}`,
          order: index + 1,
          origin: "MANUAL" as const,
          label: `Question ${index + 1}`,
          chapter: chapters[Math.min(index, chapters.length - 1)] ?? "",
        })),
        markingScheme: assessmentMode === "QUESTION_LEVEL" ? undefined : {
          id: `scheme-${Date.now()}`, version: 1,
          correct: Number(correct), incorrect: Number(incorrect),
          partiallyCorrect: Number(partial), unattempted: 0, skipped: 0, notApplicable: 0,
        },
      };
      createExerciseRecord(draft);
      onCreate(draft);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to create exercise.");
    }
  }

  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onCancel(); }}>
    <form className="modal" onSubmit={submit}>
      <div className="modal-head"><div><div className="panel-kicker">SYSTEM A · EXERCISE BUILDER</div><h2>Create an exercise</h2><p>Build the exercise shell first. Manual slots work without QBMS or DTE.</p></div><button type="button" className="icon-btn" onClick={onCancel}>×</button></div>
      <label>Exercise title<input required value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Mechanics revision test"/></label>
      <div className="form-grid">
        <label>Subject<select value={subject} onChange={event => setSubject(event.target.value)}>{["Physics","Chemistry","Mathematics","Biology"].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Exercise scope<select value={scope} onChange={event => setScope(event.target.value as ExerciseDraft["scope"])}><option value="SINGLE_CHAPTER">Single chapter</option><option value="MULTI_CHAPTER">Multiple chapters</option><option value="FULL_SYLLABUS">Full syllabus</option></select></label>
      </div>
      <label>Chapter list <small>Comma-separated; for full syllabus, enter the chapters included in this syllabus snapshot.</small><textarea required rows={2} value={chaptersText} onChange={event => setChaptersText(event.target.value)} placeholder="Kinematics, Laws of Motion"/></label>
      <div className="form-grid">
        <label>Question slots<input type="number" min="1" max="200" value={slotCount} onChange={event => setSlotCount(event.target.value)}/></label>
        <label>Assessment mode<select value={assessmentMode} onChange={event => setAssessmentMode(event.target.value as ExerciseDraft["assessmentMode"])}><option value="QUESTION_LEVEL">Question-level</option><option value="MARKS_BASED">Marks-based</option><option value="HYBRID">Hybrid</option></select></label>
      </div>
      {assessmentMode !== "QUESTION_LEVEL" && <div className="form-grid">
        <label>Correct marks<input type="number" step="0.01" value={correct} onChange={event => setCorrect(event.target.value)}/></label>
        <label>Incorrect marks<input type="number" step="0.01" value={incorrect} onChange={event => setIncorrect(event.target.value)}/></label>
        <label>Partially correct<input type="number" step="0.01" value={partial} onChange={event => setPartial(event.target.value)}/></label>
      </div>}
      <div className="slot-preview"><div><b>{slotCount} manual question slots</b><span>Slots are numbered and chapter-linked. Question content can be attached later.</span></div><div className="slot-samples"><span>{scope.replaceAll("_", " ")}</span><span>{assessmentMode.replaceAll("_", " ")}</span></div></div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="modal-actions"><button type="button" className="btn secondary" onClick={onCancel}>Cancel</button><button type="submit" className="btn primary">Create draft exercise</button></div>
    </form>
  </div>;
}
