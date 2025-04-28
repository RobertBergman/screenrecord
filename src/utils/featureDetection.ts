/**
 * Feature detection utilities for the Screen Recorder application
 */

import { logError } from './errorHandling';
import { BROWSER_COMPATIBILITY } from '../constants';

/**
 * Browser capabilities detection for media features
 */
export const browserCapabilities = {
  /**
   * Checks if the browser supports screen capture
   * @returns boolean indicating screen capture support
   */
  hasScreenCaptureSupport(): boolean {
    return !!(navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices);
  },
  
  /**
   * Checks if the browser supports the MediaRecorder API
   * @returns boolean indicating MediaRecorder support
   */
  hasMediaRecorderSupport(): boolean {
    return typeof MediaRecorder !== 'undefined';
  },
  
  /**
   * Checks if the browser potentially supports system audio capture
   * Note: This is an approximation as it's hard to detect before attempting capture
   * @returns boolean indicating potential system audio support
   */
  hasSystemAudioSupport(): boolean {
    return BROWSER_COMPATIBILITY.isChromeBased || BROWSER_COMPATIBILITY.isEdge;
  },
  
  /**
   * Checks if the browser has access to a webcam
   * @returns Promise resolving to boolean indicating webcam availability
   */
  async hasWebcamSupport(): Promise<boolean> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return false;
    }
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (e) {
      logError(e, 'webcam support detection');
      return false;
    }
  },
  
  /**
   * Gets supported MIME types for recording
   * @returns Array of supported MIME types
   */
  getSupportedMimeTypes(): string[] {
    if (!this.hasMediaRecorderSupport()) {
      return [];
    }
    
    const supportedTypes = [];
    
    // Check for WebM support (most common)
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      supportedTypes.push('video/webm;codecs=vp9,opus');
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      supportedTypes.push('video/webm;codecs=vp8,opus');
    } else if (MediaRecorder.isTypeSupported('video/webm')) {
      supportedTypes.push('video/webm');
    }
    
    // Check for MP4 support
    if (MediaRecorder.isTypeSupported('video/mp4')) {
      supportedTypes.push('video/mp4');
    }
    
    return supportedTypes;
  },
  
  /**
   * Checks overall application compatibility
   * @returns Object with compatibility status for each feature
   */
  checkCompatibility() {
    const screenCapture = this.hasScreenCaptureSupport();
    const mediaRecorder = this.hasMediaRecorderSupport();
    const systemAudio = this.hasSystemAudioSupport();
    
    // If essential features are missing, the app cannot function
    const isCompatible = screenCapture && mediaRecorder;
    
    return {
      isCompatible,
      features: {
        screenCapture,
        mediaRecorder,
        systemAudio
      },
      browser: {
        ...BROWSER_COMPATIBILITY
      }
    };
  }
};

/**
 * Checks if the application can run in the current browser
 * @returns Object containing compatibility information
 */
export function checkAppCompatibility() {
  return browserCapabilities.checkCompatibility();
}

/**
 * Gets the best supported MIME type for recording
 * @returns The best supported MIME type or null if none is supported
 */
export function getBestSupportedMimeType(): string | null {
  const supportedTypes = browserCapabilities.getSupportedMimeTypes();
  return supportedTypes.length > 0 ? supportedTypes[0] : null;
}
