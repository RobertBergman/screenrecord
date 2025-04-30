export interface Slide {
  id: string;
  content: string;
  layout?: string;
  background?: string;
  notes?: string;
  script?: string;
}

export interface SlideTheme {
  id: string;
  name: string;
  cssUrl?: string;
}

export interface SlideState {
  slides: Slide[];
  currentSlideIndex: number;
  editMode: boolean;
  presentationMode: boolean;
  autoPlayMode: boolean;
  theme: SlideTheme;
}

export type SlideAction = 
  | { type: 'ADD_SLIDE'; payload: Slide }
  | { type: 'UPDATE_SLIDE'; payload: { id: string; slide: Partial<Slide> } }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'REORDER_SLIDES'; payload: Slide[] }
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'TOGGLE_EDIT_MODE' }
  | { type: 'TOGGLE_PRESENTATION_MODE' }
  | { type: 'TOGGLE_AUTOPLAY_MODE' }
  | { type: 'SET_THEME'; payload: SlideTheme }
  | { type: 'IMPORT_SLIDES'; payload: Slide[] };
