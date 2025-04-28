/**
 * Service for webcam capture functionality
 */

import { MEDIA_CONSTRAINTS } from '../constants';
import { handleMediaError, logError } from '../utils/errorHandling';

/**
 * Service to handle webcam video capture operations
 */
export class WebcamService {
  private stream: MediaStream | null = null;
  
  /**
   * Captures webcam video using getUserMedia API
   * @param deviceId - Optional specific webcam device ID to use
   * @returns Promise resolving to MediaStream object
   */
  async captureWebcam(deviceId?: string): Promise<MediaStream> {
    try {
      // Stop any existing stream before starting a new one
      this.stopCapture();
      
      // Create constraints object
      const constraints: MediaStreamConstraints = {
        video: MEDIA_CONSTRAINTS.video,
        audio: false // We handle audio separately in AudioCaptureService
      };
      
      // Add device ID to constraints if provided
      if (deviceId) {
        // Replace video constraints completely when specifying a device ID
        constraints.video = {
          width: MEDIA_CONSTRAINTS.video.width,
          height: MEDIA_CONSTRAINTS.video.height,
          frameRate: MEDIA_CONSTRAINTS.video.frameRate,
          deviceId: { exact: deviceId }
        };
      }
      
      // Request webcam access
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      return this.stream;
    } catch (error) {
      const mediaError = handleMediaError(error);
      logError(mediaError, 'WebcamService.captureWebcam');
      throw mediaError;
    }
  }
  
  /**
   * Stops all tracks in the current webcam stream
   */
  stopCapture(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  
  /**
   * Gets the current webcam stream
   * @returns The current MediaStream or null if none exists
   */
  getStream(): MediaStream | null {
    return this.stream;
  }
  
  /**
   * Checks if webcam is currently being captured
   * @returns Boolean indicating if webcam capture is active
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
   * Sets constraints for the video track
   * @param constraints - The constraints to apply
   * @returns Boolean indicating if constraints were applied successfully
   */
  applyConstraints(constraints: MediaTrackConstraints): Promise<boolean> {
    const videoTrack = this.getVideoTrack();
    
    if (!videoTrack) {
      return Promise.resolve(false);
    }
    
    return videoTrack.applyConstraints(constraints)
      .then(() => true)
      .catch((error) => {
        logError(error, 'WebcamService.applyConstraints');
        return false;
      });
  }
}

// Create singleton instance
export const webcamService = new WebcamService();
