/**
 * RecordingControls component for controlling recording process
 */

import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../contexts/AppContext';
import { recordingService } from '../../services/RecordingService';
import { getBestSupportedMimeType } from '../../utils/featureDetection';
import { logError } from '../../utils/errorHandling';

// Styled components
const ControlsContainer = styled.div`
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

const StatusIndicator = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: ${props => {
    switch (props.$status) {
      case 'recording': return '#ffebee';
      case 'paused': return '#fff8e1';
      case 'processing': return '#e8f5e9';
      case 'completed': return '#e3f2fd';
      case 'error': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  border-radius: 4px;
  margin-bottom: 16px;
`;

const StatusIcon = styled.div<{ $status: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.$status) {
      case 'recording': return '#d32f2f';
      case 'paused': return '#ffa000';
      case 'processing': return '#43a047';
      case 'completed': return '#1976d2';
      case 'error': return '#d32f2f';
      default: return '#9e9e9e';
    }
  }};
  
  ${props => props.$status === 'recording' && `
    animation: pulse 1.5s infinite;
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  `}
`;

const StatusText = styled.span`
  font-weight: 500;
  font-size: 16px;
`;

const TimerDisplay = styled.div`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
  font-family: monospace;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
`;

interface ControlButtonProps {
  $variant: 'primary' | 'secondary' | 'danger';
}

const ControlButton = styled.button<ControlButtonProps>`
  padding: 12px 24px;
  background-color: ${props => {
    switch (props.$variant) {
      case 'primary': return '#4285f4';
      case 'secondary': return '#9e9e9e';
      case 'danger': return '#d32f2f';
      default: return '#4285f4';
    }
  }};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => {
      switch (props.$variant) {
        case 'primary': return '#3367d6';
        case 'secondary': return '#757575';
        case 'danger': return '#b71c1c';
        default: return '#3367d6';
      }
    }};
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

// Format time function (converts ms to MM:SS format)
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Component
const RecordingControls: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  
  // Get combined stream
  const getCombinedStream = useCallback(() => {
    const { screen } = state.mediaState.streams;
    
    if (!screen) {
      throw new Error('No screen stream available. Please go back and capture screen first.');
    }
    
    // If we have both webcam and screen, we need to combine them
    // In a real implementation, we would use canvas or WebRTC to combine streams
    // For this example, we'll just return the screen stream
    
    // TODO: In a full implementation, set up a canvas to composite screen and webcam
    // and return the canvas stream
    
    return screen;
  }, [state.mediaState.streams]);
  
  // Initialize recorder
  const initializeRecorder = useCallback(() => {
    try {
      const combinedStream = getCombinedStream();
      const mimeType = getBestSupportedMimeType();
      
      const options: MediaRecorderOptions = {
        mimeType: mimeType || undefined,
      };
      
      // Set up quality settings based on user's selection
      if (state.outputState.quality !== 'custom') {
        // In a real implementation, we would map quality presets to recorder options
        // However, MediaRecorder doesn't directly support bitrate, etc.
        // These would require additional processing of the output
      }
      
      // Initialize the recorder
      const initialized = recordingService.initialize(combinedStream, options);
      
      if (!initialized) {
        throw new Error('Failed to initialize recorder. Please try again.');
      }
      
      // Set up event handlers
      recordingService.setOnDataAvailable((chunk) => {
        dispatch({
          type: 'ADD_RECORDING_CHUNK',
          chunk,
        });
      });
      
      recordingService.setOnRecordingComplete((blob) => {
        // Set output blob in state
        dispatch({
          type: 'SET_OUTPUT_BLOB',
          output: blob,
        });
        
        // Create object URL for download
        const url = URL.createObjectURL(blob);
        dispatch({
          type: 'SET_DOWNLOAD_URL',
          url,
        });
        
        // Change status to completed
        dispatch({
          type: 'SET_RECORDING_STATUS',
          status: 'completed',
        });
        
        // Move to output panel
        dispatch({
          type: 'SET_ACTIVE_PANEL',
          panel: 'output',
        });
      });
      
      recordingService.setOnError((err) => {
        setError(`Recording error: ${err.message}`);
        dispatch({
          type: 'SET_RECORDING_ERROR',
          error: err,
        });
        dispatch({
          type: 'SET_RECORDING_STATUS',
          status: 'error',
        });
      });
      
      return true;
    } catch (err) {
      logError(err, 'RecordingControls.initializeRecorder');
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to initialize recorder.');
      }
      
      return false;
    }
  }, [getCombinedStream, dispatch, state.outputState.quality]);
  
  // Start the timer
  const startTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const interval = window.setInterval(() => {
      const duration = recordingService.getDuration();
      dispatch({
        type: 'SET_RECORDING_DURATION',
        duration,
      });
    }, 100) as unknown as number;
    
    setTimerInterval(interval);
  }, [dispatch, timerInterval]);
  
  // Stop the timer
  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);
  
  // Start recording
  const startRecording = async () => {
    setError(null);
    
    if (initializeRecorder()) {
      const started = recordingService.start();
      
      if (started) {
        dispatch({
          type: 'SET_RECORDING_STATUS',
          status: 'recording',
        });
        
        dispatch({
          type: 'SET_RECORDING_START_TIME',
          startTime: Date.now(),
        });
        
        startTimer();
      } else {
        setError('Failed to start recording. Please try again.');
      }
    }
  };
  
  // Pause recording
  const pauseRecording = () => {
    const paused = recordingService.pause();
    
    if (paused) {
      dispatch({
        type: 'SET_RECORDING_STATUS',
        status: 'paused',
      });
      
      stopTimer();
    } else {
      setError('Failed to pause recording. This browser may not support pausing recordings.');
    }
  };
  
  // Resume recording
  const resumeRecording = () => {
    const resumed = recordingService.resume();
    
    if (resumed) {
      dispatch({
        type: 'SET_RECORDING_STATUS',
        status: 'recording',
      });
      
      startTimer();
    } else {
      setError('Failed to resume recording. Please try again.');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    const stopped = recordingService.stop();
    
    if (stopped) {
      dispatch({
        type: 'SET_RECORDING_STATUS',
        status: 'processing',
      });
      
      stopTimer();
      
      // Show processing message to user
      console.log('Processing recording... Please wait.');
      
      // If after 5 seconds we're still in processing state, something might be wrong
      window.setTimeout(() => {
        if (state.recordingState.status === 'processing') {
          console.log('Recording is taking longer than expected to process...');
        }
      }, 5000);
    } else {
      setError('Failed to stop recording. Please try again.');
    }
  };
  
  // Handler for going back to preview panel
  const handleBackToPreview = () => {
    // Make sure recording is stopped
    if (state.recordingState.status === 'recording' || state.recordingState.status === 'paused') {
      recordingService.stop();
      stopTimer();
    }
    
    // Reset recording state
    dispatch({
      type: 'RESET_RECORDING_STATE',
    });
    
    // Go back to preview
    dispatch({
      type: 'SET_ACTIVE_PANEL',
      panel: 'preview',
    });
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);
  
  // Determine which controls to show based on recording state
  const renderControls = () => {
    switch (state.recordingState.status) {
      case 'idle':
        return (
          <ControlsRow>
            <ControlButton $variant="secondary" onClick={handleBackToPreview}>
              Back
            </ControlButton>
            <ControlButton $variant="primary" onClick={startRecording}>
              Start Recording
            </ControlButton>
          </ControlsRow>
        );
        
      case 'recording':
        return (
          <ControlsRow>
            <ControlButton $variant="secondary" onClick={pauseRecording}>
              Pause
            </ControlButton>
            <ControlButton $variant="danger" onClick={stopRecording}>
              Stop Recording
            </ControlButton>
          </ControlsRow>
        );
        
      case 'paused':
        return (
          <ControlsRow>
            <ControlButton $variant="primary" onClick={resumeRecording}>
              Resume
            </ControlButton>
            <ControlButton $variant="danger" onClick={stopRecording}>
              Stop Recording
            </ControlButton>
          </ControlsRow>
        );
        
      case 'processing':
        return (
          <ControlsRow>
            <ControlButton $variant="secondary" disabled>
              Processing...
            </ControlButton>
          </ControlsRow>
        );
        
      case 'error':
        return (
          <ControlsRow>
            <ControlButton $variant="secondary" onClick={handleBackToPreview}>
              Back
            </ControlButton>
            <ControlButton $variant="primary" onClick={startRecording}>
              Try Again
            </ControlButton>
          </ControlsRow>
        );
        
      default:
        return null;
    }
  };
  
  const getStatusText = () => {
    switch (state.recordingState.status) {
      case 'idle':
        return 'Ready to record';
      case 'recording':
        return 'Recording in progress';
      case 'paused':
        return 'Recording paused';
      case 'processing':
        return 'Processing recording';
      case 'completed':
        return 'Recording completed';
      case 'error':
        return 'Recording error';
      default:
        return 'Unknown status';
    }
  };
  
  return (
    <ControlsContainer>
      <div>
        <SectionTitle>Recording</SectionTitle>
        
        <StatusIndicator $status={state.recordingState.status}>
          <StatusIcon $status={state.recordingState.status} />
          <StatusText>{getStatusText()}</StatusText>
        </StatusIndicator>
        
        <TimerDisplay>
          {formatTime(state.recordingState.duration)}
        </TimerDisplay>
        
        {renderControls()}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {state.recordingState.error && (
          <ErrorMessage>{state.recordingState.error.message}</ErrorMessage>
        )}
      </div>
    </ControlsContainer>
  );
};

export default RecordingControls;
