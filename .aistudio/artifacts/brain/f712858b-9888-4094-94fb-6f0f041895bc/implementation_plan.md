### Implementation Plan

# JAMB Practice Mode Feature

Implement a specialized "JAMB Practice Mode" that allows students to simulate a live JAMB examination by selecting up to four subjects (Mathematics, Chemistry, Physics, Biology), aggregating questions, and managing a combined session timer.

### User Review & Critical Decisions

> [!IMPORTANT]
> The new "JAMB Practice Mode" will be integrated as a new tab, replacing the removed "Formulas" tab.
> Please review the planned feature set:
> 1. **Subject Selection**: Users can toggle Math, Physics, Chemistry, and Biology.
> 2. **Session Simulation**: A single "exam" interface for all selected subjects.
> 3. **Aggregated Time**: The session timer will sum individual subject time limits to simulate a comprehensive exam session.

### 1. Overview & Core Concept

- **What It Does**: A new practice mode for JAMB preparation.
- **Target Audience**: Students preparing for the JAMB examination.
- **Key Value**: Provides an authentic, timed, multi-subject practice experience.

### 2. User Experience & Visual Design

- **Key User Flows**:
    1. Navigate to "JAMB Practice" tab.
    2. Select subjects (Maths, Chemistry, Physics, Biology).
    3. Click "Start Practice".
    4. Answer questions in a single-page view with an aggregated timer.
- **Visual Identity**: Consistent with "ClikTutor" theme (emerald-600 accents).

### 3. Key Product Decisions & Trade-Offs

- **Decision 1**: **Data Handling**
    - *Chosen Approach*: Query `questionBank.ts` for selected subjects and aggregate.
    - *Why*: Leverages existing question bank.
- **Decision 2**: **State Management**
    - *Chosen Approach*: React `useState` and `useEffect` for timer and session management, Firebase for persisting practice session history (if user is logged in).

### 4. Technical Architecture & Data Strategy

```text
┌──────────────────────┐
│  JAMBPracticeView    │ <───> [Aggregated Timer Logic]
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    questionBank.ts   │ <─── [Query Subjects]
└───────────────┬──────┘
                │
                ▼
┌──────────────────────┐
│   Firebase (db)      │ <─── [Session Persistence]
└──────────────────────┘
```

- **Data Model**: `JAMBSession` type for tracking selected subjects, total time, current index, and answers.
- **Key Sequences**:
    - Subject selection -> Timer calculation (Sum of subject times) -> Question fetching -> Practice Session UI.
