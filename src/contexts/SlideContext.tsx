import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Slide, SlideAction, SlideState, SlideTheme } from '../types/slide';
import { slideReducer, initialSlideState } from '../reducers/slideReducer';
import { MarkdownParserService } from '../services/MarkdownParserService';

interface SlideContextType {
  state: SlideState;
  dispatch: React.Dispatch<SlideAction>;
  // Helper functions for common slide operations
  createNewSlide: () => void;
  updateSlideContent: (id: string, content: string) => void;
  navigateToSlide: (index: number) => void;
  navigateNext: () => void;
  navigatePrevious: () => void;
  importFromMarkdown: (markdown: string) => void;
  exportToMarkdown: () => string;
  togglePresentationMode: () => void;
  toggleEditMode: () => void;
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
    
    navigateToSlide: (index: number) => {
      if (index >= 0 && index < state.slides.length) {
        dispatch({ type: 'SET_CURRENT_SLIDE', payload: index });
      }
    },
    
    navigateNext: () => {
      if (state.currentSlideIndex < state.slides.length - 1) {
        dispatch({ 
          type: 'SET_CURRENT_SLIDE', 
          payload: state.currentSlideIndex + 1 
        });
      }
    },
    
    navigatePrevious: () => {
      if (state.currentSlideIndex > 0) {
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
