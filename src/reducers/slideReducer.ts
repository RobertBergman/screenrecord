import { Slide, SlideAction, SlideState, SlideTheme } from '../types/slide';

// Default theme
const defaultTheme: SlideTheme = {
  id: 'default',
  name: 'Default Theme'
};

// Initial state for slides
export const initialSlideState: SlideState = {
  slides: [],
  currentSlideIndex: 0,
  editMode: true,
  presentationMode: false,
  autoPlayMode: false,
  theme: defaultTheme
};

/**
 * Reducer function for managing slide state
 * @param state The current slide state
 * @param action The action to perform
 * @returns Updated slide state
 */
export const slideReducer = (state: SlideState, action: SlideAction): SlideState => {
  switch (action.type) {
    case 'ADD_SLIDE': {
      const slides = [...state.slides, action.payload];
      return {
        ...state,
        slides,
        currentSlideIndex: slides.length - 1
      };
    }

    case 'UPDATE_SLIDE': {
      const { id, slide } = action.payload;
      const slides = state.slides.map(s => 
        s.id === id ? { ...s, ...slide } : s
      );
      return {
        ...state,
        slides
      };
    }

    case 'DELETE_SLIDE': {
      const slides = state.slides.filter(slide => slide.id !== action.payload);
      let currentSlideIndex = state.currentSlideIndex;
      
      // Adjust currentSlideIndex if necessary
      if (currentSlideIndex >= slides.length) {
        currentSlideIndex = Math.max(0, slides.length - 1);
      }

      return {
        ...state,
        slides,
        currentSlideIndex
      };
    }

    case 'REORDER_SLIDES': {
      return {
        ...state,
        slides: action.payload
      };
    }

    case 'SET_CURRENT_SLIDE': {
      return {
        ...state,
        currentSlideIndex: action.payload
      };
    }

    case 'TOGGLE_EDIT_MODE': {
      return {
        ...state,
        editMode: !state.editMode
      };
    }

    case 'TOGGLE_PRESENTATION_MODE': {
      return {
        ...state,
        presentationMode: !state.presentationMode,
        // Exit edit mode when entering presentation mode
        editMode: state.presentationMode ? state.editMode : false,
        // Exit autoplay mode when exiting presentation mode
        autoPlayMode: state.presentationMode ? false : state.autoPlayMode
      };
    }
    
    case 'TOGGLE_AUTOPLAY_MODE': {
      return {
        ...state,
        autoPlayMode: !state.autoPlayMode
      };
    }

    case 'SET_THEME': {
      return {
        ...state,
        theme: action.payload
      };
    }

    case 'IMPORT_SLIDES': {
      return {
        ...state,
        slides: action.payload,
        currentSlideIndex: 0
      };
    }

    default:
      return state;
  }
};
