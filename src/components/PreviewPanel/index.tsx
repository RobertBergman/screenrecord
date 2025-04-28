/**
 * PreviewPanel component for displaying preview of recording sources
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../contexts/AppContext';
import { WebcamPosition } from '../../types';
import { WEBCAM_POSITION_PRESETS } from '../../constants';

// Styled components
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
`;

const PreviewArea = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
`;

const ScreenPreview = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

interface WebcamPreviewProps {
  position: WebcamPosition;
}

const WebcamPreview = styled.video<WebcamPreviewProps>`
  position: absolute;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x}px;
  width: ${props => props.position.width}px;
  height: ${props => props.position.height}px;
  object-fit: cover;
  border: 2px solid #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 10;
`;

const WebcamControls = styled.div`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PositionButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  background-color: ${props => props.active ? '#4285f4' : '#e0e0e0'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#3367d6' : '#d0d0d0'};
  }
`;

const NoStreamMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 18px;
  text-align: center;
  padding: 20px;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3367d6;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// Component
const PreviewPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const screenRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  
  const [webcamPosition, setWebcamPosition] = useState<WebcamPosition>(
    state.uiState.webcamPosition
  );
  
  const hasWebcam = !!state.mediaState.streams.webcam;
  
  // Set up screen preview
  useEffect(() => {
    const screenStream = state.mediaState.streams.screen;
    
    if (screenRef.current && screenStream) {
      // Set srcObject and handle play with proper AbortError handling
      screenRef.current.srcObject = screenStream;
      
      // Use a timeout to avoid race conditions with rapid state changes
      const playTimeout = setTimeout(() => {
        if (screenRef.current && screenRef.current.srcObject === screenStream) {
          screenRef.current.play().catch(error => {
            // Specific handling for AbortError which is normal during rapid changes
            if (error.name !== 'AbortError') {
              console.error('Error playing screen preview:', error);
            }
          });
        }
      }, 100);
      
      return () => {
        clearTimeout(playTimeout);
        if (screenRef.current) {
          screenRef.current.srcObject = null;
        }
      };
    }
    
    return () => {
      if (screenRef.current) {
        screenRef.current.srcObject = null;
      }
    };
  }, [state.mediaState.streams.screen]);
  
  // Set up webcam preview
  useEffect(() => {
    const webcamStream = state.mediaState.streams.webcam;
    
    if (webcamRef.current && webcamStream) {
      // Set srcObject and handle play with proper AbortError handling
      webcamRef.current.srcObject = webcamStream;
      
      // Use a timeout to avoid race conditions with rapid state changes
      const playTimeout = setTimeout(() => {
        if (webcamRef.current && webcamRef.current.srcObject === webcamStream) {
          webcamRef.current.play().catch(error => {
            // Specific handling for AbortError which is normal during rapid changes
            if (error.name !== 'AbortError') {
              console.error('Error playing webcam preview:', error);
            }
          });
        }
      }, 100);
      
      return () => {
        clearTimeout(playTimeout);
        if (webcamRef.current) {
          webcamRef.current.srcObject = null;
        }
      };
    }
    
    return () => {
      if (webcamRef.current) {
        webcamRef.current.srcObject = null;
      }
    };
  }, [state.mediaState.streams.webcam]);
  
  // Update webcam position in app state when it changes
  useEffect(() => {
    dispatch({
      type: 'SET_WEBCAM_POSITION',
      position: webcamPosition,
    });
  }, [webcamPosition, dispatch]);
  
  // Handler for changing webcam position
  const handleChangeWebcamPosition = (position: keyof typeof WEBCAM_POSITION_PRESETS) => {
    setWebcamPosition(WEBCAM_POSITION_PRESETS[position]);
  };
  
  // Handler for going back to media source selection
  const handleBackToSourceSelection = () => {
    dispatch({
      type: 'SET_ACTIVE_PANEL',
      panel: 'source',
    });
  };
  
  // Handler for proceeding to recording controls
  const handleProceedToRecording = () => {
    dispatch({
      type: 'SET_ACTIVE_PANEL',
      panel: 'controls',
    });
  };
  
  return (
    <PreviewContainer>
      <div>
        <SectionTitle>Preview</SectionTitle>
        <PreviewArea>
          {state.mediaState.streams.screen ? (
            <ScreenPreview ref={screenRef} muted />
          ) : (
            <NoStreamMessage>No screen stream available</NoStreamMessage>
          )}
          
          {hasWebcam && (
            <WebcamPreview 
              ref={webcamRef} 
              position={webcamPosition}
              muted 
            />
          )}
        </PreviewArea>
        
        {hasWebcam && (
          <WebcamControls>
            <SectionTitle>Webcam Position</SectionTitle>
            <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
              <PositionButton 
                active={webcamPosition.x === WEBCAM_POSITION_PRESETS.topLeft.x && 
                        webcamPosition.y === WEBCAM_POSITION_PRESETS.topLeft.y}
                onClick={() => handleChangeWebcamPosition('topLeft')}
              >
                Top Left
              </PositionButton>
              
              <PositionButton 
                active={webcamPosition.x === WEBCAM_POSITION_PRESETS.topRight.x && 
                        webcamPosition.y === WEBCAM_POSITION_PRESETS.topRight.y}
                onClick={() => handleChangeWebcamPosition('topRight')}
              >
                Top Right
              </PositionButton>
              
              <PositionButton 
                active={webcamPosition.x === WEBCAM_POSITION_PRESETS.bottomLeft.x && 
                        webcamPosition.y === WEBCAM_POSITION_PRESETS.bottomLeft.y}
                onClick={() => handleChangeWebcamPosition('bottomLeft')}
              >
                Bottom Left
              </PositionButton>
              
              <PositionButton 
                active={webcamPosition.x === WEBCAM_POSITION_PRESETS.bottomRight.x && 
                        webcamPosition.y === WEBCAM_POSITION_PRESETS.bottomRight.y}
                onClick={() => handleChangeWebcamPosition('bottomRight')}
              >
                Bottom Right
              </PositionButton>
            </div>
          </WebcamControls>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button onClick={handleBackToSourceSelection}>
          Back
        </Button>
        
        <Button 
          onClick={handleProceedToRecording}
          disabled={!state.mediaState.streams.screen}
        >
          Ready to Record
        </Button>
      </div>
    </PreviewContainer>
  );
};

export default PreviewPanel;
