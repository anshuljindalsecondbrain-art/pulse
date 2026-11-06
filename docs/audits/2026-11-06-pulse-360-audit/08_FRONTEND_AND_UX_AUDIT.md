# Frontend and UX Audit

## Verified implementation

The System A app is React 18, TypeScript and Vite. The main matrix uses fictional demo students, exercises and marks. The app stores these under versioned `pulse.demo.v2.*` localStorage keys. It includes a responsive shared stylesheet, matrix interactions, filtering, CSV export, cohort signals, offline module selection and an Exercise Builder.

The Exercise Builder supports single-chapter, multi-chapter and full-syllabus scopes; question-level, marks-based and hybrid assessment modes; marking-scheme input and manual numbered slots. Domain functions support publishing/revision snapshots, but the UI does not yet implement complete draft editing, publication/revision screens or QBMS/offline question attachment in this builder.

## UX strengths

- A fast operational matrix exists without DTE tags.
- Six UI states are visible: Unattempted, Correct, Incorrect, Doubt, Skipped and Partially Correct.
- The architecture separates evidence, evaluation, verification, correction and doubt.
- Responsive layout rules cover desktop/tablet/mobile and reduced-motion/focus considerations.
- Existing offline-module picker retains source module and question references rather than duplicating question content.

## UX gaps and risks

- No real authentication or role-based navigation.
- Demo records may be mistaken for real student data unless demo mode is conspicuous.
- Primary UI is not connected to repository services.
- Exercise Builder lacks full edit/publish/revise workflow and server-backed validation.
- Academic eligibility infers class from batch label and uses JEE demo context; production must use trusted effective-dated academic context.
- No verified Playwright/browser/device/accessibility test suite.
- No confirmed keyboard/screen-reader audit or representative device QA.
- A/B experiment state is represented in UI as a local state selection; deterministic user/batch allocation and telemetry are not verified.

## Required UX gates

Implement separate demo and authenticated production modes; show data provenance; add loading/empty/error/permission-denied states; implement server-backed workflow; add responsive viewport tests, keyboard navigation, screen-reader semantics, focus management and reduced-motion checks; test matrix speed and accidental-edit guardrails with actual faculty.
