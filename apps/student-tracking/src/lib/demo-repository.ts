/**
 * Browser-backed demo repository.
 *
 * This is an intentionally replaceable persistence adapter for the demo UI.
 * It stores fictional demo records only; it is not an authorization boundary
 * or a production API. A future HTTP/Supabase repository can implement the
 * same read/write contract without changing screen components.
 */
export interface DemoStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface DemoRepository {
  read<T>(collection: string, fallback: T): T;
  write<T>(collection: string, value: T): void;
  remove(collection: string): void;
  clear(): void;
}

export function createDemoRepository(
  storage: DemoStorage,
  namespace = "pulse.demo.v4.",
): DemoRepository {
  const keyFor = (collection: string) => {
    if (!/^[a-z][a-z0-9_-]*$/i.test(collection)) {
      throw new Error("Invalid demo collection name.");
    }
    return namespace + collection;
  };

  return {
    read<T>(collection: string, fallback: T): T {
      const key = keyFor(collection);
      try {
        const raw = storage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
      } catch {
        // Corrupt demo data should not prevent the UI from opening.
        return fallback;
      }
    },
    write<T>(collection: string, value: T): void {
      storage.setItem(keyFor(collection), JSON.stringify(value));
    },
    remove(collection: string): void {
      storage.removeItem(keyFor(collection));
    },
    clear(): void {
      for (const collection of ["students", "exercises", "marks", "report-events", "verification-decisions", "doubts", "attendance"]) {
        storage.removeItem(keyFor(collection));
      }
    },
  };
}

const browserStorage: DemoStorage = {
  getItem(key) {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  },
  setItem(key, value) {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  removeItem(key) {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};

export const demoRepository = createDemoRepository(browserStorage);
