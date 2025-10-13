import React, { useState } from 'react';
import './WorkExperienceCarousel.css';

const workExperiences = [
    {
        id: 1,
        title: "Full-Stack Software Engineer",
        company: "KATALYST",
        client: "KATALYST",
        location: "Ho Chi Minh City, Vietnam",
        duration: "Jul 2022 - Dec 2024",
        achievements: [
            "Engineered and implemented a data portal called HANAS to streamline data processing solutions, enhancing pipeline efficiency and centralizing data services for improved performance",
            "Developed the HANAS platform UI using React.js and Java, integrating backend services including DataHub, Superset/PowerBI, Dremio, Apache Ranger, and Airflow/NiFi, boosting engineer productivity by 40%"
        ],
        technologies: ["React.js", "Vue.js", "Java", "Node.js", "Next.js", "Apache Kafka", "Spring Boot", "DataHub", "Superset", "PowerBI", "Dremio", "Apache Ranger", "Airflow", "NiFi", "Oracle"],
        linkProduct: "https://katalyst.vn/solutions/hanas-data-platform"
    },
    {
        id: 2,
        title: "Full-Stack Software Engineer",
        company: "KATALYST",
        client: "RockitFitness",
        location: "Ho Chi Minh City, Vietnam",
        duration: "Jul 2022 - Dec 2024",
        achievements: [
            "Applied Vue.js framework to design and deploy RockitFitness management system, leveraging Node.js for backend services and automating 80% of daily management tasks",
            "Collaborated with supervisors to devise innovative solutions that enhanced code readability and boosted execution speed by 10%"
        ],
        technologies: ["React.js", "Vue.js", "Java", "Node.js", "Next.js", "Apache Kafka", "Spring Boot", "DataHub", "Superset", "PowerBI", "Dremio", "Apache Ranger", "Airflow", "NiFi", "Oracle"],
        link: "https://rock-it.fit/en"
    },
    {
        id: 3,
        title: "Full-Stack Software Engineer",
        company: "KATALYST",
        client: "Electricity of Vietnam",
        location: "Ho Chi Minh City, Vietnam",
        duration: "Jul 2022 - Dec 2024",
        achievements: [
            "Built and optimized the backend of a high-throughput messaging stream system for EVN (Electricity of Vietnam) using Next.js and Apache Kafka"
        ],
        technologies: ["React.js", "Vue.js", "Java", "Node.js", "Next.js", "Apache Kafka", "Spring Boot", "DataHub", "Superset", "PowerBI", "Dremio", "Apache Ranger", "Airflow", "NiFi", "Oracle"],
        link: "https://en.evn.com.vn/"
    },
    {
        id: 4,
        title: "Full-Stack Software Engineer",
        company: "KATALYST",
        client: "Nam A Bank",
        location: "Ho Chi Minh City, Vietnam",
        duration: "Jul 2022 - Dec 2024",
        achievements: [
            "Implemented secure Host-to-Host integration on Nam A Bank's SSO 2.0 with CIC, enabling SSO access and real-time credit data exchange using Java Spring Boot"
        ],
        technologies: ["React.js", "Vue.js", "Java", "Node.js", "Next.js", "Apache Kafka", "Spring Boot", "DataHub", "Superset", "PowerBI", "Dremio", "Apache Ranger", "Airflow", "NiFi", "Oracle"],
        link: "https://www.namabank.com.vn/"
    },
    {
        id: 5,
        title: "Intern Business Analyst",
        company: "SVTech",
        client: "SVTech",
        location: "Ho Chi Minh City, Vietnam",
        duration: "Mar 2022 - Jun 2022",
        achievements: [
            "Collaborated with customers to gather, evaluate, and refine business requirements, reducing misaligned feature requests by 60%.",      
            "Designed and delivered an interactive Figma demo to guide developers through the implementation process.",
            "Presented and demonstrated the final product to both management and clients, ensuring alignment and satisfaction.",
            "Collaborated in reviewing and analyzing epics, features, and user stories."
        ],
        technologies: ["Figma", "Business Analysis", "Requirements Gathering", "User Stories", "Agile Methodology"],
        linkCompany: "https://www.svtech.com/"
    }
];

export default function WorkExperienceCarousel({ onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Debug when component mounts
    React.useEffect(() => {
        return () => {
        };
    }, []);

    const nextExperience = () => {
        setCurrentIndex((prev) => (prev + 1) % workExperiences.length);
    };

    const prevExperience = () => {
        setCurrentIndex((prev) => (prev - 1 + workExperiences.length) % workExperiences.length);
    };

    const currentExperience = workExperiences[currentIndex];

    return (
        <div className="carousel-overlay" onClick={onClose}>
            <div className="carousel-container" onClick={(e) => e.stopPropagation()}>
                <div className="close-button">
                    <button onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="carousel-content">
                    <div className="experience-card">
                        <div className="experience-header">
                            <h2>{currentExperience.title}</h2>
                            <h3>{currentExperience.company}</h3>
                            <p className="location">{currentExperience.location}</p>
                            <p className="duration">{currentExperience.duration}</p>
                        </div>
                        
                        <div className="experience-body">
                            <div className="experience-details">
                                <div className="achievements">
                                    <h4>Key Achievements:</h4>
                                    <ul>
                                        {currentExperience.achievements.map((achievement, index) => (
                                            <li key={index}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="achievements">
                                    {currentExperience.linkProduct && (
                                        <>
                                            <h4>Link to product:</h4>
                                            <a href={currentExperience.linkProduct} target="_blank" rel="noopener noreferrer">{currentExperience.linkProduct}</a>
                                        </>
                                    )}
                                    {currentExperience.linkCompany && (
                                        <>
                                            <h4>Link to company website:</h4>
                                            <a href={currentExperience.linkCompany} target="_blank" rel="noopener noreferrer">{currentExperience.linkCompany}</a>
                                        </>
                                    )}
                                    {currentExperience.link && (
                                        <>
                                            <h4>Link to client website:</h4>
                                            <a href={currentExperience.link} target="_blank" rel="noopener noreferrer">{currentExperience.link}</a>
                                        </>
                                    )}
                                </div>
                                <div className="technologies">
                                    <h4>Technologies & Skills:</h4>
                                    <div className="tech-tags">
                                        {currentExperience.technologies.map((tech, index) => (
                                            <span key={index} className="tech-tag">{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="carousel-controls">
                    <button className="nav-button prev" onClick={prevExperience}>
                        ← Previous
                    </button>
                    
                    <div className="carousel-indicators">
                        {workExperiences.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                    
                    <button className="nav-button next" onClick={nextExperience}>
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
}
