import { BaseSimplex } from './BaseSimplex.js';

export class PrimalSimplex extends BaseSimplex {
  constructor(problemData, originalObjectiveCoefficients) {
    super(problemData, originalObjectiveCoefficients);
  }

  solve() {
    this.initializeTableau();
    this.iteration = 0;
    this.logStep('Tabel awal simpleks primal', -1, -1, '', '');

    while (!this.isOptimal && !this.isUnbounded && !this.isInfeasible && this.iteration < 100) {
      this.iteration++;

      const pivotCol = this.findPivotColumn();
      if (pivotCol === -1) {
        this.isOptimal = true;
        this.logStep('Solusi optimal tercapai', -1, -1, '', '');
        break;
      }

      const pivotRow = this.findPivotRow(pivotCol);
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

    // Add final step if needed
    if (this.steps.length > 0) {
      const lastStep = this.steps[this.steps.length - 1];
      if (this.isOptimal && !lastStep.description.includes('optimal')) {
        this.iteration++;
        this.logStep('Solusi optimal tercapai', -1, -1, '', '');
      }
    }

    return this.generateSolutionOutput('primal');
  }

  // Find pivot column for primal method
  findPivotColumn() {
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
  findPivotRow(pivotCol) {
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
}
