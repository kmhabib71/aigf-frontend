"use client";

import React from 'react';

interface TropeSelectorProps {
  selected: string[];
  onChange: (tropes: string[]) => void;
}

const AVAILABLE_TROPES = [
  { id: 'slow-burn', label: '🔥 Slow Burn', description: 'Gradual emotional buildup' },
  { id: 'enemies-to-lovers', label: '⚔️ Enemies to Lovers', description: 'From conflict to passion' },
  { id: 'forbidden-love', label: '🚫 Forbidden Love', description: 'Against all odds' },
  { id: 'second-chance', label: '💔 Second Chance', description: 'Rekindling lost love' },
  { id: 'fake-relationship', label: '🎭 Fake Relationship', description: 'Pretend turns real' },
  { id: 'forced-proximity', label: '🏠 Forced Proximity', description: 'Stuck together' },
  { id: 'grumpy-sunshine', label: '🌤️ Grumpy x Sunshine', description: 'Opposites attract' },
  { id: 'friends-to-lovers', label: '👫 Friends to Lovers', description: 'More than friends' }
];

export default function TropeSelector({ selected, onChange }: TropeSelectorProps) {
  const toggleTrope = (tropeId: string) => {
    if (selected.includes(tropeId)) {
      onChange(selected.filter(t => t !== tropeId));
    } else {
      onChange([...selected, tropeId]);
    }
  };

  return (
    <div className="trope-selector">
      <label className="text-lg font-semibold mb-3 block">
        Select Romance Tropes (Choose up to 3)
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {AVAILABLE_TROPES.map(trope => (
          <button
            key={trope.id}
            type="button"
            onClick={() => toggleTrope(trope.id)}
            disabled={!selected.includes(trope.id) && selected.length >= 3}
            className={`
              p-4 rounded-lg border-2 transition-all text-left
              ${selected.includes(trope.id)
                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
              }
              ${!selected.includes(trope.id) && selected.length >= 3
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
              }
            `}
          >
            <div className="text-xl mb-1">{trope.label}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {trope.description}
            </div>
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Selected: {selected.length}/3
        </div>
      )}
    </div>
  );
}
