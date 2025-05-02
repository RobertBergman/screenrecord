/**
 * OutputManager component for handling recording output
 */

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../../contexts/AppContext';
// import { recordingService } from '../../services/RecordingService';
import { OutputFormat, QualityPreset } from '../../types';
// import { QUALITY_PRESETS } from '../../constants';

// Styled components
const OutputContainer = styled.div`
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

const PreviewSection = styled.div`
  margin-bottom: 24px;
`;

const VideoPreview = styled.video`
  width: 100%;
  height: auto;
  max-height: 480px;
  background-color: #000;
  border-radius: 4px;
`;

const OptionsSection = styled.div`
  margin-bottom: 24px;
`;

const OptionRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const OptionLabel = styled.label`
  margin-bottom: 8px;
  font-weight: 500;
`;

const SelectOption = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 14px;
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

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;

const DownloadLink = styled.a`
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #43a047;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RecordingInfo = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #666;
`;

const NoOutputMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

// Component
const OutputManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Set up video preview
  useEffect(() => {
    const url = state.outputState.downloadUrl;
    const outputBlob = state.outputState.output;
    
    if (videoRef.current && url && outputBlob) {
      console.log('Setting up video preview with', {
        url,
        type: outputBlob.type,
        size: outputBlob.size
      });
      
      // First, pause any existing playback
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      }
      
      // Set src and load
      videoRef.current.src = url;
      videoRef.current.load();
      
      // Wait a bit to ensure video has loaded before trying to play
      const playTimeout = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            // AbortError is expected during rapid changes
            if (error.name !== 'AbortError') {
              console.error('Error playing recording preview:', error);
              
              // If there's a not supported error, try a different approach
              if (error.name === 'NotSupportedError') {
                console.log('Attempting alternative playback method...');
                
                // Create a new object URL - the original one might be corrupted
                const newUrl = URL.createObjectURL(outputBlob);
                
                // Update state with the new URL
                dispatch({
                  type: 'SET_DOWNLOAD_URL',
                  url: newUrl
                });
              }
            }
          });
        }
      }, 300);
      
      return () => {
        clearTimeout(playTimeout);
      };
    }
    
    // Clean up on unmount
    return () => {
      // Don't revoke URLs here as it might be needed for download
      // URLs will be properly revoked in the RESET_OUTPUT_STATE reducer
    };
  }, [state.outputState.downloadUrl, state.outputState.output, dispatch]);
  
  // Handler for format change
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const format = e.target.value as OutputFormat;
    dispatch({
      type: 'SET_OUTPUT_FORMAT',
      format,
    });
  };
  
  // Handler for quality change
  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const quality = e.target.value as QualityPreset;
    dispatch({
      type: 'SET_OUTPUT_QUALITY',
      quality,
    });
  };
  
  // Handler for starting a new recording
  const handleNewRecording = () => {
    // Stop any active streams
    if (state.mediaState.streams.screen) {
      state.mediaState.streams.screen.getTracks().forEach(track => track.stop());
    }
    
    if (state.mediaState.streams.webcam) {
      state.mediaState.streams.webcam.getTracks().forEach(track => track.stop());
    }
    
    if (state.mediaState.streams.audio) {
      state.mediaState.streams.audio.getTracks().forEach(track => track.stop());
    }
    
    // Reset recording and output state
    dispatch({ type: 'RESET_RECORDING_STATE' });
    dispatch({ type: 'RESET_OUTPUT_STATE' });
    
    // Go back to source selection
    dispatch({
      type: 'SET_ACTIVE_PANEL',
      panel: 'source',
    });
  };
  
  // Get file name for download
  const getFileName = () => {
    const date = new Date();
    const dateStr = date.toISOString().replace(/[:.]/g, '-').replace('T', '_').split('Z')[0];
    return `screen_recording_${dateStr}.${state.outputState.format}`;
  };
  
  // Format file size
  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get recording duration formatted
  const getFormattedDuration = (): string => {
    const totalSeconds = Math.floor(state.recordingState.duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  if (!state.outputState.output || !state.outputState.downloadUrl) {
    return (
      <OutputContainer>
        <SectionTitle>Output</SectionTitle>
        <NoOutputMessage>
          No recording output available. Please complete a recording first.
        </NoOutputMessage>
        <Button onClick={handleNewRecording}>Start New Recording</Button>
      </OutputContainer>
    );
  }
  
  return (
    <OutputContainer>
      <SectionTitle>Recording Output</SectionTitle>
      
      <PreviewSection>
        <VideoPreview ref={videoRef} controls />
        <RecordingInfo>
          Duration: {getFormattedDuration()} | 
          Size: {formatFileSize(state.outputState.output.size)} | 
          Format: {state.outputState.format}
        </RecordingInfo>
      </PreviewSection>
      
      <OptionsSection>
        <OptionRow>
          <OptionLabel>Format</OptionLabel>
          <SelectOption 
            value={state.outputState.format}
            onChange={handleFormatChange}
            disabled={true} // Format conversion would require additional processing, disabled for now
          >
            <option value="webm">WebM</option>
            <option value="mp4">MP4</option>
          </SelectOption>
          <div style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
            Format conversion requires additional processing and is disabled in this version.
          </div>
        </OptionRow>
        
        <OptionRow>
          <OptionLabel>Quality</OptionLabel>
          <SelectOption 
            value={state.outputState.quality}
            onChange={handleQualityChange}
            disabled={true} // Quality conversion would require additional processing, disabled for now
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="custom">Custom</option>
          </SelectOption>
          <div style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
            Quality adjustments require additional processing and are disabled in this version.
          </div>
        </OptionRow>
      </OptionsSection>
      
      <ButtonRow>
        <Button onClick={handleNewRecording}>
          New Recording
        </Button>
        
        <DownloadLink 
          href={state.outputState.downloadUrl}
          download={getFileName()}
        >
          Download Recording
        </DownloadLink>
      </ButtonRow>
    </OutputContainer>
  );
};

export default OutputManager;
