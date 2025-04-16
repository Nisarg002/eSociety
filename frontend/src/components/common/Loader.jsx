import React from "react";
import { useState, useEffect } from "react";
import "./loader.css"; // You'll need to create this CSS file separately

// Loader 1: Pulse Loader
export const PulseLoader = () => {
  return (
    <div className="loader-container">
      <div className="pulse-loader">
        <div className="pulse-circle pulse-circle-outer"></div>
        <div className="pulse-circle pulse-circle-middle"></div>
        <div className="pulse-circle pulse-circle-inner"></div>
      </div>
      <div className="loader-text">LOADING</div>
    </div>
  );
};

// Loader 2: Circle Loader with Gradient
export const CircleLoader = () => {
  return (
    <div className="loader-container">
      <div className="circle-loader-wrapper">
        <svg className="circle-loader-svg" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1c2a44"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#64ffda"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset="100"
            className="circle-loader-progress"
          />
        </svg>
        <div className="circle-loader-dots">...</div>
      </div>
      <div className="loader-text-muted">PROCESSING</div>
    </div>
  );
};

// Loader 3: Progress Bar Loader
export const ProgressBarLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="progress-loader-container">
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progress}%`,
            transition: "width 0.15s ease-in-out",
          }}
        />
      </div>
      <div className="progress-bar-stats">
        <span>LOADING</span>
        <span>{progress}%</span>
      </div>
      <div className="progress-bar-dots">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="progress-dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Loader 4: Dots Loader
export const DotsLoader = () => {
  return (
    <div className="loader-container">
      <div className="dots-loader">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="dot"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
      <div className="loader-text-wide">PLEASE WAIT</div>
    </div>
  );
};

// Loader 5: Bouncing Balls Loader
export const BouncingBallsLoader = () => {
  return (
    <div className="loader-container">
      <div className="bouncing-balls-container">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bouncing-ball"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
      {/* <div className="bouncing-progress-bar">
        <div className="bouncing-progress-fill"></div>
      </div> */}
    </div>
  );
};

// Main component that showcases all loaders
const ModernLoaders = () => {
  const [activeLoader, setActiveLoader] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLoader((prev) => (prev + 1) % 5);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loaders-showcase">
      <h2 className="showcase-title">Modern Loader Collection</h2>

      <div className="loader-navigation">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => setActiveLoader(index)}
            className={`nav-dot ${activeLoader === index ? "active" : ""}`}
            aria-label={`Show loader ${index + 1}`}
          />
        ))}
      </div>

      <div className="loader-display">
        {activeLoader === 0 && <PulseLoader />}
        {activeLoader === 1 && <CircleLoader />}
        {activeLoader === 2 && <ProgressBarLoader />}
        {activeLoader === 3 && <DotsLoader />}
        {activeLoader === 4 && <BouncingBallsLoader />}
      </div>
    </div>
  );
};

// Export all components
export { ModernLoaders };

// Default export for the main component
export default ModernLoaders;
