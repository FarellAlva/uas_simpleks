// File: PrimalSimplex.js

import { BaseSimplex } from './BaseSimplex.js';

export class PrimalSimplex extends BaseSimplex {
  constructor(problemData, originalObjectiveCoefficients) {
    super(problemData, originalObjectiveCoefficients);
  }

  solve() {
    // 1) Inisialisasi tableau (termasuk Big-M)
    this.initializeTableau();
    this.iteration = 0;
    this.logStep('Tabel awal simpleks primal (fase Big-M)', -1, -1, '', '');

    // 2) Loop iterasi hingga optimal/unbounded/infeasible
    while (
      !this.isOptimal &&
      !this.isUnbounded &&
      !this.isInfeasible &&
      this.iteration < 200
    ) {
      this.iteration++;

      // 2.a) Cari pivot column (koef positif tertinggi di baris tujuan)
      const pivotCol = this.findPivotColumn();
      if (pivotCol === -1) {
        // Tidak ada koef > 0 → sudah optimal
        this.isOptimal = true;
        this.logStep('Solusi optimal tercapai', -1, -1, '', '');
        break;
      }

      // 2.b) Cari pivot row dengan rasio minimum (RHS / kolom pivot)
      const pivotRow = this.findPivotRow(pivotCol);
      if (pivotRow === -1) {
        // Tidak ada baris dengan koef > 0 di pivotCol → unbounded
        this.isUnbounded = true;
        const enteringVar = this.getVariableName(pivotCol);
        this.logStep(
          `Solusi tidak terbatas, variabel masuk: ${enteringVar}`,
          pivotCol,
          -1,
          enteringVar,
          ''
        );
        break;
      }

      const enteringVar = this.getVariableName(pivotCol);
      const leavingVar = this.basicVariables[pivotRow];

      this.logStep(
        `Iterasi ${this.iteration}: ${enteringVar} masuk, ${leavingVar} keluar`,
        pivotCol,
        pivotRow,
        enteringVar,
        leavingVar
      );

      // 2.c) Pivot dan update basicVariables
      this.pivot(pivotRow, pivotCol);
      this.basicVariables[pivotRow] = enteringVar;
    }

    if (
      this.iteration >= 200 &&
      !this.isOptimal &&
      !this.isUnbounded &&
      !this.isInfeasible
    ) {
      this.isInfeasible = true;
      this.logStep('Iterasi maksimum tercapai', -1, -1, '', '');
    }

    return this.generateSolutionOutput('primal');
  }

  // Temukan pivot column untuk primal (koef > 0 paling besar di baris tujuan)
  findPivotColumn() {
    const objRow = this.tableau[this.tableau.length - 1];
    let maxCoeff = 1e-9;
    let pivotCol = -1;

    // Kolom 0 .. (n-1), kecuali kolom RHS terakhir
    for (let j = 0; j < objRow.length - 1; j++) {
      if (objRow[j] > maxCoeff) {
        maxCoeff = objRow[j];
        pivotCol = j;
      }
    }
    return pivotCol;
  }

  // Temukan pivot row: rasio (RHS / koef) terkecil, koef > 0
  findPivotRow(pivotCol) {
    let minRatio = Infinity;
    let pivotRow = -1;

    for (let i = 0; i < this.tableau.length - 1; i++) {
      const coeff = this.tableau[i][pivotCol];
      const rhs = this.tableau[i][this.tableau[0].length - 1];
      if (coeff > 1e-9) {
        const ratio = rhs / coeff;
        if (ratio >= -1e-9 && ratio < minRatio) {
          minRatio = ratio;
          pivotRow = i;
        }
      }
    }
    return pivotRow;
  }
}
