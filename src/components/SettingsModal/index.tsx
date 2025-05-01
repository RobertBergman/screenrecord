import React, { useState, useEffect } from 'react';
import './styles.css';
import TTSService from '../../services/TTSService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Component for configuring application settings
 */
const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Load saved API key on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  // Handle API key change
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    setSaveStatus('idle');
  };
  
  // Save API key and initialize TTS service
  const handleSaveSettings = () => {
    try {
      // Save API key to localStorage
      localStorage.setItem('openai_api_key', apiKey);
      
      // Initialize TTS service with the API key
      TTSService.initializeOpenAI(apiKey);
      
      // Show success message
      setSaveStatus('success');
      
      // Reset status after delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    }
  };
  
  // Don't render if not open
  if (!isOpen) return null;
  
  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <div className="settings-modal-header">
          <h2>Application Settings</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-modal-content">
          <div className="settings-section">
            <h3>Text-to-Speech Settings</h3>
            <p className="settings-description">
              Enter your OpenAI API key to enable high-quality text-to-speech narration for slides.
              If no key is provided, the browser's built-in speech synthesis will be used as a fallback.
            </p>
            
            <div className="form-group">
              <label htmlFor="apiKey">OpenAI API Key:</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="sk-..."
                className="api-key-input"
              />
              <div className="api-key-info">
                <small>
                  Your API key is stored locally in your browser and is never sent to our servers.
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI's website</a>.
                </small>
              </div>
            </div>
          </div>
          
          <div className="settings-actions">
            <button 
              className="save-settings-button" 
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
            
            {saveStatus === 'success' && (
              <div className="settings-status success">
                Settings saved successfully!
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="settings-status error">
                Error saving settings. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
