import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom' 
import reactLogo from './assets/react.svg'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import WaitingPage from './components/WaitingPage'
import LoadingScreen from './components/LoadingScreen'

function App() {
  return (
    <Router>
      <div className="app">
        {/* <Header /> */}
        <main className="main-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<WaitingPage />} />
            <Route path="/loading" element={<LoadingScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
