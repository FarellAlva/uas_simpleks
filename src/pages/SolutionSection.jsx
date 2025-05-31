// src/pages/SolutionSection.jsx
import React from 'react'

export default function SolutionSection() {
  return (
    <section id="solution-section" className="content-section">
      <div className="section-header">
        <h2>Penyelesaian Langkah demi Langkah</h2>
        <div className="section-actions">
          <button id="prev-step" className="btn icon" disabled>
            <span className="icon-arrow-left"></span>
          </button>
          <span id="step-indicator">Langkah 0/0</span>
          <button id="next-step" className="btn icon" disabled>
            <span className="icon-arrow-right"></span>
          </button>
          <button id="play-animation" className="btn icon">
            <span className="icon-play"></span>
          </button>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="solution-container">
          <div id="solution-status" className="solution-status">
            <div className="status-indicator waiting">
              <span className="status-icon"></span>
              <span className="status-text">Menunggu Input</span>
            </div>
            {/* Status lain bisa di-render sesuai state */}
          </div>

          <div className="step-description-container">
            <div id="step-description" className="step-description">
              Masukkan fungsi tujuan dan batasan pada halaman Input Masalah, kemudian klik tombol "Selesaikan".
            </div>
          </div>

          <div className="tableau-container">
            <h3>Tabel Simpleks</h3>
            <div id="tableau-wrapper" className="tableau-wrapper">
              <table id="simplex-tableau" className="simplex-tableau">
                <thead></thead>
                <tbody>
                  <tr>
                    <td colSpan="3" className="tableau-placeholder">
                      Tabel simpleks akan muncul di sini setelah masalah diselesaikan.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="solution-details">
            <div className="solution-panel">
              <h3>Detail Iterasi</h3>
              <div id="iteration-details" className="panel-content">
                <div className="detail-item">
                  <span className="detail-label">Iterasi ke:</span>
                  <span className="detail-value">-</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Variabel Masuk:</span>
                  <span className="detail-value">-</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Variabel Keluar:</span>
                  <span className="detail-value">-</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Elemen Pivot:</span>
                  <span className="detail-value">-</span>
                </div>
              </div>
            </div>

            <div className="solution-panel">
              <h3>Solusi Saat Ini</h3>
              <div id="current-solution" className="panel-content">
                <div className="detail-item">
                  <span className="detail-label">Nilai Fungsi Tujuan (Z):</span>
                  <span className="detail-value">-</span>
                </div>
                <div id="variable-values"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
