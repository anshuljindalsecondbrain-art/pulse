/**
 * Fictional, deterministic records for local product demonstrations.
 * Never use this dataset as a production student roster or upload it to Supabase.
 */
export type DemoStudent = { id: string; name: string; roll: string; batch: string };
export type DemoExercise = { id: string; name: string; chapter: string; subject: string; count: number; batch: string; due: string; created: string };

export const DEMO_BATCHES = ["JEE XII · Alpha", "JEE XII · Beta", "JEE XI · Alpha"] as const;

const namesByBatch: Record<string, string[]> = {
  "JEE XII · Alpha": ["Aarav Sharma", "Ananya Gupta", "Dev Mehta", "Ishita Jain", "Kabir Rathore", "Meera Soni", "Raghav Bansal", "Sara Khan"],
  "JEE XII · Beta": ["Aditya Verma", "Diya Agarwal", "Kunal Joshi", "Myra Choudhary", "Reyansh Singh", "Tara Mathur", "Vivaan Kapoor", "Zoya Ansari"],
  "JEE XI · Alpha": ["Aanya Parekh", "Arjun Yadav", "Dhruv Goyal", "Kiara Malhotra", "Manav Purohit", "Navya Bhatia", "Pranav Jain", "Riya Rathore"],
};

export const DEMO_STUDENTS: DemoStudent[] = Object.entries(namesByBatch).flatMap(([batch, names], batchIndex) =>
  names.map((name, index) => {
    const number = batchIndex * 8 + index + 1;
    return { id: `demo-s${String(number).padStart(2, "0")}`, name, roll: `DEMO-${String(number).padStart(3, "0")}`, batch };
  }),
);

export const DEMO_EXERCISES: DemoExercise[] = [
  { id: "demo-e1", name: "DPP-08 · Rotational Motion", chapter: "Rotational Motion", subject: "Physics", count: 12, batch: "JEE XII · Alpha", due: "2026-11-07", created: "Today" },
  { id: "demo-e2", name: "DPP-07 · Work, Energy & Power", chapter: "Work, Energy & Power", subject: "Physics", count: 10, batch: "JEE XII · Alpha", due: "2026-11-06", created: "Yesterday" },
  { id: "demo-e3", name: "Practice Set · Electrostatics", chapter: "Electrostatics", subject: "Physics", count: 15, batch: "JEE XII · Alpha", due: "2026-11-05", created: "Nov 3" },
  { id: "demo-e4", name: "Chemistry Practice · Chemical Bonding", chapter: "Chemical Bonding", subject: "Chemistry", count: 12, batch: "JEE XII · Beta", due: "2026-11-09", created: "Today" },
  { id: "demo-e5", name: "Mathematics Drill · Quadratic Equations", chapter: "Quadratic Equations", subject: "Mathematics", count: 10, batch: "JEE XI · Alpha", due: "2026-11-10", created: "Today" },
];

const sampleStatuses = ["C", "C", "I", "D", "C", "S", "P", "U"] as const;
export const DEMO_MARKS: Record<string, "U" | "C" | "I" | "D" | "S" | "P"> = Object.fromEntries(
  DEMO_STUDENTS.flatMap((student, studentIndex) =>
    Array.from({ length: 12 }, (_, questionIndex) => {
      const status = sampleStatuses[(studentIndex * 3 + questionIndex * 5 + (studentIndex % 3)) % sampleStatuses.length];
      return [`${student.id}-demo-e1-${questionIndex + 1}`, status];
    }),
  ),
);
