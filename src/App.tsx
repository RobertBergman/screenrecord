import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AppProvider, useAppContext } from './contexts/AppContext';
import demoRecording from './assets/demo-recording.webm';
import MediaSourceSelector from './components/MediaSourceSelector';
import PreviewPanel from './components/PreviewPanel';
import RecordingControls from './components/RecordingControls';
import OutputManager from './components/OutputManager';
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

const StartButton = styled.button`
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 28px;
  padding: 14px 32px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  margin-top: 30px;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
  
  &:hover {
    background-color: #3367d6;
    transform: translateY(-2px);
  }
`;

const Footer = styled.footer`
  text-align: center;
  color: #666;
  font-size: 14px;
  padding-top: 40px;
  border-top: 1px solid #eee;
  margin-top: 60px;
`;

// HomeScreen component shows the landing page with demo and features
const HomeScreen: React.FC<{onStartClick: () => void}> = ({ onStartClick }) => {
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
          <HeroTitle>Record Your Screen with Ease</HeroTitle>
          <HeroText>
            Capture your screen, webcam, and audio all at once. Perfect for creating tutorials,
            presentations, gameplay videos, and more - all directly in your browser with no downloads required.
          </HeroText>
          <HeroButton onClick={onStartClick}>Start Recording</HeroButton>
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
          <FeatureIcon>📱</FeatureIcon>
          <FeatureTitle>Webcam Overlay</FeatureTitle>
          <FeatureDescription>
            Add your webcam feed as an overlay with adjustable positioning to personalize your recordings.
          </FeatureDescription>
        </FeatureCard>
      </Features>
      
      <div style={{ textAlign: 'center' }}>
        <StartButton onClick={onStartClick}>
          Start Your Recording Now
        </StartButton>
      </div>
    </>
  );
};

// Inner App component with access to context
const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  // Handle start button click by directly starting the screen capture process
  const handleStartRecording = async () => {
    // Import services needed for screen capture
    const { screenCaptureService } = await import('./services/ScreenCaptureService');
    
    try {
      // Start the screen capture directly from here
      const screenOptions = {
        audio: false, // Default to no system audio
        video: true,
      };
      
      // Capture screen
      const screenStream = await screenCaptureService.captureScreen(screenOptions);
      
      // Update app state with screen stream
      dispatch({
        type: 'SET_STREAM',
        streamType: 'screen',
        stream: screenStream,
      });
      
      // Set selected screen options in state
      dispatch({
        type: 'SET_SELECTED_SCREEN',
        screen: screenOptions,
      });
      
      // Move directly to the preview panel
      dispatch({
        type: 'SET_ACTIVE_PANEL',
        panel: 'preview',
      });
    } catch (error) {
      console.error('Failed to capture screen:', error);
      
      // If we fail, show the media selector so the user can try again manually
      dispatch({
        type: 'SET_ACTIVE_PANEL',
        panel: 'source',
      });
    }
  };
  
  // Render the home screen or the active panel based on state
  const renderContent = () => {
    // If we're displaying the home screen 
    // (This is a special state where we're at 'source' but haven't started the flow yet)
    const showingHomeScreen = state.uiState.activePanel === 'source' && 
                              !state.mediaState.selectedSources.screen &&
                              !state.mediaState.streams.screen;
                              
    if (showingHomeScreen) {
      return <HomeScreen onStartClick={handleStartRecording} />;
    }
    
    // Otherwise, render the appropriate component based on the active panel
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
        <AppTitle>Screen Recorder</AppTitle>
        <AppSubtitle>
          Professional-quality screen recording right in your browser. 
          Capture your screen, webcam, and audio with just a few clicks.
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
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          No downloads required. Your recordings stay on your device. Supporting Chrome, Firefox, and Edge.
        </p>
      </Footer>
    </AppContainer>
  );
};

export default App;
