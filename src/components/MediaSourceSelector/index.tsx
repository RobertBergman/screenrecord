/**
 * MediaSourceSelector component for selecting recording sources
 */

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../contexts/AppContext';
import { MediaDeviceInfo, ScreenCaptureOptions } from '../../types';
import { screenCaptureService } from '../../services/ScreenCaptureService';
import { webcamService } from '../../services/WebcamService';
import { audioCaptureService } from '../../services/AudioCaptureService';
import { HAS_SYSTEM_AUDIO_SUPPORT } from '../../constants';
import { handleMediaError, logError } from '../../utils/errorHandling';
import { browserCapabilities } from '../../utils/featureDetection';

// Styled components
const SourceSelectorContainer = styled.div`
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

const SourceOption = styled.div`
  margin-bottom: 16px;
`;

const SourceLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const SelectDevice = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 14px;
  
  &:disabled {
    background-color: #eee;
    cursor: not-allowed;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const ToggleLabel = styled.label`
  margin-left: 10px;
  cursor: pointer;
`;

const ToggleInput = styled.input`
  cursor: pointer;
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

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 8px;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
  font-size: 14px;
`;

// Component
const MediaSourceSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Selected values
  const [selectedWebcam, setSelectedWebcam] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [enableWebcam, setEnableWebcam] = useState<boolean>(false);
  const [enableMicrophone, setEnableMicrophone] = useState<boolean>(false);
  const [enableSystemAudio, setEnableSystemAudio] = useState<boolean>(false);
  
  // Support flags
  const hasWebcamSupport = browserCapabilities.hasMediaRecorderSupport();
  const hasMicrophoneSupport = browserCapabilities.hasMediaRecorderSupport();
  const hasSystemAudioSupport = browserCapabilities.hasSystemAudioSupport();
  
  // Fetch available media devices
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // Requesting temporary permission to get device labels
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
          .then(stream => {
            // Stop the stream immediately after getting permissions
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(() => {
            // Even if permission is denied, we can still list devices
            // (though labels might be empty)
          });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        
        // Update app state with available devices
        dispatch({
          type: 'SET_AVAILABLE_DEVICES',
          devices: {
            video: videoInputs,
            audio: audioInputs,
          },
        });
        
        // Set default devices if available
        if (videoInputs.length > 0) {
          setSelectedWebcam(videoInputs[0].deviceId);
        }
        
        if (audioInputs.length > 0) {
          setSelectedMicrophone(audioInputs[0].deviceId);
        }
      } catch (err) {
        logError(err, 'MediaSourceSelector.fetchDevices');
        setError('Failed to list available devices. Please check permissions.');
      }
    };
    
    fetchDevices();
    
    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', fetchDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', fetchDevices);
    };
  }, [dispatch]);
  
  // Handler for starting screen capture
  const handleCaptureScreen = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Setup screen capture options
      const screenOptions: ScreenCaptureOptions = {
        audio: enableSystemAudio,
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
      
      // Set system audio state
      dispatch({
        type: 'SET_SYSTEM_AUDIO',
        enabled: enableSystemAudio,
      });
      
      // Handle webcam if enabled
      if (enableWebcam && selectedWebcam) {
        try {
          const webcamStream = await webcamService.captureWebcam(selectedWebcam);
          
          dispatch({
            type: 'SET_STREAM',
            streamType: 'webcam',
            stream: webcamStream,
          });
          
          // Find and set selected webcam device
          const selectedWebcamDevice = videoDevices.find(
            device => device.deviceId === selectedWebcam
          );
          
          if (selectedWebcamDevice) {
            dispatch({
              type: 'SET_SELECTED_WEBCAM',
              webcam: selectedWebcamDevice,
            });
          }
        } catch (webcamError) {
          logError(webcamError, 'MediaSourceSelector.handleCaptureScreen.webcam');
          setError('Failed to access webcam. Screen capture will continue without webcam.');
        }
      }
      
      // Handle microphone if enabled
      if (enableMicrophone && selectedMicrophone) {
        try {
          const micStream = await audioCaptureService.captureMicrophone(selectedMicrophone);
          
          dispatch({
            type: 'SET_STREAM',
            streamType: 'audio',
            stream: micStream,
          });
          
          // Find and set selected microphone device
          const selectedMicrophoneDevice = audioDevices.find(
            device => device.deviceId === selectedMicrophone
          );
          
          if (selectedMicrophoneDevice) {
            dispatch({
              type: 'SET_SELECTED_MICROPHONE',
              microphone: selectedMicrophoneDevice,
            });
          }
        } catch (micError) {
          logError(micError, 'MediaSourceSelector.handleCaptureScreen.microphone');
          setError('Failed to access microphone. Screen capture will continue without microphone audio.');
        }
      }
      
      // Move to the preview panel
      dispatch({
        type: 'SET_ACTIVE_PANEL',
        panel: 'preview',
      });
    } catch (err) {
      const mediaError = handleMediaError(err);
      logError(mediaError, 'MediaSourceSelector.handleCaptureScreen');
      setError(`Failed to capture screen: ${mediaError.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SourceSelectorContainer>
      <div>
        <SectionTitle>Screen Capture</SectionTitle>
        <SourceOption>
          <SourceLabel>Select what to record:</SourceLabel>
          <Button 
            onClick={handleCaptureScreen}
            disabled={isLoading}
          >
            {isLoading ? 'Setting up...' : 'Capture Screen'}
          </Button>
          <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
            You'll be prompted to select a screen, window, or tab to share
          </div>
        </SourceOption>
        
        {hasSystemAudioSupport && (
          <ToggleContainer>
            <ToggleInput
              type="checkbox"
              id="systemAudio"
              checked={enableSystemAudio}
              onChange={(e) => setEnableSystemAudio(e.target.checked)}
            />
            <ToggleLabel htmlFor="systemAudio">Include system audio</ToggleLabel>
          </ToggleContainer>
        )}
      </div>
      
      <div>
        <SectionTitle>Webcam</SectionTitle>
        <ToggleContainer>
          <ToggleInput
            type="checkbox"
            id="enableWebcam"
            checked={enableWebcam}
            onChange={(e) => setEnableWebcam(e.target.checked)}
            disabled={!hasWebcamSupport || videoDevices.length === 0}
          />
          <ToggleLabel htmlFor="enableWebcam">Include webcam</ToggleLabel>
        </ToggleContainer>
        
        {enableWebcam && (
          <SourceOption>
            <SourceLabel>Select webcam:</SourceLabel>
            <SelectDevice
              value={selectedWebcam}
              onChange={(e) => setSelectedWebcam(e.target.value)}
              disabled={!hasWebcamSupport || videoDevices.length === 0}
            >
              {videoDevices.length === 0 ? (
                <option value="">No webcams available</option>
              ) : (
                videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Webcam ${device.deviceId.substring(0, 5)}...`}
                  </option>
                ))
              )}
            </SelectDevice>
          </SourceOption>
        )}
      </div>
      
      <div>
        <SectionTitle>Microphone</SectionTitle>
        <ToggleContainer>
          <ToggleInput
            type="checkbox"
            id="enableMicrophone"
            checked={enableMicrophone}
            onChange={(e) => setEnableMicrophone(e.target.checked)}
            disabled={!hasMicrophoneSupport || audioDevices.length === 0}
          />
          <ToggleLabel htmlFor="enableMicrophone">Include microphone audio</ToggleLabel>
        </ToggleContainer>
        
        {enableMicrophone && (
          <SourceOption>
            <SourceLabel>Select microphone:</SourceLabel>
            <SelectDevice
              value={selectedMicrophone}
              onChange={(e) => setSelectedMicrophone(e.target.value)}
              disabled={!hasMicrophoneSupport || audioDevices.length === 0}
            >
              {audioDevices.length === 0 ? (
                <option value="">No microphones available</option>
              ) : (
                audioDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${device.deviceId.substring(0, 5)}...`}
                  </option>
                ))
              )}
            </SelectDevice>
          </SourceOption>
        )}
      </div>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SourceSelectorContainer>
  );
};

export default MediaSourceSelector;
