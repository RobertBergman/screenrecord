import React, { useEffect, useState } from 'react';
import { useSlides } from '../../contexts/SlideContext';
import SlideEditor from '../SlideEditor';
import Presentation from '../Presentation';

/**
 * Component that manages slide content and loads templates
 */
const SlideContent: React.FC = () => {
  const { importFromMarkdown, state, createNewSlide } = useSlides();
  const [templateLoaded, setTemplateLoaded] = useState(false);

  useEffect(() => {
    const loadDefaultTemplate = async () => {
      try {
        // Only load the template if there are no slides yet
        if (state.slides.length === 0 && !templateLoaded) {
          // Create sample slides if we can't fetch the template
          const defaultContent = `# Welcome to Markdown Slides

Create beautiful presentations with simple Markdown syntax`;

          try {
            // Attempt to load template
            const templateResponse = await fetch('/assets/slide-template.md');
            if (templateResponse.ok) {
              const templateText = await templateResponse.text();
              importFromMarkdown(templateText);
              console.log("Template loaded successfully");
            } else {
              console.warn("Template not found, creating default slide");
              // If template can't be loaded, use default content
              importFromMarkdown(defaultContent);
            }
          } catch (fetchError) {
            console.warn("Error fetching template:", fetchError);
            // Create a slide with default content on error
            importFromMarkdown(defaultContent);
          }
          
          setTemplateLoaded(true);
        }
      } catch (error) {
        console.error("Failed to load slide template:", error);
        // Fallback to creating an empty slide
        if (state.slides.length === 0) {
          createNewSlide();
        }
        setTemplateLoaded(true);
      }
    };

    loadDefaultTemplate();
  }, [state.slides.length, importFromMarkdown, createNewSlide, templateLoaded]);

  return (
    <>
      <SlideEditor />
      <Presentation />
    </>
  );
};

export default SlideContent;
