// src/pages/SolutionSection.jsx
import React, { useState, useEffect } from 'react';

export default function SolutionSection({ solutionData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Reset ke langkah awal setiap kali ada data solusi baru
    if (solutionData && solutionData.steps) {
      setCurrentStep(0);
      setIsExpanded(false); // Selalu mulai dari tampilan langkah tunggal
    }
  }, [solutionData]);

  // Handler untuk navigasi dan animasi
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (solutionData && currentStep < solutionData.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePlayAnimation = () => {
    if (!solutionData || !solutionData.steps) return;
    
    setIsPlaying(true);
    setCurrentStep(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= solutionData.steps.length - 1) {
          clearInterval(interval);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4000); // Durasi per langkah
  };

  // Fungsi utilitas untuk memformat angka
  const formatNumber = (num) => {
    if (typeof num !== 'number') return num;
    const rounded = parseFloat(num.toFixed(3));
    return rounded.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  };

  /**
   * Fungsi untuk menghasilkan penjelasan langkah-demi-langkah yang detail
   * termasuk dengan rumus perhitungan.
   */
  const getStepFormulation = (stepData, previousStepData) => {
    if (!stepData) return null;

    const { iteration, enteringVariable, leavingVariable, pivotElement, description, pivotColumn, pivotRow, tableau } = stepData;

    if (iteration === 0) {
        return {
            title: "📋 Iterasi 0: Tabel Awal (Bentuk Standar)",
            description: [
                "1. **Konversi ke Bentuk Standar:** Fungsi tujuan dan batasan diubah.",
                "2. **Tambah Variabel Slack:** Variabel 'slack' (s) ditambahkan untuk mengubah `≤` menjadi persamaan.",
                "3. **Basis Awal:** Variabel slack (misal: s₁, s₂, s₃) menjadi 'Variabel Basis' awal.",
                "4. **Inisialisasi Baris Z:** Diisi dengan koefisien negatif dari fungsi tujuan (untuk maksimisasi)."
            ]
        };
    }

    if (enteringVariable && leavingVariable && pivotElement) {
        const steps = [
            `1. **Pilih Kolom Pivot (Variabel Masuk):** Nilai negatif terbesar di baris Z ada di kolom **'${enteringVariable}'**.`,
            `2. **Pilih Baris Pivot (Variabel Keluar):** 'Ratio test' (NK / nilai kolom pivot) positif terkecil menunjuk baris **'${leavingVariable}'**.`,
            `3. **Elemen Pivot:** Ditemukan **${formatNumber(pivotElement)}** di perpotongan baris '${leavingVariable}' & kolom '${enteringVariable}'.`,
            `4. **Lakukan Operasi Baris Elementer (OBE):**`
        ];

        if (previousStepData && previousStepData.tableau) {
            const oldTableau = previousStepData.tableau;
            const newPivotRowValues = tableau[pivotRow];
            const oldPivotRowValues = oldTableau[pivotRow];
            
            steps.push(`   - **Baris Pivot Baru (${enteringVariable}):** Baris '${leavingVariable}' lama / Elemen Pivot`);
            steps.push(`     *Rumus:* \`[${oldPivotRowValues.map(formatNumber).join(', ')}] / ${formatNumber(pivotElement)} = [${newPivotRowValues.map(formatNumber).join(', ')}]\``);

            const oldBasicVars = [...previousStepData.basicVariables, '-Z'];
            oldTableau.forEach((oldRow, rowIndex) => {
                const varLabel = oldBasicVars[rowIndex];
                if (varLabel !== leavingVariable) {
                    const pivotColCoeff = oldRow[pivotColumn];
                    if (pivotColCoeff !== 0) { // Hanya tampilkan jika ada perubahan
                        const newRow = tableau[rowIndex];
                        steps.push(`   - **Update Baris '${varLabel}':** Baris '${varLabel}' lama - (${formatNumber(pivotColCoeff)} * Baris Pivot Baru)`);
                        steps.push(`     *Rumus:* \`[${oldRow.map(formatNumber).join(', ')}] - (${formatNumber(pivotColCoeff)} * [${newPivotRowValues.map(formatNumber).join(', ')}]) = [${newRow.map(formatNumber).join(', ')}]\``);
                    }
                }
            });
        }
        
        steps.push(`5. **Update Basis:** Variabel **'${enteringVariable}'** masuk ke basis menggantikan **'${leavingVariable}'**.`);

        return { title: `🔄 Iterasi ${iteration}`, description: steps };
    }

    return { title: "ℹ️ Status", description: [description || "Langkah dalam proses"] };
  }

  // Komponen untuk merender kotak penjelasan
  const RenderStepExplanation = ({ stepData, previousStepData }) => {
      const formulation = getStepFormulation(stepData, previousStepData);
      if (!formulation) return null;

      return (
        <div style={{
            backgroundColor: '#fff3e0', padding: '15px', borderRadius: '8px',
            border: '1px solid #ffcc02', marginBottom: '20px'
        }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#e65100', fontSize: '16px', fontWeight: 'bold' }}>
                {formulation.title}
            </h4>
            <div style={{ fontSize: '14px', color: '#bf360c', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {formulation.description.map((step, idx) => (
                    <div key={idx} style={{ marginBottom: '8px' }}
                         dangerouslySetInnerHTML={{ 
                             __html: step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                         .replace(/`(.*?)`/g, '<code style="background-color: #ffe0b2; padding: 2px 5px; border-radius: 4px; font-family: monospace;">$1</code>')
                         }} />
                ))}
            </div>
        </div>
      );
  };
  
const renderProblemFormulation = () => {
    // Guard clause: Pastikan data yang dibutuhkan ada, termasuk `steps` untuk bentuk standar.
    if (!solutionData || !solutionData.originalObjectiveCoefficients || !solutionData.steps || !solutionData.steps[0]) {
        return null;
    }

    const { 
        objectiveType, 
        originalObjectiveCoefficients, 
        numVariables, 
        // Ambil jumlah slack/surplus variables dari solutionData
        numSlack,
        numSurplus,
    } = solutionData;

    // [MODIFIKASI KUNCI 1: SUMBER DATA]
    // Kita tidak lagi menggunakan `originalConstraints`. Sebagai gantinya, kita ambil data batasan 
    // langsung dari tabel awal (iterasi 0), karena di sanalah bentuk standar (dengan variabel s) berada.
    const standardFormConstraints = solutionData.steps[0].tableau.slice(0, -1); // Potong baris Z
    const totalSVars = (numSlack || 0) + (numSurplus || 0);

    // [MODIFIKASI KUNCI 2: FUNGSI buildExpression]
    // Fungsi ini diubah dari menggunakan `.map()` menjadi `for` loop
    // agar bisa memproses variabel `x` dan `s` secara terpisah.
    const buildExpression = (coeffs) => {
        const parts = [];

        // Bagian 1: Proses Variabel Keputusan (x1, x2, ...)
        for (let i = 0; i < numVariables; i++) {
            if (coeffs[i] !== 0) {
                const c = coeffs[i];
                const absCoeff = Math.abs(c);
                const displayCoeff = (absCoeff === 1) ? '' : absCoeff;
                const variable = `x${i + 1}`;
                const sign = c < 0 ? ' - ' : ' + ';
                parts.push(`${sign}${displayCoeff}${variable}`);
            }
        }
        
        // Bagian 2: Proses Variabel Slack/Surplus (s1, s2, ...)
        for (let i = 0; i < totalSVars; i++) {
            const coeffIndex = numVariables + i;
            if (coeffs[coeffIndex] && coeffs[coeffIndex] !== 0) {
                const c = coeffs[coeffIndex];
                const absCoeff = Math.abs(c);
                const displayCoeff = absCoeff === 1 ? '' : absCoeff;
                const variable = `s${i + 1}`;
                const sign = c < 0 ? ' - ' : ' + ';
                parts.push(`${sign}${displayCoeff}${variable}`);
            }
        }
        
        // Gabungkan dan rapikan string hasil akhir
        let result = parts.join('').trim();
        if (result.startsWith('+')) {
            result = result.substring(1).trim();
        }
        return result;
    };
    
    // Fungsi ini dipertahankan sesuai permintaan Anda.
    const getOperatorSymbol = (sign) => {
        if (sign === '≤') return '≤';
        if (sign === '≥') return '≥'; 
        if (sign === '=') return '='; 
        return '≥';
    };

    // Fungsi tambahan untuk memformat fungsi tujuan menjadi Z - ... = 0
    const buildStandardObjective = () => {
        const parts = originalObjectiveCoefficients.map((c, i) => {
            if (c === 0) return '';
            // Pindahkan semua ke sisi kiri, sehingga menjadi negatif
            return ` - ${c}x${i + 1}`;
        });
        return `Z${parts.join('')} = 0`;
    };

    return (
        <div style={{
            backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px',
            border: '1px solid #dee2e6', marginBottom: '20px', fontFamily: 'monospace'
        }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '16px', fontWeight: 'bold' }}>
                {/* Judul diubah agar selalu menampilkan 'Bentuk Standar' */}
                📝 Formulasi Masalah (Bentuk Standar)
            </h4>
            
            <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                <span style={{ fontWeight: 'bold' }}>
                    {objectiveType === 'min' ? 'Minimize' : 'Maximize'}: 
                </span>
                {/* [MODIFIKASI] Gunakan fungsi baru untuk format Z - ... = 0 */}
                <span> {buildStandardObjective()}</span>
            </div>

            <div>
                <span style={{ fontWeight: 'bold' }}>Subject to:</span>
                <div style={{ marginLeft: '20px', marginTop: '8px', fontSize: '15px' }}>
                  
                    {standardFormConstraints.map((row, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        {/* Ambil operator asli dari solutionData.constraints jika ada, fallback ke '=' */}
                        {buildExpression(row)} {getOperatorSymbol(solutionData.constraints && solutionData.constraints[index] ? solutionData.constraints[index].sign : '=')} {row[row.length - 1]}
                      </div>
                    ))}
                    <div style={{ marginTop: '10px', color: '#6c757d' }}>
                     
                        {Array.from({ length: numVariables }, (_, i) => `x${i + 1}`).join(', ')}, 
                        {Array.from({ length: totalSVars }, (_, i) => `s${i + 1}`).join(', ')} ≥ 0
                    </div>
                </div>
            </div>
        </div>
    );
};
  
  // [MODIFIKASI] Komponen untuk merender tabel simpleks dengan header yang dinamis dan jelas
  const renderTableau = (tableau, basicVars, pivotRow, pivotCol, stepIndex = null, isCurrent = false) => {
    if (!tableau || tableau.length === 0) return null;

    // --- Logika Pembuatan Header Tabel ---
    // Header dibuat secara dinamis berdasarkan properti dari objek `solutionData`.
    // Pastikan `solutionData` berisi `numVariables` dan `numSlack` yang benar.
   const headers = [];
if (solutionData) {
    const numDecisionVars = solutionData.numVariables || 0;
    // [MODIFIKASI] Ambil jumlah variabel slack DAN surplus
    const numSlackVars = solutionData.numSlack || 0;
    const numSurplusVars = solutionData.numSurplus || 0;
    // [MODIFIKASI] Jumlahkan keduanya untuk mendapatkan total variabel 's'
    const totalSVars = numSlackVars + numSurplusVars;
    const numArtificialVars = solutionData.numArtificial || 0;

    // 1. Tambahkan header untuk variabel keputusan (misal: x1, x2, x3)
    for (let i = 1; i <= numDecisionVars; i++) {
        headers.push(`x${i}`);
    }

    // 2. [MODIFIKASI] Loop ini sekarang membuat header untuk SEMUA variabel 's'
    // Baik dari slack (<=) maupun surplus (>=)
    for (let i = 1; i <= totalSVars; i++) {
        headers.push(`s${i}`);
    }

    // 3. Tambahkan header untuk variabel artifisial (jika ada)
    for (let i = 1; i <= numArtificialVars; i++) {
        headers.push(`a${i}`);
    }
}
    // 4. Selalu tambahkan kolom Nilai Kanan (RHS) di bagian akhir
    headers.push('RHS');

    // --- Render Komponen JSX ---
    return (
        <div style={{ marginBottom: '30px', border: '1px solid #dee2e6', borderRadius: '8px', overflow: 'hidden' }}>
            {isExpanded && (
                <div style={{
                    backgroundColor: isCurrent ? '#e3f2fd' : '#f8f9fa', padding: '10px 15px', borderBottom: '1px solid #dee2e6',
                    fontWeight: 'bold', color: isCurrent ? '#1976d2' : '#495057'
                }}>
                    Tabel untuk Iterasi {stepIndex}
                </div>
            )}
            <div style={{overflowX: 'auto'}}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{backgroundColor: '#f5f5f5'}}>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd', fontWeight: 'bold', backgroundColor: '#fafafa' }}>Basis</th>
                            
                            {/* Render semua header yang telah dibuat secara dinamis */}
                            {headers.map((header, idx) => (
                                <th key={idx} style={{
                                    padding: '10px', borderBottom: '2px solid #ddd', fontWeight: 'bold', textAlign: 'center',
                                    // Sorot kolom pivot. `idx` di sini sesuai dengan indeks kolom pada data `tableau`.
                                    backgroundColor: idx === pivotCol ? '#ffeb3b' : 'inherit'
                                }}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableau.map((row, rowIdx) => {
                            const isObjectiveRow = rowIdx === tableau.length - 1;
                            return (
                                <tr key={rowIdx} style={{ backgroundColor: rowIdx === pivotRow ? '#e3f2fd' : isObjectiveRow ? '#fff3e0' : 'white' }}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #eee', fontWeight: 'bold', backgroundColor: '#fafafa', textAlign: 'center' }}>
                                        {isObjectiveRow ? '-Z' : (basicVars ? basicVars[rowIdx] : `s${rowIdx + 1}`)}
                                    </td>
                                    {row.map((cell, cellIdx) => (
                                        <td key={cellIdx} style={{
                                            padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center',
                                            backgroundColor: (rowIdx === pivotRow && cellIdx === pivotCol) ? '#ff5722' : (cellIdx === pivotCol ? '#fff3e0' : 'inherit'),
                                            color: (rowIdx === pivotRow && cellIdx === pivotCol) ? 'white' : 'inherit',
                                            fontWeight: (rowIdx === pivotRow && cellIdx === pivotCol) ? 'bold' : 'normal',
                                        }}>{formatNumber(cell)}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  // Komponen untuk detail iterasi
  const renderIterationDetails = (stepData) => {
    if (!stepData) return null;

    return (
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <h3 style={{marginBottom: '15px', color: '#1e293b', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
          🔄 Detail Iterasi {stepData.iteration}
        </h3>
        {[
            {label: 'Variabel Masuk:', value: stepData.enteringVariable || '-', icon: '📥'},
            {label: 'Variabel Keluar:', value: stepData.leavingVariable || '-', icon: '📤'},
            {label: 'Elemen Pivot:', value: stepData.pivotElement ? formatNumber(stepData.pivotElement) : '-', icon: '🎯'},
            {label: 'Status:', value: stepData.description || 'Dalam proses', icon: '📊'}
        ].map((item, idx) => (
            <div key={idx} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', marginBottom: '8px', backgroundColor: '#f8fafc', 
              borderRadius: '8px', border: '1px solid #e2e8f0'
            }}>
                <span style={{fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                <span style={{fontWeight: 'bold', color: '#1e293b'}}>{item.value}</span>
            </div>
        ))}
      </div>
    );
  };

  // Komponen untuk solusi optimal
  const renderOptimalSolution = () => {
    if (!solutionData || !solutionData.finalSolution) return null;

    return (
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <h3 style={{marginBottom: '15px', color: '#1e293b', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'}}>
          💰 Solusi Optimal
        </h3>
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px', marginBottom: '12px', backgroundColor: '#dcfce7', 
          borderRadius: '8px', border: '2px solid #22c55e'
        }}>
            <span style={{fontWeight: 'bold', color: '#15803d', fontSize: '16px'}}>Nilai Fungsi Tujuan (Z):</span>
            <span style={{ color: '#15803d', fontWeight: 'bold', fontSize: '20px' }}>
                {formatNumber(solutionData.finalSolution.objectiveValue)}
            </span>
        </div>
        {Object.entries(solutionData.finalSolution.variables).map(([varName, value]) => (
            <div key={varName} style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 16px', marginBottom: '6px', backgroundColor: '#f8fafc', 
              borderRadius: '6px', border: '1px solid #e2e8f0'
            }}>
                <span style={{fontWeight: '600', color: '#475569'}}>{varName}:</span>
                <span style={{fontWeight: 'bold', color: '#1e293b'}}>{formatNumber(value)}</span>
            </div>
        ))}
      </div>
    );
  };

  // Komponen navigasi yang lebih baik
  const renderNavigationControls = () => {
    if (!solutionData || !solutionData.steps || isExpanded) return null;

    return (
      <div style={{ 
        marginTop: '32px', padding: '24px', backgroundColor: '#ffffff', 
        borderRadius: '16px', border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={handlePrevStep} 
            disabled={currentStep === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', backgroundColor: currentStep === 0 ? '#f1f5f9' : '#3b82f6',
              color: currentStep === 0 ? '#94a3b8' : 'white',
              border: 'none', borderRadius: '10px', fontWeight: '600',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease', fontSize: '14px'
            }}>
            <span>◀</span> Previous
          </button>

          <div style={{ 
            padding: '12px 24px', backgroundColor: '#f8fafc', 
            borderRadius: '12px', fontWeight: '700', color: '#1e293b',
            border: '2px solid #e2e8f0', fontSize: '16px'
          }}>
            <span style={{color: '#3b82f6'}}>{currentStep + 1}</span> 
            <span style={{margin: '0 8px', color: '#64748b'}}>/</span> 
            <span>{solutionData.steps.length}</span>
          </div>

          <button 
            onClick={handleNextStep} 
            disabled={currentStep >= solutionData.steps.length - 1}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 20px', 
              backgroundColor: currentStep >= solutionData.steps.length - 1 ? '#f1f5f9' : '#3b82f6',
              color: currentStep >= solutionData.steps.length - 1 ? '#94a3b8' : 'white',
              border: 'none', borderRadius: '10px', fontWeight: '600',
              cursor: currentStep >= solutionData.steps.length - 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease', fontSize: '14px'
            }}>
            Next <span>▶</span>
          </button>
        </div>
      </div>
    );
  };

  const getStatusInfo = () => {
    if (!solutionData) return { status: 'waiting', text: 'Menunggu Input', color: '#666', bg: '#f5f5f5', border: '#ccc' };
    if (!solutionData.success) return { status: 'error', text: 'Error: ' + (solutionData.message || 'Penyelesaian Gagal'), color: '#c62828', bg: '#ffebee', border: '#f44336' };
    if (solutionData.isOptimal) return { status: 'optimal', text: '🎯 Solusi Optimal Ditemukan!', color: '#2e7d32', bg: '#e8f5e8', border: '#4CAF50' };
    if (solutionData.isUnbounded) return { status: 'unbounded', text: '♾️ Solusi Tidak Terbatas', color: '#ef6c00', bg: '#fff3e0', border: '#ff9800' };
    if (solutionData.isInfeasible) return { status: 'infeasible', text: '❌ Tidak Ada Solusi Layak', color: '#c62828', bg: '#ffebee', border: '#f44336' };
    return { status: 'solving', text: '🔄 Sedang Menyelesaikan...', color: '#666', bg: '#f5f5f5', border: '#ccc' };
  };

  const statusInfo = getStatusInfo();
  const currentStepData = solutionData && solutionData.steps ? solutionData.steps[currentStep] : null;
  const previousStepData = solutionData && solutionData.steps && currentStep > 0 ? solutionData.steps[currentStep - 1] : null;

  return (
    <section id="solution-section" className="content-section">
      <div className="section-header">
        <h2>🎯 Penyelesaian Langkah demi Langkah</h2>
      </div>

      <div className="content-wrapper">
        <div className="solution-container">
          <div id="solution-status" style={{
            padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px',
            backgroundColor: statusInfo.bg, border: `2px solid ${statusInfo.border}`
          }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: statusInfo.color }}>
              {statusInfo.text}
            </span>
          </div>

          <div className="tableau-container">
            <h3 style={{marginBottom: '15px', color: '#333'}}>📊 Tabel Simpleks & Penjelasan</h3>
            
            {renderProblemFormulation()}

            <div className="section-actions" style={{marginBottom: '20px'}}>
                <button onClick={() => setIsExpanded(!isExpanded)} disabled={!solutionData || !solutionData.steps}
                    style={{ 
                      padding: '12px 24px', 
                      backgroundColor: !solutionData ? '#ccc' : isExpanded ? '#FF9800' : '#4CAF50',
                      color: 'white', border: 'none', borderRadius: '8px', 
                      cursor: !solutionData ? 'not-allowed' : 'pointer', 
                      fontWeight: 'bold', fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}>
                    {isExpanded ? '📊 Tampilan Langkah Tunggal' : '📋 Tampilan Semua Langkah'}
                </button>
            </div>
            
            <div id="tableau-wrapper">
              {solutionData && solutionData.steps ? (
                isExpanded ? (
                  <div>
                    {solutionData.steps.map((step, index) => (
                      <div key={index} style={{marginBottom: '40px'}}>
                        <RenderStepExplanation stepData={step} previousStepData={index > 0 ? solutionData.steps[index - 1] : null} />
                        {renderTableau(step.tableau, step.basicVariables, step.pivotRow, step.pivotColumn, step.iteration, currentStep === index)}
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px', marginBottom: '30px' }}>
                          {renderIterationDetails(step)}
                          {index === solutionData.steps.length - 1 && solutionData.isOptimal && renderOptimalSolution()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {currentStepData && (
                      <>
                        <RenderStepExplanation stepData={currentStepData} previousStepData={previousStepData} />
                        {renderTableau(currentStepData.tableau, currentStepData.basicVariables, currentStepData.pivotRow, currentStepData.pivotColumn)}
                      </>
                    )}
                  </div>
                )
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '2px dashed #dee2e6' }}>
                  <p style={{fontSize: '16px', color: '#6c757d'}}>📋 Tabel simpleks akan muncul di sini.</p>
                </div>
              )}
            </div>
            
            {renderNavigationControls()}
            
          </div>

          {!isExpanded && solutionData && solutionData.steps && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
              {renderIterationDetails(currentStepData)}
              {solutionData.isOptimal && renderOptimalSolution()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}