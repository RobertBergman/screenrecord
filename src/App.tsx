import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AppProvider, useAppContext } from './contexts/AppContext';
import demoRecording from './assets/demo-recording.webm';
import MediaSourceSelector from './components/MediaSourceSelector';
import PreviewPanel from './components/PreviewPanel';
import RecordingControls from './components/RecordingControls';
import OutputManager from './components/OutputManager';
import SlideModule from './components/SlideModule';
import { checkAppCompatibility } from './utils/featureDetection';

// Styled components
const AppContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const AppHeader = styled.header`
  background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
  padding: 40px 20px;
  border-radius: 12px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const AppTitle = styled.h1`
  color: white;
  font-size: 42px;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AppSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
  margin: 0;
  max-width: 700px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const HeroContent = styled.div`
  margin-bottom: 30px;
  
  @media (min-width: 768px) {
    width: 48%;
    margin-bottom: 0;
  }
`;

const HeroTitle = styled.h2`
  font-size: 28px;
  margin-top: 0;
  margin-bottom: 16px;
  color: #333;
`;

const HeroText = styled.p`
  font-size: 16px;
  margin-bottom: 24px;
  color: #555;
  line-height: 1.6;
`;

const HeroButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const DemoContainer = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 768px) {
    width: 48%;
  }
`;

const ScreenRecordingDemo = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const DemoVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const WebcamOverlay = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 120px;
  height: 90px;
  background-color: #673ab7;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const PersonIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #9575cd;
  border-radius: 50%;
`;

const RecordingIndicator = styled.div`
  position: absolute;
  top: 50px;
  right: 16px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RecordingDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: #f44336;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const RecordingText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #333;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 40px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ToolCard = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ToolsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin: 50px 0;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ToolIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e8f0fe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 36px;
  color: #4285f4;
`;

const ToolTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #333;
`;

const ToolDescription = styled.p`
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
`;

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #e8f0fe;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: #4285f4;
`;

const FeatureTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #333;
`;

const FeatureDescription = styled.p`
  margin: 0;
  color: #666;
  line-height: 1.5;
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

// Removed unused StartButton component

const Footer = styled.footer`
  text-align: center;
  color: #666;
  font-size: 14px;
  padding-top: 40px;
  border-top: 1px solid #eee;
  margin-top: 60px;
`;

// HomeScreen component shows the landing page with two main options: Screen Recording and Markdown Presentation
const HomeScreen: React.FC<{
  onStartRecording: () => void,
  onStartPresentation: () => void
}> = ({ onStartRecording, onStartPresentation }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Auto-play the demo video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Video autoplay failed:', err);
      });
    }
  }, []);
  
  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>The Future of Content Creation</HeroTitle>
          <HeroText>
            PresentFlow is your all-in-one platform for creating dynamic presentations and recordings.
            Perfect for creators, educators, and professionals who need to communicate ideas effectively.
          </HeroText>
        </HeroContent>
        
        <DemoContainer>
          <ScreenRecordingDemo>
            <DemoVideo 
              ref={videoRef}
              src={demoRecording} 
              loop 
              muted
              playsInline
            />
            <WebcamOverlay>
              <PersonIcon />
            </WebcamOverlay>
            <RecordingIndicator>
              <RecordingDot />
              <RecordingText>Recording</RecordingText>
            </RecordingIndicator>
          </ScreenRecordingDemo>
        </DemoContainer>
      </HeroSection>
      
      <h2 style={{ textAlign: 'center', margin: '40px 0 20px', fontSize: '32px', color: '#333' }}>
        Choose Your Tool
      </h2>
      
      <ToolsContainer>
        <ToolCard onClick={onStartRecording}>
          <ToolIcon>🎥</ToolIcon>
          <ToolTitle>Screen Recording</ToolTitle>
          <ToolDescription>
            Capture your screen, webcam, and audio all at once. Perfect for creating tutorials,
            demos, gameplay videos, and more.
          </ToolDescription>
          <HeroButton onClick={onStartRecording}>Start Recording</HeroButton>
        </ToolCard>
        
        <ToolCard onClick={onStartPresentation}>
          <ToolIcon>📊</ToolIcon>
          <ToolTitle>Markdown Presentation</ToolTitle>
          <ToolDescription>
            Create beautiful slide presentations using simple Markdown syntax.
            Present your ideas with clean, professional slides.
          </ToolDescription>
          <HeroButton onClick={onStartPresentation}>Create Presentation</HeroButton>
        </ToolCard>
      </ToolsContainer>
      
      <Features>
        <FeatureCard>
          <FeatureIcon>🎥</FeatureIcon>
          <FeatureTitle>Screen Capture</FeatureTitle>
          <FeatureDescription>
            Record your entire screen, application window, or browser tab with crystal clear quality.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🎤</FeatureIcon>
          <FeatureTitle>Audio Recording</FeatureTitle>
          <FeatureDescription>
            Capture both microphone and system audio simultaneously for professional-sounding recordings.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>📝</FeatureIcon>
          <FeatureTitle>Markdown Support</FeatureTitle>
          <FeatureDescription>
            Create presentations using simple Markdown syntax with support for headers, lists, code blocks, and more.
          </FeatureDescription>
        </FeatureCard>
      </Features>
    </>
  );
};

// Inner App component with access to context
const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  // Handle start recording flow
  const handleStartRecording = async () => {
    try {
      // Set the active feature to screenRecorder
      dispatch({
        type: 'SET_ACTIVE_FEATURE',
        feature: 'screenRecorder',
      });
      
      // Set the active panel to source to start the screen recording flow
      dispatch({
        type: 'SET_ACTIVE_PANEL',
        panel: 'source',
      });
    } catch (error) {
      console.error('Failed to start recording flow:', error);
    }
  };
  
  // Handle start presentation flow
  const handleStartPresentation = () => {
    // Set the active feature to presentation
    dispatch({
      type: 'SET_ACTIVE_FEATURE',
      feature: 'presentation',
    });
    
    // Set the active panel to slides to start the presentation flow
    dispatch({
      type: 'SET_ACTIVE_PANEL',
      panel: 'slides',
    });
  };
  
  // Handle return to home
  const handleReturnToHome = () => {
    // Set the active feature back to home
    dispatch({
      type: 'SET_ACTIVE_FEATURE',
      feature: 'home',
    });
  };
  
  // Render content based on the active feature and panel
  const renderContent = () => {
    // Determine what to render based on the active feature
    switch (state.uiState.activeFeature) {
      case 'home':
        return (
          <HomeScreen 
            onStartRecording={handleStartRecording} 
            onStartPresentation={handleStartPresentation}
          />
        );
        
      case 'screenRecorder':
        // Render Screen Recorder path components based on active panel
        switch (state.uiState.activePanel) {
          case 'source':
            return (
              <div>
                <button 
                  onClick={handleReturnToHome}
                  style={{ 
                    marginBottom: '16px', 
                    padding: '8px 16px',
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Home
                </button>
                <MediaSourceSelector />
              </div>
            );
          case 'preview':
            return (
              <div>
                <button 
                  onClick={handleReturnToHome}
                  style={{ 
                    marginBottom: '16px', 
                    padding: '8px 16px',
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Home
                </button>
                <PreviewPanel />
              </div>
            );
          case 'controls':
            return (
              <div>
                <button 
                  onClick={handleReturnToHome}
                  style={{ 
                    marginBottom: '16px', 
                    padding: '8px 16px',
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Home
                </button>
                <RecordingControls />
              </div>
            );
          case 'output':
            return (
              <div>
                <button 
                  onClick={handleReturnToHome}
                  style={{ 
                    marginBottom: '16px', 
                    padding: '8px 16px',
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Home
                </button>
                <OutputManager />
              </div>
            );
          default:
            return <MediaSourceSelector />;
        }
        
      case 'presentation':
        // Render Presentation path components
        return (
          <div>
            <button 
              onClick={handleReturnToHome}
              style={{ 
                marginBottom: '16px', 
                padding: '8px 16px',
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Home
            </button>
            <SlideModule />
          </div>
        );
        
      default:
        // Fallback to home screen
        return (
          <HomeScreen 
            onStartRecording={handleStartRecording} 
            onStartPresentation={handleStartPresentation}
          />
        );
    }
  };
  
  return (
    <MainContent>
      {renderContent()}
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
        <AppTitle>PresentFlow</AppTitle>
        <AppSubtitle>
          The future of presentations. Create, narrate, and record professional-quality content all in one place.
          Seamlessly combine screen recording, markdown slides, and voice narration right in your browser.
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
          PresentFlow &copy; {new Date().getFullYear()} | The future of presentations
        </p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          Create, narrate, record. No downloads required. Your data stays on your device. Supporting Chrome, Firefox, and Edge.
        </p>
      </Footer>
    </AppContainer>
  );
};

export default App;
