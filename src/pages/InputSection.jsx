// src/pages/InputSection.jsx
import React, { useState } from 'react'

export default function InputSection() {
  const [numVariables, setNumVariables] = useState(2)
  const [numConstraints, setNumConstraints] = useState(2)
  const [showForm, setShowForm] = useState(false)

  // Handler untuk tombol “Buat Form”
  const handleGenerateForm = () => {
    setShowForm(true)
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
              <input type="radio" name="method" value="primal" defaultChecked />
              <span className="option-label">Metode Simpleks Primal</span>
              <span className="option-description">Gunakan jika semua nilai RHS (b) non-negatif dan Anda memiliki solusi awal yang layak</span>
            </label>
            <label className="method-option">
              <input type="radio" name="method" value="dual" />
              <span className="option-label">Metode Simpleks Dual</span>
              <span className="option-description">Gunakan jika semua koefisien fungsi tujuan (c) memenuhi kondisi optimalitas, tetapi solusi belum layak</span>
            </label>
          </div>
        </div>

        <div className="problem-type">
          <h3>Tipe Masalah</h3>
          <div className="problem-options">
            <label>
              <input type="radio" name="objective" value="max" defaultChecked />
              <span>Maksimasi</span>
            </label>
            <label>
              <input type="radio" name="objective" value="min" />
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
            <button id="generate-form" className="btn primary" onClick={handleGenerateForm}>
              Buat Form
            </button>
          </div>
        </div>

        {showForm && (
          <form id="linear-program-form">
            <div className="form-section objective-function">
              <h3>Fungsi Tujuan</h3>
              <div className="objective-container">
                <span id="objective-type">Maksimumkan</span> Z =
                <div id="objective-coefficients">
                  {/* Bisa di-generate dinamis berdasarkan numVariables */}
                  {[...Array(numVariables)].map((_, idx) => (
                    <input key={idx} type="number" placeholder={`c${idx + 1}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section constraints">
              <h3>Batasan</h3>
              <div id="constraints-container">
                {[...Array(numConstraints)].map((_, barisIdx) => (
                  <div key={barisIdx} className="constraint-row">
                    {Array(numVariables)
                      .fill(null)
                      .map((__, kolomIdx) => (
                        <input key={kolomIdx} type="number" placeholder={`a${barisIdx + 1}${kolomIdx + 1}`} />
                      ))}
                    <select>
                      <option value="≤">≤</option>
                      <option value="=">=</option>
                      <option value="≥">≥</option>
                    </select>
                    <input type="number" placeholder={`b${barisIdx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-controls">
              <button type="button" id="solve-button" className="btn primary">
                Selesaikan
              </button>
              <button type="button" id="reset-button" className="btn secondary">
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
