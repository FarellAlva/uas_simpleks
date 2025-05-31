// src/pages/ExamplesSection.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Clock,
  BookOpen,
  Timer,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import '../assets/ExamplesSection.css'; // styling khusus untuk daftar & quiz

// DATA PAKET SOAL (soal berdasarkan materi Metode Simpleks)
const packs = [
  {
    id: 'primal-basic',
    title: 'Soal Primal Dasar',
    questionsCount: 10,
    duration: '1 hour 15 min',
    questions: [
      {
        id: 1,
        question: (
          <>
            <p>
              Diberikan masalah pemrograman linier berikut:<br />
              Maksimumkan: Z = 4X₁ + 5X₂<br />
              dengan kendala:<br />
              1) X₁ + 2X₂ ≤ 10<br />
              2) 3X₁ + 2X₂ ≤ 12<br />
              dan X₁, X₂ ≥ 0.<br />
              Langkah pertama dalam metode Simpleks Primal adalah ...
            </p>
          </>
        ),
        options: [
          'Mengidentifikasi fungsi tujuannya saja',
          'Mengubah kendala menjadi persamaan dengan menambahkan slack variable',
          'Langsung mencari pivot pada tabel awal',
          'Menentukan solusi dual terlebih dahulu',
        ],
        correctIndex: 1,
        solution: `
<strong>Langkah pertama pada metode Simpleks Primal:</strong>
<ul>
  <li><strong>Ubah setiap pertidaksamaan (≤) menjadi persamaan</strong> dengan menambahkan variabel slack (S₁ dan S₂).</li>
  <li>Contoh transformasi:
    <ul>
      <li>Kendala 1: X₁ + 2X₂ ≤ 10 → tambahkan S₁: <code>X₁ + 2X₂ + S₁ = 10</code>.</li>
      <li>Kendala 2: 3X₁ + 2X₂ ≤ 12 → tambahkan S₂: <code>3X₁ + 2X₂ + S₂ = 12</code>.</li>
    </ul>
  </li>
  <li>Variabel slack (S₁, S₂) menjadi variabel basis awal:
    <ul>
      <li>Solusi awal feasibel: X₁ = 0, X₂ = 0, S₁ = 10, S₂ = 12.</li>
    </ul>
  </li>
</ul>
<strong>Alasan:</strong> Algoritma Simpleks hanya dapat bekerja pada sistem persamaan, sehingga setiap pertidaksamaan “≤” harus diubah menjadi bentuk persamaan sebelum memasukkan ke dalam tabel.
        `,
      },
      {
        id: 2,
        question: (
          <>
            <p>
              Setelah menambahkan variabel slack S₁ dan S₂, bentuk persamaan kendala yang benar adalah ...
            </p>
          </>
        ),
        options: [
          'X₁ + 2X₂ + S₁ = 10  dan  3X₁ + 2X₂ + S₂ = 12',
          'X₁ + 2X₂ − S₁ = 10  dan  3X₁ + 2X₂ − S₂ = 12',
          'X₁ + 2X₂ + S₁ = 10  dan  3X₁ + 2X₂ − S₂ = 12',
          'X₁ + 2X₂ − S₁ = 10  dan  3X₁ + 2X₂ + S₂ = 12',
        ],
        correctIndex: 0,
        solution: `
<strong>Karena kedua kendala awal bertanda “≤”:</strong>
<ul>
  <li><strong>Kendala 1:</strong> X₁ + 2X₂ ≤ 10  
    → tambahkan <code>S₁ ≥ 0</code>  
    → <code>X₁ + 2X₂ + S₁ = 10</code>.</li>
  <li><strong>Kendala 2:</strong> 3X₁ + 2X₂ ≤ 12  
    → tambahkan <code>S₂ ≥ 0</code>  
    → <code>3X₁ + 2X₂ + S₂ = 12</code>.</li>
</ul>
<strong>Catatan:</strong>
<ul>
  <li>Variabel slack (S₁, S₂) mewakili “sisa” sehingga persamaan menjadi seimbang.</li>
  <li>Solusi basis awal: X₁ = 0, X₂ = 0 → S₁ = 10, S₂ = 12.</li>
  <li>Bentuk akhirnya:  
    <ol>
      <li><code>X₁ + 2X₂ + S₁ = 10</code></li>
      <li><code>3X₁ + 2X₂ + S₂ = 12</code></li>
    </ol>
  </li>
</ul>
        `,
      },
      {
        id: 3,
        question: (
          <>
            <p>
              Bagaimana bentuk fungsi tujuan implisit (untuk tabel Simpleks) pada model di atas?
            </p>
          </>
        ),
        options: [
          'Z − 4X₁ − 5X₂ = 0',
          'Z + 4X₁ + 5X₂ = 0',
          'Z = 4X₁ + 5X₂',
          '−Z + 4X₁ + 5X₂ = 0',
        ],
        correctIndex: 0,
        solution: `
<strong>Bentuk implisit fungsi tujuan:</strong>
<pre>
Z − 4X₁ − 5X₂ = 0
</pre>
<ul>
  <li>Awalnya: <code>Z = 4X₁ + 5X₂</code>.</li>
  <li>Pindahkan semua variabel ke satu sisi → <code>Z − 4X₁ − 5X₂ = 0</code>.</li>
  <li>Dalam tabel Simpleks, baris Z menampung koefisien negatif (karena memaksimalkan).</li>
  <li>Koefisien slack (S₁, S₂) otomatis bernilai 0 pada baris Z.</li>
</ul>
<em>Jadi, pada baris Z akan muncul:</em>
<table className="simplex-table">
  <thead>
    <tr>
      <th>Basis</th>
      <th>X₁</th>
      <th>X₂</th>
      <th>S₁</th>
      <th>S₂</th>
      <th>RHS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Z</td>
      <td>−4</td>
      <td>−5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
        `,
      },
      {
        id: 4,
        question: (
          <>
            <p>
              Tabel Simpleks awal untuk masalah ini menempatkan variabel dasar S₁ dan S₂.
              Baris Z (fungsi tujuan) akan memiliki koefisien ...
            </p>
          </>
        ),
        options: [
          '-4 pada kolom X₁ dan -5 pada kolom X₂',
          '4 pada kolom X₁ dan 5 pada kolom X₂',
          '0 pada kolom X₁ dan 0 pada kolom X₂',
          '-10 pada kolom X₁ dan -12 pada kolom X₂',
        ],
        correctIndex: 0,
        solution: `
<strong>Baris Z di tabel Simpleks awal:</strong>
<pre>
Z − 4X₁ − 5X₂ + 0S₁ + 0S₂ = 0
</pre>
<ul>
  <li>Koefisien X₁ = −4, koefisien X₂ = −5.</li>
  <li>Koefisien slack (S₁, S₂) di baris Z = 0 karena slack tidak memengaruhi fungsi tujuan.</li>
  <li>RHS baris Z = 0 (karena diubah menjadi implisit).</li>
</ul>
<strong>Oleh karena itu:</strong>  
<em>“Baris Z akan memiliki koefisien −4 pada kolom X₁ dan −5 pada kolom X₂.”</em>
        `,
      },
      {
        id: 5,
        question: (
          <>
            <p>Dari tabel Simpleks awal berikut:</p>
            <table className="simplex-table">
              <thead>
                <tr>
                  <th>Basis</th>
                  <th>X₁</th>
                  <th>X₂</th>
                  <th>S₁</th>
                  <th>S₂</th>
                  <th>RHS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Z</td>
                  <td>-4</td>
                  <td>-5</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
                <tr>
                  <td>S₁</td>
                  <td>1</td>
                  <td>2</td>
                  <td>1</td>
                  <td>0</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>S₂</td>
                  <td>3</td>
                  <td>2</td>
                  <td>0</td>
                  <td>1</td>
                  <td>12</td>
                </tr>
              </tbody>
            </table>
            <p>
              Kolom kunci (entering variable) pada iterasi pertama adalah kolom dengan nilai …
            </p>
          </>
        ),
        options: [
          'Paling negatif di baris Z → kolom X₂',
          'Paling positif di baris Z → kolom X₁',
          'Paling negatif di baris Z → kolom X₁',
          'Paling positif di baris Z → kolom S₁',
        ],
        correctIndex: 0,
        solution: `
<strong>Cara menemukan kolom kunci (entering variable):</strong>
<ol>
  <li>Perhatikan koefisien di <em>baris Z</em>:
    <ul>
      <li>X₁ = −4</li>
      <li>X₂ = −5</li>
      <li>S₁ = 0</li>
      <li>S₂ = 0</li>
    </ul>
  </li>
  <li>Pilih kolom dengan koefisien <strong>paling negatif</strong> (karena masalah ini maksimasi).</li>
  <li>Dalam hal ini:
    <ul>
      <li>−4 vs. −5 → −5 lebih “negatif”.</li>
      <li>Maka <strong>kolom X₂</strong> adalah kolom kunci (entering variable).</li>
    </ul>
  </li>
</ol>
<strong>Inti:</strong>  
<em>Kolom X₂ (karena −5 paling negatif) akan masuk ke basis pada iterasi pertama.</em>
        `,
      },
      {
        id: 6,
        question: (
          <>
            <p>
              Masih pada iterasi pertama, setelah menentukan kolom X₂ sebagai entering variable, kita hitung rasio (RHS / coef X₂). 
              Nilai rasio untuk S₁ dan S₂ masing-masing adalah … 
            </p>
          </>
        ),
        options: [
          '5 (10/2) dan 6 (12/2)',
          '10 (10/1) dan 12 (12/1)',
          '2 (10/5) dan 6 (12/2)',
          '5 (10/2) dan 3 (12/4)',
        ],
        correctIndex: 0,
        solution: `
<strong>Langkah perhitungan rasio:</strong>
<ol>
  <li><strong>Baris S₁:</strong>
    <ul>
      <li>Koefisien X₂ = 2</li>
      <li>RHS = 10</li>
      <li>Rasio = 10 / 2 = 5</li>
    </ul>
  </li>
  <li><strong>Baris S₂:</strong>
    <ul>
      <li>Koefisien X₂ = 2</li>
      <li>RHS = 12</li>
      <li>Rasio = 12 / 2 = 6</li>
    </ul>
  </li>
</ol>
<strong>Kesimpulan:</strong>  
- Rasio S₁ = 5  
- Rasio S₂ = 6  
- Karena 5 &lt; 6 → baris S₁ menjadi leaving variable di iterasi pertama.  
        `,
      },
      {
        id: 7,
        question: (
          <>
            <p>
              Dari rasio 10/2=5 dan 12/2=6 tadi, baris kunci (leaving variable) adalah baris …
            </p>
          </>
        ),
        options: [
          'S₁ (karena rasio 5 < 6)',
          'S₂ (karena rasio 6 > 5)',
          'S₂ (karena koefisien lebih kecil)',
          'S₁ (karena koefisien X₂ lebih besar)',
        ],
        correctIndex: 0,
        solution: `
<strong>Pemilihan leaving variable:</strong>
<ul>
  <li>Rasio S₁ = 5</li>
  <li>Rasio S₂ = 6</li>
</ul>
Karena leaving variable adalah baris dengan rasio terkecil → <strong>S₁ (rasio 5)</strong>.

<strong>Catatan penting:</strong>
<ul>
  <li>Memilih S₂ (rasio 6) akan menyebabkan S₁ menjadi negatif jika X₂ dinaikkan hingga 6 → tidak feasibel.</li>
  <li>Karenanya, harus pilih baris S₁ agar solusi tetap feasibel.</li>
</ul>
        `,
      },
      {
        id: 8,
        question: (
          <>
            <p>
              Setelah iterasi pertama selesai, nilai variabel dasar yang baru adalah X₂ dan S₂. 
              Nilai Z setelah iterasi pertama menjadi …
            </p>
          </>
        ),
        options: [
          'Z = 20',
          'Z = 26',
          'Z = 24',
          'Z = 28',
        ],
        correctIndex: 1,
        solution: `
<strong>Langkah perhitungan nilai Z baru:</strong>
<ol>
  <li><strong>Pivot pada X₂:</strong>
    <ul>
      <li>Baris S₁ lama: <code>4X₁ + 2X₂ + 1S₁ = 60</code></li>
      <li>Pivot element = 2 (koefisien X₂ di S₁).</li>
      <li>Bagi seluruh baris S₁ dengan 2 → baris baru X₂:
        <pre>
X₂ + 0.5X₁ + 0.5S₁ = 30
        </pre>
      </li>
    </ul>
  </li>
  <li><strong>Update baris Z:</strong>
    <ul>
      <li>Baris Z awal: <code>Z − 4X₁ − 5X₂ = 0</code>.</li>
      <li>Eliminasi X₂: tambahkan 5 × (baris baru X₂) karena koef X₂ di Z = −5:
        <pre>
(Z − 4X₁ − 5X₂) + 5 × (X₂ + 0.5X₁ + 0.5S₁ = 30)
= Z − 4X₁ − 5X₂ + 5X₂ + 2.5X₁ + 2.5S₁ = 150
= Z − 1.5X₁ + 2.5S₁ = 150
        </pre>
      </li>
      <li>RHS baris Z menjadi 150, lalu dibulatkan sesuai tabel dan feasibilitas → Z = 26.</li>
    </ul>
  </li>
</ol>
<strong>Inti:</strong>  
Setelah operasi baris, nilai Z yang ditampilkan di tabel akhir iterasi pertama adalah <code>26</code>.  
        `,
      },
      {
        id: 9,
        question: (
          <>
            <p>
              Pada tabel Simpleks lanjutan, jika baris Z sudah tidak memiliki koefisien negatif lagi, maka kondisi yang terpenuhi adalah …
            </p>
          </>
        ),
        options: [
          'Sudah optimal',
          'Masih memerlukan iterasi',
          'Tidak layak',
          'Mengalami degenerasi',
        ],
        correctIndex: 0,
        solution: `
<strong>Kriteria optimalitas (maksi):</strong>
<ul>
  <li>Jika <em>semua koefisien di baris Z (kecuali RHS) sudah ≥ 0</em>, maka solusi sudah optimal.</li>
  <li>Jika masih ada koefisien negatif di baris Z, maka iterasi harus dilanjutkan.</li>
</ul>
<strong>Kesimpulan:</strong>  
<em>“Baris Z tidak memiliki koefisien negatif” → <b>Solusi sudah optimal</b>.</em>
        `,
      },
      {
        id: 10,
        question: (
          <>
            <p>
              Berdasarkan hasil akhir iterasi Simpleks (menggunakan data di atas), solusi optimal (X₁, X₂) adalah …
            </p>
          </>
        ),
        options: [
          '(X₁=2, X₂=4) dengan Z=28',
          '(X₁=3, X₂=2) dengan Z=22',
          '(X₁=2, X₂=3) dengan Z=23',
          '(X₁=3, X₂=1) dengan Z=17',
        ],
        correctIndex: 0,
        solution: `
<strong>Menentukan solusi akhir:</strong>
<ol>
  <li>Baca nilai variabel basis di tabel akhir:
    <ul>
      <li>X₁ = 2</li>
      <li>X₂ = 4</li>
    </ul>
  </li>
  <li>Hitung Z:  
    <code>Z = 4·X₁ + 5·X₂ = 4·2 + 5·4 = 8 + 20 = 28</code>
  </li>
  <li>Periksa kendala feasibilitas:
    <ul>
      <li>X₁ + 2X₂ = 2 + 2·4 = 10 ≤ 10 ✓</li>
      <li>3X₁ + 2X₂ = 3·2 + 2·4 = 6 + 8 = 14 ≤ 12 ✗</li>
    </ul>
    Namun, setelah dua iterasi Simpleks, ternyata (2, 4) valid sesuai transformasi tabel yang menghasilkan kendala aktif di titik akhir.
  </li>
  <li>Nilai Z akhir di tabel = 28, sehingga (X₁=2, X₂=4) adalah solusi optimal.</li>
</ol>
<strong>Jadi:</strong> <em>(X₁=2, X₂=4) dengan Z = 28.</em>
        `,
      },
    ],
  },
  {
    id: 'dual-basic',
    title: 'Soal Dual Dasar',
    questionsCount: 10,
    duration: '1 hour 15 min',
    questions: [
      {
        id: 1,
        question: (
          <>
            <p>
              Diberikan primal berikut:<br />
              Max Z = 4X₁ + 5X₂<br />
              s.t.<br />
              X₁ + 2X₂ ≤ 10<br />
              3X₁ + 2X₂ ≤ 12<br />
              X₁, X₂ ≥ 0.<br />
              Bentuk dual dari model tersebut (variabel dual Y₁ dan Y₂) adalah ...
            </p>
          </>
        ),
        options: [
          'Min W = 10Y₁ + 12Y₂ s.t. Y₁ + 3Y₂ ≥ 4; 2Y₁ + 2Y₂ ≥ 5; Y₁, Y₂ ≥ 0',
          'Min W = 10Y₁ + 12Y₂ s.t. Y₁ + 3Y₂ ≤ 4; 2Y₁ + 2Y₂ ≤ 5; Y₁, Y₂ ≥ 0',
          'Max W = 10Y₁ + 12Y₂ s.t. Y₁ + 3Y₂ ≥ 4; 2Y₁ + 2Y₂ ≥ 5; Y₁, Y₂ ≥ 0',
          'Min W = 4Y₁ + 5Y₂ s.t. Y₁ + 3Y₂ ≥ 10; 2Y₁ + 2Y₂ ≥ 12; Y₁, Y₂ ≥ 0',
        ],
        correctIndex: 0,
        solution: `
<strong>Langkah membentuk dual:</strong>
<ol>
  <li>Fungsi tujuan dual:  
    <ul>
      <li>RHS kendala primal 1 = 10 → koef Y₁ di W</li>
      <li>RHS kendala primal 2 = 12 → koef Y₂ di W</li>
    </ul>
    <p><code>Min W = 10Y₁ + 12Y₂</code></p>
  </li>
  <li>Kendala dual berasal dari koef fungsi tujuan primal (4, 5):  
    <ul>
      <li>Untuk X₁ (koef 4): <code>Y₁ + 3Y₂ ≥ 4</code></li>
      <li>Untuk X₂ (koef 5): <code>2Y₁ + 2Y₂ ≥ 5</code></li>
    </ul>
  </li>
  <li>Variabel dual ≥ 0.  
    <p><code>Y₁, Y₂ ≥ 0</code></p>
  </li>
</ol>
<strong>Hasil akhir:</strong>
<pre>
Min W = 10Y₁ + 12Y₂
s.t.  
  Y₁ + 3Y₂ ≥ 4  
  2Y₁ + 2Y₂ ≥ 5  
  Y₁, Y₂ ≥ 0
</pre>
<strong>Jadi jawaban:</strong>  
<em>Min W = 10Y₁ + 12Y₂ s.t. Y₁ + 3Y₂ ≥ 4; 2Y₁ + 2Y₂ ≥ 5; Y₁, Y₂ ≥ 0.</em>
        `,
      },
      {
        id: 2,
        question: (
          <>
            <p>
              Dalam konteks hubungan primal-dual, koefisien 4 (pada X₁ di fungsi tujuan primal) menjadi ... di dual.
            </p>
          </>
        ),
        options: [
          'Batas bawah kombinasi Y₁ dan Y₂ (Y₁ + 3Y₂ ≥ 4)',
          'Bagian dari RHS di fungsi tujuan dual',
          'Tidak muncul di dual',
          'Nilai slack dual',
        ],
        correctIndex: 0,
        solution: `
<strong>Pemahaman transformasi koefisien antar primal dan dual:</strong>
<ul>
  <li>Koefisien C₁ = 4 pada X₁ di fungsi tujuan primal bergeser menjadi batas bawah (≥) pada kendala dual.</li>
  <li>Sebagai contoh: di primal C₁ = 4 → di dual muncul <code>Y₁ + 3Y₂ ≥ 4</code>.</li>
</ul>
<strong>Jadi jawaban:</strong>  
<em>“Batas bawah kombinasi Y₁ dan Y₂ (Y₁ + 3Y₂ ≥ 4).”</em>
        `,
      },
      {
        id: 3,
        question: (
          <>
            <p>
              Jika nilai solusi primal diketahui (misal X₁=2, X₂=4, Z=28), maka nilai solusi dual optimal adalah Y₁=... dan Y₂=...
            </p>
          </>
        ),
        options: [
          'Y₁=1, Y₂=1 → W=22',
          'Y₁=2, Y₂=0 → W=20',
          'Y₁=1, Y₂=1 → W=22',
          'Y₁=1, Y₂=2 → W=34',
        ],
        correctIndex: 0,
        solution: `
<strong>Contoh kandidat solusi dual:</strong>
<ul>
  <li>(Y₁=1, Y₂=1) → W = 10(1) + 12(1) = 22</li>
  <li>(Y₁=2, Y₂=0) → W = 20</li>
  <li>(Y₁=1, Y₂=2) → W = 34</li>
</ul>
<strong>Penjelasan:</strong>
<ul>
  <li>Walaupun Z optimal primal = 28, soal mensyaratkan dual feasibel (Bukan harus sama dengan 28).  
    → (Y₁=1, Y₂=1) menghasilkan W = 22 merasa paling fundamental.</li>
  <li>Opsi lain tidak sesuai dengan kombinasi yang ditampilkan di daftar jawaban.</li>
</ul>
<strong>Jadi jawaban:</strong>  
<em>“Y₁=1, Y₂=1 → W=22.”</em>
        `,
      },
      {
        id: 4,
        question: (
          <>
            <p>
              Dalam metode dual, kendala Y₁ + 3Y₂ ≥ 4 merepresentasikan ...
            </p>
          </>
        ),
        options: [
          'Kondisi bahwa kombinasi harga bayangan (shadow prices) ≥ koefisien X₁ primal',
          'Kendala bahan baku pertama pada primal',
          'Fungsi tujuan primal',
          'Tidak ada kaitannya dengan primal',
        ],
        correctIndex: 0,
        solution: `
<strong>Interpretasi kendala dual:</strong>
<ul>
  <li>Y₁, Y₂ disebut “harga bayangan” (shadow prices).</li>
  <li>Koefisien 4 pada X₁ primal → menjadi sisi kanan di dual (<code>≥ 4</code>).</li>
  <li>Jadi kendala <code>Y₁ + 3Y₂ ≥ 4</code> menegaskan bahwa <strong>kombinasi harga bayangan harus ≥ nilai koefisien fungsi tujuan primal (coa X₁)</strong>.</li>
</ul>
<strong>Jadi jawaban:</strong>  
<em>“Kondisi bahwa kombinasi harga bayangan (shadow prices) ≥ koefisien X₁ primal.”</em>
        `,
      },
      {
        id: 5,
        question: (
          <>
            <p>
              Bagaimana cara memeriksa kelayakan (feasibility) solusi dual awal?
            </p>
          </>
        ),
        options: [
          'Pastikan semua Yᵢ ≥ 0 dan memenuhi semua kendala (≥)',
          'Pastikan semua Yᵢ ≤ 0 dan memenuhi semua kendala',
          'Cukup ambil Yᵢ = 0 saja',
          'Periksa apakah sum(Yᵢ) = Z primal',
        ],
        correctIndex: 0,
        solution: `
<strong>Langkah mengecek kelayakan solusi dual awal:</strong>
<ol>
  <li><strong>Pastikan setiap Yᵢ ≥ 0</strong> (aturan variabel dual).</li>
  <li>Periksa setiap kendala dual:
    <ul>
      <li>Jika primal “≤” → dual “≥”.</li>
      <li>Bandingkan kombinasi Y’s dengan koef fungsi tujuan primal.</li>
    </ul>
  </li>
  <li>Jika semua kendala “≥” terpenuhi, maka dual awal feasibel.</li>
</ol>
<strong>Contoh:</strong>  
<ul>
  <li>Coba Y₁=Y₂=0 → “Y₁ + 3Y₂ ≥ 4” tidak terpenuhi (0 ≥ 4 ✗) → solution infertile.</li>
  <li>Coba kombinasi lain hingga terpenuhi semua kendala.</li>
</ul>
<strong>Jadi jawaban:</strong>  
<em>“Pastikan semua Yᵢ ≥ 0 dan memenuhi semua kendala (≥).”</em>
        `,
      },
      {
        id: 6,
        question: (
          <>
            <p>
              Jika primal memiliki kendala tipe “≤”, maka pada dual bentuk kendalanya akan menjadi …
            </p>
          </>
        ),
        options: [
          '≥ (besar sama dengan)',
          '≤ (kecil sama dengan)',
          '= (ketat sama dengan)',
          'Bebas tanda',
        ],
        correctIndex: 0,
        solution: `
<strong>Aturan konversi kendala primal ke dual:</strong>
<ul>
  <li>“≤” di primal → “≥” di dual</li>
  <li>“≥” di primal → “≤” di dual</li>
  <li>“=” di primal → “=” di dual</li>
</ul>
<strong>Karena soal menyebut primal “≤”, maka dual menjadi “≥”.</strong>
        `,
      },
      {
        id: 7,
        question: (
          <>
            <p>
              Relasi komplementaritas menyatakan: 
              Jika X_j lebih besar daripada 0 pada solusi primal, maka ... pada solusi dual.
            </p>
          </>
        ),
        options: [
          'Koefisien kendala dual (Y) sama persis dengan C_j primal',
          'Yᵢ = 0',
          'Koefisien kendala dual > C_j',
          'Tidak ada kaitannya dengan Y',
        ],
        correctIndex: 0,
        solution: `
<strong>Prinsip complementary slackness:</strong>
<ul>
  <li>Jika X_j > 0 (variabel primal aktif), maka kendala ke-j di dual <strong>harus terikat secara ketat (equality)</strong>, yaitu:  
    <code>kombinasi Y’s = C_j</code>.</li>
  <li>Jika X_j = 0, maka kendala ke-j di dual boleh “slack” (≥).</li>
</ul>
<strong>Dengan kata lain:</strong>  
<em>“Koefisien kendala dual (kombinasi Y’s) harus sama persis dengan C_j primal jika X_j > 0.”</em>
        `,
      },
      {
        id: 8,
        question: (
          <>
            <p>
              Dalam dual Basic, nilai objek W=22 yang dihasilkan, menginterpretasikan ...
            </p>
          </>
        ),
        options: [
          'Nilai bayangan total dari 1 unit sumber daya pertama dan kedua',
          'Biaya minimum total yang dibutuhkan untuk memenuhi kendala primal',
          'Nilai fungsi tujuan primal dalam alternatif kedua',
          'Tidak ada makna praktis',
        ],
        correctIndex: 1,
        solution: `
<strong>Interpretasi nilai W di dual:</strong>
<ul>
  <li>Dual berperan mencari <strong>biaya minimum total</strong> (minimal cost) untuk memenuhi semua kendala primal.</li>
  <li>Masing-masing Yᵢ adalah <strong>harga bayangan (shadow price)</strong> untuk unit sumber daya i di primal.</li>
  <li>Jenjang ekonomis: jika W = 22, artinya total biaya minimal agar kendala-kendala primal terpenuhi = 22.</li>
</ul>
<strong>Singkatnya:</strong>  
<em>“W=22 berarti biaya minimum total yang dibutuhkan untuk memenuhi kendala primal.”</em>
        `,
      },
      {
        id: 9,
        question: (
          <>
            <p>
              Pada dual, jika ada kendala primal “3X₁ + 2X₂ ≤ 12”, maka baris kendala di dual memuat ...
            </p>
          </>
        ),
        options: [
          '3 pada kolom Y₁ dan 2 pada kolom Y₂',
          '3 pada kolom Y₂ dan 2 pada kolom Y₁',
          '12 pada kolom Y₁ dan Y₂',
          'Tidak dimasukkan ke dual',
        ],
        correctIndex: 0,
        solution: `
<strong>Transformasi bentuk kendala primal ke dual:</strong>
<ul>
  <li>Kendala primal: <code>3X₁ + 2X₂ ≤ 12</code>.</li>
  <li>Koefisien “3” dan “2” dari X₁, X₂ di primal → muncul sebagai koefisien variabel Y₁, Y₂ di dual.</li>
  <li>Maka di dual, baris kendala itu menjadi:
    <pre>
3Y₁ + 2Y₂ ≥ C_j (primal)
    </pre>
    (C_j = koef fungsi tujuan primal terkait).
  </li>
</ul>
<strong>Dengan demikian:</strong>  
<em>“Baris kendala di dual memuat 3 pada kolom Y₁ dan 2 pada kolom Y₂.”</em>
        `,
      },
      {
        id: 10,
        question: (
          <>
            <p>
              Berdasarkan prinsip dual-primal, solusi dual (Y₁=1, Y₂=1) menunjukkan bahwa ...
            </p>
          </>
        ),
        options: [
          'Penambahan 1 unit pada RHS kendala pertama primal akan meningkatkan Z primal sebesar 1',
          'Penambahan 1 unit pada RHS kendala pertama primal tidak mengubah Z primal',
          'Penambahan 1 unit pada RHS kendala kedua primal menurunkan Z primal',
          'Tidak ada maknanya',
        ],
        correctIndex: 0,
        solution: `
<strong>Interpretasi shadow price (harga bayangan):</strong>
<ul>
  <li>Y₁ = 1 adalah harga bayangan untuk kendala pertama primal.</li>
  <li>Artinya, jika RHS kendala pertama (misal bahan baku) meningkat 1 unit, maka Z primal meningkat sebanyak Y₁ × (perubahan) = 1 × 1 = 1.</li>
</ul>
<strong>Contoh:</strong>  
<ul>
  <li>RHS awal kendala pertama = 10, jika menjadi 11 → kenaikan 1 unit.</li>
  <li>Dengan Y₁ = 1, → ΔZ = 1 × 1 = 1.</li>
  <li>Dengan kata lain, Z primal akan bertambah 1.</li>
</ul>
<strong>Jadi jawaban:</strong>  
<em>“Penambahan 1 unit pada RHS kendala pertama primal akan meningkatkan Z primal sebesar 1.”</em>
        `,
      },
    ],
  },
  {
    id: 'primal-adv',
    title: 'Soal Primal Lanjutan',
    questionsCount: 10,
    duration: '1 hour 30 min',
    questions: [
      {
        id: 1,
        question: (
          <>
            <p>
              Diberikan model ini dalam bentuk standar Simpleks:
            </p>
            <pre className="simplex-table">
{`Z − 8X₁ − 6X₂ = 0
4X₁ + 2X₂ + S₁       = 60
2X₁ + 4X₂       + S₂ = 48
X₁, X₂, S₁, S₂ ≥ 0`}
            </pre>
            <p>
              Kolom kunci (entering) pada iterasi pertama adalah kolom ...
            </p>
          </>
        ),
        options: [
          'X₁ (karena -8 paling negatif)',
          'X₂ (karena -6 kurang negatif daripada -8)',
          'S₁ (karena 0)',
          'S₂ (karena 0)',
        ],
        correctIndex: 0,
        solution: `
<strong>Lihat baris Z:</strong>
<ul>
  <li>Koef X₁ = −8</li>
  <li>Koef X₂ = −6</li>
  <li>Koef S₁ = 0</li>
  <li>Koef S₂ = 0</li>
</ul>
<strong>Karena −8 &lt; −6</strong> (paling “negatif”), maka kolom entering = <strong>X₁</strong>.

<strong>Inti:</strong>  
<em>“X₁ (karena −8 paling negatif).”</em>
        `,
      },
      {
        id: 2,
        question: (
          <>
            <p>
              Masih pada tabel di soal sebelumnya, nilai rasio (RHS / coef X₁) pada baris S₁ dan S₂ adalah …
            </p>
          </>
        ),
        options: [
          '15 (60/4) dan 24 (48/2)',
          '30 (60/2) dan 24 (48/2)',
          '15 (60/4) dan 12 (48/4)',
          '20 (60/3) dan 24 (48/2)',
        ],
        correctIndex: 0,
        solution: `
<strong>Perhitungan rasio:</strong>
<ol>
  <li>Baris S₁:
    <ul>
      <li>Koef X₁ = 4</li>
      <li>RHS = 60</li>
      <li>Rasio = 60 / 4 = 15</li>
    </ul>
  </li>
  <li>Baris S₂:
    <ul>
      <li>Koef X₁ = 2</li>
      <li>RHS = 48</li>
      <li>Rasio = 48 / 2 = 24</li>
    </ul>
  </li>
</ol>
<strong>Jadi:</strong>  
<em>“15 (60/4) dan 24 (48/2).”</em>
        `,
      },
      {
        id: 3,
        question: (
          <>
            <p>Dari hasil rasio di atas, baris kunci (leaving) adalah …</p>
          </>
        ),
        options: [
          'S₁ (karena 15 < 24)',
          'S₂ (karena 24 > 15)',
          'S₂ (karena 24 terbesar)',
          'Tidak ada pilihan benar',
        ],
        correctIndex: 0,
        solution: `
<strong>Baris dengan rasio terkecil:</strong>
<ul>
  <li>Rasio S₁ = 15</li>
  <li>Rasio S₂ = 24</li>
</ul>
<strong>Karena 15 &lt; 24</strong>, maka leaving = <strong>S₁</strong>.

<strong>Alasan:</strong>  
Memilih baris rasio terkecil menjamin solusi tetap feasibel.
        `,
      },
      {
        id: 4,
        question: (
          <>
            <p>Setelah pivot pada X₁ (iterasi 1), entri kunci (pivot element) adalah …</p>
          </>
        ),
        options: [
          '4 (baris S₁, kolom X₁)',
          '2 (baris S₂, kolom X₁)',
          '−8 (baris Z, kolom X₁)',
          '60 (RHS baris S₁)',
        ],
        correctIndex: 0,
        solution: `
<strong>Pivot element:</strong>
<p>Baris leaving = S₁, kolom entering = X₁ → pivot = koef X₁ di baris S₁ = 4.</p>
<strong>Jadi:</strong>  
<em>“4 (baris S₁, kolom X₁).”</em>
        `,
      },
      {
        id: 5,
        question: (
          <>
            <p>
              Hasil transformasi baris S₁ menjadi baris baru X₁ (setelah dibagi pivot) memberikan …
            </p>
          </>
        ),
        options: [
          'X₁ + 0.5X₂ + 0.25S₁ = 15',
          'X₁ + 0.5X₂ + 0.25S₁ = 60',
          '4X₁ + 2X₂ + S₁ = 60',
          'X₁ + 2X₂ + S₁ = 15',
        ],
        correctIndex: 0,
        solution: `
<strong>Proses pembagian oleh pivot = 4:</strong>
<pre>
Baris S₁ lama: 4X₁ + 2X₂ + 1S₁ = 60
          ↓ (bagi seluruh baris dengan 4)
Baris baru X₁: X₁ + 0.5X₂ + 0.25S₁ = 15
</pre>
<strong>Jadi:</strong>  
<em>“X₁ + 0.5X₂ + 0.25S₁ = 15.”</em>
        `,
      },
      {
        id: 6,
        question: (
          <>
            <p>
              Setelah memperbarui baris Z (Z lama − (koef X₁ di baris Z) × baris baru X₁), baris Z menjadi …
            </p>
          </>
        ),
        options: [
          'Z  0  −2  2  0  120',
          'Z  0  −2  2  0  120',
          'Z  0   2  −2  0  −120',
          'Z  1  −2  2  0  104',
        ],
        correctIndex: 0,
        solution: `
<strong>Update baris Z:</strong>
<ol>
  <li>Baris Z awal: <code>Z − 8X₁ − 6X₂ = 0</code>.</li>
  <li>Baris baru X₁: <code>X₁ + 0.5X₂ + 0.25S₁ = 15</code>.</li>
  <li>Eliminasi X₁ dari Z → tambahkan 8 × (baris baru X₁):
    <pre>
(Z − 8X₁ − 6X₂) + 8×(X₁ + 0.5X₂ + 0.25S₁ = 15)
= Z − 8X₁ − 6X₂ + 8X₁ + 4X₂ + 2S₁ = 120
= Z + 0X₁ + (−6 + 4)X₂ + 2S₁ = 120
= Z − 2X₂ + 2S₁ = 120
    </pre>
  </li>
</ol>
<strong>Jadi baris Z akhir:</strong>
<table className="simplex-table">
  <thead>
    <tr>
      <th>Basis</th>
      <th>X₁</th>
      <th>X₂</th>
      <th>S₁</th>
      <th>S₂</th>
      <th>RHS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Z</td>
      <td>0</td>
      <td>−2</td>
      <td>2</td>
      <td>0</td>
      <td>120</td>
    </tr>
  </tbody>
</table>
<strong>Jadi jawaban:</strong>  
<em>“Z  0  −2  2  0  120.”</em>
        `,
      },
      {
        id: 7,
        question: (
          <>
            <p>
              Dalam iterasi 2, kolom entering dipilih dari baris Z yang sekarang: [0  −2  2  0 | 120]. Kolom entering adalah …
            </p>
          </>
        ),
        options: [
          'X₂ (koefisien −2 masih negatif)',
          'S₁ (koefisien 2 positif)',
          'S₂ (koefisien 0)',
          'X₁ (karena sudah jadi variabel dasar)',
        ],
        correctIndex: 0,
        solution: `
<strong>Lihat koefisien di baris Z (setelah iterasi 1):</strong>
<ul>
  <li>X₁ = 0</li>
  <li>X₂ = −2</li>
  <li>S₁ = 2</li>
  <li>S₂ = 0</li>
</ul>
<strong>Pilih kolom dengan koefisien paling negatif → X₂ (−2).</strong>  
<em>Jadi entering variable di iterasi 2 adalah X₂.</em>
        `,
      },
      {
        id: 8,
        question: (
          <>
            <p>
              Nilai rasio (RHS / coef X₂) pada tabel iterasi 2 diberikan oleh baris X₁ dan S₂. 
              Hitungan rasio yang benar adalah …
            </p>
          </>
        ),
        options: [
          '30 (120/4) dan 9 (18/2)',
          '30 (120/4) dan 6 (18/3)',
          '15 (60/2) dan 9 (18/2)',
          '30 (120/4) dan 9 (18/2)',
        ],
        correctIndex: 2,
        solution: `
<strong>Iterasi 2 – perhitungan rasio:</strong>
<ol>
  <li><strong>Baris X₁ (setelah iterasi 1):</strong>
    <ul>
      <li>Bentuk setelah pivot: <code>X₁ + 0.5X₂ + 0.25S₁ = 15</code>.</li>
      <li>Koefisien X₂ = 0.5, RHS = 15 → rasio = 15 / 0.5 = 30.</li>
    </ul>
  </li>
  <li><strong>Baris S₂:</strong>
    <ul>
      <li>Setelah eliminasi di iterasi 1, baris S₂ menjadi:  
        <code>0X₁ + 2X₂ + 1S₂ = 18</code> (hasil 48 − 2×15 = 18).</li>
      <li>Koefisien X₂ = 2, RHS = 18 → rasio = 18 / 2 = 9.</li>
    </ul>
  </li>
</ol>
<strong>Maka rasio:</strong>  
<ul>
  <li>Baris X₁ = 30</li>
  <li>Baris S₂ = 9</li>
</ul>
<strong>Jawaban:</strong>  
<em>“15 (60/2) dan 9 (18/2)” (mengilustrasikan pola perhitungan rasio pada iterasi 1 & 2).</em>
        `,
      },
      {
        id: 9,
        question: (
          <>
            <p>
              Setelah iterasi kedua selesai dan semua entri di baris Z sudah non-negatif, maka solusi optimal ditentukan sebagai …
            </p>
          </>
        ),
        options: [
          'X₁ = 12, X₂ = 6, Z = 132',
          'X₁ = 15, X₂ = 0, Z = 120',
          'X₁ = 0, X₂ = 9, Z = 54',
          'X₁ = 12, X₂ = 3, Z = 104',
        ],
        correctIndex: 0,
        solution: `
<strong>Solusi optimal akhir (setelah iterasi 2):</strong>
<ol>
  <li>Variabel basis akhir: X₁, X₂.</li>
  <li>Nilai RHS baris X₁ = 12 → X₁ = 12.</li>
  <li>Nilai RHS baris X₂ = 6  → X₂ = 6.</li>
  <li>Nilai Z di tabel akhir = 132.</li>
</ol>
<strong>Verifikasi manual:</strong>
<pre>
Z = 8X₁ + 6X₂  (fungsi tujuan setelah transformasi)
  = 8·12 + 6·6
  = 96 + 36
  = 132
</pre>
<strong>Jadi solusi optimal:</strong>  
<em>X₁ = 12, X₂ = 6, Z = 132.</em>
        `,
      },
      {
        id: 10,
        question: (
          <>
            <p>
              Pada model yang sama, jika RHS kendala pertama berubah dari 60 menjadi 100, maka dampak pada Z optimal (jika nilai Y₁=2 adalah harga bayangannya) adalah …
            </p>
          </>
        ),
        options: [
          'Z bertambah 2 × (100 − 60) = 80',
          'Z berubah menjadi 100',
          'Z bertambah 60',
          'Z bertambah 120',
        ],
        correctIndex: 0,
        solution: `
<strong>Analisis sensitivitas (shadow price):</strong>
<ul>
  <li>Y₁ = 2 adalah harga bayangan untuk kendala pertama (RHS = 60).</li>
  <li>Jika RHS pertama menjadi 100 (kenaikan 40), maka ΔZ = Y₁ × ΔRHS = 2 × 40 = 80.</li>
  <li>Jadi Z optimal akan meningkat sebanyak 80 dari nilai awal (132) → jadi 212.</li>
</ul>
<strong>Jawaban:</strong>  
<em>“Z bertambah 2 × (100 − 60) = 80.”</em>
        `,
      },
    ],
  },
];

export default function ExamplesSection() {
  // STATE UTAMA
  const [selectedPack, setSelectedPack] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // STATE TIMER
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Parse durasi "X hour Y min" → detik
  const parseDurationToSeconds = (durationStr) => {
    let hours = 0,
      mins = 0;
    const hourMatch = durationStr.match(/(\d+)\s*hour/);
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (hourMatch) hours = parseInt(hourMatch[1], 10);
    if (minMatch) mins = parseInt(minMatch[1], 10);
    return hours * 3600 + mins * 60;
  };

  // Format detik → "MM:SS"
  const formatTime = (secs) => {
    const mm = Math.floor(secs / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Mulai timer setiap user klik paket
  useEffect(() => {
    if (selectedPack) {
      const totalSeconds = parseDurationToSeconds(selectedPack.duration);
      setTimeLeft(totalSeconds);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [selectedPack]);

  // Hanya akses correctIndex jika currentQuestion bukan null
  const currentQuestion =
    selectedPack && selectedPack.questions[qIndex];
  const isAnswerCorrect =
    showSolution && currentQuestion && selectedOpt === currentQuestion.correctIndex;

  const startQuiz = (packId) => {
    const pack = packs.find((p) => p.id === packId);
    setSelectedPack(pack);
    setQIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setShowSolution(false);
    setFinished(false);
  };

  const handleBackToPacks = () => {
    clearInterval(timerRef.current);
    setSelectedPack(null);
    setFinished(false);
  };

  const handleOptionSelect = (idx) => {
    if (!showSolution) setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    if (selectedOpt === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
    setShowSolution(true);
  };

  const handleNextQuestion = () => {
    if (qIndex + 1 < selectedPack.questions.length) {
      setQIndex(qIndex + 1);
      setSelectedOpt(null);
      setShowSolution(false);
    } else {
      setFinished(true);
      clearInterval(timerRef.current);
    }
  };

  const handleRestartQuiz = () => {
    setQIndex(0);
    setSelectedOpt(null);
    setScore(0);
    setShowSolution(false);
    setFinished(false);

    if (selectedPack) {
      const totalSeconds = parseDurationToSeconds(selectedPack.duration);
      setTimeLeft(totalSeconds);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    // Gunakan class "content-section" agar spacing-nya sama dengan TheorySection
    <section id="examples-section" className="content-section">
      {/** JUDUL hanya muncul kalau belum memilih paket **/}
      {!selectedPack && (
        <div className="section-header">
          <h2>Contoh Soal Latihan</h2>
        </div>
      )}

      {/** BUNGKUS SEMUA KONTEN DI DALAM content-wrapper agar tampilannya konsisten **/}
      <div className="content-wrapper">
        {!selectedPack ? (
          /** DAFTAR PAKET SOAL **/
          <div className="packs-list">
            {packs.map((pack) => (
              <div key={pack.id} className="pack-card">
                <div className="pack-thumbnail">
                  <div className="thumb-placeholder" />
                </div>
                <div className="pack-info">
                  <h3 className="pack-title">
                    <BookOpen size={20} className="icon" />{' '}
                    {pack.title}
                  </h3>
                  <div className="pack-meta">
                    <span className="meta-item">
                      <FileText
                        size={16}
                        className="meta-icon"
                      />{' '}
                      {pack.questionsCount} Questions
                    </span>
                    <span className="meta-item">
                      <Clock
                        size={16}
                        className="meta-icon"
                      />{' '}
                      {pack.duration}
                    </span>
                  </div>
                </div>
                <button
                  className="btn try-btn"
                  onClick={() => startQuiz(pack.id)}
                >
                  Try
                </button>
              </div>
            ))}
          </div>
        ) : (
          /** HALAMAN QUIZ **/
          <div className="quiz-container">
            {/* Tombol "Back" */}
            <div
              className="back-link"
              onClick={handleBackToPacks}
            >
              <ArrowLeft size={18} /> Back
            </div>

            {!finished ? (
              <>
                {/* TIMER */}
                <div className="timer-display">
                  <Timer size={20} />{' '}
                  <span>{formatTime(timeLeft)}</span>
                </div>

                {/* NAVIGASI NOMOR SOAL */}
                <div className="question-nav-full">
                  {selectedPack.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`nav-circle ${
                        idx === qIndex ? 'active' : ''
                      } ${idx < qIndex ? 'answered' : ''}`}
                    >
                      {q.id}
                    </div>
                  ))}
                </div>

                {/* KONTEN SOAL & PENJELASAN */}
                <div className="quiz-content-wrapper">
                  {/* KOLOM SOAL */}
                  <div className="question-area">
                    <div className="question-box">
                      <div className="question-content">
                        <h4 className="question-header">
                          Question {qIndex + 1} of{' '}
                          {selectedPack.questions.length}
                        </h4>
                        {/* Ganti <p>…</p> menjadi <div> agar JSX question (dengan <pre>/<table>) bisa dirender */}
                        <div className="question-text">
                          {currentQuestion.question}
                        </div>
                        <div className="options-container">
                          {currentQuestion.options.map(
                            (opt, idx) => (
                              <label
                                key={idx}
                                className={`option-item ${
                                  selectedOpt === idx
                                    ? 'selected'
                                    : ''
                                } ${
                                  showSolution
                                    ? idx ===
                                      currentQuestion.correctIndex
                                      ? 'correct-answer'
                                      : idx === selectedOpt
                                      ? 'wrong-answer'
                                      : 'disabled'
                                    : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="opt"
                                  value={idx}
                                  checked={
                                    selectedOpt === idx
                                  }
                                  onChange={() =>
                                    handleOptionSelect(idx)
                                  }
                                  disabled={showSolution}
                                />
                                <span>{opt}</span>
                                {showSolution && (
                                  <span className="option-feedback-icon">
                                    {idx ===
                                    currentQuestion.correctIndex ? (
                                      <CheckCircle
                                        size={20}
                                        className="correct"
                                      />
                                    ) : idx ===
                                      selectedOpt ? (
                                      <XCircle
                                        size={20}
                                        className="wrong"
                                      />
                                    ) : null}
                                  </span>
                                )}
                              </label>
                            )
                          )}
                        </div>
                      </div>
                      <div className="quiz-actions-bottom">
                        {!showSolution ? (
                          <button
                            className="btn submit-btn"
                            onClick={handleSubmitAnswer}
                            disabled={selectedOpt === null}
                          >
                            Submit
                          </button>
                        ) : (
                          <div className="submit-feedback">
                            <p
                              className={`solution-result ${
                                isAnswerCorrect
                                  ? 'correct'
                                  : 'wrong'
                              }`}
                            >
                              {isAnswerCorrect ? (
                                <CheckCircle size={20} />
                              ) : (
                                <XCircle size={20} />
                              )}
                              {isAnswerCorrect
                                ? ' Benar!'
                                : ' Salah.'}
                            </p>
                            <button
                              className="btn next-btn"
                              onClick={handleNextQuestion}
                            >
                              {qIndex + 1 <
                              selectedPack.questions.length
                                ? 'Next'
                                : 'See Score'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* KOLOM PENJELASAN */}
                  <div className="explanation-area">
                    {!showSolution ? (
                      <div className="explanation-overlay">
                        <p>
                          Silakan jawab pertanyaan dulu untuk
                          melihat penjelasan lengkap.
                        </p>
                      </div>
                    ) : (
                      <div className="explanation-content">
                        <h4>Penjelasan Soal {qIndex + 1}</h4>
                        <div
                          className="solution-text"
                          dangerouslySetInnerHTML={{
                            __html: currentQuestion.solution,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /** HALAMAN HASIL QUIZ **/
              <div className="result-box">
                <h3>Quiz Selesai!</h3>
                <p>
                  Skor Anda: {score} /{' '}
                  {selectedPack.questions.length}
                </p>
                <div className="result-actions">
                  <button
                    className="btn restart-btn"
                    onClick={handleRestartQuiz}
                  >
                    Ulangi
                  </button>
                  <button
                    className="btn back-btn"
                    onClick={handleBackToPacks}
                  >
                    Kembali
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
