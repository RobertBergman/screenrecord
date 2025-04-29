# ClineRules - Screen Recording Application

## Overview
ClineRules is a React-based web application that enables users to create screen recordings with optional webcam overlay and audio capture from both microphone and system sources. This document outlines the technical requirements, architecture, and implementation guidelines for the project.

## Core Requirements

### 1. Recording Capabilities
- **Screen Capture**: Ability to record the entire screen, a specific application window, or browser tab
- **Webcam Integration**: Optional overlay of webcam video in configurable positions
- **Audio Sources**: Capture from microphone, system audio, or both simultaneously
- **Quality Settings**: Configurable resolution, frame rate, and bitrate

### 2. User Interface
- Clean, intuitive design with minimal learning curve
- Real-time preview of recording sources
- Prominent, accessible recording controls
- Customization panel for recording settings
- Visual indicators for active recording state

### 3. Technical Specifications
- Built with React and TypeScript
- Responsive design suitable for desktop platforms
- Browser compatibility with Chrome, Firefox, Edge (latest versions)
- Local-first architecture with optional cloud storage integration

## API Requirements

### Browser APIs
- **MediaDevices API**: Access to camera and microphone
- **Screen Capture API**: Access to screen content
- **MediaRecorder API**: Recording media streams
- **IndexedDB**: Temporary storage of recordings

### Permissions
The application must request and handle the following permissions:
- Screen sharing
- Camera access
- Microphone access
- System audio capture (where available)

## Component Architecture

### 1. MediaSourceSelector
- Device enumeration and selection
- Screen/window/tab selection interface
- Camera device selection
- Audio input selection

### 2. PreviewPanel
- Real-time preview of selected sources
- Webcam position and size adjustment
- Visual indicators for audio levels

### 3. RecordingControls
- Start, pause, resume, stop buttons
- Recording timer display
- Error state handling

### 4. OutputManager
- Format selection (WebM, MP4)
- Quality preset configuration
- Download functionality
- Optional sharing capabilities

## Data Flow

1. User selects media sources (screen, camera, audio)
2. Application creates respective MediaStreams
3. Streams are displayed in preview and combined
4. On record start, MediaRecorder captures the combined stream
5. Data chunks are stored temporarily
6. On record stop, chunks are combined into final output
7. File is made available for download or cloud storage

## Security Considerations

- All recording processes occur client-side
- No data transmitted to servers without explicit user action
- Clear visual indicators when recording is active
- Automatic termination of recording sessions on tab close or browser crash

## Accessibility Requirements

- Keyboard navigation for all controls
- Screen reader compatibility
- High contrast mode
- Configurable UI scaling

## Implementation Phases

### Phase 1: Core Recording
- Basic UI implementation
- Screen capture functionality
- Local saving of recordings

### Phase 2: Enhanced Features
- Webcam integration
- Audio mixing capabilities
- Quality settings

### Phase 3: Polish
- UI refinements
- Performance optimization
- Cross-browser testing

## Code Standards

- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Document all components and functions
- Include comprehensive test coverage

## Sample Implementation

For the MediaStream setup:

```javascript
// Example code for initializing screen and webcam capture
const initializeMediaStreams = async () => {
  // Screen capture
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: "always",
      frameRate: { ideal: 30, max: 60 },
    },
    audio: true,
  });
  
  // Optional webcam
  if (enableWebcam) {
    const webcamStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 320 },
        height: { ideal: 240 },
      },
      audio: false, // Audio handled separately
    });
    
    // Handle webcam stream
    setWebcamStream(webcamStream);
  }
  
  // Microphone audio if needed
  if (enableMicrophone) {
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
      video: false,
    });
    
    // Handle microphone stream
    setMicStream(micStream);
  }
  
  // Combine streams as needed
  // ...
};
```

## Browser Support Notes

- System audio capture is fully supported in Chrome and Edge
- Firefox has limited support for system audio capture
- Safari requires additional handling for certain features

## Performance Considerations

- Monitor CPU and memory usage during extended recordings
- Implement configurable quality settings for lower-spec machines
- Consider using Web Workers for processing recorded chunks
- Implement intelligent chunking for long recordings

## Legal Considerations

- Implement clear consent notifications for recording
- Include visual indicators when recording is active
- Consider adding automated watermarks to indicate content origin
- Include guidelines for ethical recording usage

## Resources

- [MDN MediaDevices.getDisplayMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia)
- [MDN MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API)
- [MDN Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API)