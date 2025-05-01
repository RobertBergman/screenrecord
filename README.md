# Screen Recorder with Markdown Slides

A web-based application built with React and TypeScript that enables users to create screen recordings with optional webcam overlay and audio inputs, as well as create and present markdown-based slide presentations with text-to-speech narration.

## Features

### Screen Recording
- **Screen Capture**: Record your entire screen, an application window, or a browser tab
- **Webcam Integration**: Add webcam video overlay with configurable positions
- **Audio Recording**: Capture microphone audio and system audio (where supported)
- **Recording Controls**: Start, pause, resume, and stop recording
- **Output Options**: Download recordings in WebM format
- **Preview Panel**: Real-time preview of recording sources

### Markdown Slides
- **Slide Creation**: Create and edit presentation slides using Markdown syntax
- **Live Preview**: See your slides as you edit them
- **Presentation Mode**: Full-screen presentation with navigation controls
- **Speaker Notes**: Add notes visible only to the presenter
- **Text-to-Speech**: Automatic narration of slides using script support
- **Auto-play Mode**: Automatic slide advancement with synchronized narration
- **OpenAI Integration**: High-quality voice synthesis with API integration
- **Web Speech Fallback**: Works even without an API key

### Integration
- **Record Presentations**: Capture slide presentations with screen recording
- **Import/Export**: Open and save markdown presentations
- **Browser-Based**: No software installation required

## Technologies Used

- React 19
- TypeScript 5.7.2
- Styled Components
- MediaDevices API
- MediaRecorder API
- Web Speech API
- OpenAI TTS API
- React Markdown 10.1.0
- Marked 15.0.11
- PrismJS 1.30.0
- Vite

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)
- Modern browser (Chrome, Edge, or Firefox recommended)
- Optional: OpenAI API key for high-quality TTS

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/RobertBergman/screenrecord.git
   cd screenrecord
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Screen Recording

1. **Select Recording Sources**:
   - Click "Capture Screen" to select what to record
   - Optionally enable webcam overlay
   - Optionally enable microphone audio
   - Optionally enable system audio (Chrome/Edge only)

2. **Preview and Position**:
   - Review the preview of selected sources
   - Position webcam overlay as desired
   - Click "Ready to Record" when satisfied

3. **Record**:
   - Click "Start Recording" to begin
   - Use controls to pause, resume, or stop recording
   - Recording timer shows duration

4. **Save Recording**:
   - Preview your recording after stopping
   - Click "Download Recording" to save to your device
   - Start a new recording if desired

### Markdown Slides

1. **Create Slides**:
   - Click "Create Slides" from the main screen
   - Use the Markdown editor to create slide content
   - Add speaker notes using markdown comments
   - See your slides in the preview panel

2. **Add Narration**:
   - Add script text inside markdown comments `<!-- Script: Your narration text -->`
   - Configure TTS settings in the settings panel
   - Optionally add your OpenAI API key for high-quality voices

3. **Present**:
   - Click "Present" to enter full-screen presentation mode
   - Navigate with arrow keys or on-screen controls
   - Press 'P' to play/pause narration
   - Press 'A' to toggle auto-play mode

4. **Record Presentation**:
   - Use screen recording features to capture your presentation
   - Include audio narration in your recording

## Browser Support

- **Full Support**: Chrome 73+, Edge 79+
- **Partial Support**: Firefox 107+ (system audio limitations)
- **Limited Support**: Safari 16+ (requires additional handling)

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── MediaSourceSelector/
│   │   ├── PreviewPanel/
│   │   ├── RecordingControls/
│   │   ├── OutputManager/
│   │   ├── SlideRenderer/
│   │   ├── SlideEditor/
│   │   ├── Presentation/
│   │   ├── SlideContent/
│   │   ├── SlideModule/
│   │   └── SettingsModal/
│   ├── services/
│   │   ├── AudioCaptureService.ts
│   │   ├── ScreenCaptureService.ts
│   │   ├── RecordingService.ts
│   │   ├── WebcamService.ts
│   │   ├── MarkdownParserService.ts
│   │   └── TTSService.ts
│   ├── contexts/
│   │   ├── AppContext.tsx
│   │   └── SlideContext.tsx
│   ├── reducers/
│   │   └── slideReducer.ts
│   ├── types/
│   │   ├── index.ts
│   │   └── slide.ts
│   ├── utils/
│   │   ├── errorHandling.ts
│   │   └── featureDetection.ts
│   ├── constants/
│   ├── App.tsx
│   └── main.tsx
└── ...
```

## Privacy

This application processes all recording and slide data locally in your browser. No data is sent to any server unless:
1. You explicitly choose to save or share it
2. You use the OpenAI TTS feature, which sends text data to OpenAI's API

## Current Development Status

The application is in active development with the following features recently added:
- Markdown slide creation and presentation
- Text-to-speech narration with OpenAI integration
- Auto-play presentation mode
- Fixed styling issues with transient props
- Improved error handling and performance

See [CHANGELOG.md](./CHANGELOG.md) for detailed development history.

## License

This project is licensed under the MIT License.

## Acknowledgments

- This project was built with Vite and React
- Inspired by the need for simple, browser-based screen recording and presentation tools
- Special thanks to the open source community for libraries and inspiration
