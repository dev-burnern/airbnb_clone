'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface GuestSelectorProps {
    guests: number;
    maxGuests: number;
    onChange: (guests: number) => void;
}

export default function GuestSelector({ guests, maxGuests, onChange }: GuestSelectorProps) {
    const handleDecrease = () => {
        if (guests > 1) {
            onChange(guests - 1);
        }
    };

    const handleIncrease = () => {
        if (guests < maxGuests) {
            onChange(guests + 1);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
                <div className="font-medium">게스트</div>
                <div className="text-sm text-gray-500">최대 {maxGuests}명</div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleDecrease}
                    disabled={guests <= 1}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${guests <= 1
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                        }`}
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{guests}</span>
                <button
                    onClick={handleIncrease}
                    disabled={guests >= maxGuests}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${guests >= maxGuests
                            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                            : 'border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                        }`}
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
