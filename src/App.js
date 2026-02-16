import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Line} from '@react-three/drei';
import './App.css';
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { v4 as uuidv4 } from "uuid";

/**
 * COMPONENT: Constellation
 * Handles the logic for detecting mouse proximity to stars and drawing fading lines.
 */
const Navbar = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { name: 'Intro', id: 'intro' },
    { name: 'Projects', id: 'projects' },
    { name: 'Ongoing', id: 'ongoing' }, 
    { name: 'Internship', id: 'internship' },
    { name: 'Tech Stack', id: 'tech-stack' }
  ];

  return (
    <nav className="fixed-nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <button 
              onClick={() => scrollToSection(item.id)}
              className="nav-btn"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
const Constellation = () => {
  const { viewport } = useThree();
  const [lines, setLines] = useState([]);
  const lastActiveStar = useRef(null);

  // Reduced spread slightly to fit the half-screen better
  const stars = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        id: uuidv4(),
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 25, // Adjusted X spread for half-width
          (Math.random() - 0.5) * 20, // Adjusted Y spread
          (Math.random() - 0.5) * 10 
        )
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    // Standard mouse interaction logic
    const x = (state.mouse.x * viewport.width) / 2;
    const y = (state.mouse.y * viewport.height) / 2;
    const mouseVec = new THREE.Vector3(x, y, 0);

    let closestStar = null;
    stars.forEach((star) => {
      if (mouseVec.distanceTo(star.position) < 1.5) closestStar = star;
    });

    if (closestStar && lastActiveStar.current && closestStar.id !== lastActiveStar.current.id) {
      setLines((prev) => [...prev.slice(-15), {
        id: uuidv4(),
        start: lastActiveStar.current.position,
        end: closestStar.position,
        opacity: 1.0,
      }]);
    }
    if (closestStar) lastActiveStar.current = closestStar;

    if (lines.length > 0) {
      setLines((prev) => prev.map(l => ({ ...l, opacity: l.opacity - 0.02 })).filter(l => l.opacity > 0));
    }
  });

  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={stars.length} array={new Float32Array(stars.flatMap(s => [s.position.x, s.position.y, s.position.z]))} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#00f0ff" transparent opacity={0.8} />
      </points>
      {lines.map(line => <Line key={line.id} points={[line.start, line.end]} color="#7000ff" lineWidth={2} transparent opacity={line.opacity} />)}
    </>
  );
};

/**
 * COMPONENT: NeuralNetwork
 * The Canvas wrapper that holds the 3D scene.
 */
function NeuralNetwork() {
  return (
    <div className="neural-bg">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        {/* Dark Background */}
        <color attach="background" args={['#050505']} />
        
        {/* Scene Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Distant Background Stars */}
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        {/* Interactive Constellation Logic */}
        <Constellation />
        
        {/* Camera Controls (Restricted for Portfolio feel) */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={true} 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}

// Holographic Glass Project Card Component
const HolographicProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTechColor = (tech) => {
    const techColors = {
      'React': '#3b82f6',
      'Python': '#eab308',
      'AWS': '#f97316',
      'Node': '#10b981',
      'MongoDB': '#10b981',
      'JavaScript': '#f59e0b',
      'CSS': '#06b6d4',
      'HTML': '#ef4444',
      'Firebase': '#fbbf24',
      'Tailwind': '#06b6d4',
      'Docker': '#2496ed',
      'SQL': '#3b82f6',
      'C++': '#00599c',
      'Java': '#f89820',
      'Git': '#f05032',
      'Redux': '#764abc',
      'Express': '#000000',
      'Socket': '#010101',
      'JWT': '#000000',
      'Chart': '#ff6384',
      'PyTorch': '#ee4c2c',
      'TensorFlow': '#ff6f00',
      'OpenCV': '#5c3ee8',
      'Pandas': '#150458',
      'NumPy': '#013243',
      'Matplotlib': '#11557c',
      'Power': '#f2c811',
      'Excel': '#217346',
      'Seaborn': '#3b82f6',
      'LangChain': '#1c3c6c',
      'RAG': '#6366f1',
      'LLMs': '#8b5cf6',
      'XAI': '#ec4899',
      'RLHF': '#14b8a6',
      'SHAP': '#6366f1',
      'LIME': '#84cc16',
      'MERN': '#10b981',
      'Next': '#000000',
      'GCP': '#4285f4',
      'Lambda': '#ff9900',
      'SageMaker': '#ff9900',
      'n8n': '#ff6d5a',
      'Postman': '#ff6c37',
      'Vercel': '#000000',
      'OpenSearch': '#005571',
      'Pinecone': '#ee4c2c',
      'Google': '#4285f4',
      'ADK': '#4285f4',
      'Webhook': '#6366f1',
      'Gmail': '#ea4335',
      'Supabase': '#3ecf8e',
      'PostgreSQL': '#336791',
      'Groq': '#00d4aa',
      'Llama': '#f59e0b',
      'Framer': '#0055ff',
      'Motion': '#0055ff',
      'Vite': '#646cff',
      'Twilio': '#f22f46',
      'WhatsApp': '#25d366',
      'Connect': '#ff9900',
      'Lex': '#ff9900',
      'Bedrock': '#ff9900',
      'Titan': '#ff9900',
      'Claude': '#ff9900',
      'DynamoDB': '#4053d3',
      'S3': '#569a31',
      'API': '#6366f1',
      'Gemini': '#4285f4',
      'Auth': '#f59e0b',
      'Firestore': '#ffca28',
      'Socket.io': '#010101',
      'Toolkit': '#764abc',
      'Chart.js': '#ff6384',
      'Keras': '#d00000',
      'ViT': '#8b5cf6',
      'CNN': '#3b82f6',
      'PEFT': '#10b981',
      'Transformers': '#ff9900',
      'XGBoost': '#017143',
      'LightGBM': '#6366f1',
      'Time-LLM': '#8b5cf6',
      'FinBERT': '#f59e0b',
      'VMD': '#ef4444'
    };
    
    for (const [key, color] of Object.entries(techColors)) {
      if (tech.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }
    return '#6366f1'; // Default purple
  };

  return (
    <motion.div
      className="holographic-card"
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.05,
        rotateX: 0,
        rotateY: 5,
        z: 50
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Glassmorphism Background */}
      <div className="glass-background" />
      
      {/* Glowing Border */}
      <div 
        className="glowing-border"
        style={{
          background: isHovered 
            ? `linear-gradient(45deg, ${getTechColor(project.techStack[0])}, ${getTechColor(project.techStack[1] || 'React')}, ${getTechColor(project.techStack[2] || 'Python')})`
            : 'linear-gradient(45deg, rgba(0, 240, 255, 0.3), rgba(112, 0, 255, 0.3), rgba(0, 240, 255, 0.3))'
        }}
      />
      
      {/* Content */}
      <div className="card-content">
        <motion.h3 
          className="project-title"
          animate={{
            textShadow: isHovered 
              ? '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(112, 0, 255, 0.6)' 
              : '0 0 10px rgba(0, 240, 255, 0.3)'
          }}
        >
          {project.title}
        </motion.h3>
        
        <motion.p 
          className="project-description"
          animate={{
            opacity: isHovered ? 1 : 0.8,
            color: isHovered ? '#ffffff' : '#b0b0b0'
          }}
        >
          {project.description}
        </motion.p>
        
        {/* Tech Stack Tags */}
        <div className="tech-stack-container">
          {project.techStack.slice(0, 4).map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              className="tech-pill"
              initial={{ opacity: 0.3, scale: 0.9 }}
              animate={{
                opacity: isHovered ? 1 : 0.6,
                scale: isHovered ? 1.1 : 1,
                borderColor: getTechColor(tech),
                backgroundColor: isHovered 
                  ? `${getTechColor(tech)}20` 
                  : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isHovered 
                  ? `0 0 15px ${getTechColor(tech)}40`
                  : 'none'
              }}
              transition={{ delay: techIndex * 0.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
        
        {/* View Project Button */}
       {/* Action Buttons */}
      <div className="project-actions" style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
        
        {/* Live Link */}
        {project.liveLink && (
          <motion.a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="view-project-btn"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="circuit-line" />
            Live Demo
            <span className="circuit-line" />
          </motion.a>
        )}

        {/* GitHub Link */}
        {project.githubLink && (
          <motion.a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="view-project-btn"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(189, 0, 255, 0.6)' // Optional: Purple glow for GitHub
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="circuit-line" />
            GitHub
            <span className="circuit-line" />
          </motion.a>
        )}
        
      </div>
      </div>
      
      {/* Ambient Glow Effect */}
      <motion.div 
        className="ambient-glow"
        animate={{
          opacity: isHovered ? 0.3 : 0.1,
          scale: isHovered ? 1.2 : 1
        }}
      />
    </motion.div>
  );
};

// Projects data
const holographicProjects = [
  {
    title: 'CivicBot',
    description: 'AI-Powered Serverless Civic Complaint Platform - Multi-channel grievance redressal with GenAI categorization and RAG-based chatbot.',
    techStack: ['AWS', 'Lambda', 'Bedrock', 'DynamoDB', 'Twilio', 'Python'],
    liveLink: null, // Set to 'https://...' if you have one
    githubLink: 'https://github.com/pavithra2870/CivicBot' 
  },
  {
    title: 'OneStop.25',
    description: 'Real-Time GenAI User Reflection & Milestone Analytics - Personalized year-in-review insights with Gemini 1.5 Pro.',
    techStack: ['React', 'Firebase', 'Gemini', 'Framer', 'Tailwind', 'Vercel'],
    liveLink: 'https://onestop25.vercel.app', 
    githubLink: 'https://github.com/yourusername/onestop25'
  },
  {
    title: 'FocusWin-Spaces',
    description: 'Real-Time Collaborative Task Engine - Productivity suite with live synchronization and distraction-free focus mode.',
    techStack: ['MERN', 'Firebase', 'Cloud Functions', 'Render', 'Tailwind'],
    liveLink: 'https://focuswin-frontend.onrender.com/',
    githubLink: 'https://github.com/pavithra2870/FocusWin-Firebase'
  },
  {
    title: 'SafeSpace',
    description: 'AI-Powered Mood Journal & Mental Wellness Companion - Sentiment analysis with coping strategies and mood tracking.',
    techStack: ['React', 'Node', 'MongoDB', 'Groq', 'Chart.js', 'Tailwind'],
    liveLink: null,
    githubLink: 'https://github.com/pavithra2870/SafeSpace---Journal'
  },
  {
    title: 'Brain Stroke Detection',
    description: 'Hybrid CNN + ViT Medical Imaging Model - Advanced diagnostic tool combining local and global feature extraction.',
    techStack: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'CNN', 'ViT'],
    liveLink: null,
    githubLink: 'https://github.com/pavithra2870/BrainStrokeDetection'
  },
  {
    title: 'Personal Automation Agents',
    description: 'Autonomous Workflow Orchestration - Self-hosted AI agents for lead enrichment, documentation, and support automation.',
    techStack: ['n8n', 'Docker', 'PostgreSQL', 'Supabase', 'API'],
    liveLink: null,
    githubLink: 'https://github.com/pavithra2870/n8n'
  },
  {
    title: 'Trainity Data Analytics',
    description: 'End-to-End Business Intelligence Pipelines - Comprehensive data analytics with ETL pipelines and interactive dashboards.',
    techStack: ['Python', 'SQL', 'Power BI', 'Excel', 'Pandas', 'Matplotlib'],
    liveLink: null,
    githubLink: 'https://github.com/pavithra2870/Trainity'   
  }
];
// Holographic Projects Section
const HolographicProjects = () => {
  return (
    <section id="projects" className="holographic-projects-section">
      {/* Animated Background */}
      <div className="nebula-background">
        <div className="aurora-gradient aurora-1" />
        <div className="aurora-gradient aurora-2" />
        <div className="aurora-gradient aurora-3" />
      </div>
      
      <div className="section-container">
        <motion.h2 
          className="holographic-section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Projects
        </motion.h2>
        
        {/* Project Stack/Grid */}
        <div className="holographic-grid">
          {holographicProjects.map((project, index) => (
            <HolographicProjectCard 
              key={index} 
              project={{
                ...project,
                // Ensure the links are explicitly passed down
                liveLink: project.liveLink || null,
                githubLink: project.githubLink || null
              }} 
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Research Card Component
const ResearchCard = ({ title, description, tags }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="research-card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3 className="research-title">{title}</motion.h3>
      <motion.p className="research-description">{description}</motion.p>
      <div className="tech-tags">
        {tags.map((tag, index) => (
          <span key={index} className="tech-tag">{tag}</span>
        ))}
      </div>
      <motion.div 
        className="card-glow"
        animate={{
          opacity: isHovered ? 0.3 : 0.1,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// Experience Timeline Component
const Experience = () => {
  const experiences = [
    {
      role: 'SDE Intern',
      company: 'Kognitive Networks',
      points: [
        'Architected a production-grade RAG search bot on AWS (Bedrock + OpenSearch Serverless) to democratize internal knowledge access.',
        'Engineered an XGBoost-based forecasting system for TCP/RTP streams to predict Quality of Experience (QoE) in real-time.',
        'Built a scalable agent using n8n and Pinecone to automate customer support tickets.',
        'Developed an AI-driven analytics engine on Google ADK for optimizing network usage in maritime environments.'
      ]
    }
  ];

  return (
    <div id="internship" className="experience-container">
      <h2 className="section-title">The Path</h2>

      <div className="timeline">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <div className="timeline-dot" />

            <div className="timeline-content">
              <h3>{exp.role} · {exp.company}</h3>
              <ul>
                {exp.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Tech Stack Component
const TechStack = () => {
  const techStack = [
    // Core
    'Python', 'C++', 'JavaScript', 'SQL',
    // AI/ML
    'PyTorch', 'TensorFlow', 'LangChain', 'RAG', 'LLMs', 'XAI', 'RLHF', 'SHAP', 'LIME',
    // Web & Cloud
    'MERN', 'Next.js', 'AWS', 'GCP', 'Docker', 'Firebase', 'Lambda', 'SageMaker',
    // Tools
    'n8n', 'Git', 'Postman', 'Vercel', 'OpenSearch', 'Pinecone'
  ];

  return (
    <div className="tech-stack" id="tech-stack">
      <h2 className="section-title">The Engine</h2>
      <div className="tag-cloud">
        {techStack.map((tech, index) => (
          <motion.span
            key={index}
            className="tech-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ 
              y: -5,
              textShadow: '0 0 10px rgba(0, 240, 255, 0.7)',
              scale: 1.1
            }}
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

// About Section Component
const About = () => (
  <motion.section
    id="intro"
    className="about-section"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
  >
    <h2 className="section-title">About Me</h2>
    <div className="about-content">
      <p>
        I am <span className="highlight">Pavithra K R</span>, a 3rd year B.Tech CSE (AI/ML) student at VIT Chennai with a CGPA of 9.23. 
        I am interested in <span className="highlight">Explainable AI (XAI) </span>, <span className="highlight">Multi-Agent Systems </span>, <span className="highlight">ML and Data Pipelines</span>
        , <span className="highlight"> Automations. </span>
      </p>
      <p>
       I am passionate about working at the intersection of Various Domains (marketing, advertising, operations, education, law) and Technology.
      </p>
      <p>
        In my previous internship, I worked on production-grade RAG systems, 
        predictive network analytics and AI-driven automation solutions on AWS and GCP.
      </p>
    
      <p className="signature">
       I love to own and build products that solve real-world problems. Not just code.
      </p>
    </div>
  </motion.section>
);

// Main App Component
function App() {
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const subtitles = [
    "AI/ML", "Data","Web Development", "GenAI", "Architecting Systems", "Explainable AI"
  ];

  // Auto-rotate subtitles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  // Research projects data
  const researchProjects = [
    {
      title: 'AI-Assisted Human-in-the-Loop Relative Grading System',
      description: 'A comparative marking system that learns a teacher\'s grading patterns using Reinforcement Learning from Human Feedback (RLHF). It moves beyond absolute scoring to "relative grading" by comparing answer sheets against a cohort.',
      tags: ['RLHF', 'XAI', 'LLMs', 'Vector DBs']
    },
    {
      title: 'Deep Learning for Stock Fibonacci Algorithm Validation',
      description: 'A multimodal semantic analysis tool that validates Fibonacci retracement levels for stock prediction. It visualizes market trends and predicts buy/sell zones with high precision using Variational Mode Decomposition (VMD) and Hybrid DL models.',
      tags: ['PyTorch', 'Time-LLM', 'FinBERT', 'VMD']
    },
    {
      title: 'Fairness-Ensuring Legal AI Agent',
      description: 'A specialized Multi-Agent Framework designed to assist legal professionals while ensuring strict adherence to fairness and regulatory compliance using PEFT-RAG (Parameter-Efficient Fine-Tuning + Retrieval Augmented Generation).',
      tags: ['LangChain', 'RAG', 'PEFT', 'Transformers']
    },
    {
      title: 'XAI Advertiser-Centric RTB',
      description: 'Revolutionizing the AdTech industry by applying XAI to Real-Time Bidding, providing transparency to advertisers about why their brand was chosen (or not) for specific ad inventory.',
      tags: ['XGBoost', 'LightGBM', 'SHAP', 'Python']
    }
  ];

  return (
    <div className="app">
      {/* Hero Section */}
      <section className="hero">
      
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 1 }}
            transition={{ duration: 0.8 }}
          >
            Pavithra K R
          </motion.h1>
          <div className="subtitle-container">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={currentSubtitle}
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {subtitles[currentSubtitle]}
              </motion.h2>
            </AnimatePresence>
          </div>
          <p className="subtitle">
             3rd year | VIT Chennai | 9.23 CGPA | B.Tech CSE | AI/ML | Web Development | GenAI | Agents
          </p>
          <div className="social-links">
          <a href="https://github.com/pavithra2870" target="_blank" className="social-link">GitHub</a>
          <a href="https://www.linkedin.com/in/pavithra-k-r-9b2a84314/" target="_blank" className="social-link">LinkedIn</a>
          <a href="https://leetcode.com/u/pavithrakr28/" target="_blank" className="social-link">Leetcode</a>
          <a href="https://codolio.com/profile/pavithra28" target="_blank" className="social-link">Codolio</a>
          <a href="https://www.codechef.com/users/pavithrakrvitc" target="_blank" className="social-link">CodeChef</a>
        </div>

        </div>
        <div className="hero-visual">
          <Canvas 
      camera={{ position: [0, 0, 15], fov: 60 }}
      gl={{ alpha: true }} /* IMPORTANT: Enables transparency */
    >
            <ambientLight intensity={0.5} />
            <Stars radius={60} depth={50} count={2000} factor={4} saturation={0} fade />
            <Constellation />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>
      </section>
      <Navbar />
<About />
      {/* Holographic Projects Section */}
      <HolographicProjects />

      {/* Research Grid */}
      <section id="ongoing" className="research-section">
        <h2 className="section-title">Research & Projects</h2>
        <div className="research-grid">
          {researchProjects.map((project, index) => (
            <ResearchCard 
              key={index}
              title={project.title}
              description={project.description}
              tags={project.tags}
            />
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <Experience />

      {/* Tech Stack */}
      <TechStack />

      {/* About Section */}
      

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Pavithra K R. All rights reserved.</p>
        
      </footer>
    </div>
  );
}

export default App;
