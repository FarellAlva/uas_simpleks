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

    const numVars = tableau[0].length - 1
    const headers = []
    
    // Generate headers for variables and slack variables
    for (let i = 0; i < numVars; i++) {
      if (i < solutionData.finalSolution?.variables ? Object.keys(solutionData.finalSolution.variables).length : numVars - tableau.length + 1) {
        headers.push(`x${i + 1}`)
      } else {
        headers.push(`s${i - (numVars - tableau.length + 1) + 1}`)
      }
    }
    headers.push('RHS')

    return (
      <div style={{overflowX: 'auto'}}>
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
            {tableau.map((row, rowIdx) => (
              <tr key={rowIdx} style={{
                backgroundColor: rowIdx === pivotRow ? '#e3f2fd' : 
                               rowIdx === tableau.length - 1 ? '#f3e5f5' : 'white'
              }}>
                <td style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  fontWeight: 'bold',
                  backgroundColor: '#fafafa'
                }}>
                  {rowIdx < tableau.length - 1 ? 
                   (basicVars ? basicVars[rowIdx] : `s${rowIdx + 1}`) : 
                   'Z'}
                </td>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    textAlign: 'center',
                    backgroundColor: 
                      rowIdx === pivotRow && cellIdx === pivotCol ? '#ff5722' :
                      rowIdx === pivotRow ? '#e3f2fd' :
                      cellIdx === pivotCol ? '#fff3e0' : 'inherit',
                    color: rowIdx === pivotRow && cellIdx === pivotCol ? 'white' : 'inherit',
                    fontWeight: rowIdx === pivotRow && cellIdx === pivotCol ? 'bold' : 'normal'
                  }}>
                    {typeof cell === 'number' ? parseFloat(cell.toFixed(3)) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
