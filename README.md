# Screen Recorder

A web-based screen recording application built with React and TypeScript that allows users to capture their screen with optional webcam overlay and audio inputs.

## Features

- **Screen Capture**: Record your entire screen, an application window, or a browser tab
- **Webcam Integration**: Add webcam video overlay with configurable positions
- **Audio Recording**: Capture microphone audio and system audio (where supported)
- **Recording Controls**: Start, pause, resume, and stop recording
- **Output Options**: Download recordings in WebM format
- **Preview Panel**: Real-time preview of recording sources
- **Browser-Based**: No software installation required

## Technologies Used

- React 18
- TypeScript
- Styled Components
- MediaDevices API
- MediaRecorder API
- Vite

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)
- Modern browser (Chrome, Edge, or Firefox recommended)

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

## Browser Support

- **Full Support**: Chrome 73+, Edge 79+
- **Partial Support**: Firefox 107+ (system audio limitations)
- **Limited Support**: Safari 16+ (requires additional handling)

## Project Structure

```
/
├── src/
│   ├── components/     # React components
│   │   ├── MediaSourceSelector/
│   │   ├── PreviewPanel/
│   │   ├── RecordingControls/
│   │   └── OutputManager/
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Media handling services
│   ├── utils/          # Utility functions
│   ├── contexts/       # React contexts
│   ├── types/          # TypeScript type definitions
│   ├── constants/      # Application constants
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
└── ...
```

## Privacy

This application processes all recording data locally in your browser. No data is sent to any server unless you explicitly choose to save or share it.

## License

This project is licensed under the MIT License.

## Acknowledgments

- This project was built with Vite and React
- Inspired by the need for simple, browser-based screen recording tools
