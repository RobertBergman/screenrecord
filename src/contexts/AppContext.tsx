/**
 * Application context provider for managing global state
 */

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, MediaState, RecordingState, OutputState, UIState } from '../types';
import { QUALITY_PRESETS, WEBCAM_POSITION_PRESETS } from '../constants';

// Initial state for the context
const initialMediaState: MediaState = {
  availableDevices: {
    video: [],
    audio: [],
  },
  selectedSources: {
    screen: null,
    webcam: null,
    microphone: null,
    systemAudio: false,
  },
  streams: {
    screen: null,
    webcam: null,
    audio: null,
    combined: null,
  },
};

const initialRecordingState: RecordingState = {
  status: 'idle',
  duration: 0,
  startTime: null,
  chunks: [],
  error: null,
};

const initialOutputState: OutputState = {
  format: 'webm',
  quality: 'medium',
  customSettings: QUALITY_PRESETS.medium,
  output: null,
  downloadUrl: null,
};

const initialUIState: UIState = {
  activePanel: 'source',
  webcamPosition: WEBCAM_POSITION_PRESETS.bottomRight,
  showSettings: false,
  notifications: [],
};

const initialState: AppState = {
  mediaState: initialMediaState,
  recordingState: initialRecordingState,
  outputState: initialOutputState,
  uiState: initialUIState,
};

// Define action types
type ActionType = 
  | { type: 'SET_AVAILABLE_DEVICES', devices: { video: MediaDeviceInfo[], audio: MediaDeviceInfo[] } }
  | { type: 'SET_SELECTED_SCREEN', screen: AppState['mediaState']['selectedSources']['screen'] }
  | { type: 'SET_SELECTED_WEBCAM', webcam: AppState['mediaState']['selectedSources']['webcam'] }
  | { type: 'SET_SELECTED_MICROPHONE', microphone: AppState['mediaState']['selectedSources']['microphone'] }
  | { type: 'SET_SYSTEM_AUDIO', enabled: boolean }
  | { type: 'SET_STREAM', streamType: keyof AppState['mediaState']['streams'], stream: MediaStream | null }
  | { type: 'SET_RECORDING_STATUS', status: RecordingState['status'] }
  | { type: 'SET_RECORDING_DURATION', duration: number }
  | { type: 'SET_RECORDING_START_TIME', startTime: number | null }
  | { type: 'ADD_RECORDING_CHUNK', chunk: Blob }
  | { type: 'CLEAR_RECORDING_CHUNKS' }
  | { type: 'SET_RECORDING_ERROR', error: Error | null }
  | { type: 'SET_OUTPUT_FORMAT', format: OutputState['format'] }
  | { type: 'SET_OUTPUT_QUALITY', quality: OutputState['quality'] }
  | { type: 'SET_CUSTOM_QUALITY_SETTINGS', settings: OutputState['customSettings'] }
  | { type: 'SET_OUTPUT_BLOB', output: Blob | null }
  | { type: 'SET_DOWNLOAD_URL', url: string | null }
  | { type: 'SET_ACTIVE_PANEL', panel: UIState['activePanel'] }
  | { type: 'SET_WEBCAM_POSITION', position: UIState['webcamPosition'] }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'SHOW_SETTINGS', show: boolean }
  | { type: 'ADD_NOTIFICATION', notification: { id: string, message: string, type: 'info' | 'success' | 'warning' | 'error' } }
  | { type: 'REMOVE_NOTIFICATION', id: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'RESET_STATE' }
  | { type: 'RESET_RECORDING_STATE' }
  | { type: 'RESET_OUTPUT_STATE' };

// Reducer function to handle state updates
const appReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case 'SET_AVAILABLE_DEVICES':
      return {
        ...state,
        mediaState: {
          ...state.mediaState,
          availableDevices: action.devices,
        },
      };
      
    case 'SET_SELECTED_SCREEN':
      return {
        ...state,
        mediaState: {
          ...state.mediaState,
          selectedSources: {
            ...state.mediaState.selectedSources,
            screen: action.screen,
          },
        },
      };
      
    case 'SET_SELECTED_WEBCAM':
      return {
        ...state,
        mediaState: {
          ...state.mediaState,
          selectedSources: {
            ...state.mediaState.selectedSources,
            webcam: action.webcam,
          },
        },
      };
      
    case 'SET_SELECTED_MICROPHONE':
      return {
        ...state,
        mediaState: {
          ...state.mediaState,
          selectedSources: {
            ...state.mediaState.selectedSources,
            microphone: action.microphone,
          },
        },
      };
      
    case 'SET_SYSTEM_AUDIO':
      return {
        ...state,
        mediaState: {
          ...state.mediaState,
          selectedSources: {
            ...state.mediaState.selectedSources,
            systemAudio: action.enabled,
          },
        },
      };
      
    case 'SET_STREAM':
      return {
        ...state,
        mediaState: {
          ...state.mediaState,
          streams: {
            ...state.mediaState.streams,
            [action.streamType]: action.stream,
          },
        },
      };
      
    case 'SET_RECORDING_STATUS':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          status: action.status,
        },
      };
      
    case 'SET_RECORDING_DURATION':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          duration: action.duration,
        },
      };
      
    case 'SET_RECORDING_START_TIME':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          startTime: action.startTime,
        },
      };
      
    case 'ADD_RECORDING_CHUNK':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          chunks: [...state.recordingState.chunks, action.chunk],
        },
      };
      
    case 'CLEAR_RECORDING_CHUNKS':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          chunks: [],
        },
      };
      
    case 'SET_RECORDING_ERROR':
      return {
        ...state,
        recordingState: {
          ...state.recordingState,
          error: action.error,
        },
      };
      
    case 'SET_OUTPUT_FORMAT':
      return {
        ...state,
        outputState: {
          ...state.outputState,
          format: action.format,
        },
      };
      
    case 'SET_OUTPUT_QUALITY':
      return {
        ...state,
        outputState: {
          ...state.outputState,
          quality: action.quality,
          // Update settings if a preset is selected
          customSettings: action.quality !== 'custom' 
            ? QUALITY_PRESETS[action.quality]
            : state.outputState.customSettings,
        },
      };
      
    case 'SET_CUSTOM_QUALITY_SETTINGS':
      return {
        ...state,
        outputState: {
          ...state.outputState,
          quality: 'custom',
          customSettings: action.settings,
        },
      };
      
    case 'SET_OUTPUT_BLOB':
      return {
        ...state,
        outputState: {
          ...state.outputState,
          output: action.output,
        },
      };
      
    case 'SET_DOWNLOAD_URL':
      return {
        ...state,
        outputState: {
          ...state.outputState,
          downloadUrl: action.url,
        },
      };
      
    case 'SET_ACTIVE_PANEL':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          activePanel: action.panel,
        },
      };
      
    case 'SET_WEBCAM_POSITION':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          webcamPosition: action.position,
        },
      };
      
    case 'TOGGLE_SETTINGS':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          showSettings: !state.uiState.showSettings,
        },
      };
      
    case 'SHOW_SETTINGS':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          showSettings: action.show,
        },
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          notifications: [...state.uiState.notifications, action.notification],
        },
      };
      
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          notifications: state.uiState.notifications.filter(n => n.id !== action.id),
        },
      };
      
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        uiState: {
          ...state.uiState,
          notifications: [],
        },
      };
      
    case 'RESET_RECORDING_STATE':
      return {
        ...state,
        recordingState: initialRecordingState,
      };
      
    case 'RESET_OUTPUT_STATE':
      // Revoke any existing object URL to prevent memory leaks
      if (state.outputState.downloadUrl) {
        URL.revokeObjectURL(state.outputState.downloadUrl);
      }
      
      return {
        ...state,
        outputState: initialOutputState,
      };
      
    case 'RESET_STATE':
      return initialState;
      
    default:
      return state;
  }
};

// Create context
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Context provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};
