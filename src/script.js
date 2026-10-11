/**
 * AI Based Quiz Application - Logic Script
 * Handles Subject, Chapter, Difficulty, Number of Questions,
 * dynamic suggestions, form validation, and interactive AI quiz generation.
 */

// Subject Chapter Presets
const CHAPTER_PRESETS = {
  physics: [
    "Kinematics & 1D/2D Motion",
    "Newton's Laws of Motion",
    "Work, Energy & Power",
    "Thermodynamics & Heat",
    "Electromagnetism & Circuits",
    "Wave Optics & Light",
    "Gravitation & Planetary Motion",
    "Modern & Nuclear Physics"
  ],
  chemistry: [
    "Chemical Bonding & Molecular Structure",
    "Thermodynamics & Thermochemistry",
    "Chemical & Ionic Equilibrium",
    "Organic Reaction Mechanisms",
    "Electrochemistry & Redox Reactions",
    "Periodic Trends & Atomic Structure",
    "Solutions & Colligative Properties",
    "Hydrocarbons & Functional Groups"
  ],
  mathematics: [
    "Differential & Integral Calculus",
    "Coordinate Geometry & Conic Sections",
    "Trigonometric Functions & Identities",
    "Probability & Statistics",
    "Matrices & Linear Systems",
    "Vectors & 3D Geometry",
    "Complex Numbers & Quadratic Equations",
    "Permutations & Combinations"
  ]
};

// Rich Question Bank tailored to Subjects, Chapters, and Difficulties
const CURATED_QUESTIONS_DB = {
  physics: {
    easy: [
      {
        question: "What is the SI unit of electric current?",
        options: ["Volt", "Ampere", "Ohm", "Watt"],
        correctIndex: 1,
        explanation: "The Ampere (A) is the fundamental SI unit for measuring electric current, defined by the elementary charge flow."
      },
      {
        question: "Which of Newton's laws states that every action has an equal and opposite reaction?",
        options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
        correctIndex: 2,
        explanation: "Newton's Third Law states that when one body exerts a force on another, the second body simultaneously exerts a force equal in magnitude and opposite in direction."
      },
      {
        question: "What physical quantity does the area under a velocity-time graph represent?",
        options: ["Acceleration", "Displacement", "Speed", "Force"],
        correctIndex: 1,
        explanation: "Integrating velocity with respect to time (the area under the v-t graph) yields displacement (Δx = ∫ v dt)."
      },
      {
        question: "If an object is in free fall near Earth's surface neglecting air resistance, its acceleration is approximately:",
        options: ["0 m/s²", "4.9 m/s²", "9.8 m/s²", "19.6 m/s²"],
        correctIndex: 2,
        explanation: "Standard acceleration due to Earth's gravity at sea level is approximately g = 9.8 m/s² downwards."
      },
      {
        question: "Which type of wave is light in a vacuum?",
        options: ["Longitudinal wave", "Transverse electromagnetic wave", "Mechanical pressure wave", "Sound wave"],
        correctIndex: 1,
        explanation: "Light is a transverse electromagnetic wave consisting of oscillating electric and magnetic fields perpendicular to the propagation vector."
      }
    ],
    medium: [
      {
        question: "A car accelerates uniformly from rest to 20 m/s over a distance of 50 meters. What is the car's acceleration?",
        options: ["2 m/s²", "4 m/s²", "8 m/s²", "10 m/s²"],
        correctIndex: 1,
        explanation: "Using the kinematic relation v² = u² + 2as: (20)² = 0² + 2(a)(50) => 400 = 100a => a = 4 m/s²."
      },
      {
        question: "In an ideal Carnot heat engine operating between temperatures of 600 K and 300 K, what is the maximum theoretical efficiency?",
        options: ["25%", "50%", "66.7%", "75%"],
        correctIndex: 1,
        explanation: "Carnot efficiency η = 1 - (T_cold / T_hot) = 1 - (300 / 600) = 0.50 or 50%."
      },
      {
        question: "Two parallel wires carry currents in the same direction. What magnetic interaction exists between them?",
        options: ["They repel each other", "They attract each other", "Zero net magnetic force", "They torque without translation"],
        correctIndex: 1,
        explanation: "By the right-hand rule and Lorentz force law, parallel currents in the same direction generate magnetic fields that attract each other."
      },
      {
        question: "A simple pendulum of length L has a period T. If the length is quadrupled (4L), the new period is:",
        options: ["T / 2", "T", "2T", "4T"],
        correctIndex: 2,
        explanation: "Period T = 2π√(L/g). Quadrupling L multiplies the period by √4 = 2, so the new period is 2T."
      },
      {
        question: "What is the de Broglie wavelength associated with an electron with momentum p?",
        options: ["λ = h / p", "λ = p / h", "λ = h · p", "λ = h / (2p²)"],
        correctIndex: 0,
        explanation: "The de Broglie hypothesis relates wavelength to linear momentum via λ = h / p, where h is Planck's constant."
      }
    ],
    hard: [
      {
        question: "A uniform solid cylinder of mass M and radius R rolls without slipping down an incline of angle θ. Its linear acceleration is:",
        options: ["g sin(θ)", "(2/3) g sin(θ)", "(1/2) g sin(θ)", "(3/4) g sin(θ)"],
        correctIndex: 1,
        explanation: "For rolling without slipping: a = g sin(θ) / (1 + I / (MR²)). For a solid cylinder, I = (1/2)MR², so a = g sin(θ) / (1 + 1/2) = (2/3) g sin(θ)."
      },
      {
        question: "In an RLC series circuit at resonance, which of the following statements is TRUE?",
        options: [
          "The impedance is purely reactive and maximum",
          "Current and voltage are in phase, and impedance equals R",
          "Capacitive reactance exceeds inductive reactance",
          "Current leads voltage by 90 degrees"
        ],
        correctIndex: 1,
        explanation: "At resonant frequency ω₀ = 1/√(LC), inductive reactance X_L equals capacitive reactance X_C, cancelling out the net reactance so Z = R (minimum impedance, current in phase)."
      },
      {
        question: "A charge Q is uniformly distributed throughout the volume of a dielectric sphere of radius R. At distance r < R from the center, the electric field magnitude is proportional to:",
        options: ["1 / r²", "1 / r", "r", "Constant (independent of r)"],
        correctIndex: 2,
        explanation: "By Gauss's law, enclosing charge q_enc = Q (r³/R³). Therefore, E · 4πr² = q_enc / ε₀ => E = (Q / 4πε₀R³) · r, which is directly proportional to r."
      },
      {
        question: "In Compton scattering, maximum wavelength shift (Δλ_max) occurs when the photon scattering angle θ is:",
        options: ["0°", "45°", "90°", "180°"],
        correctIndex: 3,
        explanation: "The Compton wavelength shift formula is Δλ = (h / m_e c)(1 - cos θ). The maximum shift occurs when cos θ = -1 (θ = 180° backscattering), giving Δλ = 2h / (m_e c)."
      },
      {
        question: "What is the escape velocity from the surface of a spherical planet of mass M and radius R?",
        options: ["√(GM / R)", "√(2GM / R)", "2√(GM / R)", "GM / (2R)"],
        correctIndex: 1,
        explanation: "Conservation of energy: (1/2) m v_esc² - G M m / R = 0 => v_esc = √(2GM / R)."
      }
    ]
  },
  chemistry: {
    easy: [
      {
        question: "What is the pH of a neutral aqueous solution at 25°C?",
        options: ["0", "7", "10", "14"],
        correctIndex: 1,
        explanation: "At standard temperature (25°C), pure water has [H⁺] = [OH⁻] = 1.0 × 10⁻⁷ M, resulting in pH = -log(10⁻⁷) = 7."
      },
      {
        question: "Which of the following is an inert noble gas?",
        options: ["Chlorine", "Argon", "Nitrogen", "Oxygen"],
        correctIndex: 1,
        explanation: "Argon (Ar, atomic number 18) belongs to Group 18 of the periodic table, possessing a stable full valence octet."
      },
      {
        question: "What type of bond is formed when electrons are shared between two nonmetal atoms?",
        options: ["Ionic bond", "Covalent bond", "Metallic bond", "Hydrogen bond"],
        correctIndex: 1,
        explanation: "A covalent bond forms when two atoms with comparable electronegativities share one or more pairs of valence electrons."
      },
      {
        question: "What is the chemical formula for ordinary table salt?",
        options: ["KCl", "NaCl", "CaCl₂", "Na₂SO₄"],
        correctIndex: 1,
        explanation: "Table salt is sodium chloride, an ionic lattice with the empirical formula NaCl."
      },
      {
        question: "In an oxidation-reduction reaction, 'Oxidation' corresponds to:",
        options: ["Gain of electrons", "Loss of electrons", "Gain of protons", "Loss of neutrons"],
        correctIndex: 1,
        explanation: "Remember 'OIL RIG': Oxidation Is Loss of electrons, Reduction Is Gain of electrons."
      }
    ],
    medium: [
      {
        question: "What is the hybridization and molecular geometry of the carbon atom in methane (CH₄)?",
        options: ["sp, Linear", "sp², Trigonal planar", "sp³, Tetrahedral", "sp³d, Trigonal bipyramidal"],
        correctIndex: 2,
        explanation: "Carbon forms 4 sigma bonds with zero lone pairs in CH₄, corresponding to sp³ hybridization and tetrahedral geometry with 109.5° bond angles."
      },
      {
        question: "According to Le Chatelier's principle, what happens to the exothermic equilibrium N₂ + 3H₂ ⇌ 2NH₃ (ΔH < 0) when temperature is increased?",
        options: [
          "Shifts to the right (more NH₃)",
          "Shifts to the left (more N₂ and H₂)",
          "No shift occurs",
          "Equilibrium constant K increases"
        ],
        correctIndex: 1,
        explanation: "Because the forward reaction is exothermic (releases heat), increasing temperature acts as adding heat, causing the system to shift towards the endothermic reverse direction (left)."
      },
      {
        question: "What is the oxidation state of Chromium in the dichromate ion (Cr₂O₇²⁻)?",
        options: ["+3", "+4", "+6", "+7"],
        correctIndex: 2,
        explanation: "Let x be the oxidation state of Cr: 2(x) + 7(-2) = -2 => 2x - 14 = -2 => 2x = 12 => x = +6."
      },
      {
        question: "Which intermolecular force is predominantly responsible for the unusually high boiling point of water (H₂O)?",
        options: ["London dispersion forces", "Dipole-induced dipole forces", "Hydrogen bonding", "Ion-dipole forces"],
        correctIndex: 2,
        explanation: "Hydrogen bonding between hydrogen bonded to highly electronegative oxygen and adjacent lone pairs creates strong intermolecular attraction in liquid water."
      },
      {
        question: "What is the standard molar volume of an ideal gas at STP (0°C, 1 atm)?",
        options: ["11.2 L", "22.4 L", "24.5 L", "44.8 L"],
        correctIndex: 1,
        explanation: "At standard temperature and pressure (0°C, 1 atm), one mole of any ideal gas occupies approximately 22.4 liters."
      }
    ],
    hard: [
      {
        question: "In the context of crystal field theory, which metal d-electron configuration in an octahedral field can exhibit both high-spin and low-spin states?",
        options: ["d³", "d⁴", "d⁸", "d¹⁰"],
        correctIndex: 1,
        explanation: "In octahedral geometry, d⁴ through d⁷ complexes can exist as high-spin (small Δ_oct) or low-spin (large Δ_oct) depending on ligand field strength versus pairing energy."
      },
      {
        question: "What is the rate law for a reaction where doubling the concentration of reactant [A] quadruples the initial rate, while doubling [B] leaves the rate unchanged?",
        options: ["Rate = k [A] [B]", "Rate = k [A]² [B]", "Rate = k [A]²", "Rate = k [A] [B]²"],
        correctIndex: 2,
        explanation: "If rate ∝ [A]², doubling [A] yields 2² = 4x rate (second order in A). If rate is independent of [B], it is zero order in B. Thus, Rate = k [A]²."
      },
      {
        question: "According to Huckel's rule, a planar cyclic conjugated monocyclic hydrocarbon is aromatic if it contains:",
        options: ["4n π-electrons", "(4n + 2) π-electrons", "(2n + 1) π-electrons", "2n π-electrons"],
        correctIndex: 1,
        explanation: "Hückel's rule states that cyclic, planar, fully conjugated systems with (4n + 2) π electrons (where n is a non-negative integer: 2, 6, 10, 14...) possess aromatic stability."
      },
      {
        question: "Calculate the standard Gibbs free energy change ΔG° at 298 K for a cell with standard potential E° = +1.10 V transferring 2 moles of electrons (F ≈ 96500 C/mol):",
        options: ["-212.3 kJ/mol", "+212.3 kJ/mol", "-106.1 kJ/mol", "+106.1 kJ/mol"],
        correctIndex: 0,
        explanation: "ΔG° = -n F E° = -(2)(96500 C/mol)(1.10 V) = -212,300 J/mol = -212.3 kJ/mol."
      },
      {
        question: "Which of the following molecules has zero dipole moment despite having polar bonds?",
        options: ["NH₃", "H₂O", "SF₄", "BF₃"],
        correctIndex: 3,
        explanation: "BF₃ has trigonal planar geometry (120° angles). The three equal B-F dipole moments vectorially cancel each other completely, giving a net dipole moment of zero."
      }
    ]
  },
  mathematics: {
    easy: [
      {
        question: "What is the derivative of f(x) = x³ with respect to x?",
        options: ["x²", "3x²", "3x", "x⁴ / 4"],
        correctIndex: 1,
        explanation: "By the power rule: d/dx (xⁿ) = n·xⁿ⁻¹. For x³, the derivative is 3x²."
      },
      {
        question: "What is the value of sin(90°) or sin(π/2 rad)?",
        options: ["0", "0.5", "1", "-1"],
        correctIndex: 2,
        explanation: "On the unit circle at angle π/2 (90°), the y-coordinate is 1, so sin(90°) = 1."
      },
      {
        question: "If a triangle has sides of length 3 and 4 with a 90° angle between them, what is the length of the hypotenuse?",
        options: ["5", "6", "7", "25"],
        correctIndex: 0,
        explanation: "By the Pythagorean theorem: c = √(a² + b²) = √(3² + 4²) = √(9 + 16) = √25 = 5."
      },
      {
        question: "What are the roots of the quadratic equation x² - 9 = 0?",
        options: ["x = 3 only", "x = -3 only", "x = 3 and x = -3", "x = 0 and x = 9"],
        correctIndex: 2,
        explanation: "x² - 9 = (x - 3)(x + 3) = 0, giving two real roots: x = 3 and x = -3."
      },
      {
        question: "What is the value of log₁₀(1000)?",
        options: ["1", "2", "3", "10"],
        correctIndex: 2,
        explanation: "Since 10³ = 1000, the logarithm base 10 of 1000 is exactly 3."
      }
    ],
    medium: [
      {
        question: "What is the definite integral ∫ from 0 to 2 of (3x² + 2x) dx?",
        options: ["8", "12", "14", "16"],
        correctIndex: 1,
        explanation: "Antiderivative: [x³ + x²] from 0 to 2 = (2³ + 2²) - (0) = 8 + 4 = 12."
      },
      {
        question: "What is the determinant of the 2x2 matrix: [[4, 2], [3, 5]]?",
        options: ["14", "20", "26", "6"],
        correctIndex: 0,
        explanation: "For a 2x2 matrix [[a, b], [c, d]], det = ad - bc. Here: (4)(5) - (2)(3) = 20 - 6 = 14."
      },
      {
        question: "In how many distinct ways can 5 books be arranged on a single shelf?",
        options: ["25", "60", "120", "720"],
        correctIndex: 2,
        explanation: "The number of permutations of 5 items is 5! = 5 × 4 × 3 × 2 × 1 = 120."
      },
      {
        question: "If two events A and B are independent with P(A) = 0.4 and P(B) = 0.5, what is P(A ∩ B)?",
        options: ["0.9", "0.2", "0.1", "0.0"],
        correctIndex: 1,
        explanation: "For independent events: P(A ∩ B) = P(A) × P(B) = 0.4 × 0.5 = 0.20."
      },
      {
        question: "What is the slope of the tangent line to y = ln(x) at x = 2?",
        options: ["1/4", "1/2", "1", "2"],
        correctIndex: 1,
        explanation: "The derivative of ln(x) is 1/x. Evaluating at x = 2 gives dy/dx = 1/2."
      }
    ],
    hard: [
      {
        question: "Evaluate the limit: lim (x -> 0) of (sin(3x) / (2x))",
        options: ["0", "1", "3/2", "Undefined"],
        correctIndex: 2,
        explanation: "Using standard limit lim (u -> 0) sin(u)/u = 1: lim (sin(3x) / 2x) = (3/2) · lim (sin(3x)/3x) = 3/2."
      },
      {
        question: "What are the eigenvalues of the matrix A = [[2, 1], [1, 2]]?",
        options: ["λ = 1 and λ = 3", "λ = 2 and λ = 2", "λ = 0 and λ = 4", "λ = -1 and λ = 3"],
        correctIndex: 0,
        explanation: "Characteristic equation: det(A - λI) = (2 - λ)² - 1 = 0 => (2 - λ)² = 1 => 2 - λ = ±1 => λ = 3 or λ = 1."
      },
      {
        question: "What is the general solution to the first-order linear differential equation dy/dx + 2y = 0?",
        options: ["y = C e^(2x)", "y = C e^(-2x)", "y = C - 2x", "y = C ln(2x)"],
        correctIndex: 1,
        explanation: "Separating variables: dy/y = -2 dx => ln|y| = -2x + C₁ => y = C e^(-2x)."
      },
      {
        question: "In Euclidean 3D space, what is the cross product of unit vectors î × ĵ?",
        options: ["0", "î", "k̂", "-k̂"],
        correctIndex: 2,
        explanation: "By the right-hand cyclic rule of standard orthonormal basis vectors: î × ĵ = k̂."
      },
      {
        question: "What is the sum of the infinite geometric series: 1 + 1/3 + 1/9 + 1/27 + ...?",
        options: ["4/3", "3/2", "2", "3"],
        correctIndex: 1,
        explanation: "For |r| < 1, sum S = a / (1 - r). Here a = 1, r = 1/3: S = 1 / (1 - 1/3) = 1 / (2/3) = 3/2."
      }
    ]
  }
};

// Application State
const quizState = {
  selectedSubject: "physics",
  chapter: "",
  difficulty: "medium",
  questionCount: 10,
  activeQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  isSubmitted: false
};

// DOM Elements
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  const form = document.getElementById("quiz-setup-form");
  const subjectRadios = document.querySelectorAll('input[name="subject"]');
  const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
  const countRadios = document.querySelectorAll('input[name="questionCount"]');
  const chapterInput = document.getElementById("chapter-input");
  const chapterChipsContainer = document.getElementById("chapter-chips");
  const generateBtn = document.getElementById("generate-quiz-btn");
  const resetBtn = document.getElementById("reset-form-btn");
  const formAlert = document.getElementById("form-alert");

  // Summary Elements
  const summarySubject = document.getElementById("summary-subject");
  const summaryChapter = document.getElementById("summary-chapter");
  const summaryDifficulty = document.getElementById("summary-difficulty");
  const summaryCount = document.getElementById("summary-count");
  const summaryTime = document.getElementById("summary-est-time");

  // Quiz display container elements
  const quizContainer = document.getElementById("quiz-active-section");
  const exitQuizBtn = document.getElementById("exit-quiz-btn");

  // Set default initial chapter
  updateChapterSuggestions("physics");
  updateLiveSummary();

  // 1. Subject Change Handler
  subjectRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      quizState.selectedSubject = e.target.value;
      updateChapterSuggestions(quizState.selectedSubject);
      updateLiveSummary();
    });
  });

  // 2. Chapter Input Handler
  chapterInput.addEventListener("input", (e) => {
    quizState.chapter = e.target.value.trim();
    // Clear chips active state if typing manually
    const chips = chapterChipsContainer.querySelectorAll(".chip-btn");
    chips.forEach((c) => {
      if (c.textContent.trim().toLowerCase() === quizState.chapter.toLowerCase()) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });
    updateLiveSummary();
    hideAlert();
  });

  // 3. Difficulty Change Handler
  difficultyRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      quizState.difficulty = e.target.value;
      updateLiveSummary();
    });
  });

  // 4. Question Count Change Handler
  countRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      quizState.questionCount = parseInt(e.target.value, 10);
      updateLiveSummary();
    });
  });

  // 5. Reset Form Handler
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.querySelector('input[name="subject"][value="physics"]').checked = true;
      document.querySelector('input[name="difficulty"][value="medium"]').checked = true;
      document.querySelector('input[name="questionCount"][value="10"]').checked = true;
      chapterInput.value = "";
      quizState.selectedSubject = "physics";
      quizState.chapter = "";
      quizState.difficulty = "medium";
      quizState.questionCount = 10;
      updateChapterSuggestions("physics");
      updateLiveSummary();
      hideAlert();
    });
  }

  // 6. Generate Quiz Button Click
  if (generateBtn) {
    generateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleGenerateQuiz();
    });
  }

  // 7. Exit Quiz & return to form
  if (exitQuizBtn) {
    exitQuizBtn.addEventListener("click", () => {
      quizContainer.classList.remove("is-visible");
      quizState.activeQuiz = null;
      quizState.currentQuestionIndex = 0;
      quizState.userAnswers = {};
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Function to render chapter suggestion pills
  function updateChapterSuggestions(subjectKey) {
    const list = CHAPTER_PRESETS[subjectKey] || [];
    chapterChipsContainer.innerHTML = "";

    list.forEach((chapterName, idx) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip-btn";
      chip.textContent = chapterName;

      // Select the first one by default if chapter is empty
      if (idx === 0 && !quizState.chapter) {
        chip.classList.add("active");
        quizState.chapter = chapterName;
        chapterInput.value = chapterName;
      } else if (quizState.chapter === chapterName) {
        chip.classList.add("active");
      }

      chip.addEventListener("click", () => {
        chapterInput.value = chapterName;
        quizState.chapter = chapterName;
        // toggle active
        chapterChipsContainer.querySelectorAll(".chip-btn").forEach((b) => b.classList.remove("active"));
        chip.classList.add("active");
        updateLiveSummary();
        hideAlert();
      });

      chapterChipsContainer.appendChild(chip);
    });
  }

  // Update live preview in sidebar
  function updateLiveSummary() {
    const capitalizedSubject = quizState.selectedSubject.charAt(0).toUpperCase() + quizState.selectedSubject.slice(1);
    if (summarySubject) summarySubject.textContent = capitalizedSubject;
    if (summaryChapter) summaryChapter.textContent = quizState.chapter || "Not Specified";
    if (summaryDifficulty) {
      summaryDifficulty.textContent = quizState.difficulty.charAt(0).toUpperCase() + quizState.difficulty.slice(1);
    }
    if (summaryCount) summaryCount.textContent = `${quizState.questionCount} Questions`;
    if (summaryTime) {
      const mins = quizState.questionCount === 5 ? "5 mins" : quizState.questionCount === 10 ? "10 mins" : "20 mins";
      summaryTime.textContent = `~${mins}`;
    }
  }

  // Validate and generate quiz
  function handleGenerateQuiz() {
    // Validation: Chapter must not be empty
    if (!quizState.chapter || quizState.chapter.trim() === "") {
      showAlert("Please enter or select a Chapter before generating the quiz.");
      chapterInput.focus();
      return;
    }

    hideAlert();
    setGenerateLoading(true);

    // Simulate AI generation / compilation
    setTimeout(() => {
      const questions = compileQuizQuestions(
        quizState.selectedSubject,
        quizState.chapter,
        quizState.difficulty,
        quizState.questionCount
      );

      quizState.activeQuiz = questions;
      quizState.currentQuestionIndex = 0;
      quizState.userAnswers = {};
      quizState.isSubmitted = false;

      setGenerateLoading(false);
      renderActiveQuiz();

      // Scroll to quiz view
      quizContainer.classList.add("is-visible");
      quizContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 600);
  }

  function setGenerateLoading(isLoading) {
    if (isLoading) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = `<span class="spinner"></span> Generating AI Quiz...`;
    } else {
      generateBtn.disabled = false;
      generateBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
        </svg>
        Generate a Quiz
      `;
    }
  }

  function showAlert(msg) {
    formAlert.textContent = msg;
    formAlert.classList.add("is-visible");
  }

  function hideAlert() {
    formAlert.classList.remove("is-visible");
  }
}

/**
 * Compiles or generates questions for the quiz based on parameters
 */
function compileQuizQuestions(subject, chapter, difficulty, count) {
  const subjectPool = CURATED_QUESTIONS_DB[subject] || CURATED_QUESTIONS_DB.physics;
  const difficultyList = subjectPool[difficulty] || subjectPool.medium;

  // We assemble the requested count of questions
  const generated = [];
  const basePool = [...difficultyList];

  for (let i = 0; i < count; i++) {
    if (i < basePool.length) {
      generated.push({ ...basePool[i] });
    } else {
      // Dynamic thematic generator to fulfill larger sets (10 or 20)
      const template = basePool[i % basePool.length];
      generated.push({
        question: `[${chapter}] Variation ${i + 1}: ${template.question}`,
        options: [...template.options],
        correctIndex: template.correctIndex,
        explanation: `${template.explanation} (Focus topic: ${chapter})`
      });
    }
  }

  return generated;
}

/**
 * Renders the active generated quiz view and handles user interaction
 */
function renderActiveQuiz() {
  const quizContainer = document.getElementById("quiz-active-section");
  if (!quizState.activeQuiz || quizState.activeQuiz.length === 0) return;

  const currentIdx = quizState.currentQuestionIndex;
  const total = quizState.activeQuiz.length;
  const qData = quizState.activeQuiz[currentIdx];

  // Capitalize helpers
  const subCap = quizState.selectedSubject.charAt(0).toUpperCase() + quizState.selectedSubject.slice(1);
  const diffCap = quizState.difficulty.charAt(0).toUpperCase() + quizState.difficulty.slice(1);

  quizContainer.innerHTML = `
    <div class="quiz-meta-bar">
      <div class="quiz-badge-group">
        <span class="quiz-pill-subject ${quizState.selectedSubject}">${subCap}</span>
        <span class="quiz-pill-diff">${diffCap}</span>
        <span style="font-weight: 600; color: #334155;">${quizState.chapter}</span>
      </div>
      <div class="quiz-controls-top">
        <span class="quiz-progress-text">Question ${currentIdx + 1} of ${total}</span>
        <button id="exit-quiz-btn" class="btn-secondary" title="Return to quiz form">Exit Quiz</button>
      </div>
    </div>

    <div class="question-block">
      <h3 class="question-prompt">${currentIdx + 1}. ${qData.question}</h3>
      <div class="options-list" id="quiz-options-list">
        ${qData.options
          .map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isUserSelected = quizState.userAnswers[currentIdx] === i;
            const hasAnswered = quizState.userAnswers[currentIdx] !== undefined;
            let statusClass = "";

            if (hasAnswered) {
              if (i === qData.correctIndex) {
                statusClass = "correct";
              } else if (isUserSelected) {
                statusClass = "incorrect";
              }
            } else if (isUserSelected) {
              statusClass = "selected";
            }

            return `
              <div class="option-item ${statusClass}" data-index="${i}">
                <div class="option-key">${letter}</div>
                <div class="option-text">${opt}</div>
              </div>
            `;
          })
          .join("")}
      </div>

      <div class="explanation-card ${quizState.userAnswers[currentIdx] !== undefined ? "is-visible" : ""}" id="explanation-box">
        <div class="explanation-title">Explanation & Solution:</div>
        <div class="explanation-body">${qData.explanation}</div>
      </div>
    </div>

    <div class="quiz-nav-footer">
      <button id="prev-q-btn" class="btn-secondary" ${currentIdx === 0 ? "disabled style='opacity:0.5; cursor:not-allowed;'" : ""}>
        &larr; Previous
      </button>
      <div>
        ${
          currentIdx < total - 1
            ? `<button id="next-q-btn" class="btn-generate" style="padding: 0.6rem 1.4rem; font-size: 0.9rem;">Next Question &rarr;</button>`
            : `<button id="finish-quiz-btn" class="btn-generate" style="background:#059669; padding: 0.6rem 1.4rem; font-size: 0.9rem;">View Quiz Results</button>`
        }
      </div>
    </div>
  `;

  // Attach option click handlers
  const optionItems = quizContainer.querySelectorAll(".option-item");
  optionItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Allow answering if not already answered
      if (quizState.userAnswers[currentIdx] !== undefined) return;

      const chosenIdx = parseInt(item.getAttribute("data-index"), 10);
      quizState.userAnswers[currentIdx] = chosenIdx;

      // Re-render this question to show feedback
      renderActiveQuiz();
    });
  });

  // Previous Button
  const prevBtn = quizContainer.getElementById("prev-q-btn");
  if (prevBtn && currentIdx > 0) {
    prevBtn.addEventListener("click", () => {
      quizState.currentQuestionIndex--;
      renderActiveQuiz();
    });
  }

  // Next Button
  const nextBtn = quizContainer.getElementById("next-q-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      quizState.currentQuestionIndex++;
      renderActiveQuiz();
    });
  }

  // Finish Button
  const finishBtn = quizContainer.getElementById("finish-quiz-btn");
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      renderQuizScorecard();
    });
  }

  // Exit Quiz
  const exitBtn = quizContainer.getElementById("exit-quiz-btn");
  if (exitBtn) {
    exitBtn.addEventListener("click", () => {
      quizContainer.classList.remove("is-visible");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/**
 * Renders the final score and results screen
 */
function renderQuizScorecard() {
  const quizContainer = document.getElementById("quiz-active-section");
  const total = quizState.activeQuiz.length;
  let correctCount = 0;

  quizState.activeQuiz.forEach((q, idx) => {
    if (quizState.userAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const percent = Math.round((correctCount / total) * 100);

  quizContainer.innerHTML = `
    <div class="score-modal">
      <div class="score-badge-circle">${percent}%</div>
      <h2 class="score-title">Quiz Completed!</h2>
      <p class="score-subtitle">
        You answered <strong>${correctCount} out of ${total}</strong> questions correctly for 
        <strong>${quizState.chapter}</strong> (${quizState.difficulty}).
      </p>

      <div style="display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; margin-top:1.5rem;">
        <button id="review-quiz-btn" class="btn-secondary" style="padding:0.75rem 1.25rem;">
          Review All Answers
        </button>
        <button id="new-quiz-btn" class="btn-generate" style="flex:initial; padding:0.75rem 1.5rem;">
          Generate Another Quiz
        </button>
      </div>
    </div>
  `;

  document.getElementById("review-quiz-btn").addEventListener("click", () => {
    quizState.currentQuestionIndex = 0;
    renderActiveQuiz();
  });

  document.getElementById("new-quiz-btn").addEventListener("click", () => {
    quizContainer.classList.remove("is-visible");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
