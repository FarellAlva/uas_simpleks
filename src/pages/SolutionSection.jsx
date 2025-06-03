// src/pages/SolutionSection.jsx
import React, { useState, useEffect } from 'react'

export default function SolutionSection({ solutionData }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (solutionData && solutionData.steps) {
      setCurrentStep(0)
    }
  }, [solutionData])

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNextStep = () => {
    if (solutionData && currentStep < solutionData.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePlayAnimation = () => {
    if (!solutionData || !solutionData.steps) return
    
    setIsPlaying(true)
    setCurrentStep(0)
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= solutionData.steps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  const renderTableau = (tableau, basicVars, pivotRow, pivotCol) => {
    if (!tableau || tableau.length === 0) return null

    const headers = []
    
    // Generate headers in proper order: x1, x2, ..., s1, s2, ..., a1, a2, ..., RHS
    if (solutionData) {
      // Add decision variables (x1, x2, ...)
      for (let i = 1; i <= solutionData.numVariables; i++) {
        headers.push(`x${i}`)
      }
      
      // Add slack variables (s1, s2, ...)
      for (let i = 1; i <= (solutionData.numSlack || 0); i++) {
        headers.push(`s${i}`)
      }
      
      // Add surplus variables if any
      for (let i = 1; i <= (solutionData.numSurplus || 0); i++) {
        headers.push(`s${i}`)
      }
      
      // Add artificial variables (a1, a2, ...)
      for (let i = 1; i <= (solutionData.numArtificial || 0); i++) {
        headers.push(`a${i}`)
      }
    }
    
    // Add RHS column header
    headers.push('RHS')

    // Check if this is a minimization problem
    const isMinimization = solutionData && solutionData.objectiveType === 'min'
    
    // For minimization, we want to show the original coefficients (not negated)
    const displayTableau = tableau.map(row => [...row])
    
    if (isMinimization && displayTableau.length > 0) {
      const objRowIndex = displayTableau.length - 1
      
      // Show original objective coefficients for decision variables
      if (solutionData.originalObjectiveCoefficients) {
        for (let j = 0; j < Math.min(solutionData.numVariables, solutionData.originalObjectiveCoefficients.length); j++) {
          displayTableau[objRowIndex][j] = solutionData.originalObjectiveCoefficients[j]
        }
      }
      
      // For minimization, negate the objective value to show the actual minimum value
      const rhsIndex = displayTableau[objRowIndex].length - 1
      displayTableau[objRowIndex][rhsIndex] = -displayTableau[objRowIndex][rhsIndex]
    }

    return (
      <div style={{overflowX: 'auto'}}>
        {/* Show problem type indicator */}
        <div style={{
          marginBottom: '10px',
          padding: '8px 12px',
          backgroundColor: isMinimization ? '#e3f2fd' : '#f3e5f5',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: isMinimization ? '#1976d2' : '#7b1fa2'
        }}>
          {isMinimization ? '📉 Masalah Minimisasi' : '📈 Masalah Maksimisasi'}
        </div>
        
        <table className="simplex-tableau" style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr style={{backgroundColor: '#f5f5f5'}}>
              <th style={{
                padding: '12px',
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                color: '#333'
              }}>Basis</th>
              {headers.map((header, idx) => (
                <th key={idx} style={{
                  padding: '12px',
                  borderBottom: '2px solid #ddd',
                  fontWeight: 'bold',
                  color: '#333',
                  backgroundColor: idx === pivotCol ? '#ffeb3b' : 'inherit'
                }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayTableau.map((row, rowIdx) => {
              const isObjectiveRow = rowIdx === displayTableau.length - 1
              const objectiveLabel = isMinimization ? 'Z' : '- Z'
              
              return (
                <tr key={rowIdx} style={{
                  backgroundColor: rowIdx === pivotRow ? '#e3f2fd' : 
                                 isObjectiveRow ? (isMinimization ? '#e8f5e8' : '#f3e5f5') : 'white'
                }}>
                  <td style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    fontWeight: 'bold',
                    backgroundColor: '#fafafa'
                  }}>
                    {isObjectiveRow ? objectiveLabel : 
                     (basicVars ? basicVars[rowIdx] : `s${rowIdx + 1}`)}
                  </td>
                  {row.map((cell, cellIdx) => {
                    // For minimization objective row, highlight decision variables differently
                    const isDecisionVarInObj = isObjectiveRow && isMinimization && cellIdx < solutionData.numVariables
                    
                    return (
                      <td key={cellIdx} style={{
                        padding: '10px',
                        borderBottom: '1px solid #eee',
                        textAlign: 'center',
                        backgroundColor: 
                          rowIdx === pivotRow && cellIdx === pivotCol ? '#ff5722' :
                          rowIdx === pivotRow ? '#e3f2fd' :
                          cellIdx === pivotCol ? '#fff3e0' : 
                          isDecisionVarInObj ? '#c8e6c9' : 'inherit',
                        color: rowIdx === pivotRow && cellIdx === pivotCol ? 'white' : 
                               isDecisionVarInObj ? '#2e7d32' : 'inherit',
                        fontWeight: (rowIdx === pivotRow && cellIdx === pivotCol) || isDecisionVarInObj ? 'bold' : 'normal'
                      }}>
                       {typeof cell === 'number' ? parseFloat(cell.toFixed(3)) : cell}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {/* Show explanation for minimization */}
        {isMinimization && (
          <div style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#f0f4c3',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#558b2f'
          }}>
            💡 <strong>Catatan:</strong> Untuk minimisasi, koefisien fungsi tujuan ditampilkan dalam bentuk asli. 
            Nilai Z menunjukkan nilai minimum yang dicapai.
          </div>
        )}
      </div>
    )
  }

  const renderProblemFormulation = () => {
    if (!solutionData || !solutionData.originalObjectiveCoefficients || !solutionData.constraints) {
      return null
    }

    const { objectiveType, originalObjectiveCoefficients, numVariables, constraints } = solutionData

    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '20px',
        fontFamily: 'monospace'
      }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#495057',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          📝 Formulasi Masalah
        </h4>
        
        {/* Objective Function */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold', color: objectiveType === 'min' ? '#1976d2' : '#7b1fa2' }}>
            {objectiveType === 'min' ? 'Minimize' : 'Maximize'}: 
          </span>
          <span style={{ marginLeft: '10px', fontSize: '16px' }}>
            Z = {originalObjectiveCoefficients && originalObjectiveCoefficients.length > 0 ? 
              originalObjectiveCoefficients.map((coeff, index) => {
                const sign = index === 0 ? '' : coeff >= 0 ? ' + ' : ' - '
                const absCoeff = Math.abs(coeff)
                const displayCoeff = absCoeff === 1 ? '' : absCoeff
                return `${sign}${displayCoeff}x${index + 1}`
              }).join('') : 'Tidak tersedia'
            }
          </span>
        </div>

        {/* Constraints */}
        <div>
          <span style={{ fontWeight: 'bold', color: '#495057' }}>Subject to:</span>
          <div style={{ marginLeft: '20px', marginTop: '8px' }}>
            {constraints && constraints.length > 0 ? 
              constraints.map((constraint, index) => (
                <div key={index} style={{ marginBottom: '5px', fontSize: '15px' }}>
                  {constraint.coeffs && constraint.coeffs.length > 0 ? 
                    constraint.coeffs.map((coeff, varIndex) => {
                      const sign = varIndex === 0 ? '' : coeff >= 0 ? ' + ' : ' - '
                      const absCoeff = Math.abs(coeff)
                      const displayCoeff = absCoeff === 1 ? '' : absCoeff
                      return `${sign}${displayCoeff}x${varIndex + 1}`
                    }).join('') : 'Koefisien tidak tersedia'
                  } {constraint.sign || '='} {constraint.rhs !== undefined ? constraint.rhs : '0'}
                </div>
              )) : 
              <div style={{ fontSize: '15px', color: '#6c757d', fontStyle: 'italic' }}>
                Batasan tidak tersedia
              </div>
            }
            {numVariables && numVariables > 0 && (
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#6c757d' }}>
                {Array.from({ length: numVariables }, (_, i) => `x${i + 1}`).join(', ')} ≥ 0
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const getStatusInfo = () => {
    if (!solutionData) {
      return { status: 'waiting', text: 'Menunggu Input' }
    }
    if (!solutionData.success) {
      return { status: 'error', text: 'Error dalam Penyelesaian' }
    }
    if (solutionData.isOptimal) {
      return { status: 'optimal', text: '🎯 Solusi Optimal Ditemukan!' }
    }
    if (solutionData.isUnbounded) {
      return { status: 'unbounded', text: '♾️ Solusi Tidak Terbatas' }
    }
    if (solutionData.isInfeasible) {
      return { status: 'infeasible', text: '❌ Tidak Ada Solusi Layak' }
    }
    return { status: 'solving', text: '🔄 Sedang Menyelesaikan' }
  }

  const currentStepData = solutionData && solutionData.steps ? solutionData.steps[currentStep] : null
  const statusInfo = getStatusInfo()

  return (
    <section id="solution-section" className="content-section">
      <div className="section-header">
        <h2>🎯 Penyelesaian Langkah demi Langkah</h2>
        <div className="section-actions">
          <button 
            id="prev-step" 
            className="btn icon" 
            disabled={!solutionData || currentStep === 0}
            onClick={handlePrevStep}
            style={{
              padding: '10px 15px',
              backgroundColor: !solutionData || currentStep === 0 ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !solutionData || currentStep === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="icon-arrow-left">← Prev</span>
          </button>
          <span id="step-indicator" style={{
            margin: '0 15px',
            padding: '10px 20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            Langkah {solutionData ? currentStep + 1 : 0}/{solutionData ? solutionData.steps.length : 0}
          </span>
          <button 
            id="next-step" 
            className="btn icon" 
            disabled={!solutionData || currentStep >= solutionData.steps.length - 1}
            onClick={handleNextStep}
            style={{
              padding: '10px 15px',
              backgroundColor: !solutionData || currentStep >= solutionData.steps.length - 1 ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !solutionData || currentStep >= solutionData.steps.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="icon-arrow-right">Next →</span>
          </button>
          <button 
            id="play-animation" 
            className="btn icon"
            disabled={!solutionData || isPlaying}
            onClick={handlePlayAnimation}
            style={{
              padding: '10px 15px',
              backgroundColor: !solutionData || isPlaying ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginLeft: '10px',
              cursor: !solutionData || isPlaying ? 'not-allowed' : 'pointer'
            }}
          >
            <span className="icon-play">{isPlaying ? '⏸ Pause' : '▶ Auto Play'}</span>
          </button>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="solution-container">
          <div id="solution-status" className="solution-status">
            <div className={`status-indicator ${statusInfo.status}`} style={{
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: 
                statusInfo.status === 'optimal' ? '#e8f5e8' :
                statusInfo.status === 'error' ? '#ffebee' :
                statusInfo.status === 'unbounded' ? '#fff3e0' :
                statusInfo.status === 'infeasible' ? '#ffebee' : '#f5f5f5',
              border: '2px solid ' + (
                statusInfo.status === 'optimal' ? '#4CAF50' :
                statusInfo.status === 'error' ? '#f44336' :
                statusInfo.status === 'unbounded' ? '#ff9800' :
                statusInfo.status === 'infeasible' ? '#f44336' : '#ccc'),
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <span className="status-text" style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: 
                  statusInfo.status === 'optimal' ? '#2e7d32' :
                  statusInfo.status === 'error' ? '#c62828' :
                  statusInfo.status === 'unbounded' ? '#ef6c00' :
                  statusInfo.status === 'infeasible' ? '#c62828' : '#666'
              }}>
                {statusInfo.text}
              </span>
            </div>
          </div>

          <div className="step-description-container">
            <div id="step-description" className="step-description" style={{
              backgroundColor: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              marginBottom: '20px',
              fontSize: '16px',
              color: '#495057'
            }}>
              {currentStepData ? currentStepData.description : 
               'Masukkan fungsi tujuan dan batasan pada halaman Input Masalah, kemudian klik tombol "Selesaikan".'}
            </div>
          </div>

          <div className="tableau-container">
            <h3 style={{marginBottom: '15px', color: '#333'}}>📊 Tabel Simpleks</h3>
            
            {/* Add problem formulation display */}
            {renderProblemFormulation()}
            
            <div id="tableau-wrapper" className="tableau-wrapper">
              {currentStepData ? 
                renderTableau(
                  currentStepData.tableau, 
                  currentStepData.basicVariables,
                  currentStepData.pivotRow,
                  currentStepData.pivotColumn
                ) :
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <p style={{fontSize: '16px', color: '#6c757d'}}>
                    📋 Tabel simpleks akan muncul di sini setelah masalah diselesaikan.
                  </p>
                </div>
              }
            </div>
          </div>

          <div className="solution-details" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div className="solution-panel" style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{marginBottom: '15px', color: '#333'}}>🔄 Detail Iterasi</h3>
              <div id="iteration-details" className="panel-content">
                {[
                  {label: 'Iterasi ke:', value: currentStepData ? currentStepData.iteration : '-'},
                  {label: 'Big M:', value: solutionData ? solutionData.bigM : '-'},
                  {label: 'Variabel Masuk:', value: currentStepData ? currentStepData.enteringVariable || '-' : '-'},
                  {label: 'Variabel Keluar:', value: currentStepData ? currentStepData.leavingVariable || '-' : '-'},
                  {label: 'Elemen Pivot:', value: currentStepData && currentStepData.pivotElement ? parseFloat(currentStepData.pivotElement.toFixed(3)) : '-'}
                ].map((item, idx) => (
                  <div key={idx} className="detail-item" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span className="detail-label" style={{fontWeight: 'bold', color: '#555'}}>{item.label}</span>
                    <span className="detail-value" style={{color: '#333'}}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="solution-panel" style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{marginBottom: '15px', color: '#333'}}>💰 Solusi Saat Ini</h3>
              <div id="current-solution" className="panel-content">
                <div className="detail-item" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '2px solid #4CAF50',
                  marginBottom: '10px'
                }}>
                  <span className="detail-label" style={{fontWeight: 'bold', color: '#555'}}>Nilai Fungsi Tujuan (Z):</span>
                  <span className="detail-value" style={{
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {solutionData && solutionData.finalSolution ? 
                     `${parseFloat(solutionData.finalSolution.objectiveValue.toFixed(2)).toLocaleString('id-ID')}` : '-'}
                  </span>
                </div>
                <div id="variable-values">
                  {solutionData && solutionData.finalSolution && solutionData.finalSolution.variables ?
                    Object.entries(solutionData.finalSolution.variables).map(([varName, value]) => (
                      <div key={varName} className="detail-item" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        borderBottom: '1px solid #eee'
                      }}>
                        <span className="detail-label" style={{fontWeight: 'bold', color: '#555'}}>{varName}:</span>
                        <span className="detail-value" style={{color: '#333'}}>{parseFloat(value.toFixed(3))}</span>
                      </div>
                    )) : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
