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

    // Untuk Big-M, kita gunakan nilai M yang sangat besar
    this.M = 1e6;
  }

  // Membuat nama variabel: x1..xn, s1.., a1..
  getVariableName(index) {
    return index < this.problemData.numVariables
      ? `x${index + 1}`
      : index < this.problemData.numVariables + this.problemData.numSlack
      ? `s${index - this.problemData.numVariables + 1}`
      : `a${index - this.problemData.numVariables - this.problemData.numSlack + 1}`;
  }

  // Inisialisasi tableau (termasuk variabel slack, surplus, artifisial)
  initializeTableau() {
    const {
      objectiveCoefficients,
      constraints,
      numVariables,
      numConstraints,
      objectiveType
    } = this.problemData;

    // Hitung berapa variabel slack (≤) dan surplus (≥) / artifisial (= atau ≥)
    let slackCount = 0;
    let surplusCount = 0;
    let artificialCount = 0;

    constraints.forEach((c) => {
      if (c.sign === '≤') {
        slackCount += 1;
      } else if (c.sign === '≥') {
        surplusCount += 1;
        artificialCount += 1;
      } else if (c.sign === '=') {
        artificialCount += 1;
      }
    });

    // Simpan jumlah variabel tambahan
    this.problemData.numSlack = slackCount;
    this.problemData.numSurplus = surplusCount;
    this.problemData.numArtificial = artificialCount;

    // Total kolom (tanpa RHS): var asli + slack + surplus + artificial
    const totalVars = numVariables + slackCount + surplusCount + artificialCount;

    // Reset tableau dan basicVariables
    this.tableau = [];
    this.basicVariables = [];

    // Indeks untuk menempatkan kolom-kolom tambahan
    let idxSlack = numVariables;
    let idxSurplus = numVariables + slackCount;
    let idxArtificial = numVariables + slackCount + surplusCount;

    // 1) Bangun baris‐baris constraint
    constraints.forEach((constraint, i) => {
      // Buat satu baris awal dengan semua koef 0
      const row = Array(totalVars + 1).fill(0); // +1 untuk RHS

      // 1.a) Masukkan koefisien variabel keputusan (x1..xn)
      for (let j = 0; j < numVariables; j++) {
        row[j] = constraint.coeffs[j];
      }

      // 1.b) Tambahkan slack, surplus, artifisial sesuai tanda
      if (constraint.sign === '≤') {
        // Slack +1
        row[idxSlack] = 1;
        this.basicVariables.push(this.getVariableName(idxSlack));
        idxSlack += 1;
      } else if (constraint.sign === '≥') {
        // Surplus −1 + Artifisial +1
        row[idxSurplus] = -1;
        row[idxArtificial] = 1;
        this.basicVariables.push(this.getVariableName(idxArtificial));
        idxSurplus += 1;
        idxArtificial += 1;
      } else if (constraint.sign === '=') {
        // Sama dengan: langsung artifisial +1
        row[idxArtificial] = 1;
        this.basicVariables.push(this.getVariableName(idxArtificial));
        idxArtificial += 1;
      }

      // 1.c) Masukkan nilai RHS
      row[totalVars] = constraint.rhs;

      this.tableau.push(row);
    });

    // 2) Bangun baris fungsi tujuan (Big-M)
    //    Kita bikin satu row dengan panjang totalVars+1, lalu isi dengan:
    //      • Untuk kolom xj: koefisien (sudah ditegur +1 kalau max, -1 kalau min)
    //      • Untuk setiap kolom artifisial: −M (karena kita maksimasi)
    //      • Sisanya 0, dan RHS 0
    const objRow = Array(totalVars + 1).fill(0);

    // 2.a) Koefisien variabel keputusan (x1..xn)
    for (let j = 0; j < numVariables; j++) {
      // Jika objectiveType = 'min', koef sudah di-negasi di SimplexSolver sebelum sampai sini
      objRow[j] = objectiveCoefficients[j];
    }

    // 2.b) Koefisien untuk variabel slack/surplus = 0 (tetap 0)

    // 2.c) Koefisien untuk setiap variabel artifisial: −M 
    let mulaiArt = numVariables + slackCount + surplusCount;
    for (let k = 0; k < artificialCount; k++) {
      objRow[mulaiArt + k] = -this.M;
    }

    // 2.d) RHS = 0
    objRow[totalVars] = 0;

    this.tableau.push(objRow);

    // Setelah inisialisasi, kita juga perlu meng‐adjust baris tujuan
    // supaya setiap artifisial yang ada di basis awal “didorong” ke nol:
    // Caranya: untuk tiap baris constraint yang punya artifisial di basis,
    // kita tambahkan M × (baris constraint) ke baris tujuan.
    // Dengan demikian kolom artifisial akan jadi nol di baris tujuan.
    for (let i = 0; i < this.tableau.length - 1; i++) {
      const basicVar = this.basicVariables[i];
      if (basicVar.startsWith('a')) {
        // Jika ini variabel artifisial, cari indeks kolomnya:
        const artIndex = this.getIndexOfVar(basicVar);
        const factor = this.M;
        // Tambahkan factor × baris i ke baris tujuan
        for (let j = 0; j < this.tableau[i].length; j++) {
          this.tableau[this.tableau.length - 1][j] += factor * this.tableau[i][j];
        }
      }
    }
  }

  // Membantu mencari indeks kolom dari nama variabel (x1, s2, a3, dll)
  getIndexOfVar(varName) {
    // Kita iterasi seluruh kolom di baris 0 (kecuali RHS)
    const headerCount = this.problemData.numVariables
      + this.problemData.numSlack
      + this.problemData.numSurplus
      + this.problemData.numArtificial;
    for (let col = 0; col < headerCount; col++) {
      if (this.getVariableName(col) === varName) {
        return col;
      }
    }
    return -1;
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
    const solution = { objectiveValue: 0, variables: {} };
    const { numVariables } = this.problemData;

    // Inisialisasi semua x₁..xₙ = 0
    for (let i = 0; i < numVariables; i++) {
      solution.variables[`x${i + 1}`] = 0;
    }

    // Baca nilai basic variables (hanya yang berawalan x)
    for (let i = 0; i < this.tableau.length - 1; i++) {
      const basicVar = this.basicVariables[i];
      if (basicVar.startsWith('x')) {
        const idx = this.getIndexOfVar(basicVar);
        const val = this.tableau[i][this.tableau[i].length - 1];
        solution.variables[basicVar] = Math.abs(val) < 1e-9 ? 0 : val;
      }
    }

    // Dapatkan nilai fungsi tujuan dari baris terakhir, kolom RHS
    let objValTable = this.tableau[this.tableau.length - 1][
      this.tableau[0].length - 1
    ];

    // Jika awalnya minimisasi, kita sudah meng‐negasi koefisien,
    // tapi Big-M juga memperhitungkan artifisial. Karena di akhir
    // artifisial sudah hilang (seharusnya 0), maka:
    if (this.problemData.objectiveType === 'min') {
      solution.objectiveValue = Math.abs(objValTable) < 1e-9 ? 0 : -objValTable;
    } else {
      solution.objectiveValue = Math.abs(objValTable) < 1e-9 ? 0 : objValTable;
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
      objectiveType: this.problemData.objectiveType,
      originalObjectiveCoefficients: this.originalObjectiveCoefficients
    };
  }

  copyTableau() {
    return this.tableau.map((row) => [...row]);
  }
}

