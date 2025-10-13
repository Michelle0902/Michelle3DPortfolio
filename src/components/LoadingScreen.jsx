import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

export default function LoadingScreen({onComplete}) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {            
            setProgress((prev) => prev + 2);
            if (progress >= 100) {
                setIsComplete(true);
                clearInterval(interval);
                setProgress(100);
                setTimeout(()=>{
                    onComplete();
                }, 500);                
            }
        }, 100);
        return () => clearInterval(interval);
    })
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-logo">
                    <h1>3D Portfolio</h1>
                    <p>Loading my professional and life experiences...</p>
                </div>
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                >                            
                </div>
            </div>
                {progress}%
                <div className="loading-dots">
                    <span className={progress > 20 ? 'active' : ''}>.</span>
                    <span className={progress > 50 ? 'active' : ''}>.</span>
                    <span className={progress > 80 ? 'active' : ''}>.</span>
                </div>               
                {isComplete && (
                    <div className="complete-message">
                        <p>Ready to explore!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
