// src/pages/TheorySection.jsx

import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  Columns,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import '../assets/TheorySection.css'; // Tambahkan style khusus di sini

export default function TheorySection() {
  const [activeTab, setActiveTab] = useState('primal');
  const [expandedSections, setExpandedSections] = useState({
    primalIntro: true,
    primalAlgorithm: false,
    primalExample: false,
    primalOptimality: false,
    dualIntro: false,
    dualAlgorithm: false,
    dualExample: false,
    dualFeasibility: false,
    dualityIntro: false,
    dualityTransform: false,
    dualityExample: false,
    dualityTheorems: false,
  });

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <section id="theory-section" className="content-section">
      <div className="section-header">
        <h2>Teori Metode Simpleks</h2>
      </div>
      <div className="content-wrapper">
        {/* Tab Headers */}
        <div className="tabs">
          <div className="tab-headers">
            <div
              className={`tab-header ${activeTab === 'primal' ? 'active' : ''}`}
              onClick={() => setActiveTab('primal')}
            >
              <BookOpen size={16} className="tab-icon" /> Simpleks Primal
            </div>
            <div
              className={`tab-header ${activeTab === 'dual' ? 'active' : ''}`}
              onClick={() => setActiveTab('dual')}
            >
              <Layers size={16} className="tab-icon" /> Simpleks Dual
            </div>
            <div
              className={`tab-header ${activeTab === 'duality' ? 'active' : ''}`}
              onClick={() => setActiveTab('duality')}
            >
              <Columns size={16} className="tab-icon" /> Dualitas
            </div>
          </div>

          {/* ===== Primal Tab ===== */}
          <div
            className={`tab-content ${activeTab === 'primal' ? 'active' : ''}`}
            id="primal-theory"
          >
            <h3 className="tab-title">
              <BookOpen size={20} className="section-icon" /> Metode Simpleks Primal
            </h3>

            {/* 1. Pengantar */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('primalIntro')}
              >
                <h4>1. Pengantar</h4>
                {expandedSections.primalIntro ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.primalIntro && (
                <div className="section-body">
                  <p>
                    Metode <strong>Simpleks Primal</strong> adalah algoritma paling populer untuk
                    menyelesaikan masalah <em>Pemrograman Linear</em> (PL) dalam bentuk standar:
                  </p>
                  <pre className="code-block">
{`Maksimalkan: Z = c₁ x₁ + c₂ x₂ + ... + cₙ xₙ
Dengan kendala:
a₁₁ x₁ + a₁₂ x₂ + ... + a₁ₙ xₙ ≤ b₁
a₂₁ x₁ + a₂₂ x₂ + ... + a₂ₙ xₙ ≤ b₂
...
aₘ₁ x₁ + aₘ₂ x₂ + ... + aₘₙ xₙ ≤ bₘ
xⱼ ≥ 0, j = 1..n`}
                  </pre>
                  <p>
                    Langkah awalnya adalah menambahkan <em>variabel slack</em> (s₁, s₂, …, sₘ)
                    sehingga semua kendala menjadi persamaan (⇾ bentuk standar Simpleks):
                  </p>
                  <pre className="code-block">
{`a₁₁ x₁ + a₁₂ x₂ + ... + a₁ₙ xₙ + s₁ = b₁
a₂₁ x₁ + a₂₂ x₂ + ... + a₂ₙ xₙ + s₂ = b₂
...
aₘ₁ x₁ + aₘ₂ x₂ + ... + aₘₙ xₙ + sₘ = bₘ
xⱼ, sᵢ ≥ 0`}
                  </pre>
                  <p>
                    Setelah itu, kita susun <em>tabel Simpleks awal</em> dengan baris fungsi tujuan:
                  </p>
                  <pre className="code-block">
{`Z − c₁ x₁ − c₂ x₂ − ... − cₙ xₙ = 0`}
                  </pre>
                  dan baris‐baris kendala yang sudah berbentuk persamaan. Metode ini akan
                  mengiterasi hingga fungsi tujuan semuanya non‐negatif (untuk maks) → solusi optimal.
                  Visualisasinya menggunakan tabel/tata letak matriks (simplex tableau).
                </div>
              )}
            </div>

            {/* 2. Algoritma Primal */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('primalAlgorithm')}
              >
                <h4>2. Langkah‐Langkah Algoritma Simpleks Primal</h4>
                {expandedSections.primalAlgorithm ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.primalAlgorithm && (
                <div className="section-body">
                  <ol className="numbered-list">
                    <li>
                      <strong>Formulasi Standar</strong>
                      <ul className="bullet-list">
                        <li>
                          Tambahkan variabel slack sᵢ untuk kendala “≤”. Jika ada kendala “=” atau “≥”, gunakan variabel artifisial (Two‐Phase atau Big‐M).
                        </li>
                        <li>
                          Pastikan semua <code>bᵢ ≥ 0</code>. Jika ada <code>bᵢ &lt; 0</code>, kalikan baris tersebut dengan −1 (ubah tanda “≤ → ≥”).
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Susun Tabel Awal (Tableau)</strong>
                      <br />
                      Contoh struktur:
                      <table className="simplex-table">
                        <thead>
                          <tr>
                            <th>Basis</th>
                            <th>x₁</th>
                            <th>x₂</th>
                            <th>…</th>
                            <th>s₁</th>
                            <th>s₂</th>
                            <th>…</th>
                            <th>RHS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Z</td>
                            <td>−c₁</td>
                            <td>−c₂</td>
                            <td>…</td>
                            <td>0</td>
                            <td>0</td>
                            <td>…</td>
                            <td>0</td>
                          </tr>
                          <tr>
                            <td>s₁</td>
                            <td>a₁₁</td>
                            <td>a₁₂</td>
                            <td>…</td>
                            <td>1</td>
                            <td>0</td>
                            <td>…</td>
                            <td>b₁</td>
                          </tr>
                          <tr>
                            <td>s₂</td>
                            <td>a₂₁</td>
                            <td>a₂₂</td>
                            <td>…</td>
                            <td>0</td>
                            <td>1</td>
                            <td>…</td>
                            <td>b₂</td>
                          </tr>
                          {/* dst. */}
                        </tbody>
                      </table>
                    </li>
                    <li>
                      <strong>Pilih Kolom Entering (Variabel Masuk)</strong>
                      <ul className="bullet-list">
                        <li>
                          Untuk <em>maksimisasi</em>: pilih kolom dengan nilai <strong>negatif</strong> paling “besar” (paling kecil nilainya) di baris Z.
                        </li>
                        <li>
                          Jika tidak ada koefisien negatif, solusi sudah optimal.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Pilih Baris Leaving (Variabel Keluar)</strong>
                      <ul className="bullet-list">
                        <li>
                          Hitung rasio <code>RHS / (entry pada kolom entering)</code> hanya untuk baris‐baris yang entry‐nya positif.
                        </li>
                        <li>
                          Baris dengan rasio terkecil → pivot row (baris leaving).
                        </li>
                        <li>
                          Jika semua entry ≤ 0 di kolom entering, → masalah <em>unbounded</em> (tak terbatas).
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Pivot dan Operasi Baris</strong>
                      <ul className="bullet-list">
                        <li>
                          Normalisasi baris pivot: bagi seluruh elemen baris tersebut dengan pivot element hingga pivot menjadi 1.
                        </li>
                        <li>
                          Eliminasi kolom pivot di baris‐baris lain:  
                          <code>New Rowᵢ = Old Rowᵢ − (entryᵢ, pivotColumn) × Pivot Row</code>.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Ulangi</strong> langkah 3–5 hingga semua koefisien di baris Z ≥ 0 untuk maximisasi (atau ≤ 0 untuk minimisasi).
                    </li>
                    <li>
                      <strong>Interpretasi Hasil</strong>:  
                      Nilai Z optimal ada di kolom RHS baris Z. Nilai variabel dasar adalah nilai yang ada di kolom RHS untuk setiap baris basis, variabel non‐basis = 0.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* 3. Contoh Langkah‐d demi‐Langkah */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('primalExample')}
              >
                <h4>3. Contoh Soal dan Penyelesaian (Primal)</h4>
                {expandedSections.primalExample ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.primalExample && (
                <div className="section-body">
                  <p><strong>Soal:</strong></p>
                  <p>
                    Maksimalkan: <code>Z = 3x₁ + 2x₂</code><br />
                    s.t.<br />
                    <code> x₁ +  x₂ ≤ 4</code><br />
                    <code>2x₁ +  x₂ ≤ 5</code><br />
                    <code>x₁, x₂ ≥ 0</code>
                  </p>
                  <p><strong>Langkah 1: Tambahkan variabel slack</strong></p>
                  <pre className="code-block">
{`x₁ +  x₂ + s₁ = 4
2x₁ +  x₂ + s₂ = 5
x₁, x₂, s₁, s₂ ≥ 0`}
                  </pre>
                  <p><strong>Langkah 2: Susun tabel Simpleks awal</strong></p>
                  <table className="simplex-table">
                    <thead>
                      <tr>
                        <th>Basis</th>
                        <th>x₁</th>
                        <th>x₂</th>
                        <th>s₁</th>
                        <th>s₂</th>
                        <th>RHS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Z</td>
                        <td>-3</td>
                        <td>-2</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>s₁</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0</td>
                        <td>4</td>
                      </tr>
                      <tr>
                        <td>s₂</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0</td>
                        <td>1</td>
                        <td>5</td>
                      </tr>
                    </tbody>
                  </table>
                  <p><strong>Langkah 3: Pilih kolom entering</strong>  
                  (baris Z paling negatif: x₁ → −3 &gt; −2) → kolom <code>x₁</code>.</p>
                  <p><strong>Langkah 4: Hitung rasio</strong> (hanya baris dengan entry &gt; 0 di kolom x₁):
                    <br />Baris s₁: 4 / 1 = 4  
                    <br />Baris s₂: 5 / 2 = 2.5 (terkecil) → pivot row = s₂.
                  </p>
                  <p><strong>Langkah 5: Pivot (elemen 2)</strong></p>
                  <p>Bagi baris s₂ dengan 2 → jadikan pivot = 1:</p>
                  <pre className="code-block">
{`Baris s₂ baru: x₁ + 0.5 x₂ + 0 s₁ + 0.5 s₂ = 2.5`}
                  </pre>
                  <p>Kemudian eliminasi di baris lain:</p>
                  <ul className="bullet-list">
                    <li>
                      Baris Z baru = (Baris Z) – (−3) × (Baris s₂ baru)  
                      → nilai di Z: x₁: 0, x₂: −0.5, s₁: 0, s₂: 1.5, RHS: 7.5
                    </li>
                    <li>
                      Baris s₁ baru = (Baris s₁) – (1) × (Baris s₂ baru)  
                      → x₁: 0, x₂: 0.5, s₁: 1, s₂: −0.5, RHS: 1.5
                    </li>
                  </ul>
                  <p><strong>Hasil iterasi 1:</strong></p>
                  <table className="simplex-table">
                    <thead>
                      <tr>
                        <th>Basis</th>
                        <th>x₁</th>
                        <th>x₂</th>
                        <th>s₁</th>
                        <th>s₂</th>
                        <th>RHS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Z</td>
                        <td>0</td>
                        <td>-0.5</td>
                        <td>0</td>
                        <td>1.5</td>
                        <td>7.5</td>
                      </tr>
                      <tr>
                        <td>s₁</td>
                        <td>0</td>
                        <td>0.5</td>
                        <td>1</td>
                        <td>-0.5</td>
                        <td>1.5</td>
                      </tr>
                      <tr>
                        <td>x₁</td>
                        <td>1</td>
                        <td>0.5</td>
                        <td>0</td>
                        <td>0.5</td>
                        <td>2.5</td>
                      </tr>
                    </tbody>
                  </table>
                  <p><strong>Langkah 6:</strong>  
                    Pilih kolom entering (baris Z masih ada koefisien negatif: x₂ → −0.5) → kolom <code>x₂</code>.
                  </p>
                  <p><strong>Hitung rasio</strong> (baris dengan entry &gt; 0 di kolom x₂):
                    <br />Baris s₁: 1.5 / 0.5 = 3  
                    <br />Baris x₁: 2.5 / 0.5 = 5 → terkecil = 3 → pivot row = s₁.
                  </p>
                  <p><strong>Pivot (elemen 0.5 pada baris s₁, kolom x₂)</strong></p>
                  <p>Bagi baris s₁ dengan 0.5 → jadikan pivot = 1:</p>
                  <pre className="code-block">
{`Baris s₁ baru: 0 x₁ + x₂ + 2 s₁ - 1 s₂ = 3`}
                  </pre>
                  <p>Kemudian eliminasi di baris lain:</p>
                  <ul className="bullet-list">
                    <li>
                      Baris Z baru = Baris Z − (−0.5) × Baris s₁ baru  
                      → x₁=0, x₂=0, s₁=1, s₂=1, RHS=9
                    </li>
                    <li>
                      Baris x₁ baru = Baris x₁ − (0.5) × Baris s₁ baru  
                      → x₁=1, x₂=0, s₁=-1, s₂=1, RHS=1
                    </li>
                  </ul>
                  <p><strong>Iteration 2 (akhir):</strong></p>
                  <table className="simplex-table">
                    <thead>
                      <tr>
                        <th>Basis</th>
                        <th>x₁</th>
                        <th>x₂</th>
                        <th>s₁</th>
                        <th>s₂</th>
                        <th>RHS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Z</td>
                        <td>0</td>
                        <td>0</td>
                        <td>1</td>
                        <td>1</td>
                        <td>9</td>
                      </tr>
                      <tr>
                        <td>x₂</td>
                        <td>0</td>
                        <td>1</td>
                        <td>2</td>
                        <td>-1</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>x₁</td>
                        <td>1</td>
                        <td>0</td>
                        <td>-1</td>
                        <td>1</td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    Semua koefisien di baris Z sudah ≥ 0 → <strong>solusi optimal</strong> tercapai:  
                    <code>x₁ = 1, x₂ = 3, Z = 9</code>.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Kondisi Optimalitas */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('primalOptimality')}
              >
                <h4>4. Kondisi Optimalitas &amp; Penghentian</h4>
                {expandedSections.primalOptimality ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.primalOptimality && (
                <div className="section-body">
                  <ul className="bullet-list">
                    <li>
                      <strong>Masalah Maksimasi:</strong>  
                      Solusi optimal ketika tidak ada nilai negatif di baris Z (kecuali kolom RHS).
                    </li>
                    <li>
                      <strong>Masalah Minimasi:</strong>  
                      Solusi optimal ketika tidak ada nilai positif di baris Z (kecuali kolom RHS).
                    </li>
                    <li>
                      <strong>Tak Terbatas (Unbounded):</strong>  
                      Jika di suatu iterasi, kolom entering terpilih tetapi seluruh entri di kolom itu ≤ 0, 
                      artinya fungsi tujuan akan meningkat terus tanpa batas.
                    </li>
                    <li>
                      <strong>Degenerasi:</strong>  
                      Terjadi ketika rasio minimum sama untuk lebih dari satu baris (muncul nilai RHS = 0).  
                      Berisiko memunculkan <em>cycling</em>, sehingga kadang memerlukan aturan <em>anti‐cycling</em>.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ===== Dual Tab ===== */}
          <div
            className={`tab-content ${activeTab === 'dual' ? 'active' : ''}`}
            id="dual-theory"
          >
            <h3 className="tab-title">
              <Layers size={20} className="section-icon" /> Metode Simpleks Dual
            </h3>

            {/* 1. Pengantar Dual */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualIntro')}
              >
                <h4>1. Pengantar</h4>
                {expandedSections.dualIntro ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualIntro && (
                <div className="section-body">
                  <p>
                    Metode Simpleks Dual digunakan ketika <strong>solusi awal primal</strong> tidak layak—
                    misalnya ada nilai <code>bᵢ &lt; 0</code> setelah membentuk tabel awal.  
                    Daripada membuat solusi basis awal layak dengan <em>artificial variables</em>, 
                    kita bekerja langsung di sisi dual. Prinsipnya:
                  </p>
                  <ul className="bullet-list">
                    <li>
                      Tabel dual awal sudah memenuhi <em>kondisi optimalitas</em> (baris Z‐row semuanya ≥ 0).
                    </li>
                    <li>
                      Namun ada baris dengan <code>RHS &lt; 0</code> → jalankan iterasi dual untuk memperbaiki kelayakan.
                    </li>
                    <li>
                      Akhirnya, ketika semua <code>RHS ≥ 0</code> dan Z‐row tetap optimal, 
                      kita akan memperoleh solusi primal optimal secara tidak langsung.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Algoritma Dual */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualAlgorithm')}
              >
                <h4>2. Langkah‐Langkah Algoritma Simpleks Dual</h4>
                {expandedSections.dualAlgorithm ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualAlgorithm && (
                <div className="section-body">
                  <ol className="numbered-list">
                    <li>
                      <strong>Susun Tabel Dual Awal:</strong>  
                      Pastikan baris Z (fungsi tujuan) sudah <em>optimal</em> (semua koefisien ≥ 0) pada masalah maks.
                    </li>
                    <li>
                      <strong>Pilih Baris Leaving (RHS Negatif):</strong>  
                      Pilih baris mana pun yang <code>RHS &lt; 0</code> (ada variabel dasar yang tidak layak).
                    </li>
                    <li>
                      <strong>Pilih Kolom Entering Dual:</strong>  
                      Dari baris leaving tersebut, tentukan kolom j dengan rasio terkecil:
                      <br />
                      <code>
                        min {`{ (coefficient on Z‐row at column j) / (−aᵢⱼ) }`}  
                        untuk semua j di mana aᵢⱼ &lt; 0.
                      </code>
                    </li>
                    <li>
                      <strong>Pivot dan Operasi Baris:</strong>  
                      - Normalisasi baris leaving sehingga pivot element (negatif) menjadi 1 (bagi seluruh baris dengan −pivot).  
                      - Eliminasi pada kolom pivot di baris lain, serupa dengan metode primal.
                    </li>
                    <li>
                      <strong>Cek Kelayakan Selanjutnya:</strong>  
                      Ulangi 2–4 hingga semua <code>RHS ≥ 0</code>.
                    </li>
                    <li>
                      <strong>Akhir Iterasi:</strong>  
                      Karena baris Z selalu menahan kondisi optimalitas, saat semua <code>RHS ≥ 0</code>, 
                      kita telah mencapai solusi dual optimal. Nilai primal dapat dibaca langsung.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* 3. Contoh Dual */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualExample')}
              >
                <h4>3. Contoh Soal dan Penyelesaian (Dual)</h4>
                {expandedSections.dualExample ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualExample && (
                <div className="section-body">
                  <p><strong>Soal:</strong></p>
                  <p>
                    Misalkan kita punya Primal (setelah standarisasi):
                  </p>
                  <pre className="code-block">
{`Maksimalkan: Z = 2x₁ + 3x₂
dengan:
−x₁ +  x₂ ≤ 1
 x₁ − 2x₂ ≤ 2
x₁, x₂ ≥ 0`}
                  </pre>
                  <p>
                    Karena ada koefisien negatif (−x₁) → bentuk ulang:
                  </p>
                  <pre className="code-block">
{`Maksimalkan: Z = 2x₁ + 3x₂
dengan:
−x₁ +  x₂ + s₁ = 1
 x₁ − 2x₂ + s₂ = 2
x₁, x₂, s₁, s₂ ≥ 0`}
                  </pre>
                  <p>
                    Namun baris pertama memiliki <code>RHS = 1</code> tetapi koefisien pada x₁ = −1 (sehingga basis awal belum layak primal). 
                    Kita pakai metode <em>simpleks dual</em> karena baris Z sudah <code>(−2, −3)</code> yang artinya koefisien Z‐row sudah positif untuk dual (maksimasi dual), jadi fungsi tujuan dual sudah “optimal”.
                  </p>
                  <p><strong>Susun Tabel Dual Awal:</strong></p>
                  <table className="simplex-table">
                    <thead>
                      <tr>
                        <th>Basis</th>
                        <th>x₁</th>
                        <th>x₂</th>
                        <th>s₁</th>
                        <th>s₂</th>
                        <th>RHS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Z</td>
                        <td>2</td>
                        <td>3</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                      </tr>
                      <tr>
                        <td>s₁</td>
                        <td>-1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0</td>
                        <td>1</td>
                      </tr>
                      <tr>
                        <td>s₂</td>
                        <td>1</td>
                        <td>-2</td>
                        <td>0</td>
                        <td>1</td>
                        <td>2</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    Perhatikan baris <code>s₁</code> (RHS=1 &gt;0, tapi koefisien x₁=−1) → primal belum layak → pakai dual.
                  </p>
                  <p><strong>Langkah 1: Pilih Baris Leaving (RHS negatif)?</strong></p>
                  <ul className="bullet-list">
                    <li>
                      Di sini semua <code>RHS ≥ 0</code>, jadi dual awal sudah feasible (kita tidak memerlukan iterasi untuk membuat RHS≥0).
                    </li>
                  </ul>
                  <p><strong>Langkah 2: Cek Optimalitas Dual (Z‐row ≥ 0)?</strong></p>
                  <ul className="bullet-list">
                    <li>
                      Baris Z: (2, 3) semuanya ≥ 0 → sudah optimal untuk dual.
                    </li>
                  </ul>
                  <p><strong>Kesimpulan:</strong>  
                    Karena dual sudah feasible dan optimal, maka primal memiliki solusi optimal. 
                    Nilai variabel dasar dual → nilai primal:
                  </p>
                  <ul className="bullet-list">
                    <li><code>s₁ = 1</code> adalah variabel basis → di primal, <code>x₁</code> non‐basis = 0.</li>
                    <li><code>s₂ = 2</code> → di primal, <code>x₂</code> non‐basis = 0.</li>
                    <li><strong>Nilai Z primal = nilai RHS baris Z dual = 0?</strong>  
                      <br />Karena di primal kita sebenarnya belum memindahkan koefisien lengkap, sering kali kita lakukan iterasi dual untuk memperbaiki nilai RHS yang sebenarnya <em>negatif</em>. 
                      Tetapi karena model sederhana ini Z‐row sudah positif, berujung pada <em>primal feasibel dengan x₁ = 0, x₂ = 0, Z = 0</em>.
                    </li>
                  </ul>
                  <p>
                    Jika ingin memaksa iterasi dual (misalnya jika RHS ada yang negatif), gunakan langkah‐langkah pivot dual seperti yang diuraikan sebelumnya.
                  </p>
                </div>
              )}
            </div>

            {/* 4. Kondisi Kelayakan Dual */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualFeasibility')}
              >
                <h4>4. Kondisi Kelayakan &amp; Terminasi (Dual)</h4>
                {expandedSections.dualFeasibility ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualFeasibility && (
                <div className="section-body">
                  <ul className="bullet-list">
                    <li>
                      <strong>Feasible Dual:</strong> Semua <code>RHS ≥ 0</code> dan baris Z ≥ 0 (untuk maks).
                    </li>
                    <li>
                      <strong>Infeasible Dual → Primal Unbounded:</strong>  
                      Jika ada baris dengan <code>RHS &lt; 0</code> tetapi seluruh entri di baris itu ≥ 0 
                      → tidak ada solusi dual → primal tak terbatas.
                    </li>
                    <li>
                      <strong>Degenerasi Dual:</strong> Sama seperti primal, jika pivot ratio(s) sama, 
                      bisa terjadi degenerasi (di beberapa langkah, <code>RHS</code> menjadi 0).
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ===== Dualitas Tab ===== */}
          <div
            className={`tab-content ${activeTab === 'duality' ? 'active' : ''}`}
            id="duality-theory"
          >
            <h3 className="tab-title">
              <Columns size={20} className="section-icon" /> Dualitas dalam PL
            </h3>

            {/* 1. Pengantar Dualitas */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualityIntro')}
              >
                <h4>1. Pengantar Dualitas</h4>
                {expandedSections.dualityIntro ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualityIntro && (
                <div className="section-body">
                  <p>
                    Dalam <em>Pemrograman Linear</em>, setiap <strong>masalah primal</strong> (P) akan mempunyai <strong>masalah dual</strong> (D).  
                    Hubungannya:
                  </p>
                  <ul className="bullet-list">
                    <li>
                      Nilai fungsi tujuan dual (W) selalu ≥ nilai fungsi tujuan primal (Z) untuk setiap solusi feasibel (Lemma Dualitas Lemah).
                    </li>
                    <li>
                      Jika ada solusi optimal terbatas di salah satu, maka yang lain juga memiliki solusi terbatas dengan <strong>Z* = W*</strong> (Teorema Dualitas Kuat).
                    </li>
                    <li>
                      Hubungan komplementaritas:
                      <br />&nbsp;&nbsp;&nbsp;Jika <code>xⱼ* &gt; 0</code> di primal, maka
                      kendala dual ke‐j “ketat” (equality).  
                      <br />&nbsp;&nbsp;&nbsp;Jika <code>yᵢ* &gt; 0</code> di dual, maka
                      kendala primal ke‐i “ketat”.
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* 2. Transformasi Primal→Dual */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualityTransform')}
              >
                <h4>2. Transformasi Primal ke Dual</h4>
                {expandedSections.dualityTransform ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualityTransform && (
                <div className="section-body">
                  <p>
                    Misalkan Primal dalam bentuk standar:  
                  </p>
                  <pre className="code-block">
{`Maksimalkan: Z = c₁ x₁ + c₂ x₂ + ... + cₙ xₙ
dengan kendala:
a₁₁ x₁ + a₁₂ x₂ + ... + a₁ₙ xₙ ≤ b₁
...
aₘ₁ x₁ + aₘ₂ x₂ + ... + aₘₙ xₙ ≤ bₘ
xⱼ ≥ 0`}
                  </pre>
                  <p><strong>Bentuk Dualnya:</strong></p>
                  <ul className="bullet-list">
                    <li>
                      Fungsi tujuan Dual (minimasi):  
                      <code>Min W = b₁ y₁ + b₂ y₂ + ... + bₘ yₘ</code>
                    </li>
                    <li>
                      Setiap koefisien <code>aᵢⱼ</code> di Primal menjadi koefisien 
                      di kendala <code>∑ aᵢⱼ yᵢ ≥ cⱼ</code> di Dual.
                    </li>
                    <li>
                      Tanda kendala berbalik: “≤” di primal → “≥” di dual;  
                      “≥” di primal → “≤” di dual.
                    </li>
                    <li>
                      Jika Primal variabel ≥ 0, maka Dual variabel ≥ 0.
                    </li>
                  </ul>
                  <p><strong>Tabel Singkat Transformasi:</strong></p>
                  <div className="duality-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Primal</th>
                          <th>Dual</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Bentuk Fungsi</strong><br />Maks &rarr; Min</td>
                          <td><strong>Bentuk Fungsi</strong><br />Min &rarr; Maks</td>
                        </tr>
                        <tr>
                          <td><strong>Kendala</strong><br />≤</td>
                          <td><strong>Kendala</strong><br />≥</td>
                        </tr>
                        <tr>
                          <td><strong>Kendala</strong><br />≥</td>
                          <td><strong>Kendala</strong><br />≤</td>
                        </tr>
                        <tr>
                          <td><strong>RHS</strong><br />bᵢ</td>
                          <td><strong>Koefisien</strong><br />cⱼ</td>
                        </tr>
                        <tr>
                          <td><strong>Koefisien</strong><br />cⱼ</td>
                          <td><strong>RHS</strong><br />bᵢ</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Contoh Transformasi */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualityExample')}
              >
                <h4>3. Contoh Transformasi Primal→Dual</h4>
                {expandedSections.dualityExample ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualityExample && (
                <div className="section-body two-column">
                  <div className="column">
                    <h5>Masalah Primal</h5>
                    <pre className="code-block">
{`Maksimalkan: Z = 5x₁ + 3x₂ + 2x₃
dengan:
x₁ +  x₂ + 2x₃ ≤ 10
2x₁ + x₂ +  x₃ ≤ 8
 x₁ + 2x₂ + 3x₃ ≤ 15
xⱼ ≥ 0`}
                    </pre>
                  </div>
                  <div className="column">
                    <h5>Masalah Dual</h5>
                    <pre className="code-block">
{`Minimalkan: W = 10y₁ + 8y₂ + 15y₃
dengan:
y₁ +  2y₂ +  y₃ ≥ 5
y₁ +  y₂ + 2y₃ ≥ 3
2y₁ + y₂ + 3y₃ ≥ 2
yᵢ ≥ 0`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Teorema Dualitas */}
            <div className="theory-section">
              <div
                className="accordion-toggle"
                onClick={() => toggleSection('dualityTheorems')}
              >
                <h4>4. Teorema Dualitas</h4>
                {expandedSections.dualityTheorems ? (
                  <ChevronUp size={20} className="chevron-icon" />
                ) : (
                  <ChevronDown size={20} className="chevron-icon" />
                )}
              </div>
              {expandedSections.dualityTheorems && (
                <div className="section-body">
                  <ul className="bullet-list">
                    <li>
                      <strong>Lemma Dualitas Lemah:</strong>  
                      Untuk setiap solusi feasibel <code>x</code> di Primal dan <code>y</code> di Dual,
                      <br />
                      <code>Z(x) ≤ W(y)</code> (primal maks ≤ dual min).
                    </li>
                    <li>
                      <strong>Teorema Dualitas Kuat:</strong>  
                      Jika Primal punya solusi optimal terbatas, maka Dual juga mempunyai solusi optimal terbatas, dan
                      <br />
                      <code>Z* = W*</code>.
                    </li>
                    <li>
                      <strong>Teorema Kelengkapan (Komplementaritas):</strong>  
                      - Jika <code>xⱼ* &gt; 0</code> → kendala Dual ke‐j menjadi “=” (binding).  
                      - Jika <code>yᵢ* &gt; 0</code> → kendala Primal ke‐i menjadi “=” (binding).
                    </li>
                    <li>
                      <strong>Aplikasi:</strong>  
                      - Menentukan <em>harga bayangan</em> (shadow price).  
                      - Analisis sensitivitas: efek perubahan <code>bᵢ</code> terhadap nilai Z*.  
                      - Memecahkan Primal tak layak dengan memeriksa Dual.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
