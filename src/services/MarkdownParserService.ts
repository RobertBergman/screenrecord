import { v4 as uuidv4 } from 'uuid';
import { Slide } from '../types/slide';

// Constants for slide parsing
const SLIDE_SEPARATOR = '---';
const LAYOUT_PATTERN = /layout:\s*(.+)/;
const BACKGROUND_PATTERN = /background:\s*(.+)/;
const NOTES_SEPARATOR = '<!-- Notes:';
const NOTES_END = '-->';

/**
 * Service responsible for parsing Markdown into slide data
 */
export class MarkdownParserService {
  /**
   * Parse markdown content into an array of slides
   * @param markdownContent The raw markdown content with slide separators
   * @returns Array of Slide objects
   */
  public static parseMarkdown(markdownContent: string): Slide[] {
    if (!markdownContent) {
      return [];
    }

    // Split the content by slide separator
    const slidesContent = markdownContent.split(SLIDE_SEPARATOR);
    
    return slidesContent.map(content => this.parseSlideContent(content.trim()));
  }

  /**
   * Parse a single slide's content
   * @param content The raw content for a single slide
   * @returns A Slide object
   */
  private static parseSlideContent(content: string): Slide {
    const slide: Slide = {
      id: uuidv4(),
      content: content
    };

    // Extract layout information if present
    const layoutMatch = content.match(LAYOUT_PATTERN);
    if (layoutMatch && layoutMatch[1]) {
      slide.layout = layoutMatch[1].trim();
      slide.content = slide.content.replace(layoutMatch[0], '').trim();
    }

    // Extract background information if present
    const backgroundMatch = content.match(BACKGROUND_PATTERN);
    if (backgroundMatch && backgroundMatch[1]) {
      slide.background = backgroundMatch[1].trim();
      slide.content = slide.content.replace(backgroundMatch[0], '').trim();
    }

    // Extract speaker notes if present
    const notesStartIndex = content.indexOf(NOTES_SEPARATOR);
    if (notesStartIndex !== -1) {
      const notesEndIndex = content.indexOf(NOTES_END, notesStartIndex);
      if (notesEndIndex !== -1) {
        slide.notes = content
          .substring(notesStartIndex + NOTES_SEPARATOR.length, notesEndIndex)
          .trim();
        
        // Remove notes from the main content
        slide.content = slide.content
          .replace(content.substring(notesStartIndex, notesEndIndex + NOTES_END.length), '')
          .trim();
      }
    }

    return slide;
  }

  /**
   * Convert slides back to markdown format
   * @param slides Array of Slide objects
   * @returns Markdown string representing the slides
   */
  public static slideToMarkdown(slides: Slide[]): string {
    return slides.map(slide => {
      let slideContent = '';
      
      // Add layout if present
      if (slide.layout) {
        slideContent += `layout: ${slide.layout}\n`;
      }
      
      // Add background if present
      if (slide.background) {
        slideContent += `background: ${slide.background}\n`;
      }
      
      // Add content
      slideContent += slide.content;
      
      // Add notes if present
      if (slide.notes) {
        slideContent += `\n\n<!-- Notes:\n${slide.notes}\n-->`;
      }
      
      return slideContent;
    }).join(`\n\n${SLIDE_SEPARATOR}\n\n`);
  }
}
