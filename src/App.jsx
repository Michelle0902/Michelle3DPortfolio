import { useState } from 'react'
import './App.css'
import './components/WaitingPage.css'
import Home from './components/Home'
import LoadingScreen from './components/LoadingScreen'

function App() {
  // Step management: 'welcome' -> 'loading' -> 'portfolio'
  const [currentStep, setCurrentStep] = useState('welcome');

  const handleExploreClick = () => {
    setCurrentStep('loading');
  };

  const handleLoadingComplete = () => {
    setCurrentStep('portfolio');
  };

  // Step 1: Welcome/Waiting Page
  if (currentStep === 'welcome') {
    return (
      <div className="app">
        <main className="main-content">
          <div className="waiting-page">
            <h1 className="hero-title">Welcome to My 3D Portfolio</h1>
            <button onClick={handleExploreClick} className="hero-button">
              Let's Explore My Working Space In 3D
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Step 2: Loading Screen
  if (currentStep === 'loading') {
    return (
      <div className="app">
        <main className="main-content">
          <LoadingScreen onComplete={handleLoadingComplete} />
        </main>
      </div>
    );
  }

  // Step 3: 3D Portfolio (Home)
  return (
    <div className="app">
      <main className="main-content">
        <Home />
      </main>
    </div>
  );
}

export default App
