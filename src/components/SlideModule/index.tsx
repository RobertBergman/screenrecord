import React from 'react';
import './styles.css';
import { useAppContext } from '../../contexts/AppContext';
import { SlideProvider } from '../../contexts/SlideContext';
import SlideContent from '../SlideContent';

/**
 * Main component that integrates slide functionality into the app
 */
const SlideModule: React.FC = () => {
  const { dispatch } = useAppContext();
  
  const handleStartRecording = () => {
    // Move to recording controls when ready to record the presentation
    dispatch({
      type: 'SET_ACTIVE_PANEL',
      panel: 'controls',
    });
  };
  
  const handleBackToSource = () => {
    // Go back to source selection
    dispatch({
      type: 'SET_ACTIVE_PANEL',
      panel: 'source',
    });
  };

  return (
    <SlideProvider>
      <div className="slide-module">
        <div className="slide-module-header">
          <h2 className="slide-module-title">Markdown Slides</h2>
          <p className="slide-module-description">
            Create and record presentations using Markdown syntax
          </p>
        </div>

        <div className="slide-module-content">
          <SlideContent />
        </div>

        <div className="slide-module-footer">
          <button 
            className="slide-module-btn back-btn"
            onClick={handleBackToSource}
          >
            Back to Source Selection
          </button>
          <button 
            className="slide-module-btn record-btn"
            onClick={handleStartRecording}
          >
            Record Presentation
          </button>
        </div>
      </div>
    </SlideProvider>
  );
};

export default SlideModule;
