// src/pages/SolutionSection.jsx
import React, { useState, useEffect } from 'react'

export default function SolutionSection({ solutionData }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

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
    }, 3000) // Slower for better readability
  }

  const formatNumber = (num) => {
    if (typeof num !== 'number') return num
    
    // Round to 3 decimal places
    const rounded = parseFloat(num.toFixed(3))
    
    // Format with thousand separators for Indonesian locale
    return rounded.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3
    })
  }

  
  const getStepFormulation = (stepData) => {
    if (!stepData) return null

    const { iteration, enteringVariable, leavingVariable, pivotElement, description } = stepData

    if (iteration === 0) {
      return {
        title: "📋 Tabel Awal",
        steps: [
          "1. Konversi masalah ke bentuk standar",
          "2. Tambahkan variabel slack/surplus/artificial sesuai kebutuhan",
          "3. Terapkan metode Big-M untuk variabel artificial",
          "4. Buat tabel simpleks awal"
        ]
      }
    }

    if (enteringVariable && leavingVariable && pivotElement) {
      return {
        title: `🔄 Iterasi ${iteration}`,
        steps: [
          `1. Pilih variabel masuk: ${enteringVariable} (koefisien terbesar/terkecil di baris tujuan)`,
          `2. Pilih variabel keluar: ${leavingVariable} (ratio test minimum)`,
          `3. Elemen pivot: ${parseFloat(pivotElement.toFixed(3))}`,
          `4. Lakukan operasi pivot:`,
          `   - Normalisasi baris pivot dengan membagi ${parseFloat(pivotElement.toFixed(3))}`,
          `   - Eliminasi kolom ${enteringVariable} di baris lain`,
          `5. Update basis: ${leavingVariable} → ${enteringVariable}`
        ]
      }
    }

    return {
      title: "ℹ️ Status",
      steps: [description || "Langkah dalam proses"]
    }
  }

  // Format cell values for display purposes

  const formatCellValue = (cell, header, isObjectiveRow, solutionData) => {
    if (typeof cell !== 'number') return cell

    // For artificial variable columns in objective row, show BigM decomposition
    if (isObjectiveRow && header && (header.startsWith('s') || header.startsWith('x')) && solutionData) {
      const bigM = solutionData.bigM || 1000000
      const coefficient = Math.round(cell / bigM)
      
      if (Math.abs(coefficient) > 0) {
      const formattedCell = formatNumber(cell)
      const sign = coefficient >= 0 ? '' : '-'
      const absCoeff = Math.abs(coefficient)
      return `${formattedCell} (${sign}${absCoeff})`
      }
    }
 

    return formatNumber(cell)
  }

  const renderTableau = (tableau, basicVars, pivotRow, pivotCol, stepIndex = null) => {
    if (!tableau || tableau.length === 0) return null

    // Generate headers in proper order: x1, x2, ..., s1, s2, ..., a1, a2, ..., RHS
    const headers = []
    if (solutionData) {
      // Add decision variables (x1, x2, ...)
      for (let i = 1; i <= solutionData.numVariables; i++) {
        headers.push(`x${i}`)
      }
      
      // Add slack variables (s1, s2, ...)
      for (let i = 1; i <= (solutionData.numSlack || 0); i++) {
        headers.push(`s${i}`)
      }
      
      // Add surplus variables - continue numbering from slack variables
      for (let i = 1; i <= (solutionData.numSurplus || 0); i++) {
        headers.push(`s${(solutionData.numSlack || 0) + i}`)
      }
      
      // Add artificial variables (a1, a2, ...)
      for (let i = 1; i <= (solutionData.numArtificial || 0); i++) {
        headers.push(`a${i}`)
      }
    }
    
    // Add RHS column header at the end
    headers.push('RHS')

    return (
      <div style={{
        marginBottom: stepIndex !== null ? '30px' : '0',
        border: stepIndex !== null ? '1px solid #dee2e6' : 'none',
        borderRadius: stepIndex !== null ? '8px' : '0',
        overflow: 'hidden'
      }}>
        {stepIndex !== null && (
          <div style={{
            backgroundColor: stepIndex === currentStep ? '#e3f2fd' : '#f8f9fa',
            padding: '10px 15px',
            borderBottom: '1px solid #dee2e6',
            fontWeight: 'bold',
            color: stepIndex === currentStep ? '#1976d2' : '#495057'
          }}>
            Langkah {stepIndex + 1}: {solutionData.steps[stepIndex]?.description || 'Iterasi'}
          </div>
        )}
        
        <div style={{overflowX: 'auto'}}>
          <table className="simplex-tableau" style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{backgroundColor: '#f5f5f5'}}>
                <th style={{
                  padding: '10px',
                  borderBottom: '2px solid #ddd',
                  fontWeight: 'bold',
                  color: '#333',
                  backgroundColor: '#fafafa'
                }}>Basis</th>
                {headers.map((header, idx) => {
                  const isArtificialVar = header.startsWith('a')
                  const isRHSColumn = header === 'RHS'
                  
                  return (
                    <th key={idx} style={{
                      padding: '10px',
                      borderBottom: '2px solid #ddd',
                      fontWeight: 'bold',
                      color: '#333',
                      backgroundColor: 
                        idx === pivotCol ? '#ffeb3b' : 
                        isArtificialVar ? '#ffebee' :
                        isRHSColumn ? '#e8f5e8' : 'inherit',
                      textAlign: 'center',
                      borderLeft: isRHSColumn ? '2px solid #ddd' : 'none'
                    }}>
                      {header}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {tableau.map((row, rowIdx) => {
                const isObjectiveRow = rowIdx === tableau.length - 1
                
                return (
                  <tr key={rowIdx} style={{
                    backgroundColor: rowIdx === pivotRow ? '#e3f2fd' : 
                                   isObjectiveRow ? '#fff3e0' : 'white'
                  }}>
                    <td style={{
                      padding: '8px',
                      borderBottom: '1px solid #eee',
                      fontWeight: 'bold',
                      backgroundColor: '#fafafa',
                      textAlign: 'center'
                    }}>
                      {isObjectiveRow ? '-Z' : 
                       (basicVars ? basicVars[rowIdx] : `s${rowIdx + 1}`)}
                    </td>
                    {row.map((cell, cellIdx) => {
                      const isRHSColumn = cellIdx === row.length - 1
                      const headerIdx = cellIdx
                      const header = headers[headerIdx]
                      const isArtificialVar = header && header.startsWith('a')
                      
                      return (
                        <td key={cellIdx} style={{
                          padding: '8px',
                          borderBottom: '1px solid #eee',
                          textAlign: 'center',
                          backgroundColor: 
                            rowIdx === pivotRow && cellIdx === pivotCol ? '#ff5722' :
                            rowIdx === pivotRow ? '#e3f2fd' :
                            cellIdx === pivotCol ? '#fff3e0' : 
                            isArtificialVar ? '#fce4ec' :
                            isRHSColumn ? '#f1f8e9' : 'inherit',
                          color: rowIdx === pivotRow && cellIdx === pivotCol ? 'white' : 'inherit',
                          fontWeight: (rowIdx === pivotRow && cellIdx === pivotCol) ? 'bold' : 'normal',
                          borderLeft: isRHSColumn ? '2px solid #ddd' : 'none',
                          fontSize: (isObjectiveRow && isArtificialVar) ? '11px' : '13px'
                        }}>
                         {formatCellValue(cell, header, isObjectiveRow, solutionData)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Show tableau explanation */}
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: '#f0f4c3',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#558b2f'
        }}>
          💡 <strong>Format Tabel:</strong> Tabel simpleks standar dengan variabel basis di kolom kiri. 
          <span style={{color: '#e91e63', fontWeight: 'bold'}}> Kolom merah muda = variabel artificial (a1, a2, ...)</span>, 
          <span style={{color: '#4caf50', fontWeight: 'bold'}}> kolom hijau = RHS</span>. 
          <span style={{color: '#ff5722', fontWeight: 'bold'}}> BigM ditampilkan sebagai: nilai (-koefM) untuk artificial variables</span>.
        </div>
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
  const formulation = getStepFormulation(currentStepData)

  return (
    <section id="solution-section" className="content-section">
      <div className="section-header">
        <h2>🎯 Penyelesaian Langkah demi Langkah</h2>
        
        {/* Toggle View Button */}
        
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

          <div className="tableau-container">
            <h3 style={{marginBottom: '15px', color: '#333'}}>📊 Tabel Simpleks</h3>
            
            {/* Problem formulation */}
            {renderProblemFormulation()}
            
            {/* Step formulation */}
            {formulation && !isExpanded && (
              <div style={{
                backgroundColor: '#fff3e0',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #ffcc02',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  margin: '0 0 10px 0',
                  color: '#e65100',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {formulation.title}
                </h4>
                <div style={{ fontSize: '14px', color: '#bf360c' }}>
                  {formulation.steps.map((step, idx) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div id="tableau-wrapper" className="tableau-wrapper">
              {solutionData && solutionData.steps ? (
                isExpanded ? (
                  // Expanded view - show all steps
                  <div>
                    <div style={{
                      padding: '15px',
                      backgroundColor: '#e3f2fd',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1976d2',
                      border: '1px solid #bbdefb'
                    }}>
                      📋 Semua Langkah Iterasi ({solutionData.steps.length} langkah)
                      <div style={{
                        fontSize: '14px',
                        marginTop: '5px',
                        color: '#1565c0',
                        fontWeight: 'normal'
                      }}>
                        Format: Basis | x₁, x₂, ... | s₁, s₂, ... | a₁, a₂, ... | RHS
                      </div>
                    </div>
                    {solutionData.steps.map((step, index) => (
                      <div key={index}>
                        {renderTableau(
                          step.tableau,
                          step.basicVariables,
                          step.pivotRow,
                          step.pivotColumn,
                          index
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single step view
                  <div>
                    <div style={{
                      padding: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      marginBottom: '15px',
                      textAlign: 'center',
                      fontSize: '14px',
                      color: '#6c757d',
                      border: '1px solid #dee2e6'
                    }}>
                      <strong>Format Tabel:</strong> Basis | x₁, x₂, ... | s₁, s₂, ... | a₁, a₂, ... | RHS
                    </div>
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
                )
              ) : (
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
              )}
            </div>
        
            {/* Navigation controls - moved below table */}
            {solutionData && solutionData.steps && !isExpanded && (
              <div style={{
                marginTop: '32px',
                padding: '24px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap'
              }}>
                {/* Previous Button */}
                <button 
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: currentStep === 0 ? '#f8fafc' : '#ffffff',
                    color: currentStep === 0 ? '#cbd5e1' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '120px',
                    justifyContent: 'center',
                    outline: 'none',
                    boxShadow: currentStep === 0 ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (currentStep !== 0) {
                      e.target.style.backgroundColor = '#f8fafc'
                      e.target.style.borderColor = '#cbd5e1'
                      e.target.style.transform = 'translateY(-1px)'
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentStep !== 0) {
                      e.target.style.backgroundColor = '#ffffff'
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Previous
                </button>
                
                {/* Step Indicator */}
                <div style={{
                  padding: '12px 20px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '12px',
                  fontWeight: '600',
                  color: '#334155',
                  fontSize: '15px',
                  minWidth: '100px',
                  textAlign: 'center',
                  userSelect: 'none',
                  letterSpacing: '0.025em'
                }}>
                  {currentStep + 1} / {solutionData.steps.length}
                </div>
                
                {/* Next Button */}
                <button 
                  onClick={handleNextStep}
                  disabled={currentStep >= solutionData.steps.length - 1}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: currentStep >= solutionData.steps.length - 1 ? '#f8fafc' : '#ffffff',
                    color: currentStep >= solutionData.steps.length - 1 ? '#cbd5e1' : '#475569',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: currentStep >= solutionData.steps.length - 1 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '120px',
                    justifyContent: 'center',
                    outline: 'none',
                    boxShadow: currentStep >= solutionData.steps.length - 1 ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    if (currentStep < solutionData.steps.length - 1) {
                      e.target.style.backgroundColor = '#f8fafc'
                      e.target.style.borderColor = '#cbd5e1'
                      e.target.style.transform = 'translateY(-1px)'
                      e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentStep < solutionData.steps.length - 1) {
                      e.target.style.backgroundColor = '#ffffff'
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
                
                {/* Subtle Divider */}
                <div style={{
                  width: '1px',
                  height: '24px',
                  backgroundColor: '#e2e8f0',
                  margin: '0 4px'
                }}></div>
                
                {/* Auto Play Button */}
                <button 
                  onClick={handlePlayAnimation}
                  disabled={isPlaying}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: isPlaying ? '#f1f5f9' : '#0f172a',
                    color: isPlaying ? '#94a3b8' : '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isPlaying ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    minWidth: '130px',
                    justifyContent: 'center',
                    outline: 'none',
                    boxShadow: isPlaying ? 'none' : '0 2px 4px rgba(15, 23, 42, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isPlaying) {
                      e.target.style.backgroundColor = '#1e293b'
                      e.target.style.transform = 'translateY(-1px)'
                      e.target.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.15)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPlaying) {
                      e.target.style.backgroundColor = '#0f172a'
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = '0 2px 4px rgba(15, 23, 42, 0.1)'
                    }
                  }}
                >
                  {isPlaying ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"/>
                        <rect x="14" y="4" width="4" height="16"/>
                      </svg>
                      Pausing...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="5,3 19,12 5,21"/>
                      </svg>
                      Auto Play
                    </>
                  )}
                </button>
                
              </div>
              
            )}
            
          </div>
<div className="section-actions">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={!solutionData}
            style={{
              padding: '10px 20px',
              backgroundColor: !solutionData ? '#ccc' : isExpanded ? '#FF9800' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: !solutionData ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isExpanded ? '📊 Tampilan Langkah Tunggal' : '📋 Tampilan Semua Langkah'}
          </button>
        </div>
          {/* Solution details - only show in single step view */}
          {!isExpanded && (
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
                    {label: 'Elemen Pivot:', value: currentStepData && currentStepData.pivotElement ? formatNumber(currentStepData.pivotElement) : '-'}
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
                       formatNumber(solutionData.finalSolution.objectiveValue) : '-'}
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
                          <span className="detail-value" style={{color: '#333'}}>{formatNumber(value)}</span>
                        </div>
                      )) : null
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}