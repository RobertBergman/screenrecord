import React, { useState, useEffect } from 'react';
import './styles.css';
import { useAppContext } from '../../contexts/AppContext';
import { SlideProvider } from '../../contexts/SlideContext';
import SlideContent from '../SlideContent';
import SettingsModal from '../SettingsModal';
import TTSService from '../../services/TTSService';

/**
 * Main component that integrates slide functionality into the app
 */
const SlideModule: React.FC = () => {
  const { dispatch } = useAppContext();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Load API key from localStorage on mount and initialize TTS service
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      TTSService.initializeOpenAI(savedApiKey);
    }
  }, []);
  
  // Open settings modal
  const handleOpenSettings = () => {
    setIsSettingsModalOpen(true);
  };
  
  // Close settings modal
  const handleCloseSettings = () => {
    setIsSettingsModalOpen(false);
  };
  
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
          <div className="slide-module-header-content">
            <h2 className="slide-module-title">Markdown Slides</h2>
            <p className="slide-module-description">
              Create and record presentations using Markdown syntax
            </p>
          </div>
          <button 
            className="settings-button"
            onClick={handleOpenSettings}
            title="Configure TTS API key and other settings"
          >
            ⚙️ Settings
          </button>
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
        
        {/* Settings Modal */}
        <SettingsModal 
          isOpen={isSettingsModalOpen}
          onClose={handleCloseSettings}
        />
      </div>
    </SlideProvider>
  );
};

export default SlideModule;
