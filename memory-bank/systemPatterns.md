# Screen Recorder - System Patterns

## System Architecture

### Overview
The Screen Recorder is built as a client-side single-page application (SPA) using React and TypeScript. It follows a component-based architecture with a focus on separation of concerns and reusability.

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              Application                                   │
├───────────┬───────────┬────────────┬────────────────┬────────────────────┤
│  Media    │  Preview  │ Recording  │    Output      │     Markdown       │
│  Source   │  Panel    │ Controls   │    Manager     │      Slides        │
│  Selector │           │            │                │                    │
└───────────┴───────────┴────────────┴────────────────┴────────────────────┘
      │           │           │             │                 │
      └───────────┴───────────┴─────────────┴─────────────────┘
                  │                                 │
          ┌───────────────────┐          ┌─────────────────────┐
          │  Media Processing │          │  Markdown Processing│
          │     Services      │          │      Services       │
          └───────────────────┘          └─────────────────────┘
                  │                                 │
          ┌───────────────────────────────────────────────────┐
          │                  Browser APIs                      │
          └───────────────────────────────────────────────────┘
```

### Core Architectural Patterns

#### 1. Component-Based Architecture
- Modular, reusable components
- Hierarchical component structure
- Container/presentational component pattern
- Composition over inheritance

#### 2. Hooks-Based State Management
- React hooks for state and side effects
- Custom hooks for reusable logic
- Context API for shared state
- Reducers for complex state logic

#### 3. Service Layer Pattern
- Abstraction over browser APIs
- Centralized media handling
- Separation of concerns

#### 4. Event-Driven Communication
- Component events for user interactions
- Stream and chunk events for recording data
- Custom event system for cross-component communication

## Component Relationships

### Media Source Selector
- **Role**: User interface for selecting recording sources
- **Dependencies**: MediaDevices API
- **Relationships**:
  - Provides selected sources to Preview Panel
  - Communicates configuration to Media Processing Services

### Preview Panel
- **Role**: Displays real-time preview of recording sources
- **Dependencies**: Media Source Selector, Canvas API
- **Relationships**:
  - Receives media streams from Media Source Selector
  - Provides visual feedback for Recording Controls

### Recording Controls
- **Role**: User interface for controlling recording process
- **Dependencies**: Media Processing Services
- **Relationships**:
  - Triggers recording actions in Media Processing Services
  - Updates application state based on recording status
  - Coordinates with Output Manager on recording completion

### Output Manager
- **Role**: Handles processing and saving of recorded media
- **Dependencies**: Media Processing Services, IndexedDB
- **Relationships**:
  - Receives recorded chunks from Media Processing Services
  - Processes final output file
  - Provides download functionality

### Media Processing Services
- **Role**: Core recording and processing logic
- **Dependencies**: Browser Media APIs
- **Relationships**:
  - Receives configuration from components
  - Manages media streams and recording
  - Provides recording data to Output Manager

### Markdown Slide Components

#### SlideRenderer
- **Role**: Renders individual markdown slides with proper formatting and layouts
- **Dependencies**: MarkdownParserService
- **Relationships**:
  - Receives slide data from SlideContext
  - Renders slide content with formatting
  - Used by both Presentation and SlideEditor components

#### SlideEditor
- **Role**: Provides an interface for editing slides with markdown syntax
- **Dependencies**: MarkdownParserService, SlideRenderer
- **Relationships**:
  - Updates slide content in SlideContext
  - Provides split-view editing with live preview
  - Communicates with SlideModule for navigation

#### Presentation
- **Role**: Displays slides in full-screen presentation mode
- **Dependencies**: SlideRenderer
- **Relationships**:
  - Receives slide data from SlideContext
  - Handles slide navigation and transitions
  - Can be used while recording for presentation captures

#### SlideContent
- **Role**: Manages slide content and template loading
- **Dependencies**: MarkdownParserService
- **Relationships**:
  - Loads templates from assets directory
  - Provides content to SlideRenderer
  - Manages content structure and organization

#### SlideModule
- **Role**: Integrates all slide components into a cohesive user interface
- **Dependencies**: SlideEditor, Presentation, SlideContent
- **Relationships**:
  - Coordinates between editing and presentation modes
  - Provides main interface for slide functionality
  - Communicates with AppContext for application state

### MarkdownParserService
- **Role**: Converts markdown content to slide objects and vice versa
- **Dependencies**: None
- **Relationships**:
  - Used by SlideRenderer to parse markdown
  - Used by SlideEditor to update slide content
  - Provides parsing and formatting logic for all slide components

## Key Design Patterns

### 1. Observer Pattern
- Media streams observe source changes
- UI components observe recording state
- Recording chunks collection

### 2. Factory Pattern
- Media stream creation
- Recorder instance creation
- Output format handlers

### 3. Strategy Pattern
- Recording quality presets
- Output format strategies
- Error handling strategies

### 4. Command Pattern
- Recording control actions
- Media processing tasks
- Undo/redo for configuration changes

### 5. Facade Pattern
- Browser API abstraction
- Simplified interface for complex media operations
- Cross-browser compatibility handling

## Critical Implementation Paths

### 1. Media Stream Initialization
```
User Selection → Device Enumeration → Permission Requests → Stream Creation → Preview Display
```

### 2. Recording Process
```
Start Command → Stream Combination → MediaRecorder Setup → Chunk Collection → Data Storage
```

### 3. Output Generation
```
Stop Command → Chunk Processing → Format Conversion → File Creation → Download Preparation
```

## State Management

### Application State Structure
```typescript
interface AppState {
  mediaState: {
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
  };
  recordingState: {
    status: 'idle' | 'preparing' | 'recording' | 'paused' | 'processing' | 'completed' | 'error';
    duration: number;
    startTime: number | null;
    chunks: Blob[];
    error: Error | null;
  };
  outputState: {
    format: 'webm' | 'mp4';
    quality: 'low' | 'medium' | 'high' | 'custom';
    customSettings: {
      resolution: { width: number; height: number };
      frameRate: number;
      bitrate: number;
    };
    output: Blob | null;
    downloadUrl: string | null;
  };
  uiState: {
    activePanel: 'source' | 'preview' | 'controls' | 'output' | 'slides';
    webcamPosition: { x: number; y: number; width: number; height: number };
    showSettings: boolean;
    notifications: Array<{ id: string; message: string; type: string }>;
  };
  slideState: {
    slides: Array<{
      id: string;
      content: string;
      title: string;
      notes: string;
      template: string;
    }>;
    currentSlideIndex: number;
    presentationMode: boolean;
    editMode: boolean;
    template: string | null;
    lastSaved: number | null;
  };
}
```

### Slide State Structure
```typescript
interface SlideState {
  slides: Slide[];
  currentSlideIndex: number;
  presentationMode: boolean;
  editMode: boolean;
  template: string | null;
  lastSaved: number | null;
}

interface Slide {
  id: string;
  content: string;
  title: string;
  notes: string;
  template: string;
}
```

## Media Resource Management Patterns

### Media Lifecycle Management
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Create/Acquire  │────▶│     Utilize     │────▶│  Release/Revoke  │
│    Resources     │     │    Resources    │     │    Resources     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

#### 1. Object URL Lifecycle
- Create: `URL.createObjectURL(blob)` creates URLs for recorded media
- Utilize: Media elements consume URL through src attribute
- Release: `URL.revokeObjectURL(url)` properly cleans up resources
- Implementation: In state reducers to ensure cleanup when state resets

#### 2. MediaStream Lifecycle
- Create: Through `getUserMedia()` or `getDisplayMedia()`
- Utilize: Feed to video elements and MediaRecorder
- Release: Stop individual tracks and remove references
- Implementation: Cleanup on component unmount and state transitions

#### 3. MediaRecorder Lifecycle
- Create: Initialize with combined media stream
- Utilize: Generate recording chunks during recording
- Release: Properly stop and dispose after recording
- Implementation: Singleton service with cleanup methods

#### 4. Asynchronous MediaElement Operations
- Problem: Race conditions in rapid state changes
- Solution: Timeout-based approach for video.play() calls
- Error handling: AbortError catching for interrupted operations
- Implementation: Delayed operations with proper cleanup on unmount

## Error Handling Strategy
- Graceful permission denial handling
- Stream initialization failure recovery
- Recording error detection and reporting
- Automatic recovery where possible
- Clear user messaging and guidance
- Detailed logging for debugging
- Timeout-based detection for long-running operations
- Fallback mechanisms for playback failures
- Type-specific error handling (AbortError vs NotSupportedError)
- Cleanup on error to prevent resource leaks

## Performance Considerations
- Efficient stream handling to minimize CPU usage
- Worker threads for processing recording chunks
- Optimized canvas operations for preview rendering
- Lazy loading of non-critical components
- Memory management for long recordings
- Progressive chunk processing
- Proper resource cleanup to prevent memory leaks
- Timeout-based approaches to prevent UI blocking
- Efficient handling of blob data for large recordings
- Optimized object URL lifecycle management
