import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import { useAppContext } from '../../contexts/AppContext';
import { SlideProvider, useSlides } from '../../contexts/SlideContext';
import SlideContent from '../SlideContent';
import SettingsModal from '../SettingsModal';
import TTSService from '../../services/TTSService';

/**
 * File Import Handler component - uses SlideContext directly
 */
const FileImportHandler: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  preloadedContent?: string | null;
}> = ({ isOpen, onClose, fileInputRef, preloadedContent }) => {
  const { importFromMarkdown } = useSlides();
  
  // Use preloaded content if available
  useEffect(() => {
    if (isOpen && preloadedContent) {
      importFromMarkdown(preloadedContent);
      onClose();
    }
  }, [isOpen, preloadedContent, importFromMarkdown, onClose]);
  
  // Handle file selection from file input (handled directly in the input element's onChange)
  // const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const content = e.target?.result as string;
  //       importFromMarkdown(content);
  //       onClose();
  //     };
  //     reader.readAsText(file);
  //   }
  // };
  
  // Handle file drop for drag and drop functionality
  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'text/markdown' || file.name.endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importFromMarkdown(content);
        onClose();
      };
      reader.readAsText(file);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div 
        className="modal-content import-modal"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <h2>Import Markdown Presentation</h2>
        <div className="import-area">
          <p>Drag and drop your presentation file here, or</p>
          <button 
            className="import-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </button>
          <p className="file-info">Accepts .md (Markdown) files</p>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main component that integrates slide functionality into the app
 */
const SlideModule: React.FC = () => {
  const { dispatch } = useAppContext();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFileImportModalOpen, setIsFileImportModalOpen] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load API key from localStorage on mount and initialize TTS service
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      TTSService.initializeOpenAI(savedApiKey);
    }
    
    // Check for 'openfile' parameter in URL query string
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has('openfile')) {
      setIsFileImportModalOpen(true);
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
  
  // Open file import modal
  const handleOpenFileImport = () => {
    setIsFileImportModalOpen(true);
  };
  
  // Close file import modal
  const handleCloseFileImport = () => {
    setIsFileImportModalOpen(false);
    setSelectedFileContent(null); // Reset the file content after closing
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
        <input 
          type="file" 
          ref={fileInputRef}
          accept=".md" 
          style={{ display: 'none' }} 
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (evt) => {
                // Store the content and open the modal
                setSelectedFileContent(evt.target?.result as string);
                setIsFileImportModalOpen(true);
              };
              reader.readAsText(file);
            }
          }}
        />
        
        <div className="slide-module-header">
          <div className="slide-module-header-content">
            <h2 className="slide-module-title">Markdown Slides</h2>
            <p className="slide-module-description">
              Create and record presentations using Markdown syntax
            </p>
          </div>
          <div className="slide-module-header-buttons">
            <button 
              className="file-button"
              onClick={handleOpenFileImport}
              title="Open exported presentation file"
            >
              📂 Open File
            </button>
            <button 
              className="settings-button"
              onClick={handleOpenSettings}
              title="Configure TTS API key and other settings"
            >
              ⚙️ Settings
            </button>
          </div>
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
        
        {/* File Import Modal */}
        <FileImportHandler
          isOpen={isFileImportModalOpen}
          onClose={handleCloseFileImport}
          fileInputRef={fileInputRef}
          preloadedContent={selectedFileContent}
        />
      </div>
    </SlideProvider>
  );
};

export default SlideModule;
