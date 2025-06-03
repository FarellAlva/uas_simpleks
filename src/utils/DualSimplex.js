// File: DualSimplex.js

import { BaseSimplex } from './BaseSimplex.js'

export class DualSimplex extends BaseSimplex {
  constructor(problemData, originalObjectiveCoefficients) {
    super(problemData, originalObjectiveCoefficients)
  }

  solve() {
    // 1) Inisialisasi tableau (sudah termasuk Big-M, artificial, dll)
    this.initializeTableau()
    this.iteration = 0
    this.logStep('Tabel awal dual simpleks (fase Big-M)', -1, -1, '', '')

    // 2) Loop utamanya
    while (
      !this.isOptimal &&
      !this.isUnbounded &&
      !this.isInfeasible &&
      this.iteration < 200
    ) {
      // 2.a) Cari baris paling infeasible (RHS < 0 terbesar absolutnya)
      const pivotRow = this.findMostInfeasibleRow()

      // 2.b) Jika tidak ada RHS < 0 ➔ semua constraint baris feasible
      if (pivotRow === -1) {
        // Tapi sebelum klaim optimal, periksa apakah baris fungsi tujuan
        // sudah “optimal” (tidak ada cost > 0)
        const pivotColPrimal = this.findPivotColumn()

        if (pivotColPrimal === -1) {
          // Tidak ada koef > 0 di baris tujuan ➔ benar-benar optimal
          this.isOptimal = true
          this.logStep('Solusi optimal tercapai (dual)', -1, -1, '', '')
          break
        } else {
          // Masih ada cost positif akibat Big-M → lakukan pivot ala Primal
          const pivotRowPrimal = this.findPivotRow(pivotColPrimal)
          if (pivotRowPrimal === -1) {
            // Jika tidak ada baris untuk pivot ➔ unbounded
            this.isUnbounded = true
            const enteringVar = this.getVariableName(pivotColPrimal)
            this.logStep(
              'Solusi tidak terbatas (dual→primal)',
              pivotColPrimal,
              -1,
              enteringVar,
              ''
            )
            break
          }

          // Lakukan pivot (primal style) untuk “membersihkan” cost positif
          const enteringVar = this.getVariableName(pivotColPrimal)
          const leavingVar = this.basicVariables[pivotRowPrimal]
          this.iteration++
          this.logStep(
            `(Dual→Primal) Iterasi ${this.iteration}: ${enteringVar} masuk, ${leavingVar} keluar`,
            pivotColPrimal,
            pivotRowPrimal,
            enteringVar,
            leavingVar
          )
          this.pivot(pivotRowPrimal, pivotColPrimal)
          this.basicVariables[pivotRowPrimal] = enteringVar

          // Lanjutkan loop (cek infeasible lagi di iterasi berikutnya)
          continue
        }
      }

      // 2.c) Jika masih ada RHS negatif, lanjut dual simplex biasa:
      const pivotCol = this.findDualPivotColumn(pivotRow)
      if (pivotCol === -1) {
        // Tidak ada koef yang memenuhi aturan dual ➔ unbounded
        this.isUnbounded = true
        this.logStep('Solusi tidak terbatas (dual)', -1, -1, '', '')
        break
      }

      // Catat variabel masuk/keluar
      const enteringVar = this.getVariableName(pivotCol)
      const leavingVar = this.basicVariables[pivotRow]
      this.iteration++
      this.logStep(
        `Iterasi ${this.iteration} (dual): ${enteringVar} masuk, ${leavingVar} keluar`,
        pivotCol,
        pivotRow,
        enteringVar,
        leavingVar
      )

      // 2.d) Pivot dan update basis
      this.pivot(pivotRow, pivotCol)
      this.basicVariables[pivotRow] = enteringVar
    }

    // 3) Jika melebihi iterasi maksimum tanpa status valid ➔ tandai infeasible
    if (
      this.iteration >= 200 &&
      !this.isOptimal &&
      !this.isUnbounded &&
      !this.isInfeasible
    ) {
      this.isInfeasible = true
      this.logStep('Iterasi maksimum tercapai (dual)', -1, -1, '', '')
    }

    return this.generateSolutionOutput('dual')
  }

  // Temukan baris paling infeasible (RHS < 0 dengan |RHS| terbesar)
  findMostInfeasibleRow() {
    let worstVal = 0
    let pivotRow = -1
    for (let i = 0; i < this.tableau.length - 1; i++) {
      const rhs = this.tableau[i][this.tableau[0].length - 1]
      if (rhs < worstVal) {
        worstVal = rhs
        pivotRow = i
      }
    }
    return pivotRow
  }

  // Temukan pivot column untuk dual simplex: 
  // Cari j sehingga tableau[pivotRow][j] < 0 dan rasio |c_j / a_{pivotRow,j}| paling kecil
  findDualPivotColumn(pivotRow) {
    const objRow = this.tableau[this.tableau.length - 1]
    let minRatio = Infinity
    let pivotCol = -1

    for (let j = 0; j < objRow.length - 1; j++) {
      const aij = this.tableau[pivotRow][j]
      if (aij < -1e-9) {
        const ratio = Math.abs(objRow[j] / aij)
        if (ratio < minRatio) {
          minRatio = ratio
          pivotCol = j
        }
      }
    }
    return pivotCol
  }

  // ---------------------------
  // Berikut dua method “Primal‐like”
  // yang kita pakai ketika cost masih positif
  // ---------------------------

  // Temukan pivot column (primal): cari cost coefficient > 0 terbesar
  findPivotColumn() {
    const objRow = this.tableau[this.tableau.length - 1]
    let maxCoeff = 1e-9
    let pivotCol = -1

    for (let j = 0; j < objRow.length - 1; j++) {
      if (objRow[j] > maxCoeff) {
        maxCoeff = objRow[j]
        pivotCol = j
      }
    }
    return pivotCol
  }

  // Temukan pivot row (primal): rasio rhs / a_{i,j} terkecil untuk a_{i,j} > 0
  findPivotRow(pivotCol) {
    let minRatio = Infinity
    let pivotRow = -1

    for (let i = 0; i < this.tableau.length - 1; i++) {
      const aij = this.tableau[i][pivotCol]
      const rhs = this.tableau[i][this.tableau[0].length - 1]
      if (aij > 1e-9) {
        const ratio = rhs / aij
        if (ratio >= -1e-9 && ratio < minRatio) {
          minRatio = ratio
          pivotRow = i
        }
      }
    }
    return pivotRow
  }
}
