/**
 * Service for screen capture functionality
 */

import { SCREEN_CAPTURE_CONSTRAINTS } from '../constants';
import { ScreenCaptureOptions } from '../types';
import { handleMediaError, logError } from '../utils/errorHandling';

/**
 * Service to handle screen capture operations
 */
export class ScreenCaptureService {
  private stream: MediaStream | null = null;
  
  /**
   * Captures the screen using the browser's getDisplayMedia API
   * @param options - Display media options
   * @returns Promise resolving to MediaStream object
   */
  async captureScreen(options: ScreenCaptureOptions = { 
    audio: true, 
    video: true
  }): Promise<MediaStream> {
    try {
      // Stop any existing stream before starting a new one
      this.stopCapture();
      
      // Merge user options with default constraints
      const constraints = {
        ...SCREEN_CAPTURE_CONSTRAINTS,
        video: {
          ...SCREEN_CAPTURE_CONSTRAINTS.video,
        },
        audio: options.audio
      };
      
      // Add display surface if specified
      if (options.displaySurface) {
        constraints.video = {
          ...constraints.video,
          // Type assertion to handle displaySurface property
          displaySurface: options.displaySurface
        } as any;
      }
      
      // Request new screen capture with merged constraints
      this.stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      
      // Handle stream ending (user stops sharing)
      const videoTrack = this.stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.addEventListener('ended', () => {
          this.stream = null;
        });
      }
      
      return this.stream;
    } catch (error) {
      const mediaError = handleMediaError(error);
      logError(mediaError, 'ScreenCaptureService.captureScreen');
      throw mediaError;
    }
  }
  
  /**
   * Stops all tracks in the current screen capture stream
   */
  stopCapture(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  
  /**
   * Gets the current screen capture stream
   * @returns The current MediaStream or null if none exists
   */
  getStream(): MediaStream | null {
    return this.stream;
  }
  
  /**
   * Checks if screen is currently being captured
   * @returns Boolean indicating if screen capture is active
   */
  isCapturing(): boolean {
    return !!this.stream && this.stream.active;
  }
  
  /**
   * Gets video track from the current stream
   * @returns The video track or null if none exists
   */
  getVideoTrack(): MediaStreamTrack | null {
    if (!this.stream) return null;
    
    const videoTracks = this.stream.getVideoTracks();
    return videoTracks.length > 0 ? videoTracks[0] : null;
  }
  
  /**
   * Gets audio track from the current stream
   * @returns The audio track or null if none exists
   */
  getAudioTrack(): MediaStreamTrack | null {
    if (!this.stream) return null;
    
    const audioTracks = this.stream.getAudioTracks();
    return audioTracks.length > 0 ? audioTracks[0] : null;
  }
}

// Create singleton instance
export const screenCaptureService = new ScreenCaptureService();
