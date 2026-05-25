import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const html = useMemo(() => {
    // Parse markdown to raw HTML
    const rawHtml = marked.parse(content, { async: false }) as string;
    // Sanitize the HTML to prevent XSS
    return DOMPurify.sanitize(rawHtml);
  }, [content]);

  return (
    <div 
      className="prose prose-zinc max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
