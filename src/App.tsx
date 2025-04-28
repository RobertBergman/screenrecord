import React from 'react';
import styled from 'styled-components';
import { AppProvider, useAppContext } from './contexts/AppContext';
import MediaSourceSelector from './components/MediaSourceSelector';
import PreviewPanel from './components/PreviewPanel';
import RecordingControls from './components/RecordingControls';
import OutputManager from './components/OutputManager';
import { checkAppCompatibility } from './utils/featureDetection';

// Styled components
const AppContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const AppHeader = styled.header`
  margin-bottom: 40px;
  text-align: center;
`;

const AppTitle = styled.h1`
  color: #333;
  font-size: 32px;
  margin: 0 0 8px 0;
`;

const AppSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  margin: 0;
`;

const MainContent = styled.main`
  margin-bottom: 40px;
`;

const IncompatibleBrowserMessage = styled.div`
  background-color: #ffebee;
  color: #d32f2f;
  padding: 20px;
  border-radius: 8px;
  margin: 40px 0;
  text-align: center;
`;

const Footer = styled.footer`
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 60px;
`;

// Inner App component with access to context
const AppContent: React.FC = () => {
  const { state } = useAppContext();
  
  // Render the appropriate component based on the active panel
  const renderActivePanel = () => {
    switch (state.uiState.activePanel) {
      case 'source':
        return <MediaSourceSelector />;
      case 'preview':
        return <PreviewPanel />;
      case 'controls':
        return <RecordingControls />;
      case 'output':
        return <OutputManager />;
      default:
        return <MediaSourceSelector />;
    }
  };
  
  return (
    <MainContent>
      {renderActivePanel()}
    </MainContent>
  );
};

// Main App component
const App: React.FC = () => {
  // Check browser compatibility
  const compatibility = checkAppCompatibility();
  
  return (
    <AppContainer>
      <AppHeader>
        <AppTitle>Screen Recorder</AppTitle>
        <AppSubtitle>
          Capture your screen with webcam and audio in just a few clicks
        </AppSubtitle>
      </AppHeader>
      
      {!compatibility.isCompatible ? (
        <IncompatibleBrowserMessage>
          <h2>Incompatible Browser</h2>
          <p>
            Your browser doesn't support some of the features required for this application.
          </p>
          <p>
            Please use a modern browser like Chrome, Edge, or Firefox (latest version).
          </p>
          <div>
            <h3>Missing Features:</h3>
            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
              {!compatibility.features.screenCapture && <li>Screen Capture</li>}
              {!compatibility.features.mediaRecorder && <li>Media Recording</li>}
            </ul>
          </div>
        </IncompatibleBrowserMessage>
      ) : (
        <AppProvider>
          <AppContent />
        </AppProvider>
      )}
      
      <Footer>
        <p>
          Screen Recorder App &copy; {new Date().getFullYear()} | Privacy-focused, browser-based recording
        </p>
      </Footer>
    </AppContainer>
  );
};

export default App;
