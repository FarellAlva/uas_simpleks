// src/components/Navigation.jsx
import React from 'react';

export default function Navigation({ activePage, onNavClick }) {
  const links = [
    { id: 'input', label: 'Input Masalah', page: 'input' },
    { id: 'solution', label: 'Penyelesaian', page: 'solution' },
    { id: 'theory', label: 'Teori', page: 'theory' },
    { id: 'examples', label: 'Contoh Soal', page: 'examples' },
    { id: 'help', label: 'Bantuan', page: 'help' },
  ];

  return (
    <nav className="main-nav">
      <div className="container">
        <ul className="nav-list">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href="#"
                className={`nav-link ${activePage === link.page ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick(link.page);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
