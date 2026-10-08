import React from 'react';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  if (!content) return null;

  // Split into paragraphs / blocks
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Heading 3
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-2">
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        // Heading 2
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-2xl font-black text-slate-950 mt-8 mb-3">
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        // Unordered list
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\n/).map((line) => line.replace(/^[-*]\s+/, '').trim());
          return (
            <ul key={idx} className="list-disc pl-5 space-y-1.5 text-slate-700">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }

        // Standard paragraph with simple bold formatting
        return (
          <p key={idx} className="text-slate-700 leading-relaxed text-sm sm:text-base">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};
