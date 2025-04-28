/**
 * Constants for the Screen Recorder application
 */

// Media Constants
export const MEDIA_CONSTRAINTS = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 60 },
  },
};

export const SCREEN_CAPTURE_CONSTRAINTS = {
  video: {
    cursor: 'always' as const,
    frameRate: { ideal: 30, max: 60 },
  },
  audio: true,
};

// Recording Constants
export const RECORDER_MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4',
];

export const RECORDER_TIMESLICE = 1000; // Record in 1-second chunks

// Quality Presets
export const QUALITY_PRESETS = {
  low: {
    resolution: { width: 640, height: 480 },
    frameRate: 15,
    bitrate: 500000, // 500 Kbps
  },
  medium: {
    resolution: { width: 1280, height: 720 },
    frameRate: 30,
    bitrate: 2500000, // 2.5 Mbps
  },
  high: {
    resolution: { width: 1920, height: 1080 },
    frameRate: 60,
    bitrate: 6000000, // 6 Mbps
  },
};

// UI Constants
export const WEBCAM_POSITION_PRESETS = {
  topLeft: { x: 16, y: 16, width: 320, height: 240 },
  topRight: { x: window.innerWidth - 336, y: 16, width: 320, height: 240 },
  bottomLeft: { x: 16, y: window.innerHeight - 256, width: 320, height: 240 },
  bottomRight: { x: window.innerWidth - 336, y: window.innerHeight - 256, width: 320, height: 240 },
};

// Error Messages
export const ERROR_MESSAGES = {
  permissionDenied: 'Permission to access media device was denied',
  deviceNotFound: 'The requested media device was not found',
  notSupported: 'This feature is not supported by your browser',
  constraintsNotSatisfied: 'The requested media constraints cannot be satisfied',
  unknownError: 'An unknown error occurred',
};

// Browser Support Detection
export const BROWSER_COMPATIBILITY = {
  isChromeBased: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
  isEdge: /Edg/.test(navigator.userAgent),
  isFirefox: /Firefox/.test(navigator.userAgent),
  isSafari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
};

export const HAS_SYSTEM_AUDIO_SUPPORT = BROWSER_COMPATIBILITY.isChromeBased || BROWSER_COMPATIBILITY.isEdge;
