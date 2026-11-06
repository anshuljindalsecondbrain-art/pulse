/**
 * Fictional offline module catalogue for UI demonstration.
 * Question references are placeholders, not real QBMS records or question text.
 * Production catalogue import must preserve source module/question identifiers.
 */
export type OfflineQuestionRef = { id: string; label: string; difficulty: "Easy" | "Medium" | "Hard" };
export type OfflineModule = {
  id: string;
  title: string;
  subject: "Physics" | "Chemistry" | "Mathematics" | "Biology";
  chapter: string;
  classLevel: "XI" | "XII";
  examTrack: "JEE" | "NEET";
  questions: OfflineQuestionRef[];
};

function questions(moduleId: string, count: number): OfflineQuestionRef[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${moduleId}-q${String(index + 1).padStart(3, "0")}`,
    label: `Question ${index + 1}`,
    difficulty: index % 7 === 0 ? "Hard" : index % 3 === 0 ? "Medium" : "Easy",
  }));
}

export const OFFLINE_MODULES: OfflineModule[] = [
  { id: "offline-phy-rot-xii", title: "Rotational Motion · Practice Module 08", subject: "Physics", chapter: "Rotational Motion", classLevel: "XII", examTrack: "JEE", questions: questions("offline-phy-rot-xii", 20) },
  { id: "offline-phy-wep-xii", title: "Work, Energy & Power · Practice Module 07", subject: "Physics", chapter: "Work, Energy & Power", classLevel: "XII", examTrack: "JEE", questions: questions("offline-phy-wep-xii", 18) },
  { id: "offline-phy-electro-xii", title: "Electrostatics · Practice Module 03", subject: "Physics", chapter: "Electrostatics", classLevel: "XII", examTrack: "JEE", questions: questions("offline-phy-electro-xii", 25) },
  { id: "offline-chem-bond-xii", title: "Chemical Bonding · Practice Module 04", subject: "Chemistry", chapter: "Chemical Bonding", classLevel: "XII", examTrack: "JEE", questions: questions("offline-chem-bond-xii", 22) },
  { id: "offline-math-quad-xi", title: "Quadratic Equations · Practice Module 02", subject: "Mathematics", chapter: "Quadratic Equations", classLevel: "XI", examTrack: "JEE", questions: questions("offline-math-quad-xi", 16) },
  { id: "offline-bio-cell-xi", title: "Cell: The Unit of Life · Practice Module 01", subject: "Biology", chapter: "Cell: The Unit of Life", classLevel: "XI", examTrack: "NEET", questions: questions("offline-bio-cell-xi", 30) },
];
