import React, { createContext, useContext, useReducer, ReactNode, useMemo, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Slide, SlideAction, SlideState, SlideTheme } from '../types/slide';
import { slideReducer, initialSlideState } from '../reducers/slideReducer';
import { MarkdownParserService } from '../services/MarkdownParserService';
import TTSService from '../services/TTSService';

interface SlideContextType {
  state: SlideState;
  dispatch: React.Dispatch<SlideAction>;
  // Helper functions for common slide operations
  createNewSlide: () => void;
  updateSlideContent: (id: string, content: string) => void;
  updateSlideScript: (id: string, script: string) => void;
  navigateToSlide: (index: number) => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  importFromMarkdown: (markdown: string) => void;
  exportToMarkdown: () => string;
  togglePresentationMode: () => void;
  toggleEditMode: () => void;
  toggleAutoPlayMode: () => void;
  playCurrentSlide: () => Promise<void>;
  stopSpeech: () => void;
  isCurrentlyPlaying: () => boolean;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

interface SlideProviderProps {
  children: ReactNode;
}

/**
 * Provider component for slide functionality
 */
export const SlideProvider: React.FC<SlideProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(slideReducer, initialSlideState);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayInProgressRef = useRef<boolean>(false);

  // Clean up any timers or playing audio when component unmounts
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
      TTSService.stop();
    };
  }, []);

  // Effect for handling auto-play mode
  useEffect(() => {
    if (state.presentationMode && state.autoPlayMode && !autoPlayInProgressRef.current) {
      handleAutoPlay();
    }
    
    if (!state.autoPlayMode && autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
      TTSService.stop();
    }
  }, [state.autoPlayMode, state.presentationMode, state.currentSlideIndex]);

  // Function to handle auto-play mode
  const handleAutoPlay = async () => {
    if (!state.presentationMode || !state.autoPlayMode) return;
    
    const currentSlide = state.slides[state.currentSlideIndex];
    if (!currentSlide) return;
    
    autoPlayInProgressRef.current = true;
    
    try {
      // Play the current slide's script
      await playCurrentSlide();
      
      // If there are more slides, move to the next one after a pause
      if (state.currentSlideIndex < state.slides.length - 1) {
        autoPlayTimerRef.current = setTimeout(() => {
          dispatch({ type: 'SET_CURRENT_SLIDE', payload: state.currentSlideIndex + 1 });
          autoPlayInProgressRef.current = false;
        }, 1500); // 1.5 second pause between slides
      } else {
        // End of presentation
        autoPlayInProgressRef.current = false;
      }
    } catch (error) {
      console.error('Error during auto-play:', error);
      autoPlayInProgressRef.current = false;
    }
  };

  // Play the current slide's script or content
  const playCurrentSlide = async () => {
    const currentSlide = state.slides[state.currentSlideIndex];
    if (!currentSlide) return;
    
    // Stop any previous speech
    TTSService.stop();
    
    // Use script if available, otherwise use content
    const textToSpeak = currentSlide.script || currentSlide.content;
    
    // Clean up the text from Markdown formatting for better TTS
    const cleanedText = textToSpeak
      .replace(/#+\s+/g, '') // Remove heading markers
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove italic markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Replace links with just the text
    
    // Try OpenAI TTS first, fall back to Web Speech API
    if (TTSService.isOpenAIInitialized()) {
      return TTSService.speakWithOpenAI(cleanedText);
    } else {
      return TTSService.speakWithWebSpeech(cleanedText);
    }
  };

  // Helper functions that encapsulate common dispatch actions
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    
    createNewSlide: () => {
      const newSlide: Slide = {
        id: uuidv4(),
        content: '# New Slide'
      };
      dispatch({ type: 'ADD_SLIDE', payload: newSlide });
    },
    
    updateSlideContent: (id: string, content: string) => {
      dispatch({
        type: 'UPDATE_SLIDE',
        payload: { id, slide: { content } }
      });
    },
    
    updateSlideScript: (id: string, script: string) => {
      dispatch({
        type: 'UPDATE_SLIDE',
        payload: { id, slide: { script } }
      });
    },
    
    navigateToSlide: (index: number) => {
      if (index >= 0 && index < state.slides.length) {
        // Stop any current speech when changing slides
        TTSService.stop();
        dispatch({ type: 'SET_CURRENT_SLIDE', payload: index });
      }
    },
    
    navigateNext: () => {
      if (state.currentSlideIndex < state.slides.length - 1) {
        // Stop any current speech when changing slides
        TTSService.stop();
        dispatch({ 
          type: 'SET_CURRENT_SLIDE', 
          payload: state.currentSlideIndex + 1 
        });
      }
    },
    
    navigatePrevious: () => {
      if (state.currentSlideIndex > 0) {
        // Stop any current speech when changing slides
        TTSService.stop();
        dispatch({ 
          type: 'SET_CURRENT_SLIDE', 
          payload: state.currentSlideIndex - 1 
        });
      }
    },
    
    importFromMarkdown: (markdown: string) => {
      const slides = MarkdownParserService.parseMarkdown(markdown);
      dispatch({ type: 'IMPORT_SLIDES', payload: slides });
    },
    
    exportToMarkdown: () => {
      return MarkdownParserService.slideToMarkdown(state.slides);
    },
    
    togglePresentationMode: () => {
      dispatch({ type: 'TOGGLE_PRESENTATION_MODE' });
    },
    
    toggleEditMode: () => {
      dispatch({ type: 'TOGGLE_EDIT_MODE' });
    },
    
    toggleAutoPlayMode: () => {
      dispatch({ type: 'TOGGLE_AUTOPLAY_MODE' });
    },
    
    playCurrentSlide,
    
    stopSpeech: () => {
      TTSService.stop();
    },
    
    isCurrentlyPlaying: () => {
      return TTSService.isSpeakingNow();
    }
  }), [state, dispatch]);

  return (
    <SlideContext.Provider value={contextValue}>
      {children}
    </SlideContext.Provider>
  );
};

/**
 * Hook to use slide functionality
 * @returns Slide context
 */
export const useSlides = (): SlideContextType => {
  const context = useContext(SlideContext);
  if (context === undefined) {
    throw new Error('useSlides must be used within a SlideProvider');
  }
  return context;
};
