// src/utils/SimplexSolver.js

export class SimplexSolver {
  constructor(problemData) {
    this.problemData = { ...problemData };
    this.tableau = [];
    this.steps = [];
    this.basicVariables = [];
    this.isOptimal = false;
    this.isUnbounded = false;
    this.isInfeasible = false;
    this.iteration = 0;

    // Convert minimization to maximization
    this.originalObjectiveCoefficients = [...this.problemData.objectiveCoefficients];
    if (this.problemData.objectiveType === 'min') {
      this.problemData.objectiveCoefficients = this.problemData.objectiveCoefficients.map(c => -c);
    }
  }

  solve() {
    return this.problemData.selectedMethod === 'primal' ? this.solvePrimal() : this.solveDual();
  }

  // Generate variable names
  getVariableName(index) {
    return index < this.problemData.numVariables ? `x${index + 1}` : `s${index - this.problemData.numVariables + 1}`;
  }

  // Initialize simplex tableau
  initializeTableau() {
    const { objectiveCoefficients, constraints, numVariables, numConstraints } = this.problemData;
    this.tableau = [];
    this.basicVariables = [];

    // Constraint rows
    constraints.forEach((constraint, i) => {
      const row = Array(numVariables + numConstraints).fill(0);
      
      // Decision variables coefficients
      for (let j = 0; j < numVariables; j++) {
        row[j] = constraint.coeffs[j];
      }

      // Slack/surplus variables
      if (constraint.sign === '≤') {
        row[numVariables + i] = 1;
        this.basicVariables.push(this.getVariableName(numVariables + i));
      } else if (constraint.sign === '≥') {
        row[numVariables + i] = -1;
        this.basicVariables.push(this.getVariableName(numVariables + i));
      } else {
        row[numVariables + i] = 0;
        this.basicVariables.push(`A${i + 1}`);
      }
      
      row.push(constraint.rhs);
      this.tableau.push(row);
    });

    // Objective function row
    const objRow = Array(numVariables + numConstraints + 1).fill(0);
    for (let j = 0; j < numVariables; j++) {
      objRow[j] = objectiveCoefficients[j];
    }
    this.tableau.push(objRow);
  }

  // Primal simplex method
  solvePrimal() {
    this.initializeTableau();
    this.iteration = 0;
    this.logStep('Tabel awal simpleks primal', -1, -1, '', '');

    while (!this.isOptimal && !this.isUnbounded && !this.isInfeasible && this.iteration < 100) {
      this.iteration++;

      const pivotCol = this.findPrimalPivotColumn();
      if (pivotCol === -1) {
        this.isOptimal = true;
        this.logStep('Solusi optimal tercapai', -1, -1, '', '');
        break;
      }

      const pivotRow = this.findPrimalPivotRow(pivotCol);
      if (pivotRow === -1) {
        this.isUnbounded = true;
        const enteringVar = this.getVariableName(pivotCol);
        this.logStep(`Solusi tidak terbatas untuk ${enteringVar}`, pivotCol, -1, enteringVar, '');
        break;
      }

      const enteringVar = this.getVariableName(pivotCol);
      const leavingVar = this.basicVariables[pivotRow];

      this.logStep(
        `Iterasi ${this.iteration}: ${enteringVar} masuk, ${leavingVar} keluar`,
        pivotCol, pivotRow, enteringVar, leavingVar
      );

      this.pivot(pivotRow, pivotCol);
      this.basicVariables[pivotRow] = enteringVar;
    }

    if (this.iteration >= 100 && !this.isOptimal && !this.isUnbounded && !this.isInfeasible) {
      this.isInfeasible = true;
      this.logStep('Iterasi maksimum tercapai', -1, -1, '', '');
    }

    return this.generateSolutionOutput('primal');
  }

  // Dual simplex method
  solveDual() {
    this.initializeTableau();
    this.iteration = 0;
    this.logStep('Tabel awal simpleks dual', -1, -1, '', '');

    // Check dual feasibility
    const objRow = this.tableau[this.tableau.length - 1];
    for (let j = 0; j < objRow.length - 1; j++) {
      if (objRow[j] > 1e-9) {
        this.isInfeasible = true;
        this.logStep('Kondisi awal dual tidak terpenuhi', -1, -1, '', '');
        return this.generateSolutionOutput('dual');
      }
    }

    while (!this.isOptimal && !this.isInfeasible && this.iteration < 100) {
      this.iteration++;

      const pivotRow = this.findDualPivotRow();
      if (pivotRow === -1) {
        this.isOptimal = true;
        this.logStep('Solusi optimal dual tercapai', -1, -1, '', '');
        break;
      }

      const pivotCol = this.findDualPivotColumn(pivotRow);
      if (pivotCol === -1) {
        this.isInfeasible = true;
        const leavingVar = this.basicVariables[pivotRow];
        this.logStep(`Masalah tidak layak untuk ${leavingVar}`, -1, pivotRow, '', leavingVar);
        break;
      }

      const enteringVar = this.getVariableName(pivotCol);
      const leavingVar = this.basicVariables[pivotRow];

      this.logStep(
        `Iterasi Dual ${this.iteration}: ${leavingVar} keluar, ${enteringVar} masuk`,
        pivotCol, pivotRow, enteringVar, leavingVar
      );

      this.pivot(pivotRow, pivotCol);
      this.basicVariables[pivotRow] = enteringVar;
    }

    if (this.iteration >= 100 && !this.isOptimal && !this.isInfeasible) {
      this.isInfeasible = true;
      this.logStep('Iterasi maksimum dual tercapai', -1, -1, '', '');
    }

    return this.generateSolutionOutput('dual');
  }

  // Log each step for visualization
  logStep(description, pivotCol, pivotRow, enteringVar, leavingVar) {
    const pivotElement = (pivotRow !== -1 && pivotCol !== -1) ? this.tableau[pivotRow][pivotCol] : 0;
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

  // Find pivot column for primal method
  findPrimalPivotColumn() {
    const objRow = this.tableau[this.tableau.length - 1];
    let maxCoeff = 1e-9;
    let pivotCol = -1;
    
    for (let j = 0; j < objRow.length - 1; j++) {
      if (objRow[j] > maxCoeff) {
        maxCoeff = objRow[j];
        pivotCol = j;
      }
    }
    return pivotCol;
  }

  // Find pivot row for primal method
  findPrimalPivotRow(pivotCol) {
    let minRatio = Infinity;
    let pivotRow = -1;
    
    for (let i = 0; i < this.tableau.length - 1; i++) {
      const element = this.tableau[i][pivotCol];
      const rhs = this.tableau[i][this.tableau[i].length - 1];

      if (element > 1e-9) {
        const ratio = rhs / element;
        if (ratio >= -1e-9 && ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }
    return pivotRow;
  }

  // Find pivot row for dual method
  findDualPivotRow() {
    let minRhs = -1e-9;
    let pivotRow = -1;
    
    for (let i = 0; i < this.tableau.length - 1; i++) {
      const rhs = this.tableau[i][this.tableau[i].length - 1];
      if (rhs < minRhs) {
        minRhs = rhs;
        pivotRow = i;
      }
    }
    return pivotRow;
  }

  // Find pivot column for dual method
  findDualPivotColumn(pivotRow) {
    const objRow = this.tableau[this.tableau.length - 1];
    let minRatio = Infinity;
    let pivotCol = -1;

    for (let j = 0; j < objRow.length - 1; j++) {
      const elementInPivotRow = this.tableau[pivotRow][j];
      const objCoeff = objRow[j];

      if (elementInPivotRow < -1e-9) {
        const ratio = Math.abs(objCoeff / elementInPivotRow);
        if (ratio < minRatio) {
          minRatio = ratio;
          pivotCol = j;
        }
      }
    }
    return pivotCol;
  }

  // Perform pivot operation
  pivot(pivotRow, pivotCol) {
    const pivotElement = this.tableau[pivotRow][pivotCol];
    
    if (Math.abs(pivotElement) < 1e-9) {
      console.error("Pivot element is zero");
      this.isInfeasible = true;
      return;
    }

    // Normalize pivot row
    for (let j = 0; j < this.tableau[pivotRow].length; j++) {
      this.tableau[pivotRow][j] /= pivotElement;
    }

    // Eliminate pivot column
    for (let i = 0; i < this.tableau.length; i++) {
      if (i !== pivotRow) {
        const factor = this.tableau[i][pivotCol];
        for (let j = 0; j < this.tableau[i].length; j++) {
          this.tableau[i][j] -= factor * this.tableau[pivotRow][j];
        }
      }
    }
  }

  // Extract final solution
  extractSolution() {
    const solution = { objectiveValue: 0, variables: {} };

    // Initialize all decision variables to 0
    for (let i = 0; i < this.problemData.numVariables; i++) {
      solution.variables[this.getVariableName(i)] = 0;
    }

    // Get basic variable values
    for (let i = 0; i < this.tableau.length - 1; i++) {
      const basicVarName = this.basicVariables[i];
      if (basicVarName && basicVarName.startsWith('x')) {
        const value = this.tableau[i][this.tableau[i].length - 1];
        solution.variables[basicVarName] = Math.abs(value) < 1e-9 ? 0 : value;
      }
    }
    
    // Get objective value
    let objectiveValueInTableau = this.tableau[this.tableau.length - 1][this.tableau[this.tableau.length - 1].length - 1];
    
    if (this.problemData.objectiveType === 'min') {
      solution.objectiveValue = Math.abs(objectiveValueInTableau) < 1e-9 ? 0 : -objectiveValueInTableau;
    } else {
      solution.objectiveValue = Math.abs(objectiveValueInTableau) < 1e-9 ? 0 : -objectiveValueInTableau;
    }

    return solution;
  }

  // Generate solution output
  generateSolutionOutput(method) {
    if (!this.isOptimal && !this.isUnbounded && !this.isInfeasible) {
      if (method === 'primal') {
        if (this.findPrimalPivotColumn() === -1) this.isOptimal = true;
      } else {
        if (this.findDualPivotRow() === -1) this.isOptimal = true;
      }
      if (!this.isOptimal) this.isInfeasible = true;
    }

    // Add final step if needed
    if (this.steps.length > 0) {
      const lastStep = this.steps[this.steps.length - 1];
      if (this.isOptimal && !lastStep.description.includes('optimal')) {
        this.iteration++;
        this.logStep('Solusi optimal tercapai', -1, -1, '', '');
      }
    }

    return {
      success: this.isOptimal,
      method,
      steps: this.steps,
      finalSolution: (this.isOptimal || this.isUnbounded) ? this.extractSolution() : null,
      isOptimal: this.isOptimal,
      isUnbounded: this.isUnbounded,
      isInfeasible: this.isInfeasible,
      numVariables: this.problemData.numVariables,
      numConstraints: this.problemData.numConstraints,
      objectiveType: this.problemData.objectiveType,
      originalObjectiveCoefficients: this.originalObjectiveCoefficients
    };
  }

  copyTableau() {
    return this.tableau.map(row => [...row]);
  }
}

export const sampleProblems = {
  primal: {
    max: {
      numVariables: 3,
      numConstraints: 3,
      objectiveCoefficients: [150000, 200000, 100000],
      constraints: [
        { coeffs: [4, 3, 2], sign: '≤', rhs: 480 },
        { coeffs: [2, 4, 3], sign: '≤', rhs: 360 },
        { coeffs: [3, 2, 4], sign: '≤', rhs: 400 }
      ],
      description: "Masalah Produksi: Maksimasi keuntungan Z = 150rb×x₁ + 200rb×x₂ + 100rb×x₃ dengan batasan sumber daya"
    },
    min: {
      numVariables: 2,
      numConstraints: 2,
      objectiveCoefficients: [300000, 400000],
      constraints: [
        { coeffs: [2, 3], sign: '≥', rhs: 60 },
        { coeffs: [4, 2], sign: '≥', rhs: 80 }
      ],
      description: "Masalah Diet: Minimasi biaya Z = 300rb×x₁ + 400rb×x₂ dengan batasan nutrisi minimum"
    }
  },
  dual: {
    max: {
      numVariables: 2,
      numConstraints: 2,
      objectiveCoefficients: [-200000, -300000],
      constraints: [
        { coeffs: [1, -1], sign: '≤', rhs: -10 },
        { coeffs: [-2, 1], sign: '≤', rhs: -5 }
      ],
      description: "Masalah Dual: Maksimasi Z = -200rb×x₁ - 300rb×x₂ dengan RHS negatif"
    },
    min: {
      numVariables: 2,
      numConstraints: 2,
      objectiveCoefficients: [200000, 500000],
      constraints: [
        { coeffs: [1, 1], sign: '≤', rhs: -50 },
        { coeffs: [2, -1], sign: '≤', rhs: -20 }
      ],
      description: "Masalah Dual: Minimasi Z = 200rb×x₁ + 500rb×x₂ dengan batasan kompleks"
    }
  }
};