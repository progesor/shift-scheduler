// src/components/RequirementCard.tsx
import React from 'react';

interface Requirement {
    code: string;
    label: string;
    time: string;
    required: number;
    assigned: number;
}

const requirements: Requirement[] = [
    { code: 'G', label: 'Gece', time: '00:00 - 09:00', required: 3, assigned: 3 },
    { code: 'S1', label: 'Sabah', time: '09:00 - 18:00', required: 3, assigned: 3 },
    { code: 'S2', label: 'Sabah2', time: '10:00 - 19:00', required: 3, assigned: 3 },
    { code: 'A1', label: 'Akşam1', time: '15:00 - 00:00', required: 3, assigned: 3 },
    { code: 'A2', label: 'Akşam2', time: '15:00 - 00:00', required: 3, assigned: 3 },
    { code: 'D', label: 'Davul', time: '19:00 - 04:00', required: 3, assigned: 3 },
];

// Renk sınıfları – A2 için yeni renk:
const colorClasses: { [code: string]: string } = {
    G: 'bg-purple-200 hover:bg-purple-300',
    S1: 'bg-blue-200 hover:bg-blue-300',
    S2: 'bg-green-200 hover:bg-green-300',
    A1: 'bg-yellow-200 hover:bg-yellow-300',
    A2: 'bg-orange-200 hover:bg-orange-300', // A2 için
    D: 'bg-red-200 hover:bg-red-300',
};

const RequirementCard: React.FC = () => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Vardiya Gereksinimleri</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {requirements.map((req) => (
                    <div
                        key={req.code}
                        className={`${colorClasses[req.code]} rounded-lg shadow p-3`}
                    >
                        <div className="font-medium text-gray-900">
                            {req.label} ({req.time})
                        </div>
                        <div className="text-sm text-gray-600">
                            Günlük {req.required} kişi gerekli
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Atanan: {req.assigned} kişi
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequirementCard;
