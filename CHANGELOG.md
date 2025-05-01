# Changelog

All notable changes to the Screen Recorder project will be documented in this file.

## [Unreleased]

## [0.3.0] - 2025-04-30
### Fixed
- Fixed styled-components console warnings
  - Implemented transient props using `$` prefix in styled components
  - Updated RecordingControls component to use proper props handling
  - Fixed TimerInterval type issues with proper window reference
  - Improved TypeScript type safety for styled components and timer handling

## [0.2.0] - 2025-04-29
### Added
- Text-to-speech narration feature for slides
  - Created TTSService with OpenAI API integration
  - Implemented Web Speech API fallback mechanism
  - Added script support in slides using markdown comments
  - Updated MarkdownParserService to parse script sections
  - Added auto-play mode with automatic slide advancement
- Enhanced presentation mode
  - Added play/pause controls for narration
  - Added auto-play toggle button
  - Implemented keyboard shortcuts (p for play/pause, a for auto-play)
  - Added visual indicators for speech and auto-play status
- Created Settings modal for configuration
  - Added OpenAI API key management
  - Implemented secure storage using localStorage
  - Designed settings UI with clear instructions
- Added example slide presentation with scripts for demonstration

### Changed
- Updated technology stack to latest versions
  - React 19.0.0
  - TypeScript 5.7.2
  - ESLint 9.22.0
  - React Markdown 10.1.0
  - Marked 15.0.11
  - PrismJS 1.30.0
- Implemented best practices based on latest framework recommendations
  - Proper memoization using useMemo and useCallback
  - Following rules of hooks strictly
  - Explicit return types for all functions
  - Proper null/undefined checks
  - Component composition over inheritance

### Added
- Implemented markdown slide functionality with the following components
  - SlideRenderer for displaying markdown slides
  - SlideEditor for creating and editing slides
  - Presentation component for full-screen presentation mode
  - SlideContent for managing content and templates
  - SlideModule for integrating all slide components
- Added MarkdownParserService for converting markdown to slide objects
- Added state management through SlideContext and SlideReducer
- Integrated slides functionality with existing screen recorder components
- Added example slides and templates

## [0.1.0] - 2025-04-27
### Added
- Initialized memory bank with core documentation
- Established project vision and requirements
- Defined system architecture and technical approach
- Created initial component structure plan
- Implemented core UI components and service layer
- Enhanced homepage with improved visual design
  - Added gradient header and modern layout
  - Integrated real screen recording example
  - Created feature highlight cards
  - Implemented direct screen capture from homepage buttons
  - Added TypeScript declarations for WebM video files

### Fixed
- Fixed critical issues with recording preview and download functionality
  - Added proper timing in MediaRecorder stop event handling
  - Improved object URL lifecycle management
  - Enhanced media stream error handling
  - Fixed race conditions in media element playback
  - Added better error recovery mechanisms

## Recent Fixes
- Fixed issue where slide editor would disappear when hitting escape after presentation mode
  - Updated slideReducer to properly restore editor mode when exiting presentation mode
- Added ability to open exported presentations with a new file import functionality
  - Added "Open File" button in the slide module header
  - Implemented file import modal with drag-and-drop support
  - Added markdown file reading and importing capabilities
- Improved onscreen controls in presentation mode
  - Made controls larger, more visible, and more interactive
  - Added subtle animations and hover effects for better user feedback
  - Improved visual hierarchy with better spacing and borders
  - Enhanced speaker notes visibility with better styling
  - Improved help popup readability with better typography and colors
  - Added visual indicators for active states (speaking/auto-play)
