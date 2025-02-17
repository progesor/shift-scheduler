// src/components/ShiftTable.tsx
import React from 'react';

interface ShiftTableProps {
    weeks: number;
}

// Örnek çalışan verisi (28 çalışan)
const employees = Array.from({ length: 28 }, (_, i) => `Çalışan ${i + 1}`);

// İzin grubu bilgileri (grup ve izin günleri)
interface PermissionGroup {
    group: string;
    employees: string[];
    // Haftanın günleri: Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar
    offDays: string[];
}

// Örnek: Grup A (Çalışan 1-4) izin: Pazartesi, Salı; Grup B (5-8): Salı, Çarşamba; vb.
const permissionGroups: PermissionGroup[] = [
    { group: 'A', employees: employees.slice(0, 4), offDays: ['Pzt', 'Sal'] },
    { group: 'B', employees: employees.slice(4, 8), offDays: ['Sal', 'Çar'] },
    { group: 'C', employees: employees.slice(8, 12), offDays: ['Çar', 'Perş'] },
    { group: 'D', employees: employees.slice(12, 16), offDays: ['Perş', 'Cum'] },
    { group: 'E', employees: employees.slice(16, 20), offDays: ['Cum', 'Cmt'] },
    { group: 'F', employees: employees.slice(20, 24), offDays: ['Cmt', 'Paz'] },
    { group: 'G', employees: employees.slice(24, 28), offDays: ['Paz', 'Pzt'] },
];

const days = ['Pzt', 'Sal', 'Çar', 'Perş', 'Cum', 'Cmt', 'Paz'];
const shifts = ['Shift 1', 'Shift 2', 'Shift 3', 'Shift 4', 'Shift 5', 'Shift 6'];

/**
 * Bu fonksiyon, verilen hafta sayısı için tüm çalışanların haftalık vardiya planını hesaplar.
 * Her çalışanın günü için:
 *  - Eğer çalışanın izin günü ise "İzin" yazılır.
 *  - Aksi halde, o gün için atanmış shift (örneğin, grup içindeki sıraya göre) belirlenir.
 */
const generateSchedule = (weeks: number) => {
    const schedule: any[] = [];

    // Her hafta için döngü
    for (let week = 1; week <= weeks; week++) {
        const weekPlan: { [day: string]: { [employee: string]: string } } = {};
        days.forEach((day) => {
            weekPlan[day] = {};
            // Her grup için
            permissionGroups.forEach((group) => {
                group.employees.forEach((employee, index) => {
                    // Eğer bu gün çalışanın izin günü ise:
                    if (group.offDays.includes(day)) {
                        weekPlan[day][employee] = 'İzin';
                    } else {
                        // Her hafta, grup içi sıralamaya göre vardiya ataması, basit rotasyon:
                        const shiftIndex = (index + week - 1) % shifts.length;
                        weekPlan[day][employee] = shifts[shiftIndex];
                    }
                });
            });
        });
        schedule.push(weekPlan);
    }
    return schedule;
};

const ShiftTable: React.FC<ShiftTableProps> = ({ weeks }) => {
    const schedule = generateSchedule(weeks);

    return (
        <div className="space-y-10">
            {schedule.map((weekPlan, weekIndex) => (
                <div key={weekIndex} className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold text-blue-600 mb-4">
                        Hafta {weekIndex + 1}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 border text-gray-700 font-semibold">Çalışan</th>
                                {days.map((day) => (
                                    <th key={day} className="px-4 py-2 border text-gray-700 font-semibold">{day}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee) => (
                                <tr key={employee} className="odd:bg-white even:bg-gray-50">
                                    <td className="px-4 py-2 border font-medium">{employee}</td>
                                    {days.map((day) => (
                                        <td key={day} className="px-4 py-2 border text-center">
                                            {weekPlan[day][employee]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ShiftTable;
