// File: BaseSimplex.js

export class BaseSimplex {
  constructor(problemData, originalObjectiveCoefficients) {
    this.problemData = { ...problemData };
    this.originalObjectiveCoefficients = [...originalObjectiveCoefficients];
    this.tableau = [];
    this.steps = [];
    this.basicVariables = [];
    this.isOptimal = false;
    this.isUnbounded = false;
    this.isInfeasible = false;
    this.iteration = 0;

    // Use a round BigM value for cleaner display
    const sumCoeffs = this.problemData.objectiveCoefficients
      .reduce((sum, c) => sum + Math.abs(c), 0);
    this.M = Math.max(sumCoeffs * 10, 1000000); // Minimum 1,000,000 for cleaner display
  }

  // Membantu mencari indeks kolom dari nama variabel (x1, s2, a3, dll)
  getIndexOfVar(varName) {
    const { numVariables, numSlack, numSurplus, numArtificial } = this.problemData
    
    if (varName.startsWith('x')) {
      // Decision variables: x1, x2, ...
      const num = parseInt(varName.substring(1))
      return num - 1
    } else if (varName.startsWith('s')) {
      // Slack/Surplus variables: s1, s2, ...
      const num = parseInt(varName.substring(1))
      return numVariables + num - 1
    } else if (varName.startsWith('a')) {
      // Artificial variables: a1, a2, ...
      const num = parseInt(varName.substring(1))
      return numVariables + numSlack + numSurplus + num - 1
    }
    
    return -1
  }

  // Membuat nama variabel: x1..xn, s1.., a1..
  getVariableName(index) {
    const { numVariables, numSlack, numSurplus } = this.problemData
    
    if (index < numVariables) {
      return `x${index + 1}`
    } else if (index < numVariables + numSlack + numSurplus) {
      return `s${index - numVariables + 1}`
    } else {
      return `a${index - numVariables - numSlack - numSurplus + 1}`
    }
  }

  // Inisialisasi tableau (termasuk variabel slack, surplus, artifisial)
// File: BaseSimplex.js (di dalam class BaseSimplex)

initializeTableau() {
  const {
    objectiveCoefficients,
    constraints,
    numVariables,
    objectiveType
  } = this.problemData;

  // Hitung jumlah slack, surplus, artifisial
  let slackCount = 0, surplusCount = 0, artificialCount = 0;
  constraints.forEach(c => {
    if (c.sign === '≤') slackCount++;
    else if (c.sign === '≥') { surplusCount++; artificialCount++; }
    else if (c.sign === '=') artificialCount++;
  });
  this.problemData.numSlack = slackCount;
  this.problemData.numSurplus = surplusCount;
  this.problemData.numArtificial = artificialCount;

  const totalVars = numVariables + slackCount + surplusCount + artificialCount;
  this.tableau = [];
  this.basicVariables = [];

  // Posisi awal kolom tambahan
  let idxSlack     = numVariables;
  let idxSurplus   = numVariables + slackCount;
  let idxArtificial= numVariables + slackCount + surplusCount;

  // 1) Buat baris-baris constraint
  constraints.forEach(c => {
    const row = Array(totalVars + 1).fill(0);
    // a) Koefisien keputusan
    c.coeffs.forEach((v, j) => (row[j] = v));
    // b) Slack/Surplus/Artifisial
    if (c.sign === '≤') {
      row[idxSlack] = 1;
      this.basicVariables.push(this.getVariableName(idxSlack));
      idxSlack++;
    } else if (c.sign === '≥') {
      row[idxSurplus]   = -1;
      row[idxArtificial]=  1;
      this.basicVariables.push(this.getVariableName(idxArtificial));
      idxSurplus++; idxArtificial++;
    } else { // =
      row[idxArtificial] = 1;
      this.basicVariables.push(this.getVariableName(idxArtificial));
      idxArtificial++;
    }
    // c) RHS
    row[totalVars] = c.rhs;
    this.tableau.push(row);
  });

  // 2) Baris fungsi tujuan (Big-M)
  const objRow = Array(totalVars + 1).fill(0);
  objectiveCoefficients.forEach((c, j) => (objRow[j] = c));
  const artStart = numVariables + slackCount + surplusCount;
  for (let k = 0; k < artificialCount; k++) {
    objRow[artStart + k] = -this.M;
  }
  objRow[totalVars] = 0;
  this.tableau.push(objRow);

  // 3) Koreksi Big-M untuk artifisial di basis
  //    sehingga kolom a* menjadi nol di baris tujuan
  for (let i = 0; i < this.tableau.length - 1; i++) {
    const bv = this.basicVariables[i];
    if (bv.startsWith('a')) {
      const col   = this.getIndexOfVar(bv);
      const factor= this.M;
      for (let j = 0; j < this.tableau[i].length; j++) {
        this.tableau[this.tableau.length - 1][j] +=
          factor * this.tableau[i][j];
      }
    }
  }
}


  // Log setiap step untuk keperluan visualisasi
  logStep(description, pivotCol, pivotRow, enteringVar, leavingVar) {
    const pivotElement =
      pivotRow !== -1 && pivotCol !== -1 ? this.tableau[pivotRow][pivotCol] : 0;
    this.steps.push({
      iteration: this.iteration,
      tableau: this.copyTableau(),
      description,
      pivotColumn: pivotCol,
      pivotRow: pivotRow,
      pivotElement,
      enteringVariable: enteringVar,
      leavingVariable: leavingVar,
      basicVariables: [...this.basicVariables],
      numVariables: this.problemData.numVariables,
      numConstraints: this.problemData.numConstraints
    });
  }

  // Operasi pivot
  pivot(pivotRow, pivotCol) {
    const pivotElement = this.tableau[pivotRow][pivotCol];
    if (Math.abs(pivotElement) < 1e-9) {
      console.error("Pivot element is zero");
      this.isInfeasible = true;
      return;
    }

    // Normalize baris pivot
    for (let j = 0; j < this.tableau[pivotRow].length; j++) {
      this.tableau[pivotRow][j] /= pivotElement;
    }

    // Eliminasi kolom pivot di baris lain
    for (let i = 0; i < this.tableau.length; i++) {
      if (i !== pivotRow) {
        const factor = this.tableau[i][pivotCol];
        for (let j = 0; j < this.tableau[i].length; j++) {
          this.tableau[i][j] -= factor * this.tableau[pivotRow][j];
        }
      }
    }
  }

  // Ekstrak solusi akhir (asumsi sudah optimal atau unbounded)
  extractSolution() {
    const solution = { objectiveValue: 0, variables: {}, optimalBasis: {} };
    const { numVariables } = this.problemData;

    // Inisialisasi semua x₁..xₙ = 0
    for (let i = 0; i < numVariables; i++) {
      solution.variables[`x${i + 1}`] = 0;
    }

    // Ekstrak optimal basis - variabel yang ada di basis dan nilainya
    for (let i = 0; i < this.tableau.length - 1; i++) {
      const basicVar = this.basicVariables[i];
      const value = this.tableau[i][this.tableau[i].length - 1];
      const cleanValue = Math.abs(value) < 1e-9 ? 0 : value;
      
      // Masukkan ke optimal basis (semua variabel basis)
      solution.optimalBasis[basicVar] = cleanValue;
      
      // Jika variabel keputusan, masukkan juga ke variables
      if (basicVar.startsWith('x')) {
        solution.variables[basicVar] = cleanValue;
      }
    }

    // Dapatkan nilai fungsi tujuan dari baris terakhir, kolom RHS
    let objValTable = this.tableau[this.tableau.length - 1][
      this.tableau[0].length - 1
    ];

    // Handle objective value based on problem type
    if (this.problemData.objectiveType === 'min') {
      // For minimization: the tableau shows -Z, so negate to get actual minimum value
      solution.objectiveValue = Math.abs(objValTable) < 1e-9 ? 0 : objValTable;
    } else {
      // For maximization: negate tableau value to get actual maximum
      solution.objectiveValue = Math.abs(objValTable) < 1e-9 ? 0 : -objValTable;
    }

    return solution;
  }

  // Keluarkan output akhir
  generateSolutionOutput(method) {
    return {
      success: this.isOptimal && !this.isInfeasible && !this.isUnbounded,
      method,
      steps: this.steps,
      finalSolution:
        this.isOptimal && !this.isInfeasible && !this.isUnbounded
          ? this.extractSolution()
          : null,
      isOptimal: this.isOptimal,
      isUnbounded: this.isUnbounded,
      isInfeasible: this.isInfeasible,
      numVariables: this.problemData.numVariables,
      numConstraints: this.problemData.numConstraints,
      numSlack: this.problemData.numSlack || 0,
      numSurplus: this.problemData.numSurplus || 0,
      numArtificial: this.problemData.numArtificial || 0,
      bigM: this.M,
      objectiveType: this.problemData.objectiveType,
      originalObjectiveCoefficients: this.originalObjectiveCoefficients,
      constraints: this.problemData.constraints || []
    };
  }


  copyTableau() {
    return this.tableau.map((row) => [...row]);
  }
}

