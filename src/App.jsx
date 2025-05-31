// src/App.jsx
import React, { useState } from 'react'

// Import styling global
import './assets/style.css'

// Import komponen layout
import Header from './components/Header'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

// Import halaman
import InputSection from './pages/InputSection'
import SolutionSection from './pages/SolutionSection'
import TheorySection from './pages/TheorySection'
import ExamplesSection from './pages/ExamplesSection'
import HelpSection from './pages/HelpSection'

export default function App() {
  // activePage: 'input' | 'solution' | 'theory' | 'examples' | 'help'
  const [activePage, setActivePage] = useState('input')

  // Fungsi untuk merender konten halaman berdasarkan state
  const renderPage = () => {
    switch (activePage) {
      case 'input':
        return <InputSection />
      case 'solution':
        return <SolutionSection />
      case 'theory':
        return <TheorySection />
      case 'examples':
        return <ExamplesSection />
      case 'help':
        return <HelpSection />
      default:
        return <InputSection />
    }
  }

  return (
    <div className="App">
      <Header />
      <Navigation activePage={activePage} onNavClick={setActivePage} />
      <main className="container">{renderPage()}</main>
      <Footer />
    </div>
  )
}
