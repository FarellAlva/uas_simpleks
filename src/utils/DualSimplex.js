import { BaseSimplex } from './BaseSimplex.js';

export class DualSimplex extends BaseSimplex {
  constructor(problemData, originalObjectiveCoefficients) {
    super(problemData, originalObjectiveCoefficients);
  }

  solve() {
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

      const pivotRow = this.findPivotRow();
      if (pivotRow === -1) {
        this.isOptimal = true;
        this.logStep('Solusi optimal dual tercapai', -1, -1, '', '');
        break;
      }

      const pivotCol = this.findPivotColumn(pivotRow);
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

    // Add final step if needed
    if (this.steps.length > 0) {
      const lastStep = this.steps[this.steps.length - 1];
      if (this.isOptimal && !lastStep.description.includes('optimal')) {
        this.iteration++;
        this.logStep('Solusi optimal dual tercapai', -1, -1, '', '');
      }
    }

    return this.generateSolutionOutput('dual');
  }

  // Find pivot row for dual method
  findPivotRow() {
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
  findPivotColumn(pivotRow) {
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
}
