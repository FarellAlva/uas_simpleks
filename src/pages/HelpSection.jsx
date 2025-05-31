// src/pages/HelpSection.jsx

import React, { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import '../assets/HelpSection.css' // nanti buat file CSS ini

export default function HelpSection() {
  const [activeAccordion, setActiveAccordion] = useState(null)

  const faqItems = [
    {
      question: 'Kapan sebaiknya menggunakan metode simpleks primal?',
      answer: (
        <ul className="faq-list">
          <li>Semua nilai RHS (b) non-negatif</li>
          <li>Tersedia solusi basis awal yang layak</li>
          <li>Masalah dalam bentuk standar (umumnya batasan ≤ untuk maksimasi atau ≥ untuk minimasi setelah diubah ke maksimasi)</li>
        </ul>
      ),
    },
    {
      question: 'Kapan sebaiknya menggunakan metode simpleks dual?',
      answer: (
        <ul className="faq-list">
          <li>Semua koefisien pada baris fungsi tujuan memenuhi kondisi optimalitas (misalnya, ≥ 0 untuk maksimasi)</li>
          <li>Solusi belum layak (ada nilai RHS yang negatif pada tabel awal setelah standarisasi)</li>
          <li>Sering digunakan dalam analisis sensitivitas atau ketika menambahkan batasan baru ke masalah yang sudah optimal</li>
        </ul>
      ),
    },
    {
      question: 'Bagaimana menangani batasan \'=\' dalam simpleks?',
      answer: (
        <p className="faq-paragraph">
          Untuk batasan '=', biasanya kita menggunakan <strong>variabel artifisial</strong> dan metode <strong>Big M</strong> atau <strong>Two‐Phase</strong> untuk mendapatkan solusi basis awal yang layak jika metode simpleks primal standar digunakan. Aplikasi ini (tergantung implementasi <code>simplex.js</code> Anda) diharapkan dapat menangani transformasi yang diperlukan atau memandu Anda.
        </p>
      ),
    },
    {
      question: 'Apakah aplikasi dapat menangani masalah yang tidak memiliki solusi?',
      answer: (
        <ul className="faq-list">
          <li>Tidak memiliki solusi layak (Infeasible)</li>
          <li>Memiliki solusi tak terbatas (Unbounded)</li>
          <li>Memiliki solusi optimal ganda (Multiple Optimal Solutions)</li>
          <li>Mengalami degenerasi</li>
        </ul>
      ),
    },
  ]

  return (
    <section id="help-section" className="help-section content-section">
      <div className="section-header">
        <h2>Bantuan</h2>
      </div>

      <div className="content-wrapper">
        {/* Container utama untuk kartu-kartu bantuan */}
        <div className="help-container">
          {/* Kartu: Cara Menggunakan Aplikasi */}
          <article className="help-card usage-card">
            <h3 className="card-title">Cara Menggunakan Aplikasi</h3>
            <ol className="usage-list">
              <li>Pilih metode penyelesaian (Primal atau Dual) pada halaman <em>Input Masalah</em>.</li>
              <li>Tentukan tipe masalah (Maksimasi atau Minimasi).</li>
              <li>Masukkan jumlah variabel dan batasan.</li>
              <li>Klik <strong>"Buat Form"</strong> untuk menghasilkan form input.</li>
              <li>Masukkan koefisien fungsi tujuan dan batasan.</li>
              <li>Pilih tipe batasan untuk setiap baris (≤, =, ≥).</li>
              <li>Klik <strong>"Selesaikan"</strong> untuk melihat langkah‐langkah penyelesaian di halaman <em>Penyelesaian</em>.</li>
              <li>Gunakan tombol navigasi pada halaman <em>Penyelesaian</em> untuk melihat setiap iterasi.</li>
              <li>Jelajahi tab <em>Teori</em>, <em>Contoh Soal</em>, dan <em>Bantuan</em> untuk informasi lebih lanjut.</li>
            </ol>
          </article>

          {/* Kartu: FAQ */}
          <article className="help-card faq-card">
            <h3 className="card-title">FAQ</h3>
            <div className="accordion">
              {faqItems.map((item, idx) => (
                <div
                  className={`accordion-item ${
                    activeAccordion === idx ? 'expanded' : ''
                  }`}
                  key={idx}
                >
                  <button
                    className="accordion-header"
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === idx ? null : idx
                      )
                    }
                    aria-expanded={activeAccordion === idx}
                    aria-controls={`faq-content-${idx}`}
                    id={`faq-header-${idx}`}
                  >
                    <span className="question-text">{item.question}</span>
                    <span className="icon-wrapper">
                      {activeAccordion === idx ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </span>
                  </button>
                  <div
                    id={`faq-content-${idx}`}
                    className="accordion-content"
                    role="region"
                    aria-labelledby={`faq-header-${idx}`}
                  >
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* Kartu: Istilah Penting */}
          <article className="help-card terms-card">
            <h3 className="card-title">Istilah Penting</h3>
            <dl className="terms-list">
              <div className="term-item">
                <dt className="term">Variabel Basis</dt>
                <dd className="definition">
                  Variabel yang nilainya bukan nol (umumnya positif) dalam solusi saat ini dan membentuk bagian dari matriks basis.
                </dd>
              </div>
              <div className="term-item">
                <dt className="term">Variabel Non-Basis</dt>
                <dd className="definition">
                  Variabel yang nilainya diatur menjadi nol dalam solusi saat ini.
                </dd>
              </div>
              <div className="term-item">
                <dt className="term">Elemen Pivot</dt>
                <dd className="definition">
                  Elemen pada tabel simpleks yang berada di perpotongan kolom variabel masuk (entering variable) dan baris variabel keluar (leaving variable). Digunakan untuk operasi baris elementer.
                </dd>
              </div>
              <div className="term-item">
                <dt className="term">Entering Variable (Variabel Masuk)</dt>
                <dd className="definition">
                  Variabel non-basis yang dipilih untuk menjadi variabel basis pada iterasi berikutnya karena berpotensi meningkatkan nilai fungsi tujuan (pada maksimasi).
                </dd>
              </div>
              <div className="term-item">
                <dt className="term">Leaving Variable (Variabel Keluar)</dt>
                <dd className="definition">
                  Variabel basis yang dipilih untuk menjadi variabel non-basis pada iterasi berikutnya untuk menjaga kelayakan solusi.
                </dd>
              </div>
              <div className="term-item">
                <dt className="term">Solusi Degenerasi</dt>
                <dd className="definition">
                  Solusi di mana satu atau lebih variabel basis memiliki nilai nol. Dapat menyebabkan cycling dalam algoritma simpleks.
                </dd>
              </div>
              <div className="term-item">
                <dt className="term">Solusi Tak Terbatas (Unbounded)</dt>
                <dd className="definition">
                  Kondisi di mana fungsi tujuan dapat ditingkatkan (atau diturunkan pada minimasi) tanpa batas tanpa melanggar batasan.
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  )
}
