import React, { useEffect, useCallback, useState } from 'react';
import './styles.css';
import { useSlides } from '../../contexts/SlideContext';
import SlideRenderer from '../SlideRenderer';

/**
 * Component for presentation mode showing slides in fullscreen
 */
const Presentation: React.FC = () => {
  const { 
    state, 
    navigateNext, 
    navigatePrevious, 
    togglePresentationMode,
    toggleAutoPlayMode,
    playCurrentSlide,
    stopSpeech,
    isCurrentlyPlaying
  } = useSlides();
  
  const { slides, currentSlideIndex, presentationMode, autoPlayMode } = state;
  const [speakingStatus, setSpeakingStatus] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(true); // Show help popup by default
  const currentSlide = slides[currentSlideIndex];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
      navigateNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      navigatePrevious();
    } else if (e.key === 'Escape') {
      togglePresentationMode();
    } else if (e.key === 'p' || e.key === 'P') {
      // Play/pause current slide with 'p' key
      handlePlayCurrentSlide();
    } else if (e.key === 'a' || e.key === 'A') {
      // Toggle autoplay with 'a' key
      toggleAutoPlayMode();
    }
  }, [navigateNext, navigatePrevious, togglePresentationMode, toggleAutoPlayMode]);

  // Check speaking status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeakingStatus(isCurrentlyPlaying());
    }, 500);
    
    return () => clearInterval(interval);
  }, [isCurrentlyPlaying]);

  // Set up keyboard event listeners
  useEffect(() => {
    if (presentationMode) {
      window.addEventListener('keydown', handleKeyDown);
      // Apply fullscreen body class
      document.body.classList.add('presentation-mode');
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('presentation-mode');
      // Stop any ongoing speech when exiting presentation mode
      stopSpeech();
    };
  }, [presentationMode, handleKeyDown, stopSpeech]);
  
  // Handler for playing current slide
  const handlePlayCurrentSlide = async () => {
    if (isCurrentlyPlaying()) {
      stopSpeech();
    } else {
      await playCurrentSlide();
    }
  };

  if (!presentationMode) {
    return null;
  }

  return (
    <div className="presentation-container">
      <div className="presentation-content">
        {currentSlide ? (
          <SlideRenderer slide={currentSlide} fullscreen={true} />
        ) : (
          <div className="empty-presentation-message">
            No slides available.
          </div>
        )}
      </div>
      
      <div className="presentation-controls">
        <div className="presentation-navigation">
          <button 
            className="presentation-control-btn previous"
            onClick={navigatePrevious}
            disabled={currentSlideIndex === 0}
          >
            ←
          </button>
          
          <div className="presentation-progress">
            {currentSlideIndex + 1} / {slides.length}
          </div>
          
          <button 
            className="presentation-control-btn next"
            onClick={navigateNext}
            disabled={currentSlideIndex === slides.length - 1}
          >
            →
          </button>
        </div>
        
        <div className="presentation-audio-controls">
          <button 
            className={`presentation-control-btn play ${speakingStatus ? 'speaking' : ''}`}
            onClick={handlePlayCurrentSlide}
            title={speakingStatus ? "Stop speaking" : "Play this slide"}
          >
            {speakingStatus ? '◼' : '▶'}
          </button>
          
          <button 
            className={`presentation-control-btn autoplay ${autoPlayMode ? 'active' : ''}`}
            onClick={toggleAutoPlayMode}
            title={autoPlayMode ? "Turn off auto-play" : "Turn on auto-play"}
          >
            {autoPlayMode ? '⟳' : '⟲'}
          </button>
        </div>
        
        <div className="presentation-control-buttons">
          <button 
            className="presentation-control-btn help"
            onClick={() => setShowHelpPopup(!showHelpPopup)}
            title="Show/Hide Help"
          >
            ?
          </button>
          
          <button 
            className="presentation-control-btn exit"
            onClick={togglePresentationMode}
          >
            Exit
          </button>
        </div>
      </div>
      
      {/* Help Popup */}
      {showHelpPopup && (
        <div className="presentation-help-popup">
          <div className="help-popup-header">
            <h3>Presentation Controls</h3>
            <button onClick={() => setShowHelpPopup(false)}>×</button>
          </div>
          <div className="help-popup-content">
            <h4>Keyboard Controls:</h4>
            <ul>
              <li><strong>Right Arrow / Space / Page Down:</strong> Next slide</li>
              <li><strong>Left Arrow / Page Up:</strong> Previous slide</li>
              <li><strong>P:</strong> Play/pause text-to-speech for current slide</li>
              <li><strong>A:</strong> Toggle auto-play mode</li>
              <li><strong>Escape:</strong> Exit presentation</li>
            </ul>
            
            <h4>On-Screen Controls:</h4>
            <ul>
              <li><strong>← / →:</strong> Navigate between slides</li>
              <li><strong>▶/◼:</strong> Play/stop text-to-speech for current slide</li>
              <li><strong>⟲/⟳:</strong> Toggle auto-play mode</li>
              <li><strong>?:</strong> Show/hide this help</li>
              <li><strong>Exit:</strong> Exit presentation mode</li>
            </ul>
            
            <h4>Text-to-Speech Setup:</h4>
            <p>To use the text-to-speech feature:</p>
            <ol>
              <li>Click <strong>Settings</strong> in the main interface</li>
              <li>Enter your OpenAI API key in the settings modal</li>
              <li>Click Save to enable high-quality text-to-speech</li>
            </ol>
            <p>Without an API key, the presentation will use your browser's built-in speech synthesis (quality may vary).</p>
            
            <h4>Auto-Play Mode:</h4>
            <p>When auto-play is enabled (⟳), each slide will be read aloud, followed by automatic advancement to the next slide.</p>
          </div>
        </div>
      )}
      
      {/* Speaker notes if available */}
      {currentSlide && currentSlide.notes && (
        <div className="speaker-notes">
          <h3>Speaker Notes</h3>
          <div className="notes-content">
            {currentSlide.notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default Presentation;
