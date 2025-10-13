import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

export default function WaitingPage() {
    const navigate = useNavigate();
    const [showRender, setShowRender] = useState(false);

    const handleShowHome = () => {
        setShowRender(true);
    }

    if (showRender) {
        return <LoadingScreen onComplete={() => navigate('/home')} />
    }
    
    return (
        <div>
            <h1 className="hero-title">Welcome to My 3D Portfolio</h1>
            <button onClick={handleShowHome} className="hero-button">
                Let's Explore My Working Space In 3D
            </button>
        </div>
    )
}
