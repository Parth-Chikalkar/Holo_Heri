import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

/**
 * Component to display content with fallback for missing translations
 * Shows a subtle indicator when content is not available in the selected language
 */
const TranslatedContent = ({ content, fieldName, showPlaceholder = true }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Check if content starts with language placeholder pattern like "[HI]", "[MR]", etc.
  const isPlaceholder = content && /^\[([A-Z]{2})\]/.test(content);

  if (!content || content.trim() === '') {
    if (!showPlaceholder) return null;
    
    return (
      <div className="text-gray-400 italic flex items-center gap-2 py-2">
        <AlertCircle className="w-4 h-4" />
        <span>Content not available</span>
      </div>
    );
  }

  if (isPlaceholder) {
    // Extract the placeholder message (after [XX])
    const placeholderText = content.replace(/^\[[A-Z]{2}\]\s*/, '');
    
    return (
      <div className="relative">
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-amber-300 rounded"></div>
        <div className="pl-4 text-gray-600 italic">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 uppercase">
              Translation Not Available
            </span>
          </div>
          <p className="text-sm">{placeholderText}</p>
        </div>
      </div>
    );
  }

  return <div className="whitespace-pre-wrap">{content}</div>;
};

export default TranslatedContent;
