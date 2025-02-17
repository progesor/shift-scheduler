// src/components/WeekSelector.tsx
import React from 'react';

interface WeekSelectorProps {
    weeks: number;
    setWeeks: (weeks: number) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ weeks, setWeeks }) => {
    const options = [4, 8, 12, 16];

    return (
        <div className="mb-8 flex items-center justify-center">
            <label htmlFor="weekSelect" className="mr-3 text-lg font-medium text-gray-700">
                Haftalık Plan:
            </label>
            <select
                id="weekSelect"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
