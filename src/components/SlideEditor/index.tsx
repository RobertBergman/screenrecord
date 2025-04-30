import React, { useState, useEffect } from 'react';
import './styles.css';
import { useSlides } from '../../contexts/SlideContext';
import SlideRenderer from '../SlideRenderer';

/**
 * Component for editing slides using markdown
 */
const SlideEditor: React.FC = () => {
  const { 
    state, 
    createNewSlide, 
    updateSlideContent,
    updateSlideScript, 
    navigateToSlide,
    navigateNext,
    navigatePrevious,
    importFromMarkdown,
    exportToMarkdown
  } = useSlides();
  
  const { slides, currentSlideIndex, editMode } = state;
  const currentSlide = slides[currentSlideIndex];
  
  const [markdownInput, setMarkdownInput] = useState<string>('');
  const [scriptInput, setScriptInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'content' | 'script'>('content');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');

  // Update the editor content when the current slide changes
  useEffect(() => {
    if (currentSlide) {
      setMarkdownInput(currentSlide.content);
      setScriptInput(currentSlide.script || '');
    }
  }, [currentSlide]);

  // Handle slide content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownInput(e.target.value);
    if (currentSlide) {
      updateSlideContent(currentSlide.id, e.target.value);
    }
  };
  
  // Handle slide script changes
  const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScriptInput(e.target.value);
    if (currentSlide) {
      updateSlideScript(currentSlide.id, e.target.value);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Arrow for navigation
    if (e.ctrlKey) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrevious();
      }
    }
  };

  // Import markdown content
  const handleImport = () => {
    importFromMarkdown(importText);
    setImportModalOpen(false);
    setImportText('');
  };

  // Export markdown content
  const handleExport = () => {
    const markdown = exportToMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slides.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!editMode) {
    return null;
  }

  return (
    <div className="slide-editor" onKeyDown={handleKeyDown}>
      <div className="slide-editor-toolbar">
        <div className="slide-editor-actions">
          <button onClick={createNewSlide}>New Slide</button>
          <button onClick={() => setImportModalOpen(true)}>Import</button>
          <button onClick={handleExport}>Export</button>
        </div>
        
        <div className="slide-navigation">
          <button 
            onClick={navigatePrevious}
            disabled={currentSlideIndex === 0}
          >
            Previous
          </button>
          <span>{`${currentSlideIndex + 1} / ${slides.length}`}</span>
          <button 
            onClick={navigateNext}
            disabled={currentSlideIndex === slides.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      
      <div className="slide-editor-tabs">
        <button 
          className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={`tab-button ${activeTab === 'script' ? 'active' : ''}`}
          onClick={() => setActiveTab('script')}
        >
          Script
        </button>
      </div>
      
      <div className="slide-editor-content">
        {activeTab === 'content' ? (
          <div className="markdown-editor">
            <textarea
              value={markdownInput}
              onChange={handleContentChange}
              placeholder="# Write your slide content in Markdown"
            />
          </div>
        ) : (
          <div className="script-editor">
            <textarea
              value={scriptInput}
              onChange={handleScriptChange}
              placeholder="Enter the script for text-to-speech narration"
            />
            <div className="script-info">
              <p>This script will be used for text-to-speech narration in presentation mode.</p>
              <p>If no script is provided, the slide content will be used instead.</p>
            </div>
          </div>
        )}
        
        <div className="slide-preview">
          {currentSlide ? (
            <SlideRenderer slide={currentSlide} />
          ) : (
            <div className="empty-slide-message">
              <p>No slides yet. Create a new slide to get started.</p>
              <button onClick={createNewSlide}>Create First Slide</button>
            </div>
          )}
        </div>
      </div>

      {/* Slide thumbnails */}
      <div className="slide-thumbnails">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`slide-thumbnail ${index === currentSlideIndex ? 'active' : ''}`}
            onClick={() => navigateToSlide(index)}
          >
            <div className="thumbnail-number">{index + 1}</div>
            <div className="thumbnail-content">
              {slide.content.substring(0, 50)}
            </div>
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {importModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Import Markdown</h2>
            <p>Paste your markdown content below. Use '---' to separate slides.</p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="# Slide 1&#10;&#10;Content for slide 1&#10;&#10;---&#10;&#10;# Slide 2&#10;&#10;Content for slide 2"
              rows={10}
            />
            <div className="modal-actions">
              <button onClick={() => setImportModalOpen(false)}>Cancel</button>
              <button onClick={handleImport}>Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideEditor;
