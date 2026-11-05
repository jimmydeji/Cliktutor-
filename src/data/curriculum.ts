import { SubjectId, GradeLevel, Term } from '../types';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  iconName: string;
  color: string;
  badgeColor: string;
  description: string;
  waecCode: string;
  jambCode: string;
}

export const SUBJECTS: SubjectMeta[] = [
  {
    id: 'mathematics',
    name: 'General Mathematics',
    iconName: 'Calculator',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Algebra, trigonometry, geometry, calculus, statistics, and number bases.',
    waecCode: '402',
    jambCode: 'MTH',
  },
  {
    id: 'english',
    name: 'English Language',
    iconName: 'BookOpen',
    color: 'from-sky-500 to-blue-600',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    description: 'Lexis & structure, oral English, comprehension, synonyms, antonyms, and idioms.',
    waecCode: '104',
    jambCode: 'ENG',
  },
  {
    id: 'physics',
    name: 'Physics',
    iconName: 'Atom',
    color: 'from-indigo-500 to-violet-600',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    description: 'Mechanics, heat, waves, optics, electromagnetism, and atomic physics.',
    waecCode: '512',
    jambCode: 'PHY',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    iconName: 'FlaskConical',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Organic chemistry, stoichiometry, atomic structure, gas laws, and redox reactions.',
    waecCode: '505',
    jambCode: 'CHM',
  },
  {
    id: 'biology',
    name: 'Biology',
    iconName: 'Dna',
    color: 'from-rose-500 to-pink-600',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    description: 'Cell biology, genetics, physiology, ecology, plant/animal kingdom, and evolution.',
    waecCode: '504',
    jambCode: 'BIO',
  },
];

export interface TermTopicStructure {
  [term: string]: string[];
}

export interface CurriculumDatabase {
  [subject: string]: {
    [grade in GradeLevel]: TermTopicStructure;
  };
}

export const NERDC_CURRICULUM: CurriculumDatabase = {
  mathematics: {
    SS1: {
      '1st Term': [
        'Number Bases & Binary Operations',
        'Modular Arithmetic',
        'Indices and Logarithms',
        'Sets and Venn Diagrams',
        'Simple Equations & Linear Inequalities'
      ],
      '2nd Term': [
        'Simultaneous Linear & Quadratic Equations',
        'Approximations and Significant Figures',
        'Percentage Errors and Simple Interest',
        'Mensuration of Plane Shapes (Circles & Sectors)',
        'Trigonometric Ratios of Angles (30°, 45°, 60°)'
      ],
      '3rd Term': [
        'Angles of Elevation and Depression',
        'Bearings and Distances (Basic)',
        'Statistics: Mean, Median, Mode of Ungrouped Data',
        'Histograms, Frequency Polygons & Pie Charts',
        'Logical Reasoning (Converse, Inverse, Contrapositive)'
      ]
    },
    SS2: {
      '1st Term': [
        'Logarithms & Scientific Notations',
        'Approximations and Rounding Rules',
        'Sequence and Series (Arithmetic Progression - A.P)',
        'Sequence and Series (Geometric Progression - G.P)',
        'Quadratic Equations by Factorization and Formula Method'
      ],
      '2nd Term': [
        'Simultaneous Equations: One Linear, One Quadratic',
        'Linear Inequalities in Two Variables & Shaded Regions',
        'Chord Properties of Circles',
        'Circle Theorems (Angles subtended at center & circumference)',
        'Cyclic Quadrilaterals and Tangent Theorems',
        'Geometry of Triangles and Polygons' // Added
      ],
      '3rd Term': [
        'Trigonometry: Sine and Cosine Rules',
        'Bearings and Scale Drawing',
        'Probability (Single and Mutually Exclusive Events)',
        'Statistics: Grouped Data, Standard Deviation and Variance',
        'Matrices and Determinants (2x2)' // Added
      ]
    },
    SS3: {
      '1st Term': [
        'Surds: Rationalization and Conjugate Surds',
        'Matrices & Simultaneous Equations with Matrices',
        'Coordinate Geometry: Midpoint, Gradient, Distance, and Straight Lines',
        'Differentiation from First Principles and Power Rule',
        'Applications of Differentiation: Maxima, Minima & Rates of Change'
      ],
      '2nd Term': [
        'Integration as Reverse Differentiation and Area under Curves',
        'Latitude and Longitude: Great and Small Circles',
        'Earth Distances along Parallels of Latitude',
        'Linear Programming: Objective Functions & Feasible Regions',
        'Comprehensive WAEC/JAMB Mock Exam Revisions'
      ],
      '3rd Term': [
        'Advanced Probability (Independent and Conditional)',
        'Compound Angles and Trigonometric Proofs',
        'Vectors in Two Dimensions (Dot Product & Resolution)',
        'Past JAMB UTME Comprehensive Speed Drills',
        'National Examination Board (NECO) Master Drills'
      ]
    }
  },
  english: {
    SS1: {
      '1st Term': [
        'Nouns, Pronouns, and Subject-Verb Concord',
        'Vowel Sounds: Monophthongs & Diphthongs',
        'Consonant Clusters and Plural Morphemes',
        'Vocabulary Associated with Science and Technology',
        'Reading Comprehension: Identifying Topic Sentences'
      ],
      '2nd Term': [
        'Verbs, Tenses, and Aspect (Present, Past, Perfect)',
        'Modal Auxiliaries (Can, Could, May, Must, Should)',
        'Oral English: Word Stress on Two-Syllable Words',
        'Lexis Associated with Agriculture and the Environment',
        'Antonyms and Synonyms in Context'
      ],
      '3rd Term': [
        'Adjectives and Adverbs (Order and Comparison)',
        'Prepositions and Phrasal Verbs',
        'Stress on Polysyllabic Words',
        'Summary Writing: Stating Main Ideas Concisely',
        'Registers of Health and Medicine',
        'Reading Comprehension: Narrative and Descriptive Passages' // Added
      ]
    },
    SS2: {
      '1st Term': [
        'Advanced Concord: Proximity, Parenthetical Expressions',
        'Sentence Types: Simple, Compound, Complex, Compound-Complex',
        'Oral English: Intonation (Falling, Rising, Fall-Rise)',
        'Vocabulary Associated with Law, Crime, and Courts',
        'WAEC-Standard Reading Comprehension Techniques'
      ],
      '2nd Term': [
        'Noun Clauses and Their Grammatical Functions',
        'Adjectival Clauses and Relative Pronouns (Who, Which, That)',
        'Adverbial Clauses (Time, Reason, Condition, Concession)',
        'Oral English: Vowel Contrasts (/iː/ vs /ɪ/, /æ/ vs /ʌ/)',
        'Figurative Language: Metaphors, Similes, Personification, Irony'
      ],
      '3rd Term': [
        'Active and Passive Voice Transformations',
        'Direct and Indirect (Reported) Speech',
        'Collocations and Idiomatic Expressions in JAMB',
        'Silent Letters and Homophones',
        'Summary Writing Techniques for Maximum Marks',
        'Reading Comprehension: Analytical and Expository Passages' // Added
      ]
    },
    SS3: {
      '1st Term': [
        'Punctuation Marks: Colons, Semicolons, Hyphens, Apostrophes',
        'Sentence Inversion, Dangling Modifiers, and Faulty Parallelism',
        'Emphatic Stress in Oral English (JAMB UTME Patterns)',
        'Registers Associated with Commerce, Oil & Gas, and Industry',
        'Comprehensive Lexis & Structure Drills'
      ],
      '2nd Term': [
        'Prescribed Text Literature/Comprehension Passages',
        'Idioms, Proverbs, and Figurative Usage in NECO/WAEC',
        'Spelling Traps, Doubled Consonants, and Suffixes',
        'JAMB Use of English Speed and Accuracy Strategies',
        'Past Questions Mastery: WASSCE English Paper 1'
      ],
      '3rd Term': [
        'Grammatical Analysis of Clauses and Phrases',
        'Intonation Pitches in Questions and Statements',
        'Synonyms and Antonyms High-Frequency Exam Vocabulary',
        'Final JAMB & WAEC CBT Speed Testing',
        'Error Correction in Complex Prose',
        'Reading Comprehension: Critical and Argumentative Passages' // Added
      ]
    }
  },
  physics: {
    SS1: {
      '1st Term': [
        'Fundamental and Derived Quantities and Units',
        'Measurement of Length, Time, and Mass (Micrometer & Vernier)',
        'Position, Distance, and Displacement',
        'Speed, Velocity, and Uniform Acceleration',
        'Equations of Uniformly Accelerated Motion'
      ],
      '2nd Term': [
        'Vectors: Addition, Subtraction, and Resolution of Vectors',
        'Contact and Non-Contact Forces',
        'Newton\'s Laws of Motion and Applications',
        'Friction: Laws, Advantages, and Limiting Friction',
        'Work, Energy, and Power Calculations'
      ],
      '3rd Term': [
        'Conservation of Mechanical Energy',
        'Machines: Mechanical Advantage, Velocity Ratio, Efficiency',
        'Elastic Properties of Solids (Hooke\'s Law & Young\'s Modulus)',
        'Hydrostatic Pressure and Atmospheric Pressure',
        'Archimedes\' Principle, Upthrust, and Flotation'
      ]
    },
    SS2: {
      '1st Term': [
        'Thermal Physics: Temperature and Thermometers',
        'Thermal Expansion in Solids, Liquids, and Gases',
        'Specific Heat Capacity and Method of Mixtures',
        'Latent Heat of Fusion and Vaporization',
        'Heat Transfer: Conduction, Convection, Radiation', // Added
        'Gas Laws: Boyle\'s, Charles\', Pressure Law & Ideal Gas Equation'
      ],
      '2nd Term': [
        'Wave Motion: Transverse, Longitudinal, Amplitude & Wavelength',
        'Wave Equation: v = fλ and Graphical Representation',
        'Types of Waves: Mechanical, Electromagnetic', // Added
        'Sound Waves: Speed, Echoes, Resonance, and Musical Notes',
        'Reflection of Light at Plane and Curved Mirrors',
        'Refraction of Light, Snell\'s Law, and Critical Angle'
      ],
      '3rd Term': [
        'Thin Lenses and Optical Instruments (Microscope & Telescope)',
        'Dispersion of White Light and Electromagnetic Spectrum',
        'Electrostatics: Electric Charges and Coulomb\'s Law',
        'Electric Fields, Potential, and Capacitors in Series/Parallel',
        'Current Electricity: Ohm\'s Law, EMF, and Internal Resistance'
      ]
    },
    SS3: {
      '1st Term': [
        'Electrical Resistivity, Temperature Coefficient of Resistance',
        'Electrical Power, Energy, and Cost of Electricity (kWh)',
        'Magnetic Fields of Permanent Magnets and Current-Carrying Wires',
        'Electromagnetic Induction: Faraday\'s and Lenz\'s Laws',
        'Alternating Current (A.C) Circuits: R-L-C Series and Resonance'
      ],
      '2nd Term': [
        'Transformers: Step-Up, Step-Down, and Transmission of Power',
        'Thermionic Emission, Cathode Ray Oscilloscope (CRO)',
        'Photoelectric Effect, Einstein\'s Equation & Threshold Frequency',
        'X-Rays: Production, Properties, and Bragg\'s Law',
        'Radioactivity: Alpha, Beta, Gamma Rays, Half-Life Calculations'
      ],
      '3rd Term': [
        'Nuclear Reactions: Fission, Fusion, and Mass Defect (E = mc²)',
        'Semiconductor Devices: p-n Junction Diodes and Rectification',
        'Wave-Particle Paradox and de Broglie Wavelength',
        'Comprehensive WAEC Physics Paper 1 Speed Master',
        'JAMB Physics Formula Sheet & Rapid CBT Practice'
      ]
    }
  },
  chemistry: {
    SS1: {
      '1st Term': [
        'Introduction to Chemistry & Scientific Methods',
        'Particulate Nature of Matter (Atoms, Molecules, Ions)',
        'Elements, Compounds, and Mixtures (Separation Techniques)',
        'Atomic Structure, Subatomic Particles & Isotopy',
        'Electronic Configuration (s, p, d, f and K, L, M, N)'
      ],
      '2nd Term': [
        'Periodic Table: Groups, Periods, and Periodic Trends',
        'Chemical Bonding: Electrovalent (Ionic) and Covalent Bonds',
        'Metallic and Intermolecular Bonds (Hydrogen Bonding & Van der Waals)',
        'Stoichiometry: Relative Atomic Mass and The Mole Concept',
        'Chemical Formulae, Valency, and Empirical/Molecular Formulae'
      ],
      '3rd Term': [
        'Chemical Equations and Balancing Chemical Reactions',
        'Gas Laws: Boyle\'s Law, Charles\' Law, Graham\'s Law of Diffusion',
        'Acids: Definition, Physical/Chemical Properties, and Preparation',
        'Bases, Alkalis, and Neutralization Reactions',
        'pH Scale, Indicators, and Types of Salts'
      ]
    },
    SS2: {
      '1st Term': [
        'Volumetric Analysis: Standard Solutions and Acid-Base Titration',
        'Water: Hardness of Water (Temporary & Permanent) and Treatment',
        'Solubility: Solubility Curves and Fractional Crystallization',
        'Carbon and Its Allotropes (Diamond, Graphite, Fullerene)',
        'Oxides of Carbon (CO and CO₂) and Coal Distillation'
      ],
      '2nd Term': [
        'Introduction to Organic Chemistry: Hybridization (sp³, sp², sp)',
        'Homologous Series, Functional Groups, and IUPAC Nomenclature',
        'Alkanes: Preparation, Combustion, and Halogenation (Substitution)',
        'Alkenes: Geometric Isomerism and Addition Reactions (Bromine Test)',
        'Alkynes: Ethyne Preparation, Combustion, and Metal Acetylides'
      ],
      '3rd Term': [
        'Benzene and Aromatic Hydrocarbons',
        'Oxidation and Reduction (Redox): Electron Transfer and Oxidation Numbers',
        'Electrolysis: Electrodes, Preferential Discharge, and Faraday\'s Laws',
        'Electrochemical Cells and Standard Electrode Potentials',
        'Energy and Chemical Reactions: Exothermic and Endothermic Processes'
      ]
    },
    SS3: {
      '1st Term': [
        'Rates of Chemical Reactions: Collision Theory and Catalysts',
        'Chemical Equilibrium: Le Chatelier\'s Principle and Equilibrium Constant',
        'Alkanols: Classification (1°, 2°, 3°), Fermentation, and Oxidation',
        'Alkanoic Acids and Alkanoates (Esterification and Saponification)',
        'Fats, Oils, and Detergents (Soap vs Soapless)'
      ],
      '2nd Term': [
        'Giant Molecules: Carbohydrates, Proteins, and Amino Acids',
        'Synthetic Polymers: Addition and Condensation Polymerization',
        'Metals and Extraction: Iron, Aluminum, Copper, and Gold',
        'Non-Metals: Nitrogen, Sulfur, Chlorine and Their Important Compounds',
        'Environmental Chemistry: Green Chemistry, Pollution & Ozone Layer'
      ],
      '3rd Term': [
        'Qualitative Analysis: Confirmatory Tests for Cations and Anions',
        'Gas Identification Tests (H₂, O₂, CO₂, Cl₂, NH₃, SO₂, H₂S)',
        'JAMB Chemistry CBT Special Mock Review',
        'WASSCE Chemistry Paper 1 Objective Speed Practice',
        'NECO Chemistry Master Test'
      ]
    }
  },
  biology: {
    SS1: {
      '1st Term': [
        'Recognizing Living Things: Characteristics of Life (MR NIGER D)',
        'Classification of Living Things: Kingdoms Monera, Protista, Fungi, Plantae, Animalia',
        'The Cell: Cell Theory, Structure of Plant and Animal Cells',
        'Differences Between Plant and Animal Cells, Organelles',
        'Levels of Organization: Cell, Tissue, Organ, System, Organism'
      ],
      '2nd Term': [
        'Plant Nutrition: Photosynthesis, Light and Dark Reactions',
        'Mineral Requirements of Plants and Deficiency Symptoms',
        'Animal Nutrition: Classes of Food, Balanced Diet, and Malnutrition',
        'Digestive Enzymes and Human Alimentary Canal Mechanism',
        'Transport System in Plants: Xylem, Phloem, and Transpiration'
      ],
      '3rd Term': [
        'Circulatory System in Animals: Blood Composition and Heart Structure',
        'Respiratory Systems: Gills, Trachea, Lungs, and Stomata',
        'Aerobic and Anaerobic Respiration, Glycolysis, and ATP',
        'Excretion in Living Organisms: Contractile Vacuoles, Flame Cells, Nephridia, Kidneys',
        'Ecological Concepts: Biosphere, Ecosystem, Habitat, Population Density'
      ]
    },
    SS2: {
      '1st Term': [
        'Biomes of the World and Nigerian Vegetation Zones',
        'Ecological Factors: Abiotic (Climatic, Edaphic) and Biotic Factors',
        'Energy Flow in Ecosystems: Food Chains, Food Webs, and Trophic Levels',
        'Pyramids of Numbers, Biomass, and Energy',
        'Nutrient Cycling in Nature: Carbon Cycle, Water Cycle, Nitrogen Cycle'
      ],
      '2nd Term': [
        'Ecological Management: Biological Control, Pest Control, Pollution',
        'Skeletal Systems in Animals: Hydrostatic, Exoskeleton, Endoskeleton',
        'Human Skeleton: Axial and Appendicular Skeletons, Joints, and Cartilage',
        'Movement and Locomotion: Muscles, Tendons, and Ligaments',
        'Nervous Coordination: Neurons, Central Nervous System (Brain & Spinal Cord)'
      ],
      '3rd Term': [
        'Reflex Action, Reflex Arc, and Conditioned Reflexes',
        'Sense Organs: Structure and Function of the Human Eye and Ear',
        'Endocrine System: Hormones, Pituitary, Thyroid, Adrenal, Pancreas',
        'Homeostasis: Osmoregulation, Thermoregulation, and Liver Functions',
        'Reproduction in Flowering Plants: Floral Parts, Pollination, and Fertilization'
      ]
    },
    SS3: {
      '1st Term': [
        'Reproduction in Humans: Male and Female Reproductive Systems',
        'Fertilization, Embryo Development, Placenta, and Birth',
        'Genetics: Heredity, Mendel\'s Laws of Inheritance',
        'Monohybrid and Dihybrid Crosses, Genotype and Phenotype',
        'Sex Determination, Sex-Linked Characters (Color Blindness & Hemophilia)'
      ],
      '2nd Term': [
        'Blood Groups (ABO System), Rhesus Factor, and Sickle Cell Anemia',
        'Variation in Populations: Morphological vs Physiological Variations',
        'Evolution: Theories of Lamarck and Darwin, Natural Selection',
        'Evidence of Evolution: Paleontology, Comparative Anatomy, Embryology',
        'Adaptations for Survival: Structural, Physiological, Behavioral'
      ],
      '3rd Term': [
        'Microorganisms Around Us: Vectors, Pathogens, and Diseases',
        'Immunity: Antibodies, Vaccines, and Public Health Measures',
        'JAMB Biology Rapid CBT Speed Practice',
        'WASSCE Biology Paper 1 Objective Past Questions Review',
        'NECO Biology National Examination Mastery'
      ]
    }
  }
};
