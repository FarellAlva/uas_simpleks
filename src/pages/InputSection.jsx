import React, { useState, useEffect } from 'react'
import { SimplexSolver, sampleProblems } from '../utils/SimplexSolver'

export default function InputSection({ onSolutionUpdate }) {
  const [numVariables, setNumVariables] = useState(2)
  const [numConstraints, setNumConstraints] = useState(2)
  const [showForm, setShowForm] = useState(false)
  
  const [objectiveType, setObjectiveType] = useState('max')
  const [selectedMethod, setSelectedMethod] = useState('primal')
  const [objectiveCoefficients, setObjectiveCoefficients] = useState([])
  const [constraintsData, setConstraintsData] = useState([])

  useEffect(() => {
    if (showForm) {
      setObjectiveCoefficients(Array(numVariables).fill(''))
      setConstraintsData(
        Array(numConstraints)
          .fill(null)
          .map(() => ({
            coeffs: Array(numVariables).fill(''),
            sign: '≤',
            rhs: '',
          }))
      )
    }
  }, [numVariables, numConstraints, showForm])

  // Handler untuk tombol "Buat Form"
  const handleGenerateForm = () => {
    setObjectiveCoefficients(Array(numVariables).fill(''))
    setConstraintsData(
      Array(numConstraints)
        .fill(null)
        .map(() => ({
          coeffs: Array(numVariables).fill(''),
          sign: '≤',
          rhs: '',
        }))
    )
    setShowForm(true)
  }

  const handleObjectiveCoeffChange = (index, value) => {
    const newCoeffs = [...objectiveCoefficients]
    newCoeffs[index] = value
    setObjectiveCoefficients(newCoeffs)
  }

  const handleConstraintCoeffChange = (constraintIndex, coeffIndex, value) => {
    const newConstraints = [...constraintsData]
    newConstraints[constraintIndex].coeffs[coeffIndex] = value
    setConstraintsData(newConstraints)
  }

  const handleConstraintSignChange = (constraintIndex, value) => {
    const newConstraints = [...constraintsData]
    newConstraints[constraintIndex].sign = value
    setConstraintsData(newConstraints)
  }

  const handleConstraintRhsChange = (constraintIndex, value) => {
    const newConstraints = [...constraintsData]
    newConstraints[constraintIndex].rhs = value
    setConstraintsData(newConstraints)
  }

  const handleAutoFill = () => {
    const sample = sampleProblems[selectedMethod][objectiveType];
    
    setNumVariables(sample.numVariables);
    setNumConstraints(sample.numConstraints);
    
    // Wait for state to update, then fill the form
    setTimeout(() => {
      setObjectiveCoefficients(sample.objectiveCoefficients.map(String));
      setConstraintsData(sample.constraints.map(constraint => ({
        coeffs: constraint.coeffs.map(String),
        sign: constraint.sign,
        rhs: String(constraint.rhs)
      })));
      setShowForm(true);
    }, 100);
    
    alert(`🎯 Contoh soal telah diisi!\n\n${sample.description}Klik "Selesaikan" untuk melihat proses penyelesaian langkah demi langkah dengan angka yang menarik!`);
  }

  const isFormEmpty = () => {
    if (!showForm) return true;
    
    const hasObjectiveCoeffs = objectiveCoefficients.some(coeff => coeff !== '');
    const hasConstraintData = constraintsData.some(constraint => 
      constraint.coeffs.some(coeff => coeff !== '') || constraint.rhs !== ''
    );
    
    return !hasObjectiveCoeffs && !hasConstraintData;
  }

  const validateForm = () => {
    const hasEmptyObjective = objectiveCoefficients.some(coeff => coeff === '' || isNaN(parseFloat(coeff)));
    const hasEmptyConstraints = constraintsData.some(constraint => 
      constraint.coeffs.some(coeff => coeff === '' || isNaN(parseFloat(coeff))) ||
      constraint.rhs === '' || isNaN(parseFloat(constraint.rhs))
    );
    
    return !hasEmptyObjective && !hasEmptyConstraints;
  }

  const handleSolve = () => {
    if (!validateForm()) {
      alert('❌ Mohon lengkapi semua field dengan angka yang valid!\n\nTip: Klik "Isi Contoh Soal" untuk mengisi form dengan data yang siap pakai.');
      return;
    }

    const parsedObjectiveCoefficients = objectiveCoefficients.map(c => parseFloat(c) || 0)
    const parsedConstraintsData = constraintsData.map(con => ({
      coeffs: con.coeffs.map(c => parseFloat(c) || 0),
      sign: con.sign,
      rhs: parseFloat(con.rhs) || 0,
    }))

    const problemData = {
      objectiveType,
      selectedMethod,
      objectiveCoefficients: parsedObjectiveCoefficients,
      constraints: parsedConstraintsData,
      numVariables,
      numConstraints,
    }

    try {
      const solver = new SimplexSolver(problemData)
      const result = solver.solve()
      
      if (onSolutionUpdate) {
        onSolutionUpdate(result)
      }
    } catch (error) {
      console.error('Error solving simplex:', error)
      if (onSolutionUpdate) {
        onSolutionUpdate({
          success: false,
          error: error.message
        })
      }
    }
  }

  const handleResetForm = () => {
    setShowForm(false)
    setNumVariables(2)
    setNumConstraints(2)
    setObjectiveType('max')
    setSelectedMethod('primal')
    setObjectiveCoefficients([])
    setConstraintsData([])
    if (onSolutionUpdate) {
      onSolutionUpdate(null)
    }
  }

  // (Implementasi komplek pembuatan form bisa kamu sesuaikan, 
  // di sini hanya contoh dasar agar struktur terbentuk.)
  return (
    <section id="input-section" className="content-section active">
      <div className="section-header">
        <h2>Input Masalah Pemrograman Linear</h2>
      </div>
      <div className="content-wrapper">
        <div className="method-selector">
          <h3>Pilih Metode Penyelesaian</h3>
          <div className="method-options">
            <label className="method-option">
              <input 
                type="radio" 
                name="method" 
                value="primal" 
                checked={selectedMethod === 'primal'}
                onChange={(e) => setSelectedMethod(e.target.value)} 
              />
              <span className="option-label">Metode Simpleks Primal</span>
              <span className="option-description">Gunakan jika semua nilai RHS (b) non-negatif dan Anda memiliki solusi awal yang layak</span>
            </label>
            <label className="method-option">
              <input 
                type="radio" 
                name="method" 
                value="dual" 
                checked={selectedMethod === 'dual'}
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <span className="option-label">Metode Simpleks Dual</span>
              <span className="option-description">Gunakan jika semua koefisien fungsi tujuan (c) memenuhi kondisi optimalitas, tetapi solusi belum layak</span>
            </label>
          </div>
        </div>

        <div className="problem-type">
          <h3>Tipe Masalah</h3>
          <div className="problem-options">
            <label>
              <input 
                type="radio" 
                name="objective" 
                value="max" 
                checked={objectiveType === 'max'}
                onChange={(e) => setObjectiveType(e.target.value)}
              />
              <span>Maksimasi</span>
            </label>
            <label>
              <input 
                type="radio" 
                name="objective" 
                value="min" 
                checked={objectiveType === 'min'}
                onChange={(e) => setObjectiveType(e.target.value)}
              />
              <span>Minimasi</span>
            </label>
          </div>
        </div>

        <div className="problem-size">
          <h3>Ukuran Masalah</h3>
          <div className="input-group">
            <div className="input-field">
              <label htmlFor="num-variables">Jumlah Variabel (n):</label>
              <input
                type="number"
                id="num-variables"
                min="1"
                max="10"
                value={numVariables}
                onChange={(e) => setNumVariables(Number(e.target.value))}
              />
            </div>
            <div className="input-field">
              <label htmlFor="num-constraints">Jumlah Batasan (m):</label>
              <input
                type="number"
                id="num-constraints"
                min="1"
                max="10"
                value={numConstraints}
                onChange={(e) => setNumConstraints(Number(e.target.value))}
              />
            </div>
            <div className="button-group">
              <button id="generate-form" className="btn primary" onClick={handleGenerateForm}>
                Buat Form
              </button>
              <button id="auto-fill" className="btn secondary" onClick={handleAutoFill}>
                🎯 Isi Contoh Soal
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <form id="linear-program-form">
            {isFormEmpty() && (
              <div className="form-suggestion" style={{
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                border: '2px dashed #2196F3',
                borderRadius: '12px',
                padding: '20px',
                margin: '20px 0',
                textAlign: 'center'
              }}>
                <div className="suggestion-header">
                  <h4 style={{color: '#1976D2', marginBottom: '10px'}}>
                    💡 Form Masih Kosong - Butuh Bantuan?
                  </h4>
                </div>
                <div className="suggestion-content">
                  <p style={{marginBottom: '15px', color: '#424242'}}>
                    Belum ada data yang diisi. Coba contoh soal dengan angka besar yang menarik!
                  </p>
                  <button 
                    type="button" 
                    className="btn secondary" 
                    onClick={handleAutoFill}
                    style={{
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      cursor: 'pointer',
                      marginBottom: '10px'
                    }}
                  >
                    🚀 Isi Contoh Soal {selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)} {objectiveType.charAt(0).toUpperCase() + objectiveType.slice(1)}
                  </button>
                  <p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
                    <strong>💰 Fitur:</strong> Contoh soal menggunakan angka ratusan ribu hingga jutaan rupiah untuk hasil yang realistis!
                  </p>
                </div>
              </div>
            )}

            <div className="form-section objective-function">
              <h3>Fungsi Tujuan</h3>
              <div className="objective-container">
                <span id="objective-type">{objectiveType === 'max' ? 'Maksimumkan' : 'Minimumkan'}</span> Z =
                <div id="objective-coefficients">
                  {objectiveCoefficients.map((coeff, idx) => (
                    <React.Fragment key={idx}>
                      <div className="objective-term"> {/* Menggunakan div dengan class objective-term */}
                        <input 
                          type="number" 
                          placeholder={`c${idx + 1}`} 
                          value={coeff}
                          onChange={(e) => handleObjectiveCoeffChange(idx, e.target.value)}
                          step="any"
                          // style={{margin: '0 5px'}} <- Hapus inline style ini, biarkan CSS yang menangani
                        />
                        <span>x{idx+1}</span>
                      </div>
                      {idx < numVariables - 1 && <span className="plus-sign">+</span>} {/* Tambahkan operator '+' sebagai elemen terpisah */}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section constraints">
              <h3>Batasan</h3>
              <div id="constraints-container">
                {constraintsData.map((constraint, barisIdx) => (
                  <div key={barisIdx} className="constraint-row"> {/* Hapus inline style, biarkan CSS yang menangani */}
                    <div className="constraint-coefficients"> {/* Bungkus bagian koefisien dengan class ini */}
                      {constraint.coeffs.map((coeff, kolomIdx) => (
                        <React.Fragment key={kolomIdx}>
                          <div className="constraint-term"> {/* Menggunakan div dengan class constraint-term */}
                            <input 
                              type="number" 
                              placeholder={`a${barisIdx + 1}${kolomIdx + 1}`} 
                              value={coeff}
                              onChange={(e) => handleConstraintCoeffChange(barisIdx, kolomIdx, e.target.value)}
                              step="any"
                              // style={{width: '80px'}} <- Hapus inline style ini, biarkan CSS yang menangani
                            />
                            <span>x{kolomIdx+1}</span>
                          </div>
                          {kolomIdx < numVariables - 1 && <span className="plus-sign">+</span>} {/* Tambahkan operator '+' sebagai elemen terpisah */}
                        </React.Fragment>
                      ))}
                    </div>
                    <select 
                      value={constraint.sign} 
                      onChange={(e) => handleConstraintSignChange(barisIdx, e.target.value)}
                      // style={{margin: '0 10px'}} <- Hapus inline style ini, biarkan CSS yang menangani
                    >
                      <option value="≤">≤</option>
                      <option value="=">=</option>
                      <option value="≥">≥</option>
                    </select>
                    <input 
                      type="number" 
                      placeholder={`b${barisIdx + 1}`} 
                      value={constraint.rhs}
                      onChange={(e) => handleConstraintRhsChange(barisIdx, e.target.value)}
                      step="any"
                      // style={{width: '80px'}} <- Hapus inline style ini, biarkan CSS yang menangani
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-controls" style={{marginTop: '30px', textAlign: 'center'}}>
              <button 
                type="button" 
                id="solve-button" 
                className="btn primary" 
                onClick={handleSolve}
                style={{
                  background: isFormEmpty() ? '#ccc' : '#2196F3',
                  color: 'white',
                  padding: '15px 30px',
                  fontSize: '18px',
                  marginRight: '15px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isFormEmpty() ? 'not-allowed' : 'pointer'
                }}
              >
                🚀 Selesaikan
              </button>
              <button 
                type="button" 
                id="reset-button" 
                className="btn secondary" 
                onClick={handleResetForm}
                style={{
                  background: '#f44336',
                  color: 'white',
                  padding: '15px 30px',
                  fontSize: '18px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                🔄 Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}