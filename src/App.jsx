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
  const [solutionData, setSolutionData] = useState(null)

  const handleSolutionUpdate = (data) => {
    setSolutionData(data)
    if (data && data.success) {
      setActivePage('solution') // Automatically switch to solution page when solved
    }
  }

  // Fungsi untuk merender konten halaman berdasarkan state
  const renderPage = () => {
    switch (activePage) {
      case 'input':
        return <InputSection onSolutionUpdate={handleSolutionUpdate} />
      case 'solution':
        return <SolutionSection solutionData={solutionData} />
      case 'theory':
        return <TheorySection />
      case 'examples':
        return <ExamplesSection />
      case 'help':
        return <HelpSection />
      default:
        return <InputSection onSolutionUpdate={handleSolutionUpdate} />
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
