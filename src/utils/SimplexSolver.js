// File: SimplexSolver.js

import { PrimalSimplex } from './PrimalSimplex.js';
import { DualSimplex } from './DualSimplex.js';

export class SimplexSolver {
  constructor(problemData) {
    this.problemData = { ...problemData };

    // Simpan koefisien original untuk output
    this.originalObjectiveCoefficients = [
      ...this.problemData.objectiveCoefficients
    ];

    // Jika minimasi, ubah koefisien jadi negatif → jadi maksimasi
    if (this.problemData.objectiveType === 'min') {
      this.problemData.objectiveCoefficients = this.problemData.objectiveCoefficients.map(
        (c) => -c
      );
    }
  }

  solve() {
    const method = this.problemData.selectedMethod || 'primal';

    if (method === 'primal') {
      const primalSolver = new PrimalSimplex(
        this.problemData,
        this.originalObjectiveCoefficients
      );
      return primalSolver.solve();
    } else {
      const dualSolver = new DualSimplex(
        this.problemData,
        this.originalObjectiveCoefficients
      );
      return dualSolver.solve();
    }
  }
}

// Contoh sampleProblems yang sudah dilengkapi 'objectiveType' dan 'selectedMethod'
export const sampleProblems = {
  primal: {
    max: {
      numVariables: 3,
      numConstraints: 3,
      objectiveCoefficients: [150000, 200000, 100000],
      objectiveType: 'max',          // sekali lagi: 'max' atau 'min'
      selectedMethod: 'primal',
      constraints: [
        { coeffs: [4, 3, 2], sign: '≤', rhs: 480 },
        { coeffs: [2, 4, 3], sign: '≤', rhs: 360 },
        { coeffs: [3, 2, 4], sign: '≤', rhs: 400 }
      ],
      description:
        "Masalah Produksi: Maksimasi keuntungan Z = 150rb×x₁ + 200rb×x₂ + 100rb×x₃ "
    },
    min: {
      numVariables: 2,
      numConstraints: 2,
      objectiveCoefficients: [300000, 400000],
      objectiveType: 'min',           // **penting**
      selectedMethod: 'primal',       // bisa juga 'dual' jika ingin dual simplex
      constraints: [
        { coeffs: [2, 3], sign: '≥', rhs: 60 },
        { coeffs: [4, 2], sign: '≥', rhs: 80 }
      ],
      description:
        "Masalah Diet: Minimasi biaya Z = 300rb×x₁ + 400rb×x₂ dengan batasan nutrisi"
    }
  },
  dual: {
    max: {
      numVariables: 2,
      numConstraints: 2,
      objectiveCoefficients: [-200000, -300000],
      objectiveType: 'max',
      selectedMethod: 'dual',
      constraints: [
        { coeffs: [1, -1], sign: '≤', rhs: -10 },
        { coeffs: [-2, 1], sign: '≤', rhs: -5 }
      ],
      description:
        "Masalah Dual: Maksimasi Z = -200rb×x₁ - 300rb×x₂ dengan RHS negatif"
    },
    min: {
      numVariables: 2,
      numConstraints: 2,
      objectiveCoefficients: [200000, 500000],
      objectiveType: 'min',
      selectedMethod: 'dual',
      constraints: [
        { coeffs: [-1, -1], sign: '≤', rhs: -50 },
        { coeffs: [-2, -1], sign: '≤', rhs: -20 }
      ],
      description:
        "Masalah Dual: Minimasi Z = 200rb×x₁ + 500rb×x₂ dengan batasan kompleks"
    }
  }
};
