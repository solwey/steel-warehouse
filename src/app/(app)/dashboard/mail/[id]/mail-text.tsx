'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface Props {
  text: string;
  limit?: number;
}

export default function EmailTextSection({ text, limit = 500 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > limit;

  const displayText = expanded || !shouldTruncate ? text : text.slice(0, limit) + '...';

  return (
    <div className="whitespace-pre-wrap">
      {displayText}

      {shouldTruncate && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center text-sm text-blue-600 hover:underline"
          >
            {expanded ? (
              <>
                <ChevronUpIcon className="w-4 h-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Show less</span>
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-4 h-4 mr-1 text-primary" />
                <span className="text-primary font-medium">Read more</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
