/**
 * Types for the Screen Recorder application
 */

// Media Related Types
export interface MediaDeviceInfo {
  deviceId: string;
  kind: string;
  label: string;
  groupId: string;
}

export interface ScreenCaptureOptions {
  audio: boolean;
  video: boolean;
  displaySurface?: 'browser' | 'window' | 'monitor';
}

export interface MediaState {
  availableDevices: {
    video: MediaDeviceInfo[];
    audio: MediaDeviceInfo[];
  };
  selectedSources: {
    screen: ScreenCaptureOptions | null;
    webcam: MediaDeviceInfo | null;
    microphone: MediaDeviceInfo | null;
    systemAudio: boolean;
  };
  streams: {
    screen: MediaStream | null;
    webcam: MediaStream | null;
    audio: MediaStream | null;
    combined: MediaStream | null;
  };
}

// Recording Related Types
export type RecordingStatus = 
  | 'idle' 
  | 'preparing' 
  | 'recording' 
  | 'paused' 
  | 'processing' 
  | 'completed' 
  | 'error';

export interface RecordingState {
  status: RecordingStatus;
  duration: number;
  startTime: number | null;
  chunks: Blob[];
  error: Error | null;
}

// Output Related Types
export type OutputFormat = 'webm' | 'mp4';
export type QualityPreset = 'low' | 'medium' | 'high' | 'custom';

export interface QualitySettings {
  resolution: { width: number; height: number };
  frameRate: number;
  bitrate: number;
}

export interface OutputState {
  format: OutputFormat;
  quality: QualityPreset;
  customSettings: QualitySettings;
  output: Blob | null;
  downloadUrl: string | null;
}

// UI Related Types
export type ActivePanel = 'source' | 'preview' | 'controls' | 'output' | 'slides';
export interface WebcamPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface UIState {
  activePanel: ActivePanel;
  webcamPosition: WebcamPosition;
  showSettings: boolean;
  notifications: Notification[];
}

// App State Type
export interface AppState {
  mediaState: MediaState;
  recordingState: RecordingState;
  outputState: OutputState;
  uiState: UIState;
}
