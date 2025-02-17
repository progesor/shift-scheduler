// src/components/WeekSelector.tsx
import React from 'react';

interface WeekSelectorProps {
    weeks: number;
    setWeeks: (weeks: number) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ weeks, setWeeks }) => {
    const options = [1,4, 8, 12, 16];

    return (
        <div className="mt-4">
            <label htmlFor="weeks" className="block text-sm font-medium text-gray-700">
                Gösterilecek Hafta Sayısı
            </label>
            <select
                id="weeks"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option} Hafta
                    </option>
                ))}
            </select>
        </div>
    );
};

export default WeekSelector;
