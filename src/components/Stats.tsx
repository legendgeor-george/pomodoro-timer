import React from 'react';

interface StatsProps {
  completedCycles: number;
}

export function Stats({ completedCycles }: StatsProps) {
  const sets = Math.floor(completedCycles / 4);
  const remaining = completedCycles % 4;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {sets > 0 && (
          <>
            {Array.from({ length: sets }).map((_, setIndex) => (
              <div key={`set-${setIndex}`} className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="text-2xl">
                    🍅
                  </span>
                ))}
                {setIndex < sets - 1 && <div className="w-px h-6 bg-gray-300 mx-2" />}
              </div>
            ))}
            {remaining > 0 && <div className="w-px h-6 bg-gray-300 mx-2" />}
          </>
        )}
        {remaining > 0 && (
          <div className="flex items-center gap-2">
            {Array.from({ length: remaining }).map((_, i) => (
              <span key={i} className="text-2xl">
                🍅
              </span>
            ))}
          </div>
        )}
        {completedCycles === 0 && (
          <span className="text-gray-400 text-sm">完了サイクルなし</span>
        )}
      </div>
    </div>
  );
}
