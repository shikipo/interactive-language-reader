import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

interface TranslationOverlayProps {
  targetLanguage?: string;
}

export default function TranslationOverlay({ targetLanguage = 'de' }: TranslationOverlayProps) {
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; x: number; y: number }>({
    visible: false,
    text: "",
    x: 0,
    y: 0
  });

  async function translateWord(word: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/translate-word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, target: targetLanguage })
      });
      const data = await response.json();
      return data.success ? data.translated : `? ${word}`;
    } catch (error) {
      console.error("Translation error:", error);
      return `? ${word}`;
    }
  }

  useEffect(() => {
    // Function to handle hover on PDF text
    const handleWordHover = async (event: Event) => {
      const target = event.target as HTMLElement;
      const originalText = target.innerText?.trim();
      
      if (!originalText || originalText.length === 0) return;
      if (target.tagName !== 'SPAN') return;
      
      // Get position
      const rect = target.getBoundingClientRect();
      const x = rect.left + (rect.width / 2) - 100;
      const y = rect.top - 45;
      
      // Show loading
      setTooltip({
        visible: true,
        text: `"${originalText}" → translating...`,
        x: Math.max(5, Math.min(x, window.innerWidth - 210)),
        y: Math.max(5, y)
      });
      
      // Get translation
      const translated = await translateWord(originalText);
      
      // Update with translation
      setTooltip({
        visible: true,
        text: `"${originalText}" → "${translated}"`,
        x: Math.max(5, Math.min(x, window.innerWidth - 210)),
        y: Math.max(5, y)
      });
    };

    const hideTooltip = () => {
      setTooltip(prev => ({ ...prev, visible: false }));
    };

    // Find all PDF text spans and add event listeners
    const attachEvents = () => {
      const spans = document.querySelectorAll(".react-pdf__Page__textContent span");
      console.log(`Found ${spans.length} text spans`);
      
      spans.forEach((span) => {
        span.addEventListener("mouseenter", handleWordHover);
        span.addEventListener("mouseleave", hideTooltip);
      });
    };

    // Wait for PDF to render
    const timer = setTimeout(attachEvents, 2000);
    
    // Watch for dynamically added spans
    const observer = new MutationObserver(() => {
      attachEvents();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      // Clean up event listeners
      const spans = document.querySelectorAll(".react-pdf__Page__textContent span");
      spans.forEach((span) => {
        span.removeEventListener("mouseenter", handleWordHover);
        span.removeEventListener("mouseleave", hideTooltip);
      });
    };
  }, [targetLanguage]);

  if (!tooltip.visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: tooltip.x,
        top: tooltip.y,
        backgroundColor: "#ffd700",
        color: "#1a1a2e",
        padding: "8px 14px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "bold",
        pointerEvents: "none",
        zIndex: 10000,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        fontFamily: "monospace",
      }}
    >
      {tooltip.text}
    </div>
  );
}