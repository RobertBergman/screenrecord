/**
 * Service for managing recording functionality
 */

import { RECORDER_MIME_TYPES, RECORDER_TIMESLICE } from '../constants';
import { getBestSupportedMimeType } from '../utils/featureDetection';
import { logError } from '../utils/errorHandling';

/**
 * Service to handle media recording operations
 */
export class RecordingService {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private startTime: number = 0;
  private pausedDuration: number = 0;
  private pauseStartTime: number = 0;
  private onDataAvailable: ((chunk: Blob) => void) | null = null;
  private onRecordingComplete: ((blob: Blob) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;
  
  /**
   * Initializes a new MediaRecorder with the provided stream
   * @param stream - The MediaStream to record
   * @param options - Optional MediaRecorder options
   * @returns Boolean indicating if initialization was successful
   */
  initialize(stream: MediaStream, options: MediaRecorderOptions = {}): boolean {
    try {
      // If a recorder already exists, stop it
      this.stop();
      
      // Clear previously recorded chunks
      this.resetRecording();
      
      // Get the best supported MIME type if not specified
      if (!options.mimeType) {
        const bestMimeType = getBestSupportedMimeType();
        if (bestMimeType) {
          options.mimeType = bestMimeType;
        }
      }
      
      // Fallback options if the specified ones aren't supported
      if (options.mimeType && !MediaRecorder.isTypeSupported(options.mimeType)) {
        for (const mimeType of RECORDER_MIME_TYPES) {
          if (MediaRecorder.isTypeSupported(mimeType)) {
            options.mimeType = mimeType;
            break;
          }
        }
      }
      
      // Create a new MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(stream, options);
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
      this.mediaRecorder.onerror = this.handleError.bind(this);
      this.mediaRecorder.onstop = this.handleStop.bind(this);
      
      return true;
    } catch (error) {
      logError(error, 'RecordingService.initialize');
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
      }
      return false;
    }
  }
  
  /**
   * Starts recording
   * @returns Boolean indicating if recording started successfully
   */
  start(): boolean {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'recording') {
      return false;
    }
    
    try {
      // Start recording with time slicing for regular chunks
      this.mediaRecorder.start(RECORDER_TIMESLICE);
      
      // Track recording time
      this.startTime = Date.now();
      this.pausedDuration = 0;
      
      return true;
    } catch (error) {
      logError(error, 'RecordingService.start');
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
      }
      return false;
    }
  }
  
  /**
   * Pauses recording if supported
   * @returns Boolean indicating if recording was paused successfully
   */
  pause(): boolean {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') {
      return false;
    }
    
    try {
      if ('pause' in this.mediaRecorder) {
        this.mediaRecorder.pause();
        this.pauseStartTime = Date.now();
        return true;
      }
      return false;
    } catch (error) {
      logError(error, 'RecordingService.pause');
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
      }
      return false;
    }
  }
  
  /**
   * Resumes recording if paused
   * @returns Boolean indicating if recording was resumed successfully
   */
  resume(): boolean {
    if (!this.mediaRecorder || this.mediaRecorder.state !== 'paused') {
      return false;
    }
    
    try {
      if ('resume' in this.mediaRecorder) {
        this.mediaRecorder.resume();
        // Update paused duration tracker
        this.pausedDuration += (Date.now() - this.pauseStartTime);
        return true;
      }
      return false;
    } catch (error) {
      logError(error, 'RecordingService.resume');
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
      }
      return false;
    }
  }
  
  /**
   * Stops recording
   * @returns Boolean indicating if recording was stopped successfully
   */
  stop(): boolean {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      return false;
    }
    
    try {
      this.mediaRecorder.stop();
      return true;
    } catch (error) {
      logError(error, 'RecordingService.stop');
      if (this.onError) {
        this.onError(error instanceof Error ? error : new Error(String(error)));
      }
      return false;
    }
  }
  
  /**
   * Gets the current recording state
   * @returns The current recording state or 'inactive' if no recorder exists
   */
  getState(): RecordingState {
    if (!this.mediaRecorder) {
      return 'inactive';
    }
    return this.mediaRecorder.state as RecordingState;
  }
  
  /**
   * Gets the recorded chunks
   * @returns Array of recorded Blobs
   */
  getRecordedChunks(): Blob[] {
    return [...this.recordedChunks];
  }
  
  /**
   * Gets the current recording duration in milliseconds
   * @returns Duration in milliseconds
   */
  getDuration(): number {
    if (!this.startTime) return 0;
    
    if (this.mediaRecorder?.state === 'paused') {
      return this.pauseStartTime - this.startTime - this.pausedDuration;
    }
    
    return Date.now() - this.startTime - this.pausedDuration;
  }
  
  /**
   * Creates a single Blob from all recorded chunks
   * @param type - The MIME type for the resulting Blob
   * @returns A Blob containing the complete recording
   */
  getRecordingBlob(type?: string): Blob | null {
    if (this.recordedChunks.length === 0) {
      console.warn('No recorded chunks available to create blob');
      return null;
    }
    
    // Log information about chunks for debugging
    console.log(`Creating blob from ${this.recordedChunks.length} chunks`);
    console.log(`First chunk type: ${this.recordedChunks[0].type}, size: ${this.recordedChunks[0].size}`);
    
    // Use the first chunk's type if not specified
    if (!type && this.recordedChunks.length > 0) {
      type = this.recordedChunks[0].type;
    }
    
    // Ensure we have a valid MIME type - defaulting to WebM with VP8/Opus if needed
    if (!type || type === '') {
      type = 'video/webm;codecs=vp8,opus';
    }
    
    console.log(`Creating final blob with MIME type: ${type}`);
    
    // Create the blob with explicit type
    const finalBlob = new Blob(this.recordedChunks, { type });
    console.log(`Final blob created - size: ${finalBlob.size}, type: ${finalBlob.type}`);
    
    return finalBlob;
  }
  
  /**
   * Sets a callback for when recording data is available
   * @param callback - Function to call with each data chunk
   */
  setOnDataAvailable(callback: (chunk: Blob) => void): void {
    this.onDataAvailable = callback;
  }
  
  /**
   * Sets a callback for when recording is complete
   * @param callback - Function to call with final recording Blob
   */
  setOnRecordingComplete(callback: (blob: Blob) => void): void {
    this.onRecordingComplete = callback;
  }
  
  /**
   * Sets a callback for when an error occurs
   * @param callback - Function to call with error
   */
  setOnError(callback: (error: Error) => void): void {
    this.onError = callback;
  }
  
  /**
   * Resets the recording state
   */
  resetRecording(): void {
    this.recordedChunks = [];
    this.startTime = 0;
    this.pausedDuration = 0;
    this.pauseStartTime = 0;
  }
  
  /**
   * Creates a URL for the recording Blob
   * @returns A URL for the recording Blob or null if no data
   */
  createObjectURL(): string | null {
    const blob = this.getRecordingBlob();
    if (!blob) return null;
    
    return URL.createObjectURL(blob);
  }
  
  /**
   * Revoking a previously created object URL
   * @param url - The URL to revoke
   */
  revokeObjectURL(url: string): void {
    URL.revokeObjectURL(url);
  }
  
  /**
   * Handles the dataavailable event from MediaRecorder
   */
  private handleDataAvailable(event: BlobEvent): void {
    if (event.data.size > 0) {
      this.recordedChunks.push(event.data);
      
      if (this.onDataAvailable) {
        this.onDataAvailable(event.data);
      }
    }
  }
  
  /**
   * Handles the stop event from MediaRecorder
   */
  private handleStop(): void {
    // Wait a short time to ensure all chunks are processed
    setTimeout(() => {
      const finalBlob = this.getRecordingBlob();
      
      if (finalBlob && this.onRecordingComplete) {
        this.onRecordingComplete(finalBlob);
      } else if (this.onError) {
        this.onError(new Error('Failed to create final recording blob'));
      }
    }, 100);
  }
  
  /**
   * Handles errors from MediaRecorder
   */
  private handleError(event: ErrorEvent): void {
    logError(event.error, 'MediaRecorder');
    
    if (this.onError) {
      this.onError(event.error);
    }
  }
}

// Define a type for the recording state
export type RecordingState = 'inactive' | 'recording' | 'paused';

// Create singleton instance
export const recordingService = new RecordingService();
