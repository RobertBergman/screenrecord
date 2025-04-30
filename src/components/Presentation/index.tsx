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
        
        <button 
          className="presentation-control-btn exit"
          onClick={togglePresentationMode}
        >
          Exit
        </button>
      </div>
      
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
