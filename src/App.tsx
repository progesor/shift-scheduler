// src/App.tsx
import React, { useState } from 'react';
import WeekSelector from './components/WeekSelector';
import ShiftTable from './components/ShiftTable';

const App: React.FC = () => {
    const [weeks, setWeeks] = useState<number>(4);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Vardiya Planlama Uygulaması
                </h1>
                <WeekSelector weeks={weeks} setWeeks={setWeeks} />
                <ShiftTable weeks={weeks} />
            </div>
        </div>
    );
};

export default App;
