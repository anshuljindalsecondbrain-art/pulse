import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronDown, ChevronRight, ClipboardList, FileText, Layers3, Plus, Search, ShieldAlert, Trash2 } from "lucide-react";
import { OFFLINE_MODULES, type OfflineModule, type OfflineQuestionRef } from "./offline-catalog";
import "./content-selector.css";

export type SelectedContentSlot = {
  sourceId: string;
  sourceRef: string;
  sourceLabel: string;
  unitId: string;
  unitLabel: string;
  slotLabel: string;
  slotOrder: number;
  sourceKind: "EXERCISE" | "DPP" | "MANUAL";
};

type Unit = {
  id: string;
  label: string;
  kind: "EXERCISE" | "DPP";
  questions: OfflineQuestionRef[];
};

function unitsFor(module: OfflineModule): Unit[] {
  const split = Math.ceil(module.questions.length / 2);
  return [
    { id: module.id + ":exercise-01", label: "Exercise 01", kind: "EXERCISE", questions: module.questions.slice(0, split) },
    { id: module.id + ":dpp-01", label: "DPP 01", kind: "DPP", questions: module.questions.slice(split) },
  ];
}

type Props = {
  subject: string;
  classLevel: string;
  stream: string;
  initialSelection?: SelectedContentSlot[];
  onBack: () => void;
  onContinue: (slots: SelectedContentSlot[]) => void;
};

export function ContentSelector({ subject, classLevel, stream, initialSelection = [], onBack, onContinue }: Props) {
  const eligibleModules = useMemo(() => OFFLINE_MODULES.filter(module =>
    module.subject === subject && module.classLevel === classLevel &&
    (stream === "COMMON" || module.examTrack === stream || stream === "School")
  ), [subject, classLevel, stream]);
  const [activeModuleId, setActiveModuleId] = useState(eligibleModules[0]?.id ?? "");
  const [activeUnitId, setActiveUnitId] = useState("");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("");
  const [rangeError, setRangeError] = useState("");
  const [manualSource, setManualSource] = useState("");
  const [manualCount, setManualCount] = useState("10");
  const [selected, setSelected] = useState<SelectedContentSlot[]>(initialSelection);
  const [expanded, setExpanded] = useState<string[]>(eligibleModules[0] ? [eligibleModules[0].id] : []);
  const activeModule = eligibleModules.find(module => module.id === activeModuleId);
  const units = activeModule ? unitsFor(activeModule) : [];
  const activeUnit = units.find(unit => unit.id === activeUnitId) ?? units[0];
  const visibleQuestions = activeUnit?.questions.filter(question => question.label.toLowerCase().includes(search.toLowerCase())) ?? [];
  const selectedRefs = new Set(selected.map(slot => slot.sourceRef));
  const exactDuplicateCount = selected.length - selectedRefs.size;
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; slots: SelectedContentSlot[] }>();
    for (const slot of selected) {
      const current = map.get(slot.sourceId) ?? { label: slot.sourceLabel, slots: [] };
      current.slots.push(slot);
      map.set(slot.sourceId, current);
    }
    return [...map.entries()].map(([id, value]) => ({ id, ...value }));
  }, [selected]);

  function makeSlot(module: OfflineModule, unit: Unit, question: OfflineQuestionRef): SelectedContentSlot {
    return {
      sourceId: module.id,
      sourceRef: question.id,
      sourceLabel: module.title,
      unitId: unit.id,
      unitLabel: unit.label,
      slotLabel: question.label,
      slotOrder: module.questions.findIndex(item => item.id === question.id) + 1,
      sourceKind: unit.kind,
    };
  }

  function addSlots(module: OfflineModule, unit: Unit, questions: OfflineQuestionRef[]) {
    setSelected(current => {
      const existing = new Set(current.map(slot => slot.sourceRef));
      const additions = questions.filter(question => !existing.has(question.id)).map(question => makeSlot(module, unit, question));
      return [...current, ...additions];
    });
  }

  function toggleSlot(module: OfflineModule, unit: Unit, question: OfflineQuestionRef) {
    setSelected(current => current.some(slot => slot.sourceRef === question.id)
      ? current.filter(slot => slot.sourceRef !== question.id)
      : [...current, makeSlot(module, unit, question)]);
  }

  function applyRange() {
    if (!activeModule || !activeUnit) return;
    const match = range.trim().match(/^(\d+)\s*(?:-|to|:)\s*(\d+)$/i);
    if (!match) { setRangeError("Enter a range such as 1-10."); return; }
    const start = Number(match[1]), end = Number(match[2]);
    if (start < 1 || end < start || end > activeUnit.questions.length) {
      setRangeError(`Valid range for this source is 1-${activeUnit.questions.length}.`);
      return;
    }
    addSlots(activeModule, activeUnit, activeUnit.questions.slice(start - 1, end));
    setRangeError("");
    setRange("");
  }

  function selectAll() {
    if (activeModule && activeUnit) addSlots(activeModule, activeUnit, activeUnit.questions);
  }

  function addManualSlots() {
    const label = manualSource.trim();
    const count = Number(manualCount);
    if (!label || !Number.isInteger(count) || count < 1 || count > 200) {
      setRangeError("Enter a source label and a slot count from 1 to 200.");
      return;
    }
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const sourceId = "manual:" + slug;
    const additions: SelectedContentSlot[] = Array.from({ length: count }, (_, index) => {
      const order = index + 1;
      return { sourceId, sourceRef: sourceId + ":slot-" + String(order).padStart(3, "0"), sourceLabel: label, unitId: sourceId, unitLabel: "Physical reference", slotLabel: "Slot " + order, slotOrder: order, sourceKind: "MANUAL" };
    });
    setSelected(current => {
      const existing = new Set(current.map(slot => slot.sourceRef));
      return [...current, ...additions.filter(slot => !existing.has(slot.sourceRef))];
    });
    setRangeError("");
    setManualSource("");
  }

  return <div className="cs-page">
    <header className="cs-header">
      <div><div className="cs-eyebrow">M08-04 · ASSIGNMENT CONTENT SELECTOR</div><h1>Select exact work</h1><p>Choose existing physical-source slots. No QBMS records or questions are created here.</p></div>
      <span className="cs-demo">LOCAL CATALOGUE · DEMO REFERENCES</span>
    </header>
    <div className="cs-scope"><b>{subject}</b><span>Class {classLevel}</span><span>{stream}</span><span>{eligibleModules.length} source modules in this preview</span></div>
    <div className="cs-workspace">
      <aside className="cs-pane cs-tree">
        <div className="cs-pane-head"><div><small>SOURCE TREE</small><b>Books & modules</b></div><Layers3 size={17}/></div>
        {eligibleModules.map(module => {
          const open = expanded.includes(module.id);
          return <div className="cs-tree-group" key={module.id}>
            <button className={activeModuleId === module.id ? "cs-tree-module active" : "cs-tree-module"} onClick={() => { setActiveModuleId(module.id); setActiveUnitId(""); setExpanded(current => open ? current.filter(id => id !== module.id) : [...current, module.id]); }}>
              <BookOpen size={15}/><span>{module.title}</span>{open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
            </button>
            {open && unitsFor(module).map(unit => <button key={unit.id} className={activeModuleId === module.id && (activeUnitId === unit.id || (!activeUnitId && units[0]?.id === unit.id)) ? "cs-tree-unit active" : "cs-tree-unit"} onClick={() => { setActiveModuleId(module.id); setActiveUnitId(unit.id); setSearch(""); }}>
              {unit.kind === "DPP" ? <FileText size={14}/> : <ClipboardList size={14}/>}<span>{unit.label}</span><small>{unit.questions.length}</small>
            </button>)}
          </div>;
        })}
        {!eligibleModules.length && <div className="cs-empty">No catalogue source matches this academic scope. A manual physical reference can be added later; this demo has no matching source.</div>}
      </aside>

      <section className="cs-pane cs-preview">
        <div className="cs-pane-head"><div><small>CONTENT PREVIEW</small><b>{activeModule?.title ?? "No source selected"}</b></div><span className="cs-slot-count">{activeUnit?.questions.length ?? 0} slots</span></div>
        {!activeUnit && <div className="cs-manual-source">
          <h3>Unmapped physical source</h3>
          <p>This academic scope has no matching catalogue item. Create stable physical slot references without QBMS taxonomy.</p>
          <label>Book / module / exercise / DPP label<input value={manualSource} onChange={event => setManualSource(event.target.value)} placeholder="e.g. Physics Module 04 · Exercise 2"/></label>
          <label>Number of slots<input type="number" min="1" max="200" value={manualCount} onChange={event => setManualCount(event.target.value)}/></label>
          <button onClick={addManualSlots}><Plus size={14}/> Add physical slots</button>
          {rangeError && <span role="alert">{rangeError}</span>}
        </div>}
        {activeUnit && <>
          <div className="cs-unit-heading"><div><b>{activeUnit.label}</b><span>{activeUnit.kind === "DPP" ? "Daily practice paper" : "Exercise"} · Stable physical slot references</span></div><button onClick={selectAll}><Check size={14}/> Select all</button></div>
          <div className="cs-range">
            <label>Question range<input value={range} onChange={event => setRange(event.target.value)} onKeyDown={event => event.key === "Enter" && applyRange()} placeholder={`e.g. 1-${activeUnit.questions.length}`}/></label>
            <button onClick={applyRange} disabled={!range.trim()}><Plus size={14}/> Add range</button>
            {rangeError && <span role="alert">{rangeError}</span>}
          </div>
          <label className="cs-search"><Search size={14}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a question slot"/></label>
          <div className="cs-question-list">
            {visibleQuestions.map(question => {
              const isSelected = selectedRefs.has(question.id);
              return <label className={isSelected ? "cs-question selected" : "cs-question"} key={question.id}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleSlot(activeModule!, activeUnit, question)}/>
                <span className="cs-q-order">Q{activeModule!.questions.findIndex(item => item.id === question.id) + 1}</span>
                <span className="cs-q-main"><b>{question.label}</b><small>{question.id}</small></span>
                <span className={"cs-difficulty " + question.difficulty.toLowerCase()}>{question.difficulty}</span>
                {isSelected && <Check size={15}/>}
              </label>;
            })}
            {!visibleQuestions.length && <div className="cs-empty">No question slots match this search.</div>}
          </div>
        </>}
        <div className="cs-source-note"><ShieldAlert size={14}/><span>Question labels and IDs are fictional preview references. Production selection must load stable physical references from the approved source catalogue.</span></div>
      </section>

      <aside className="cs-pane cs-basket">
        <div className="cs-pane-head"><div><small>SELECTED-WORK BASKET</small><b>Your assignment content</b></div><span className="cs-basket-count">{selected.length}</span></div>
        <div className="cs-sticky-count"><strong>{selected.length}</strong><span>selected slots</span><small>{grouped.length} original sources</small></div>
        {exactDuplicateCount > 0 && <div className="cs-warning">Exact duplicate slots detected: {exactDuplicateCount}. Remove duplicates before continuing.</div>}
        <div className="cs-equivalence-note"><b>Equivalent mapping check</b><span>No approved equivalence map is connected in this preview. Similarity is not treated as proof of equivalence.</span></div>
        <div className="cs-groups">
          {grouped.map(group => <div className="cs-source-group" key={group.id}>
            <div className="cs-group-title"><b>{group.label}</b><span>{group.slots.length} selected</span></div>
            {group.slots.map(slot => <div className="cs-selected-slot" key={slot.sourceRef}>
              <div><b>{slot.unitLabel} · {slot.slotLabel}</b><small>{slot.sourceRef}</small></div>
              <button aria-label={`Remove ${slot.slotLabel}`} onClick={() => setSelected(current => current.filter(item => item.sourceRef !== slot.sourceRef))}><Trash2 size={14}/></button>
            </div>)}
          </div>)}
          {!selected.length && <div className="cs-empty">No work selected. Choose a complete exercise/DPP, a range, or individual slots.</div>}
        </div>
        <div className="cs-basket-foot"><span>Source grouping and selection count remain visible while selecting.</span><button onClick={() => setSelected([])} disabled={!selected.length}>Clear basket</button></div>
      </aside>
    </div>
    <footer className="cs-footer"><button className="cs-back" onClick={onBack}><ArrowLeft size={15}/> Back to assignment</button><div><span>{selected.length} slots · {grouped.length} sources</span><button className="cs-continue" onClick={() => onContinue(selected)} disabled={!selected.length || exactDuplicateCount > 0}>Continue to configuration <ArrowRight size={15}/></button></div></footer>
  </div>;
}
