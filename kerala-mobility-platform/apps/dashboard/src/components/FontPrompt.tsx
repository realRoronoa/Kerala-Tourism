import React, { useState, useEffect } from 'react';

const FontPrompt: React.FC = () => {
  // State to store the user's chosen font
  const [customFont, setCustomFont] = useState<string>('');

  const handleTriggerPrompt = () => {
    // Open a native browser prompt dialog
    const requestedFont = window.prompt(
      'Enter a font family to apply globally (e.g., "Outfit", "Inter", "Roboto"):',
      'Outfit' // Default value
    );
    
    // Update state only if the user didn't cancel the prompt
    if (requestedFont) {
      setCustomFont(requestedFont);
    }
  };

  useEffect(() => {
    // Don't inject anything if no font is selected yet
    if (!customFont) return;

    // Create and inject the style tag
    const style = document.createElement('style');
    style.innerHTML = `* { font-family: "${customFont}", sans-serif !important; }`;
    document.head.appendChild(style);

    // Cleanup function to remove the old style tag if the font changes or component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, [customFont]);

  return (
    <button 
      onClick={handleTriggerPrompt}
      className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-colors"
      style={{ padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
    >
      Prompt for New Font
    </button>
  );
};

export default FontPrompt;
