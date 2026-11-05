import PHYSICS_DATA from '../data/physicsFormulaDataStructured.json';

export interface FormulaItem {
  id: string;
  category: 'physics' | 'mathematics' | 'chemistry' | 'constant' | 'english';
  title: string;
  value: string;
  description: string;
}

export const FORMULA_SHEET_ITEMS: FormulaItem[] = [
  // --- MATHEMATICS ---
  { id: 'mat-1', category: 'mathematics', title: 'Pythagoras', value: 'a² + b² = c²', description: 'Right triangle sides' },
  { id: 'mat-2', category: 'mathematics', title: 'Quadratic Formula', value: 'x = [-b ± √(b²-4ac)] / 2a', description: 'Solving ax²+bx+c=0' },
  { id: 'mat-3', category: 'mathematics', title: 'Area of Circle', value: 'A = πr²', description: 'Area formula' },
  { id: 'mat-4', category: 'mathematics', title: 'Volume of Sphere', value: 'V = ⁴⁄₃πr³', description: 'Sphere volume' },
  { id: 'mat-5', category: 'mathematics', title: 'Determinant (2x2)', value: 'det = ad - bc', description: 'Det of [[a,b],[c,d]]' },
  { id: 'mat-6', category: 'mathematics', title: 'Sum of AP', value: 'Sₙ = ⁿ⁄₂(2a + (n-1)d)', description: 'Sum of AP' },
  { id: 'mat-7', category: 'mathematics', title: 'Sum of GP', value: 'Sₙ = a(rⁿ-1)/(r-1)', description: 'Sum of GP' },
  { id: 'mat-8', category: 'mathematics', title: 'Trig Identity', value: 'sin²θ + cos²θ = 1', description: 'Pythagorean trig identity' },
  { id: 'mat-9', category: 'mathematics', title: 'Trig Ratio (Sine)', value: 'sin θ = Opp / Hyp', description: 'Sine ratio' },
  { id: 'mat-10', category: 'mathematics', title: 'Trig Ratio (Cosine)', value: 'cos θ = Adj / Hyp', description: 'Cosine ratio' },
  // --- CHEMISTRY ---
  { id: 'chm-1', category: 'chemistry', title: 'Mole Concept', value: 'n = m/M', description: 'Mass-molar mass' },
  { id: 'chm-2', category: 'chemistry', title: 'Molarity', value: 'M = n/V', description: 'Concentration formula' },
  { id: 'chm-3', category: 'chemistry', title: 'Ideal Gas Law', value: 'PV = nRT', description: 'Gas behavior' },
  { id: 'chm-4', category: 'chemistry', title: 'pH Scale', value: 'pH = -log[H⁺]', description: 'Acidity measurement' },
  { id: 'chm-5', category: 'chemistry', title: 'Titration', value: 'CₐVₐ/nₐ = CᵦVᵦ/nᵦ', description: 'Neutralization' },
  { id: 'chm-6', category: 'chemistry', title: 'Empirical Formula', value: 'Ratio of atoms', description: 'Simplest atom ratio' },
  // --- CONSTANTS ---
  { id: 'con-1', category: 'constant', title: 'Speed of Light', value: 'c ≈ 3.00 × 10⁸ m/s', description: 'c in vacuum' },
  { id: 'con-2', category: 'constant', title: 'Avogadro\'s Number', value: 'N_A ≈ 6.02 × 10²³ mol⁻¹', description: 'Particles per mole' },
  { id: 'con-3', category: 'constant', title: 'Gravity', value: 'g ≈ 9.81 m/s²', description: 'Earth acceleration' },
  { id: 'con-4', category: 'constant', title: 'Gas Constant', value: 'R ≈ 8.314 J/mol·K', description: 'Ideal gas constant' },
  // --- ENGLISH ---
  { id: 'eng-1', category: 'english', title: 'Ephemeral', value: 'Short-lived', description: 'Lasting briefly' },
  { id: 'eng-2', category: 'english', title: 'Meticulous', value: 'Very careful', description: 'Extreme attention to detail' },
  { id: 'eng-3', category: 'english', title: 'Concord Rule', value: 'Subject-Verb Agreement', description: 'Singular/Plural agreement' },
  { id: 'eng-4', category: 'english', title: 'Pronoun Case', value: 'Subjective vs Objective', description: 'I vs Me, He vs Him' }
];

export const FORMULA_SHEET_DATA: any = {
  mathematics: { 
    title: 'Mathematics', 
    sections: [
      { topic: 'Algebra & Geometry', formulas: FORMULA_SHEET_ITEMS.filter(i => i.category === 'mathematics') }
    ] 
  },
  physics: { 
    title: 'Physics', 
    sections: Object.entries(PHYSICS_DATA.classes).flatMap(([className, classData]: [string, any]) =>
        classData.topics.map((topic: any) => ({
          topic: `${className}: ${topic.topic}`,
          formulas: topic.formulas.map((f: any) => ({
            id: f.id,
            title: f.name,
            value: f.latex,
            description: f.name
          }))
        }))
      )
  },
  chemistry: { 
    title: 'Chemistry', 
    sections: [
      { topic: 'General Chemistry', formulas: FORMULA_SHEET_ITEMS.filter(i => i.category === 'chemistry') }
    ] 
  },
  biology: { title: 'Biology', sections: [] },
  english: { 
    title: 'English Language', 
    sections: [
      { topic: 'Grammar & Vocabulary', formulas: FORMULA_SHEET_ITEMS.filter(i => i.category === 'english') }
    ] 
  },
};
