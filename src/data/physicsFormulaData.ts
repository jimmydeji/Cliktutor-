
export const PHYSICS_FORMULA_DATA = {
  "metadata": {
    "title": "Nigerian Secondary School Physics Formula Sheet",
    "curriculum": "NERDC Scheme of Work (SS1-SS3)",
  },
  "classes": {
    "SS1": {
      "topics": [
        {
          "topic": "Measurement and Units",
          "formulas": [
            { "id": "ss1_meas_01", "name": "Density", "latex": "\\rho = \\frac{m}{V}", "variables": { "rho": "density (kg/m^3)", "m": "mass (kg)", "V": "volume (m^3)" } },
            { "id": "ss1_meas_02", "name": "Relative Density", "latex": "R.D = \\frac{\\rho_{substance}}{\\rho_{water}}", "variables": { "R.D": "relative density (dimensionless)" }, "notes": "Also = weight of substance in air / upthrust in water" }
          ]
        },
        {
          "topic": "Scalars and Vectors",
          "formulas": [
            { "id": "ss1_vec_01", "name": "Horizontal component", "latex": "F_x = F \\cos\\theta", "variables": { "F_x": "horizontal component", "F": "resultant vector", "theta": "angle to horizontal" } },
            { "id": "ss1_vec_02", "name": "Vertical component", "latex": "F_y = F \\sin\\theta", "variables": { "F_y": "vertical component" } },
            { "id": "ss1_vec_03", "name": "Resultant of perpendicular vectors", "latex": "R = \\sqrt{F_x^2 + F_y^2}", "variables": { "R": "resultant magnitude" } }
          ]
        },
        {
          "topic": "Motion (Kinematics)",
          "formulas": [
            { "id": "ss1_kin_01", "name": "First equation of motion", "latex": "v = u + at", "variables": { "v": "final velocity (m/s)", "u": "initial velocity (m/s)", "a": "acceleration (m/s^2)", "t": "time (s)" } },
            { "id": "ss1_kin_02", "name": "Second equation of motion", "latex": "s = ut + \\frac{1}{2}at^2", "variables": { "s": "displacement (m)" } },
            { "id": "ss1_kin_03", "name": "Third equation of motion", "latex": "v^2 = u^2 + 2as", "variables": {} },
            { "id": "ss1_kin_04", "name": "Average velocity form", "latex": "s = \\frac{(u+v)}{2}\\,t", "variables": {} },
            { "id": "ss1_kin_05", "name": "Motion under gravity (velocity)", "latex": "v = u \\pm gt", "variables": { "g": "acceleration due to gravity" }, "notes": "+ for downward, - for upward" },
            { "id": "ss1_kin_06", "name": "Motion under gravity (height)", "latex": "h = ut \\pm \\frac{1}{2}gt^2", "variables": { "h": "height (m)" } },
            { "id": "ss1_kin_07", "name": "Motion under gravity (velocity-displacement)", "latex": "v^2 = u^2 \\pm 2gh", "variables": {} }
          ]
        },
        {
          "topic": "Newton's Laws, Momentum and Equilibrium",
          "formulas": [
            { "id": "ss1_newton_01", "name": "Newton's second law", "latex": "F = ma = \\frac{m(v-u)}{t}", "variables": { "F": "force (N)", "m": "mass (kg)", "a": "acceleration (m/s^2)" } },
            { "id": "ss1_mom_01", "name": "Momentum", "latex": "p = mv", "variables": { "p": "momentum (kg.m/s)" } },
            { "id": "ss1_mom_02", "name": "Impulse", "latex": "Ft = mv - mu", "variables": { "F": "force", "t": "time" }, "notes": "Impulse = change in momentum" },
            { "id": "ss1_mom_03", "name": "Conservation of linear momentum", "latex": "m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2", "variables": {} },
            { "id": "ss1_eq_01", "name": "Principle of moments", "latex": "F_1 d_1 = F_2 d_2", "variables": { "F": "force", "d": "perpendicular distance from pivot" } }
          ]
        },
        {
          "topic": "Friction",
          "formulas": [
            { "id": "ss1_fric_01", "name": "Limiting static friction", "latex": "F_s = \\mu_s R", "variables": { "F_s": "static friction force (N)", "mu_s": "coefficient of static friction", "R": "normal reaction (N)" } },
            { "id": "ss1_fric_02", "name": "Coefficient of static friction", "latex": "\\mu_s = \\frac{F_{max}}{R}", "variables": {} },
            { "id": "ss1_fric_03", "name": "Coefficient of static friction (horizontal)", "latex": "\\mu_s = \\frac{F_{max}}{mg}", "variables": {}, "notes": "Valid on a horizontal surface where R = mg" },
            { "id": "ss1_fric_04", "name": "Coefficient of static friction (incline)", "latex": "\\mu_s = \\tan\\theta", "variables": { "theta": "angle of inclination at point of sliding" } }
          ]
        },
        {
          "topic": "Work, Energy and Power",
          "formulas": [
            { "id": "ss1_wep_01", "name": "Work done", "latex": "W = Fs\\cos\\theta", "variables": { "W": "work (J)", "s": "distance (m)", "theta": "angle between force and displacement" } },
            { "id": "ss1_wep_02", "name": "Kinetic energy", "latex": "KE = \\frac{1}{2}mv^2", "variables": { "KE": "kinetic energy (J)" } },
            { "id": "ss1_wep_03", "name": "Potential energy", "latex": "PE = mgh", "variables": { "PE": "potential energy (J)" } },
            { "id": "ss1_wep_04", "name": "Power", "latex": "P = \\frac{W}{t} = Fv", "variables": { "P": "power (W)" } }
          ]
        },
        {
          "topic": "Simple Machines",
          "formulas": [
            { "id": "ss1_mach_01", "name": "Mechanical advantage", "latex": "MA = \\frac{Load}{Effort}", "variables": { "MA": "mechanical advantage" } },
            { "id": "ss1_mach_02", "name": "Velocity ratio", "latex": "VR = \\frac{Effort\\ distance}{Load\\ distance}", "variables": { "VR": "velocity ratio" } },
            { "id": "ss1_mach_03", "name": "Efficiency", "latex": "\\eta = \\frac{MA}{VR} \\times 100\\%", "variables": { "eta": "efficiency (%)" } },
            { "id": "ss1_mach_04", "name": "MA of a lever", "latex": "MA = \\frac{Effort\\ arm}{Load\\ arm}", "variables": {} },
            { "id": "ss1_mach_05", "name": "MA of a pulley system", "latex": "MA = \\text{number of supporting ropes}", "variables": {} },
            { "id": "ss1_mach_06", "name": "MA of wheel and axle", "latex": "MA = \\frac{R_{wheel}}{R_{axle}}", "variables": {} },
            { "id": "ss1_mach_07", "name": "MA of inclined plane", "latex": "MA = \\frac{L}{h}", "variables": { "L": "length of slope", "h": "height of slope" } }
          ]
        },
        {
          "topic": "Heat Energy",
          "formulas": [
            { "id": "ss1_heat_01", "name": "Quantity of heat", "latex": "Q = mc\\Delta\\theta", "variables": { "Q": "heat (J)", "c": "specific heat capacity (J/kg.K)", "delta_theta": "temperature change (K)" } },
            { "id": "ss1_heat_02", "name": "Latent heat", "latex": "Q = mL", "variables": { "L": "specific latent heat (J/kg)" } },
            { "id": "ss1_heat_03", "name": "Linear expansion", "latex": "\\Delta L = \\alpha L_0 \\Delta\\theta", "variables": { "alpha": "linear expansivity (K^-1)" } }
          ]
        }
      ]
    },
    "SS2": {
      "topics": [
        {
          "topic": "Projectile Motion",
          "formulas": [
            { "id": "ss2_proj_01", "name": "Time of flight (level ground)", "latex": "T = \\frac{2u\\sin\\theta}{g}", "variables": { "T": "time of flight (s)", "u": "launch speed", "theta": "launch angle" } },
            { "id": "ss2_proj_02", "name": "Maximum height", "latex": "H = \\frac{u^2\\sin^2\\theta}{2g}", "variables": { "H": "maximum height (m)" } },
            { "id": "ss2_proj_03", "name": "Range (level ground)", "latex": "R = \\frac{u^2\\sin 2\\theta}{g}", "variables": { "R": "horizontal range (m)" }, "notes": "Max range at theta = 45 degrees" },
            { "id": "ss2_proj_04", "name": "Time of flight (horizontal projection from height h)", "latex": "T = \\sqrt{\\frac{2h}{g}}", "variables": { "h": "height of projection (m)" } },
            { "id": "ss2_proj_05", "name": "Range (horizontal projection from height h)", "latex": "R = u_x \\sqrt{\\frac{2h}{g}}", "variables": { "u_x": "horizontal launch velocity" } }
          ]
        },
        {
          "topic": "Circular Motion and Gravitation",
          "formulas": [
            { "id": "ss2_circ_01", "name": "Angular velocity", "latex": "\\omega = \\frac{2\\pi}{T} = 2\\pi f", "variables": { "omega": "angular velocity (rad/s)", "f": "frequency (Hz)", "T": "period (s)" } },
            { "id": "ss2_circ_02", "name": "Linear velocity", "latex": "v = \\omega r", "variables": { "r": "radius (m)" } },
            { "id": "ss2_circ_03", "name": "Centripetal acceleration", "latex": "a = \\frac{v^2}{r} = \\omega^2 r", "variables": {} },
            { "id": "ss2_circ_04", "name": "Centripetal force", "latex": "F = \\frac{mv^2}{r} = m\\omega^2 r", "variables": {} },
            { "id": "ss2_grav_01", "name": "Newton's law of gravitation", "latex": "F = \\frac{Gm_1m_2}{r^2}", "variables": { "G": "gravitational constant" } },
            { "id": "ss2_grav_02", "name": "Acceleration due to gravity", "latex": "g = \\frac{GM}{r^2}", "variables": { "M": "mass of planet", "r": "distance from center" } }
          ]
        },
        {
          "topic": "Simple Harmonic Motion (SHM)",
          "formulas": [
            { "id": "ss2_shm_01", "name": "Acceleration in SHM", "latex": "a = -\\omega^2 x", "variables": { "x": "displacement from equilibrium (m)" } },
            { "id": "ss2_shm_02", "name": "Velocity in SHM", "latex": "v = \\omega\\sqrt{A^2 - x^2}", "variables": { "A": "amplitude (m)" } },
            { "id": "ss2_shm_03", "name": "Maximum velocity", "latex": "v_{max} = \\omega A", "variables": {} },
            { "id": "ss2_shm_04", "name": "Period of simple pendulum", "latex": "T = 2\\pi\\sqrt{\\frac{l}{g}}", "variables": { "l": "length of pendulum (m)" } },
            { "id": "ss2_shm_05", "name": "Period of mass-spring system", "latex": "T = 2\\pi\\sqrt{\\frac{m}{k}}", "variables": { "k": "spring constant (N/m)" } }
          ]
        },
        {
          "topic": "Elasticity (Hooke's Law)",
          "formulas": [
            { "id": "ss2_elas_01", "name": "Hooke's law", "latex": "F = ke", "variables": { "k": "spring constant", "e": "extension (m)" } },
            { "id": "ss2_elas_02", "name": "Energy stored in a spring", "latex": "W = \\frac{1}{2}ke^2", "variables": {} },
            { "id": "ss2_elas_03", "name": "Stress", "latex": "\\sigma = \\frac{F}{A}", "variables": { "sigma": "stress (N/m^2)", "A": "cross-sectional area" } },
            { "id": "ss2_elas_04", "name": "Strain", "latex": "\\epsilon = \\frac{e}{L}", "variables": { "epsilon": "strain", "L": "original length" } },
            { "id": "ss2_elas_05", "name": "Young's modulus", "latex": "E = \\frac{\\sigma}{\\epsilon}", "variables": { "E": "Young's modulus (N/m^2)" } }
          ]
        },
        {
          "topic": "Fluid Statics",
          "formulas": [
            { "id": "ss2_fluid_01", "name": "Pressure", "latex": "P = \\frac{F}{A}", "variables": { "P": "pressure (Pa)" } },
            { "id": "ss2_fluid_02", "name": "Pressure in a liquid", "latex": "P = \\rho g h", "variables": { "rho": "liquid density", "h": "depth (m)" } },
            { "id": "ss2_fluid_03", "name": "Upthrust", "latex": "U = \\rho V g", "variables": { "U": "upthrust/buoyant force (N)", "V": "displaced volume" }, "notes": "Archimedes' principle" }
          ]
        },
        {
          "topic": "Waves and Sound",
          "formulas": [
            { "id": "ss2_wave_01", "name": "Wave equation", "latex": "v = f\\lambda", "variables": { "v": "wave speed (m/s)", "f": "frequency (Hz)", "lambda": "wavelength (m)" } },
            { "id": "ss2_wave_02", "name": "Period", "latex": "T = \\frac{1}{f}", "variables": {} },
            { "id": "ss2_wave_03", "name": "Sound intensity level", "latex": "L = 10\\log_{10}\\left(\\frac{I}{I_0}\\right)", "variables": { "L": "intensity level (dB)", "I": "intensity (W/m^2)", "I_0": "reference intensity (1e-12 W/m^2)" } }
          ]
        },
        {
          "topic": "Light: Reflection, Refraction and Lenses",
          "formulas": [
            { "id": "ss2_opt_01", "name": "Refractive index (Snell's law)", "latex": "n = \\frac{\\sin i}{\\sin r}", "variables": { "i": "angle of incidence", "r": "angle of refraction" } },
            { "id": "ss2_opt_02", "name": "Refractive index (speed)", "latex": "n = \\frac{c}{v}", "variables": { "v": "speed of light in medium" } },
            { "id": "ss2_opt_03", "name": "Relative refractive index", "latex": "n_{21} = \\frac{n_2}{n_1} = \\frac{v_1}{v_2}", "variables": {} },
            { "id": "ss2_opt_04", "name": "Critical angle", "latex": "\\sin C = \\frac{1}{n}", "variables": { "C": "critical angle" }, "notes": "For medium-to-air interface; general form sin C = n2/n1" },
            { "id": "ss2_opt_05", "name": "Apparent depth", "latex": "n = \\frac{real\\ depth}{apparent\\ depth}", "variables": {} },
            { "id": "ss2_opt_06", "name": "Apparent shift through a slab", "latex": "shift = t\\left(1 - \\frac{1}{n}\\right)", "variables": { "t": "thickness of slab (m)" } },
            { "id": "ss2_opt_07", "name": "Prism minimum deviation", "latex": "n = \\frac{\\sin\\left(\\frac{A + D_m}{2}\\right)}{\\sin\\left(\\frac{A}{2}\\right)}", "variables": { "A": "refracting angle of prism", "D_m": "minimum deviation" } },
            { "id": "ss2_opt_08", "name": "Mirror/lens formula", "latex": "\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}", "variables": { "f": "focal length", "u": "object distance", "v": "image distance" } },
            { "id": "ss2_opt_09", "name": "Magnification", "latex": "m = \\frac{v}{u} = \\frac{image\\ height}{object\\ height}", "variables": {} },
            { "id": "ss2_opt_10", "name": "Power of a lens", "latex": "P = \\frac{1}{f}", "variables": { "P": "power (dioptres, D)", "f": "focal length in metres" } },
            { "id": "ss2_opt_11", "name": "Focal length of spherical mirror", "latex": "f = \\frac{R}{2}", "variables": { "R": "radius of curvature" } }
          ]
        },
        {
          "topic": "Optical Instruments",
          "formulas": [
            { "id": "ss2_inst_01", "name": "Simple microscope magnification (near point)", "latex": "M = 1 + \\frac{D}{f}", "variables": { "D": "least distance of distinct vision (25 cm)", "f": "focal length of lens" } },
            { "id": "ss2_inst_02", "name": "Compound microscope magnification", "latex": "M \\approx \\frac{v_o}{u_o} \\times \\left(1 + \\frac{D}{f_e}\\right)", "variables": { "v_o": "image distance of objective", "u_o": "object distance from objective", "f_e": "focal length of eyepiece" }, "notes": "Also M = m_o x m_e" },
            { "id": "ss2_inst_03", "name": "Astronomical telescope magnification (normal adjustment)", "latex": "M = \\frac{f_o}{f_e}", "variables": { "f_o": "focal length of objective", "f_e": "focal length of eyepiece" } }
          ]
        },
        {
          "topic": "Electricity and Magnetism",
          "formulas": [
            { "id": "ss2_elec_01", "name": "Ohm's law", "latex": "V = IR", "variables": { "V": "voltage (V)", "I": "current (A)", "R": "resistance (ohm)" } },
            { "id": "ss2_elec_02", "name": "Electrical power", "latex": "P = VI = I^2R = \\frac{V^2}{R}", "variables": {} },
            { "id": "ss2_elec_03", "name": "Resistors in series", "latex": "R_T = R_1 + R_2 + \\dots", "variables": {} },
            { "id": "ss2_elec_04", "name": "Resistors in parallel", "latex": "\\frac{1}{R_T} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots", "variables": {} },
            { "id": "ss2_elec_05", "name": "Resistance from resistivity", "latex": "R = \\frac{\\rho l}{A}", "variables": { "rho": "resistivity (ohm.m)", "l": "length (m)", "A": "cross-sectional area (m^2)" } },
            { "id": "ss2_elec_06", "name": "E.m.f. and internal resistance", "latex": "E = V + Ir = I(R + r)", "variables": { "E": "e.m.f. (V)", "r": "internal resistance (ohm)" } },
            { "id": "ss2_elec_07", "name": "Electrical energy", "latex": "W = QV = IVt = I^2Rt = \\frac{V^2}{R}t", "variables": { "W": "energy (J)" } },
            { "id": "ss2_elec_08", "name": "Coulomb's law", "latex": "F = k\\frac{q_1q_2}{r^2}", "variables": { "q": "charge (C)", "r": "separation (m)" } },
            { "id": "ss2_elec_09", "name": "Capacitance", "latex": "C = \\frac{Q}{V}", "variables": { "C": "capacitance (F)", "Q": "charge (C)" } },
            { "id": "ss2_mag_01", "name": "Magnetic force on a moving charge", "latex": "F = qvB\\sin\\theta", "variables": { "B": "magnetic flux density (T)", "theta": "angle between v and B" } },
            { "id": "ss2_mag_02", "name": "Magnetic flux", "latex": "\\Phi = BA", "variables": { "Phi": "magnetic flux (Wb)", "A": "area (m^2)" } },
            { "id": "ss2_mag_03", "name": "Faraday's law of induction", "latex": "E = -N\\frac{\\Delta\\Phi}{\\Delta t}", "variables": { "N": "number of turns" } },
            { "id": "ss2_mag_04", "name": "Ideal transformer", "latex": "\\frac{V_s}{V_p} = \\frac{N_s}{N_p}", "variables": { "V_s": "secondary voltage", "V_p": "primary voltage", "N_s": "secondary turns", "N_p": "primary turns" } }
          ]
        }
      ]
    },
    "SS3": {
      "topics": [
        {
          "topic": "Energy and Society (Hydroelectric Power and Dams)",
          "formulas": [
            { "id": "ss3_energy_01", "name": "Gravitational potential energy of stored water", "latex": "PE = mgh", "variables": { "m": "mass of water (kg)", "h": "head/height (m)" } },
            { "id": "ss3_energy_02", "name": "Input power to turbine", "latex": "P_{in} = \\rho Q g h", "variables": { "rho": "water density (~1000 kg/m^3)", "Q": "volumetric flow rate (m^3/s)" } },
            { "id": "ss3_energy_03", "name": "Hydroelectric plant efficiency", "latex": "\\eta = \\frac{P_{electrical\\ out}}{\\rho Q g h} \\times 100\\%", "variables": {} }
          ]
        },
        {
          "topic": "Rockets and Satellites",
          "formulas": [
            { "id": "ss3_rocket_01", "name": "Rocket thrust", "latex": "F_{thrust} = v_e \\frac{\\Delta m}{\\Delta t}", "variables": { "v_e": "exhaust velocity (m/s)", "dm/dt": "mass flow rate (kg/s)" } },
            { "id": "ss3_rocket_02", "name": "Net force at launch", "latex": "F_{net} = Thrust - mg = ma", "variables": {} },
            { "id": "ss3_rocket_03", "name": "Ideal rocket equation", "latex": "\\Delta v = v_e \\ln\\left(\\frac{m_0}{m}\\right)", "variables": { "m_0": "initial mass", "m": "final mass" } }
          ]
        },
        {
          "topic": "Nigerian Space Science (Satellites)",
          "formulas": [
            { "id": "ss3_sat_01", "name": "Orbital speed (circular orbit)", "latex": "v = \\sqrt{\\frac{GM}{r}}", "variables": { "r": "orbital radius = R + h" } },
            { "id": "ss3_sat_02", "name": "Orbital period", "latex": "T = 2\\pi\\sqrt{\\frac{r^3}{GM}}", "variables": {} },
            { "id": "ss3_sat_03", "name": "Escape velocity", "latex": "v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}", "variables": { "R": "planet radius (m)" } },
            { "id": "ss3_sat_04", "name": "Orbital vs escape velocity", "latex": "v_{orbital} = \\frac{v_{escape}}{\\sqrt{2}}", "variables": {} }
          ]
        },
        {
          "topic": "Gravitational Fields",
          "formulas": [
            { "id": "ss3_gfield_01", "name": "Gravitational potential", "latex": "\\phi = -\\frac{GM}{r}", "variables": { "phi": "gravitational potential (J/kg)" } },
            { "id": "ss3_gfield_02", "name": "Gravitational potential energy", "latex": "U = -\\frac{GMm}{r}", "variables": { "U": "gravitational PE (J)" } }
          ]
        },
        {
          "topic": "Alternating Current (A.C.) Circuits",
          "formulas": [
            { "id": "ss3_ac_01", "name": "R.M.S. current", "latex": "I_{rms} = \\frac{I_0}{\\sqrt{2}} \\approx 0.707 I_0", "variables": { "I_0": "peak current (A)" } },
            { "id": "ss3_ac_02", "name": "Peak current", "latex": "I_0 = \\sqrt{2}\\,I_{rms} \\approx 1.414 I_{rms}", "variables": {} },
            { "id": "ss3_ac_03", "name": "R.M.S. voltage", "latex": "V_{rms} = \\frac{V_0}{\\sqrt{2}}", "variables": { "V_0": "peak voltage (V)" } },
            { "id": "ss3_ac_04", "name": "Peak voltage", "latex": "V_0 = \\sqrt{2}\\,V_{rms}", "variables": {} },
            { "id": "ss3_ac_05", "name": "Capacitive reactance", "latex": "X_C = \\frac{1}{2\\pi f C}", "variables": { "X_C": "capacitive reactance (ohm)", "f": "frequency (Hz)", "C": "capacitance (F)" } },
            { "id": "ss3_ac_06", "name": "Inductive reactance", "latex": "X_L = 2\\pi f L", "variables": { "X_L": "inductive reactance (ohm)", "L": "inductance (H)" } },
            { "id": "ss3_ac_07", "name": "Impedance of RLC series circuit", "latex": "Z = \\sqrt{R^2 + (X_L - X_C)^2}", "variables": { "Z": "impedance (ohm)" } },
            { "id": "ss3_ac_08", "name": "Resonant frequency", "latex": "f_0 = \\frac{1}{2\\pi\\sqrt{LC}}", "variables": {}, "notes": "Occurs when X_L = X_C" }
          ]
        },
        {
          "topic": "Radioactivity and Nuclear Physics",
          "formulas": [
            { "id": "ss3_rad_01", "name": "Radioactive decay law", "latex": "N = N_0 e^{-\\lambda t}", "variables": { "N": "nuclei remaining", "N_0": "initial nuclei", "lambda": "decay constant (s^-1)", "t": "time (s)" } },
            { "id": "ss3_rad_02", "name": "Activity", "latex": "A = \\lambda N = A_0 e^{-\\lambda t}", "variables": { "A": "activity (Bq)" } },
            { "id": "ss3_rad_03", "name": "Half-life", "latex": "T_{1/2} = \\frac{\\ln 2}{\\lambda} \\approx \\frac{0.693}{\\lambda}", "variables": { "T_1/2": "half-life (s)" } },
            { "id": "ss3_rad_04", "name": "Nuclei remaining after n half-lives", "latex": "N = N_0\\left(\\frac{1}{2}\\right)^n", "variables": { "n": "number of half-lives elapsed" } },
            { "id": "ss3_rad_05", "name": "Alpha decay", "latex": "{}^{A}_{Z}X \\rightarrow {}^{A-4}_{Z-2}Y + {}^{4}_{2}He", "variables": { "A": "mass number", "Z": "atomic number" }, "notes": "Mass number decreases by 4; atomic number by 2" },
            { "id": "ss3_rad_06", "name": "Beta-minus decay", "latex": "{}^{A}_{Z}X \\rightarrow {}^{A}_{Z+1}Y + {}^{0}_{-1}e + \\bar{\\nu}", "variables": {}, "notes": "Mass number unchanged; atomic number increases by 1" },
            { "id": "ss3_rad_07", "name": "Mass-energy equivalence", "latex": "E = mc^2", "variables": {} },
            { "id": "ss3_rad_08", "name": "Mass defect energy", "latex": "\\Delta E = \\Delta m\\,c^2", "variables": { "delta_m": "mass defect (kg)" } }
          ]
        },
        {
          "topic": "Photons and Quantum Physics",
          "formulas": [
            { "id": "ss3_quant_01", "name": "Photon energy", "latex": "E = hf = \\frac{hc}{\\lambda}", "variables": { "E": "photon energy (J)" } },
            { "id": "ss3_quant_02", "name": "Photon momentum", "latex": "p = \\frac{h}{\\lambda} = \\frac{E}{c}", "variables": {} },
            { "id": "ss3_quant_03", "name": "Photoelectric effect", "latex": "KE_{max} = hf - \\Phi", "variables": { "Phi": "work function (J)" } },
            { "id": "ss3_quant_04", "name": "Electron acceleration energy", "latex": "eV = \\frac{1}{2}mv^2", "variables": { "V": "accelerating potential difference (V)" } }
          ]
        },
        {
          "topic": "Electronics",
          "formulas": [
            { "id": "ss3_elec_01", "name": "Transistor current gain", "latex": "\\beta = \\frac{I_c}{I_b}", "variables": { "beta": "current gain", "I_c": "collector current", "I_b": "base current" } }
          ]
        }
      ]
    }
  }
};
