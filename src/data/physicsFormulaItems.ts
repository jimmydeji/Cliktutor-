
import { FormulaItem } from '../data/formulaSheet';

export const PHYSICS_FORMULA_ITEMS: FormulaItem[] = [
    { id: 'ss1-dens', category: 'physics', title: 'Density', value: '\\rho = m/V', description: 'Mass per unit volume' },
    { id: 'ss1-rd', category: 'physics', title: 'Relative Density', value: 'R.D = \\rho_{sub}/\\rho_{wat}', description: 'Density ratio' },
    { id: 'ss2-proj-t', category: 'physics', title: 'Time of Flight', value: 'T = 2u sin θ / g', description: 'Projectile T' },
    { id: 'ss2-proj-r', category: 'physics', title: 'Range', value: 'R = u² sin 2θ / g', description: 'Projectile R' },
    { id: 'ss2-shm-t', category: 'physics', title: 'Pendulum Period', value: 'T = 2π√(l/g)', description: 'Simple pendulum' }
];
