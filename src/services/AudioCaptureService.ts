/**
 * Service for audio capture functionality (microphone and system audio)
 */

import { MEDIA_CONSTRAINTS } from '../constants';
import { handleMediaError, logError } from '../utils/errorHandling';

/**
 * Service to handle audio capture operations
 */
export class AudioCaptureService {
  private microphoneStream: MediaStream | null = null;
  // System audio is usually captured as part of screen capture
  
  /**
   * Captures microphone audio using getUserMedia API
   * @param deviceId - Optional specific microphone device ID to use
   * @returns Promise resolving to MediaStream object
   */
  async captureMicrophone(deviceId?: string): Promise<MediaStream> {
    try {
      // Stop any existing microphone stream before starting a new one
      this.stopMicrophoneCapture();
      
      // Create constraints object with audio only
      const constraints: MediaStreamConstraints = {
        audio: MEDIA_CONSTRAINTS.audio,
        video: false
      };
      
      // Add device ID to constraints if provided
      if (deviceId) {
        constraints.audio = {
          ...MEDIA_CONSTRAINTS.audio,
          deviceId: { exact: deviceId }
        };
      }
      
      // Request microphone access
      this.microphoneStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      return this.microphoneStream;
    } catch (error) {
      const mediaError = handleMediaError(error);
      logError(mediaError, 'AudioCaptureService.captureMicrophone');
      throw mediaError;
    }
  }
  
  /**
   * Stops all tracks in the current microphone stream
   */
  stopMicrophoneCapture(): void {
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach(track => track.stop());
      this.microphoneStream = null;
    }
  }
  
  /**
   * Gets the current microphone stream
   * @returns The current MediaStream or null if none exists
   */
  getMicrophoneStream(): MediaStream | null {
    return this.microphoneStream;
  }
  
  /**
   * Checks if microphone is currently being captured
   * @returns Boolean indicating if microphone capture is active
   */
  isMicrophoneCapturing(): boolean {
    return !!this.microphoneStream && this.microphoneStream.active;
  }
  
  /**
   * Gets audio track from the microphone stream
   * @returns The audio track or null if none exists
   */
  getMicrophoneTrack(): MediaStreamTrack | null {
    if (!this.microphoneStream) return null;
    
    const audioTracks = this.microphoneStream.getAudioTracks();
    return audioTracks.length > 0 ? audioTracks[0] : null;
  }
  
  /**
   * Extracts system audio track from a screen capture stream
   * @param screenStream - The screen capture MediaStream that may contain system audio
   * @returns MediaStreamTrack or null if no system audio is present
   */
  getSystemAudioTrack(screenStream: MediaStream): MediaStreamTrack | null {
    if (!screenStream) return null;
    
    const audioTracks = screenStream.getAudioTracks();
    return audioTracks.length > 0 ? audioTracks[0] : null;
  }
  
  /**
   * Creates a new MediaStream by combining microphone and system audio tracks
   * @param microphoneTrack - Optional microphone audio track
   * @param systemAudioTrack - Optional system audio track
   * @returns A new MediaStream with the combined audio tracks, or null if no tracks provided
   */
  combineAudioTracks(
    microphoneTrack?: MediaStreamTrack | null, 
    systemAudioTrack?: MediaStreamTrack | null
  ): MediaStream | null {
    if (!microphoneTrack && !systemAudioTrack) return null;
    
    const combinedStream = new MediaStream();
    
    if (microphoneTrack) {
      combinedStream.addTrack(microphoneTrack);
    }
    
    if (systemAudioTrack) {
      combinedStream.addTrack(systemAudioTrack);
    }
    
    return combinedStream;
  }
  
  /**
   * Toggles microphone mute state
   * @param mute - Whether to mute (true) or unmute (false)
   * @returns Boolean indicating if the operation was successful
   */
  toggleMicrophoneMute(mute: boolean): boolean {
    const track = this.getMicrophoneTrack();
    
    if (!track) return false;
    
    track.enabled = !mute;
    return true;
  }
}

// Create singleton instance
export const audioCaptureService = new AudioCaptureService();
