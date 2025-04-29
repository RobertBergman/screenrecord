import React, { useEffect, useCallback } from 'react';
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
    togglePresentationMode 
  } = useSlides();
  
  const { slides, currentSlideIndex, presentationMode } = state;
  const currentSlide = slides[currentSlideIndex];

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'PageDown') {
      navigateNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      navigatePrevious();
    } else if (e.key === 'Escape') {
      togglePresentationMode();
    }
  }, [navigateNext, navigatePrevious, togglePresentationMode]);

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
    };
  }, [presentationMode, handleKeyDown]);

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
