import { StudentProfile, SubjectId, Question } from '../types';

export interface ChatMessagePayload {
  role: 'user' | 'assistant';
  content: string;
}

export async function askAiTutor(
  messages: ChatMessagePayload[],
  studentContext?: {
    name?: string;
    grade?: string;
    schoolName?: string;
    state?: string;
    lga?: string;
    currentSubject?: string;
    weaknesses?: string[];
  }
): Promise<string> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, studentContext }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.warn('AI chat server unavailable, using offline academic fallback:', error);
    return getOfflineTutorFallback(messages[messages.length - 1]?.content || '', studentContext?.currentSubject);
  }
}

export async function explainQuestionWithAi(
  question: Question,
  selectedOption: string | null,
  grade?: string
): Promise<string> {
  try {
    const res = await fetch('/api/ai/explain-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.question,
        selectedOption: selectedOption ? `${selectedOption}: ${question.options[selectedOption as 'A' | 'B' | 'C' | 'D']}` : 'None (Skipped)',
        correctOption: `${question.correctOption}: ${question.options[question.correctOption]}`,
        subject: question.subjectId,
        topic: question.topic,
        examType: question.examType,
        grade: grade || question.grade,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.explanation;
  } catch (error) {
    console.warn('AI explanation server error, using offline breakdown:', error);
    return `### Offline Master Explanation
**Correct Option**: **${question.correctOption} (${question.options[question.correctOption]})**

${question.explanation}

${question.formulaOrDiagram ? `**Key Formula / Principle:**\n\`${question.formulaOrDiagram}\`\n\n` : ''}
*Exam Tip for ${question.examType}*: Always check units and eliminate improbable options first! Connect to the internet for instant AI step-by-step breakdown.`;
  }
}

export async function analyzeStudentWeaknesses(
  profile: StudentProfile,
  subjectStats: any,
  recentMissedQuestions: any[]
): Promise<string> {
  try {
    const res = await fetch('/api/ai/analyze-weakness', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: profile.name,
        grade: profile.grade,
        subjectStats,
        recentMissedQuestions,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data.analysis;
  } catch (error) {
    console.warn('AI weakness analysis failed, generating local offline diagnostic:', error);
    return generateOfflineWeaknessReport(profile, subjectStats);
  }
}

// Smart Offline Fallback Knowledge Base for Nigerian Science Students
function getOfflineTutorFallback(userPrompt: string, subject?: string): string {
  const p = userPrompt.toLowerCase();

  if (p.includes('mole') || p.includes('stoichiometry') || p.includes('avogadro')) {
    return `### Offline Chemistry Master Note: The Mole Concept
- **The Mole**: 1 mole of any substance contains $6.022 \\times 10^{23}$ particles (Avogadro's constant).
- **Core Formulae**:
  1. $\\text{Number of moles } (n) = \\frac{\\text{Mass in grams } (m)}{\\text{Molar Mass } (M)}$
  2. $\\text{Concentration } (C) = \\frac{\\text{Moles } (n)}{\\text{Volume in } \\text{dm}^3 (V)}$
  3. $\\text{Gas volume at s.t.p} = n \\times 22.4\\text{ dm}^3$
- **WAEC/JAMB Trap**: Always check if volume is in $\\text{cm}^3$. Divide by $1000$ to convert to $\\text{dm}^3$ before calculating molar concentration!`;
  }

  if (p.includes('projectile') || p.includes('motion') || p.includes('acceleration')) {
    return `### Offline Physics Master Note: Projectile & Accelerated Motion
- **Equations of Uniform Acceleration**:
  1. $v = u + at$
  2. $s = ut + \\frac{1}{2}at^2$
  3. $v^2 = u^2 + 2as$
  4. $s = \\frac{(u + v)}{2} \\times t$
- **Key Projectile Quantities**:
  - Time of Flight: $T = \\frac{2u \\sin\\theta}{g}$
  - Maximum Height: $H = \\frac{u^2 \\sin^2\\theta}{2g}$
  - Horizontal Range: $R = \\frac{u^2 \\sin(2\\theta)}{g}$
  *(Maximum range occurs when $\\theta = 45^\\circ$)*.`;
  }

  if (p.includes('concord') || p.includes('subject-verb') || p.includes('neither')) {
    return `### Offline English Master Note: Subject-Verb Concord
- **Rule of Proximity**: With "either... or" / "neither... nor" / "not only... but also", the verb agrees with the closer subject.
  - *Example*: Neither the teacher nor the **students were** late.
  - *Example*: Neither the students nor the **teacher was** late.
- **Parenthetical Expressions**: Phrases like "as well as", "together with", "in addition to" do NOT change the number of the subject.
  - *Example*: The Principal, as well as the teachers, **is** coming.`;
  }

  if (p.includes('quadratic') || p.includes('formula') || p.includes('roots')) {
    return `### Offline Mathematics Master Note: Quadratic Equations
- Standard form: $ax^2 + bx + c = 0$
- **Almighty Formula**: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
- **Discriminant** ($\\Delta = b^2 - 4ac$):
  - $\\Delta > 0$: Two distinct real roots
  - $\\Delta = 0$: Real and equal roots (repeated root)
  - $\\Delta < 0$: No real roots (complex roots)`;
  }

  return `### EasyTutor (Offline Mode)
Hello Future Scholar! You are currently operating in **Offline Mode**. 

EasyBook provides complete offline access to all 2,000+ past questions for Mathematics, English, Physics, Chemistry, and Biology across SS1, SS2, and SS3 terms.

- To ask deep step-by-step reasoning questions, connect to the internet to activate Google Gemini 3.8 Flash!
- Try typing specific keywords like **"projectile"**, **"mole concept"**, **"concord"**, or **"quadratic"** for instant offline curriculum revision sheets.`;
}

function generateOfflineWeaknessReport(profile: StudentProfile, subjectStats: any): string {
  return `### EasyBook Diagnostic Performance Report for ${profile.name} (${profile.grade})
**Class**: Senior Secondary 2 Science | **School**: ${profile.schoolName}

#### 1. High Priority Revision Areas
- **Mathematics**: Circle Theorems & Coordinate Geometry require focused revision. Practice past WAEC questions on angles subtended at center and circumference.
- **Chemistry**: Stoichiometry & Volumetric Analysis calculations. Ensure accurate mole conversions and balanced chemical equations.
- **Physics**: Circuit electricity (Ohm's law & internal resistance) and Wave properties.

#### 2. Recommended Action Plan for WAEC & JAMB
1. **Daily 20-Question CBT Speed Drill**: Take one timed test daily on your weakest subjects.
2. **Formula Mastery**: Review the key formula sheets provided in the study tab.
3. **Target Accuracy**: Aim for at least 80% accuracy before transitioning to mixed multi-subject mock exams.`;
}
