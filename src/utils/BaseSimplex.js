export class BaseSimplex {
  constructor(problemData, originalObjectiveCoefficients) {
    this.problemData = { ...problemData };
    this.originalObjectiveCoefficients = originalObjectiveCoefficients;
    this.tableau = [];
    this.steps = [];
    this.basicVariables = [];
    this.isOptimal = false;
    this.isUnbounded = false;
    this.isInfeasible = false;
    this.iteration = 0;
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
