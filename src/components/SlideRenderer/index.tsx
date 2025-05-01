import React from 'react';
import ReactMarkdown from 'react-markdown';
import './styles.css';
import { Slide } from '../../types/slide';

interface SlideRendererProps {
  slide: Slide;
  fullscreen?: boolean;
}

/**
 * Component to render a slide with markdown content
 */
const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, fullscreen = false }) => {
  if (!slide) {
    return <div className="slide-empty">No slide content</div>;
  }

  const backgroundStyle = slide.background 
    ? { backgroundImage: `url(${slide.background})` } 
    : {};

  const layoutClass = slide.layout ? `layout-${slide.layout}` : '';
  const fullscreenClass = fullscreen ? 'fullscreen' : '';

  return (
    <div 
      className={`slide-container ${layoutClass} ${fullscreenClass}`} 
      style={backgroundStyle}
    >
      <div className="slide-content">
        <ReactMarkdown>{slide.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SlideRenderer;
