# Screen Recorder - Technical Context

## Technology Stack

### Frontend Framework
- **React**: v19.0.0 - Latest version for building the user interface
- **TypeScript**: v5.7.2 - For type-safe code development
- **React Hooks**: For state management and side effects

### Build Tools
- **Vite**: v6.3.1 - Fast, modern build tool and development server
- **ESLint**: v9.22.0 - Code quality and style enforcement with modern configurations
- **TypeScript-ESLint**: v8.26.1 - TypeScript-specific linting rules
- **Prettier**: Code formatting (configured through ESLint)
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities

### Key Libraries
- **React Markdown**: v10.1.0 - Markdown rendering for slide functionality
- **Marked**: v15.0.11 - Markdown parsing library
- **PrismJS**: v1.30.0 - Syntax highlighting for code blocks in markdown
- **Styled Components**: v6.1.17 - CSS-in-JS styling solution
- **React-Use**: v17.6.0 - Collection of essential React Hooks
- **UUID**: v11.1.0 - For generating unique identifiers

### Key Browser APIs
- **MediaDevices API**: Accessing camera and microphone
  - `navigator.mediaDevices.getUserMedia()`
  - `navigator.mediaDevices.enumerateDevices()`
- **Screen Capture API**: Recording screen content
  - `navigator.mediaDevices.getDisplayMedia()`
- **MediaRecorder API**: Recording media streams
  - `MediaRecorder` class and related methods
- **Canvas API**: Combining and processing video streams
- **IndexedDB**: Local storage for recorded data
- **Web Workers API**: For processing tasks off the main thread

## Development Setup

### Environment Requirements
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher (or yarn equivalent)
- **Modern Browser**: Chrome/Edge/Firefox latest versions

### Project Structure
```
/
├── public/             # Static assets
│   └── assets/         # Static resource files (templates, etc.)
├── src/
│   ├── components/     # React components
│   │   ├── MediaSourceSelector/
│   │   ├── PreviewPanel/
│   │   ├── RecordingControls/
│   │   ├── OutputManager/
│   │   ├── SlideRenderer/
│   │   ├── SlideEditor/
│   │   ├── Presentation/
│   │   ├── SlideContent/
│   │   └── SlideModule/
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Media handling services
│   │   ├── ScreenCaptureService.ts
│   │   ├── WebcamService.ts
│   │   ├── AudioCaptureService.ts
│   │   ├── RecordingService.ts
│   │   └── MarkdownParserService.ts
│   ├── utils/          # Utility functions
│   │   ├── errorHandling.ts
│   │   └── featureDetection.ts
│   ├── contexts/       # React contexts
│   │   ├── AppContext.tsx
│   │   └── SlideContext.tsx
│   ├── types/          # TypeScript type definitions
│   │   ├── index.ts
│   │   └── slide.ts
│   ├── constants/      # Application constants
│   ├── reducers/       # State reducers
│   │   └── slideReducer.ts
│   ├── assets/         # Component-specific assets
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .eslintrc.js        # ESLint configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## Technical Constraints

### Browser Compatibility
- **Full Support**: Chrome 73+, Edge 79+
- **Partial Support**: Firefox 107+ (system audio limitations)
- **Limited Support**: Safari 16+ (requires additional handling)

### API Limitations
- System audio capture may require browser extensions on some platforms
- Firefox has limited support for system audio capture
- Webcam overlay quality depends on user's hardware
- Extended recordings may face memory limitations in browser environment
- Maximum recording resolution dependent on device capabilities

### Performance Considerations
- High-resolution recording increases CPU and memory usage
- Long recordings may strain browser memory management
- Simultaneous webcam + screen recording requires adequate system resources
- Mobile device support is limited by hardware capabilities

### Security Requirements
- All browser permissions must be explicitly requested
- Recording indicators must be clearly visible
- Privacy-sensitive recording options must be opt-in
- All processing occurs client-side for data privacy

## Best Practices

### React Best Practices
- Use functional components with hooks instead of class components
- Apply proper memoization using `useMemo` and `useCallback` to optimize rendering
- Avoid accessing `ref.current` properties during render phase
- Never reassign variables after render, use state management instead
- Follow rules of hooks - only call at top level, not in conditionals
- Avoid creating components inside render functions
- No direct mutation of global state
- Use pure functions whenever possible
- Proper cleanup in useEffect hooks to prevent memory leaks
- Component composition over inheritance

### TypeScript Best Practices
- Use explicit return types for all functions
- Avoid unused imports and declarations
- Properly handle optional properties with null/undefined checks
- Use correct module import/export patterns
- Use explicit type imports (with 'type' keyword) when appropriate
- Maintain strict null checking
- Use utility types where appropriate
- Use interfaces for object shapes and types for unions/primitives
- Avoid using 'any' type - use unknown or proper typing instead
- Leverage TypeScript's discriminated unions for complex state management

## Development Workflow

### Development Process
1. Local development with hot module replacement
2. Component development with isolated testing
3. Integration testing for media stream interactions
4. Cross-browser testing before deployment
5. Performance testing with different media configurations

### Testing Strategy
- **Unit Tests**: Individual utilities and hooks
- **Component Tests**: Isolated component rendering and behavior
- **Integration Tests**: Component interactions and state management
- **End-to-End Tests**: Full application workflows
- **Manual Browser Testing**: API compatibility verification

### Debugging Tools
- React DevTools for component inspection
- Chrome DevTools Media Panel for stream debugging
- Console logging with dedicated debug channels
- Performance monitoring for media processing

## Deployment Strategy
- Static site hosting (GitHub Pages, Netlify, Vercel)
- Content Security Policy configuration for media permissions
- HTTPS required for media capture APIs
- Cache strategy for application assets
- No backend server requirements (client-only)

## Tool Usage Patterns

### React Hooks Pattern

```typescript
// Custom hook for managing media devices
function useMediaDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function getDevices() {
      try {
        setLoading(true);
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        
        if (mounted) {
          setDevices(mediaDevices);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    getDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    
    return () => {
      mounted = false;
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return { devices, loading, error };
}
```

### Media Stream Management Pattern

```typescript
// Service pattern for screen capture
class ScreenCaptureService {
  private stream: MediaStream | null = null;
  
  async captureScreen(options: DisplayMediaStreamOptions): Promise<MediaStream> {
    try {
      // Stop any existing stream
      this.stopCapture();
      
      // Request new screen capture
      this.stream = await navigator.mediaDevices.getDisplayMedia(options);
      
      // Handle stream ending
      this.stream.getVideoTracks()[0].addEventListener('ended', () => {
        this.stream = null;
      });
      
      return this.stream;
    } catch (error) {
      throw new Error(`Screen capture failed: ${error}`);
    }
  }
  
  stopCapture(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  
  getStream(): MediaStream | null {
    return this.stream;
  }
}
```

### Error Handling Pattern

```typescript
// Centralized error handling
type ErrorType = 
  | 'permission_denied' 
  | 'not_supported' 
  | 'device_not_found'
  | 'constraints_not_satisfied'
  | 'unknown';

interface MediaError {
  type: ErrorType;
  message: string;
  originalError?: Error;
}

function handleMediaError(error: unknown): MediaError {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
        return {
          type: 'permission_denied',
          message: 'Permission to access media device was denied',
          originalError: error
        };
      case 'NotFoundError':
        return {
          type: 'device_not_found',
          message: 'The requested media device was not found',
          originalError: error
        };
      case 'NotSupportedError':
        return {
          type: 'not_supported',
          message: 'The media type is not supported by your browser',
          originalError: error
        };
      case 'OverconstrainedError':
        return {
          type: 'constraints_not_satisfied',
          message: 'The requested media constraints cannot be satisfied',
          originalError: error
        };
      default:
        return {
          type: 'unknown',
          message: error.message || 'An unknown media error occurred',
          originalError: error
        };
    }
  }
  
  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    originalError: error instanceof Error ? error : undefined
  };
}
```

## Browser Feature Detection

```typescript
// Feature detection utilities
const browserCapabilities = {
  hasScreenCaptureSupport(): boolean {
    return !!(navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices);
  },
  
  hasMediaRecorderSupport(): boolean {
    return typeof MediaRecorder !== 'undefined';
  },
  
  hasSystemAudioSupport(): boolean {
    // This is an approximation as it's hard to detect before attempting capture
    const isChromeBased = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    
    return isChromeBased || isEdge;
  },
  
  async hasWebcamSupport(): Promise<boolean> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return false;
    }
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (e) {
      return false;
    }
  },
  
  getMimeTypes(): string[] {
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
  }
};
