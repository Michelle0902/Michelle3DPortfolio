import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Text, useProgress } from '@react-three/drei';
import { Raycaster, Vector2 } from 'three';
import * as THREE from 'three';
import WorkExperienceCarousel from './WorkExperienceCarousel';
import './GLBModel.css';
import blobConfig from '../blob-config.json';

// Mobile detection utility
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
};

// Performance detection
const getDevicePerformance = () => {
    const isMobile = isMobileDevice();
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const deviceMemory = navigator.deviceMemory || 4;
    
    if (isMobile && (hardwareConcurrency <= 4 || deviceMemory <= 2)) {
        return 'low'; // Low-end mobile
    } else if (isMobile) {
        return 'medium'; // Mid-range mobile
    }
    return 'high'; // Desktop or high-end device
};

// 3D Loading Component (for Canvas fallback)
function LoadingScreen3D() {
    const { progress } = useProgress();
    
    return (
        <group>
            {/* Simple 3D loading indicator */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#667eea" transparent opacity={0.8} />
            </mesh>
            <Text 
                position={[0, 1, 0]} 
                fontSize={0.3} 
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                Loading... {Math.round(progress)}%
            </Text>
        </group>
    );
}

// HTML Loading Screen Component (for overlay)
function LoadingScreenHTML() {
    const [dots, setDots] = useState('');
    
    // Animate loading dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="loading-screen">
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
                
                <div className="loading-content">
                    <h2>Loading Portfolio</h2>
                    <p className="loading-text">
                        Preparing 3D Experience{dots}
                    </p>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `100%` }}
                            ></div>
                        </div>
                        <span className="progress-text">Loading...</span>
                    </div>
                    
                    <div className="loading-tips">
                        <p className="loading-hint">
                            <strong>Tip:</strong> 
                            This detailed 3D portfolio room includes interactive elements
                        </p>
                        <p className="loading-hint">
                            Hint: Look for the glowing monitor to explore my work experiences ^^!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('GLBModel Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-fallback">
                    <h2>Something went wrong with the 3D scene.</h2>
                    <p>Please refresh the page to try again.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

// Animated Moon/Sun Component
function AnimatedCelestialBody({ isDarkTheme, performance }) {
    const moonRef = useRef();
    const sunRef = useRef();
    const [targetY, setTargetY] = React.useState(isDarkTheme ? 50 : -20);
    const shouldAnimate = performance === 'high'; // Only animate on high-performance devices
    
    React.useEffect(() => {
        setTargetY(isDarkTheme ? 40 : -20);
    }, [isDarkTheme]);
    
    useFrame(() => {
        if (!shouldAnimate) return; // Skip animation on mobile
        
        // Smoothly animate moon position
        if (moonRef.current) {
            const currentY = moonRef.current.position.y;
            const diff = targetY - currentY;
            moonRef.current.position.y += diff * 0.05;
            
            // Fade moon in/out
            if (moonRef.current.material) {
                const targetOpacity = isDarkTheme ? 1 : 0;
                moonRef.current.material.opacity += (targetOpacity - moonRef.current.material.opacity) * 0.05;
            }
        }
        
        // Smoothly animate sun position
        if (sunRef.current) {
            const sunTargetY = isDarkTheme ? -20 : 40;
            const currentY = sunRef.current.position.y;
            const diff = sunTargetY - currentY;
            sunRef.current.position.y += diff * 0.05;

            // Fade sun in/out
            if (sunRef.current.material) {
                const targetOpacity = isDarkTheme ? 0 : 1;
                sunRef.current.material.opacity += (targetOpacity - sunRef.current.material.opacity) * 0.05;
            }
        }
    });
    
    // Simplified geometry for low-performance devices
    const segments = performance === 'low' ? 8 : (performance === 'medium' ? 16 : 32);
    
    return (
        <group>
            {/* Moon */}
            <mesh ref={moonRef} position={[30, isDarkTheme ? 50 : -20, -30]}>
                <sphereGeometry args={[3, segments, segments]} />
                <meshStandardMaterial 
                    color="#f0f0f0"
                    emissive="#8888ff"
                    emissiveIntensity={0.5}
                    transparent
                    opacity={isDarkTheme ? 1 : 0}
                />
            </mesh>
            
            {/* Sun */}
            <mesh ref={sunRef} position={[30, isDarkTheme ? -20 : 50, -30]}>
                <sphereGeometry args={[4, segments, segments]} />
                <meshStandardMaterial 
                    color="#ffff00"
                    emissive="#ffaa00"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={isDarkTheme ? 0 : 1}
                />
            </mesh>
            
            {/* Sun glow effect */}
            {!isDarkTheme && (
                <pointLight 
                    position={[30, 50, -30]} 
                    color="#ffaa00" 
                    intensity={0.8} 
                    distance={100}
                />
            )}
            
            {/* Moon glow effect */}
            {isDarkTheme && (
                <pointLight 
                    position={[30, 50, -30]} 
                    color="#8888ff" 
                    intensity={0.3} 
                    distance={80}
                />
            )}
        </group>
    );
}


// Component to handle camera positioning
function CameraController({ isDarkTheme }) {
    const { camera, scene } = useThree();
    
    React.useEffect(() => {
        if (camera && scene) {
            // Set camera to look down at the room from above
            camera.position.set(-10, -2, 10);
            camera.lookAt(-30, 0, 50);
            camera.updateProjectionMatrix();
            
            // Set background color based on theme
            scene.background = new THREE.Color(isDarkTheme ? '#1a1a1a' : '#f5f5f5');
        }
    }, [camera, scene, isDarkTheme]);
    
    return null;
}

// Animated Arrow Component pointing to the monitor
function AnimatedArrow({ position, rotation, delay = 0, performance }) {
    const arrowRef = useRef();
    const shouldAnimate = performance === 'high';
    
    useFrame((state) => {
        if (!shouldAnimate || !arrowRef.current) return;
        
        const time = state.clock.getElapsedTime();
        
        // Floating animation
        arrowRef.current.position.y = position[1] + Math.sin(time * 2 + delay) * 0.2;
        
        // Gentle rotation/wobble
        arrowRef.current.rotation.z = rotation[2] + Math.sin(time * 3 + delay) * 0.15;
        
        // Pulsing scale
        const scale = 1 + Math.sin(time * 2 + delay) * 0.15;
        arrowRef.current.scale.set(scale, scale, scale);
        
        // Rotate around Y axis for spinning effect
        arrowRef.current.rotation.y += 0.01;
    });
    
    return (
        <group ref={arrowRef} position={position} rotation={rotation}>
            {/* Arrow pointer (cone) */}
            <mesh position={[0, 0.25, 0]}>
                <coneGeometry args={[0.2, 0.4, 8]} />
                <meshStandardMaterial 
                    color="#FFD700" 
                    emissive="#ff3300"
                    emissiveIntensity={0.6}
                />
            </mesh>
            
            {/* Arrow shaft (cylinder) */}
            <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
                <meshStandardMaterial 
                    color="#FFD700"
                    emissive="#ff3300"
                    emissiveIntensity={0.4}
                />
            </mesh>
            
            {/* Glow effect */}
            <pointLight 
                color="#ff6600" 
                intensity={0.3} 
                distance={2}
            />
        </group>
    );
}

// Component to add arrows around the monitor
function MonitorArrows({ scene, performance }) {
    const [monitorPosition, setMonitorPosition] = useState(null);
    
    React.useEffect(() => {
        // Find monitor position
        let foundPosition = null;
        
        scene.traverse((child) => {
            const childName = child.name.toLowerCase();
            if (child.isMesh && (
                childName === 'plane006_2' || 
                childName === 'plane005_2' || 
                childName === 'plane004_2'
            )) {
                // Get world position of the monitor
                const worldPos = new THREE.Vector3();
                child.getWorldPosition(worldPos);
                
                if (!foundPosition) {
                    foundPosition = worldPos;
                }
            }
        });
        
        setMonitorPosition(foundPosition);
    }, [scene]);
    
    if (!monitorPosition) return null;
    
    // Create arrows in a circle around the monitor
    const arrowCount = 3;
    const radius = 1;
    
    return (
        <group>
            {Array.from({ length: arrowCount }).map((_, i) => {
                const angle = (i / arrowCount) * Math.PI * 2;
                const x = monitorPosition.x + Math.cos(angle) * radius;
                const z = monitorPosition.z + Math.sin(angle) * radius;
                const y = monitorPosition.y+1.1;
                
                // Rotation to point toward monitor center
                const rotationY = Math.PI / 2;
                const rotationX = Math.PI;
                
                return (
                    <AnimatedArrow
                        key={i}
                        position={[x, y, z]}
                        rotation={[rotationX, rotationY, 0]}
                        delay={i * 0.4}
                        performance={performance}
                    />
                );
            })}
            
            {/* Floating "CLICK HERE!" text above monitor */}
            <Text
                position={[monitorPosition.x, monitorPosition.y + 0.8, monitorPosition.z]}
                fontSize={0.18}
                color="#ff6600"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
                fontWeight="bold"
            >
                
            </Text>
        </group>
    );
}

function Model({ onMonitorClick, onSceneReady, performance }) {
    // Multi-source fallback strategy: Try sources in order until one works
    const getGLBPath = () => {
        const sources = blobConfig.sources || {};
        const fallbackOrder = blobConfig.fallbackOrder || ['cloudflareR2', 'githubRelease', 'vercelBlob', 'local'];
        
        // Try each source in fallback order
        for (const source of fallbackOrder) {
            if (source === 'local') {
                // Local fallback for development or API endpoint for production
                return import.meta.env.PROD ? '/api/glb' : '/portfolio-room.min.glb';
            }
            
            if (sources[source] && sources[source].trim() !== '') {
                console.log(`Loading GLB from: ${source}`);
                return sources[source];
            }
        }
        
        // Ultimate fallback
        return import.meta.env.PROD ? '/api/glb' : '/portfolio-room.min.glb';
    };
    
    const glbPath = getGLBPath();
    console.log('Final GLB Path:', glbPath); // Debug log
    const { scene, error } = useGLTF(glbPath, true); // true = draco compression enabled
    
    const { camera, gl } = useThree();
    const [hoveredMesh, setHoveredMesh] = useState(null);
    const raycaster = useRef(new Raycaster());
    const mouse = useRef(new Vector2());
    const monitorRef = useRef();
    const originalMaterials = useRef({});
    const enableHoverEffects = performance === 'high'; // Only enable hover on desktop
    
    // Notify parent when scene is ready
    React.useEffect(() => {
        if (onSceneReady && scene) {
            onSceneReady(scene);
        }
        
        // Store original materials for monitor meshes
        scene.traverse((child) => {
            if (child.isMesh) {
                const childName = child.name.toLowerCase();
                if (childName.includes('plane006_2') || 
                    childName.includes('plane005_2') || 
                    childName.includes('plane004_2')) {
                    originalMaterials.current[child.uuid] = {
                        emissive: child.material.emissive?.clone() || new THREE.Color(0x000000),
                        emissiveIntensity: child.material.emissiveIntensity || 0
                    };
                }
            }
        });
    }, [scene, onSceneReady]);
    
    // Handle hover effect
    React.useEffect(() => {
        let originalEmissive = null;
        let originalIntensity = 0;
        
        if (hoveredMesh && hoveredMesh.material) {
            // Save original values before modifying
            originalEmissive = hoveredMesh.material.emissive?.clone();
            originalIntensity = hoveredMesh.material.emissiveIntensity || 0;
            
            // Apply hover effect
            hoveredMesh.material.emissive = new THREE.Color('#4facfe');
            hoveredMesh.material.emissiveIntensity = 0.5;
        }
        
        return () => {
            // Reset on cleanup
            if (hoveredMesh && hoveredMesh.material && originalEmissive) {
                hoveredMesh.material.emissive = originalEmissive;
                hoveredMesh.material.emissiveIntensity = originalIntensity;
            }
        };
    }, [hoveredMesh]);
    
    // Handle GLB loading error - moved after all hooks
    if (error) {
        console.error('Failed to load GLB model:', error);
        return (
            <group>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[4, 4, 4]} />
                    <meshStandardMaterial color="#667eea" />
                </mesh>
                <Text position={[0, 2, 0]} fontSize={0.5} color="white">
                    Portfolio Room
                </Text>
                <Text position={[0, 1.5, 0]} fontSize={0.3} color="white">
                    (Loading 3D model...)
                </Text>
            </group>
        );
    }

    if (!scene) {
        return null; // Loading state
    }
    
    // Add hover handler (only on high-performance devices)
    const handlePointerMove = (event) => {
        if (!enableHoverEffects) return; // Skip hover on mobile
        
        event.stopPropagation();
        
        // Get mouse position relative to the canvas
        const canvas = gl.domElement;
        const rect = canvas.getBoundingClientRect();
        
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update raycaster with camera and mouse position
        raycaster.current.setFromCamera(mouse.current, camera);
        
        // Get all meshes from the scene
        const meshes = [];
        scene.traverse((child) => {
            if (child.isMesh) {
                meshes.push(child);
            }
        });
        
        // Calculate intersections
        const intersections = raycaster.current.intersectObjects(meshes, true);
        
        if (intersections.length > 0) {
            const hoveredObject = intersections[0].object;
            const objectName = hoveredObject.name?.toLowerCase();
            
            // Check if hovering over monitor
            if (objectName?.includes('plane006_2') ||
                objectName?.includes('plane005_2') ||
                objectName?.includes('plane004_2')) {
                document.body.style.cursor = 'pointer';
                setHoveredMesh(hoveredObject);
            } else {
                document.body.style.cursor = 'default';
                setHoveredMesh(null);
            }
        } else {
            document.body.style.cursor = 'default';
            setHoveredMesh(null);
        }
    };
    
    // Reset hover when mouse leaves
    const handlePointerOut = () => {
        document.body.style.cursor = 'default';
        setHoveredMesh(null);
    };
    
    // Add click handler with raycasting
    const handleClick = (event) => {
        event.stopPropagation();
        
        // Get mouse position relative to the canvas
        const canvas = gl.domElement;
        const rect = canvas.getBoundingClientRect();
        
        mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update raycaster with camera and mouse position
        raycaster.current.setFromCamera(mouse.current, camera);
        
        // Get all meshes from the scene
        const meshes = [];
        scene.traverse((child) => {
            if (child.isMesh) {
                meshes.push(child);
            }
        });
        
        // Calculate intersections
        const intersections = raycaster.current.intersectObjects(meshes, true);
        
        if (intersections.length > 0) {
            const clickedObject = intersections[0].object;
            
            if (clickedObject.name?.toLowerCase().includes('plane006_2') ||
                clickedObject.name?.toLowerCase().includes('plane005_2') ||
                clickedObject.name?.toLowerCase().includes('plane004_2')) {
                onMonitorClick();
            }
        }
    };
    
    return (
        <primitive 
            ref={monitorRef}
            object={scene} 
            scale={1} 
            position={[0, -5, 0]} 
            onClick={handleClick}
            onPointerMove={handlePointerMove}
            onPointerOut={handlePointerOut}
        />
    );
}

function LoadingFallback() {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading 3D Model...</p>
        </div>
    );
}

export default function GLBModel() {
    const [showCarousel, setShowCarousel] = useState(false);
    const [loadedScene, setLoadedScene] = useState(null);
    const [isDarkTheme, setIsDarkTheme] = useState(true); // Default to dark theme
    const [isLoading, setIsLoading] = useState(true);
    const [performance, setPerformance] = useState('high');
    const controlsRef = useRef();

    // Detect device performance on mount
    React.useEffect(() => {
        const detectedPerformance = getDevicePerformance();
        setPerformance(detectedPerformance);
        console.log('Device performance detected:', detectedPerformance);
    }, []);

    const handleMonitorClick = () => {
        setShowCarousel(true);
    };

    const handleCloseCarousel = () => {
        setShowCarousel(false);
    };

    const resetCamera = () => {
        if (controlsRef.current) {
            // Reset camera to specific viewing position
            const camera = controlsRef.current.object; // Get the camera from controls
            camera.position.set(-10, -2, 10);
            controlsRef.current.update(); // Update the controls
        }
    };
    
    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };
    
    const handleSceneReady = (scene) => {
        setLoadedScene(scene);
        setIsLoading(false);
    };
    
    // Performance-based settings
    const isMobile = isMobileDevice();
    const canvasSettings = {
        antialias: performance === 'high',
        alpha: false,
        powerPreference: performance === 'low' ? 'low-power' : 'high-performance',
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
        pixelRatio: performance === 'low' ? 1 : (performance === 'medium' ? 1.5 : window.devicePixelRatio)
    };

    return (
        <ErrorBoundary>
            <div className="glb-model-container fullscreen">
                {/* HTML Loading Screen Overlay */}
                {isLoading && <LoadingScreenHTML />}
                <Canvas
                    camera={{ position: [0, 2, 7], fov: 75 }}
                    style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
                    gl={canvasSettings}
                    dpr={canvasSettings.pixelRatio}
                    onCreated={({ gl }) => {
                        // Set pixel ratio based on performance
                        gl.setPixelRatio(canvasSettings.pixelRatio);
                        
                        // Handle WebGL context loss
                        gl.domElement.addEventListener('webglcontextlost', (event) => {
                            event.preventDefault();
                            console.warn('WebGL context lost, reloading...');
                        });
                        
                        gl.domElement.addEventListener('webglcontextrestored', () => {
                            console.log('WebGL context restored');
                        });
                    }}
                >
                    <Suspense fallback={<LoadingScreen3D />}>
                        <CameraController isDarkTheme={isDarkTheme} />
                        <AnimatedCelestialBody isDarkTheme={isDarkTheme} performance={performance} />
                        <Environment preset={isDarkTheme ? "lobby" : "apartment"} />
                        <ambientLight intensity={isDarkTheme ? 0.5 : 0.8} />
                        <directionalLight 
                            position={[10, 10, 5]} 
                            intensity={isDarkTheme ? 1.5 : 2.0}
                        />
                        <Model 
                            onMonitorClick={handleMonitorClick} 
                            onSceneReady={handleSceneReady}
                            performance={performance}
                        />
                        {loadedScene && <MonitorArrows scene={loadedScene} performance={performance} />}
                        <OrbitControls 
                            ref={controlsRef}
                            enablePan={!isMobile}
                            enableZoom={true}
                            enableRotate={true}
                            minDistance={2}
                            maxDistance={20}
                            target={[0, 0, 0]}
                            autoRotate={false}
                            enableDamping={performance !== 'low'}
                            dampingFactor={0.05}
                        />
                    </Suspense>
                </Canvas>
                
                           {!showCarousel && (
                               <div className="model-info">
                                   <p>Interactive 3D Portfolio Room</p>
                                   {isMobile && (
                                       <p className="controls-hint" style={{color: '#ffd700', fontSize: '0.85em'}}>
                                           📱 Mobile-optimized mode active
                                       </p>
                                   )}
                                   <p className="controls-hint">🎯 <strong>Follow the orange arrows</strong> to find the monitor!</p>
                                   <p className="controls-hint">
                                       {isMobile ? 'Touch to interact, pinch to zoom' : 'Use mouse to rotate, scroll to zoom, and drag to pan'}
                                   </p>
                                   <div className="button-group">
                                       <button className="reset-camera-btn" onClick={resetCamera}>
                                           📷 Reset View
                                       </button>
                                       <button className="reset-camera-btn" onClick={toggleTheme}>
                                           {isDarkTheme ? '☀️ Light Mode' : '🌙 Dark Mode'}
                                       </button>
                                   </div>
                               </div>
                           )}
            </div>

            {showCarousel && (
                <WorkExperienceCarousel onClose={handleCloseCarousel} />
            )}
        </ErrorBoundary>
    );
}
