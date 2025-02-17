// src/components/ShiftInfoCard.tsx
import React from 'react';

interface ShiftInfo {
    code: string;
    label: string;
    time: string;
}

const shifts: ShiftInfo[] = [
    { code: 'G', label: 'Gece', time: '00:00 - 09:00' },
    { code: 'S1', label: 'Sabah', time: '09:00 - 18:00' },
    { code: 'S2', label: 'Sabah2', time: '10:00 - 19:00' },
    { code: 'A1', label: 'Akşam1', time: '15:00 - 00:00' },
    { code: 'A2', label: 'Akşam2', time: '15:00 - 00:00' },
    { code: 'D', label: 'Davul', time: '19:00 - 04:00' },
    { code: 'X', label: 'İzin', time: '- - -' },
];

// Renk sınıfları – A2 için yeni renk: bg-orange-200 hover:bg-orange-300
const colorClasses: { [code: string]: string } = {
    G: 'bg-purple-200 hover:bg-purple-300',
    S1: 'bg-blue-200 hover:bg-blue-300',
    S2: 'bg-green-200 hover:bg-green-300',
    A1: 'bg-yellow-200 hover:bg-yellow-300',
    A2: 'bg-orange-200 hover:bg-orange-300', // A2 rengini değiştirdik.
    D: 'bg-red-200 hover:bg-red-300',
    X: 'bg-gray-200 hover:bg-gray-300',
};

const ShiftInfoCard: React.FC = () => {
    return (
        <div className="mb-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">Vardiya Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {shifts.map((shift) => (
                    <div
                        key={shift.code}
                        className={`${colorClasses[shift.code]} p-3 rounded-lg shadow-sm transition-all duration-200 flex items-center space-x-2`}
                    >
                        <span className="font-medium">{shift.code}:</span>
                        <span>
              {shift.label} ({shift.time})
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShiftInfoCard;
