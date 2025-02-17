// src/components/ShiftTable.tsx
import React from 'react';
import { generateSchedule, days, shiftDetails, employees } from '../utils/shiftScheduler';

interface ShiftTableProps {
    weeks: number;
}

// Vardiya hücrelerinin arka plan renkleri – A2 için turuncu
const shiftColorClasses: Record<string, string> = {
    G: 'bg-purple-200 hover:bg-purple-300',
    S1: 'bg-blue-200 hover:bg-blue-300',
    S2: 'bg-green-200 hover:bg-green-300',
    A1: 'bg-yellow-200 hover:bg-yellow-300',
    A2: 'bg-orange-200 hover:bg-orange-300', // A2 için
    D: 'bg-red-200 hover:bg-red-300',
    X: 'bg-gray-200 hover:bg-gray-300',
};

/**
 * generateDailySummary:
 * Her gün için, o gün atanan her vardiyadan kaç kişinin olduğunu özetler.
 */
const generateDailySummary = (weekPlan: Record<string, Record<string, string>>) => {
    const summary: Record<string, number> = {};
    days.forEach((day) => {
        shiftDetails.forEach((shift) => {
            const count = Object.values(weekPlan[day]).filter(
                (assigned) => assigned === shift.id
            ).length;
            summary[`${day}-${shift.id}`] = count;
        });
    });
    return summary;
};

const ShiftTable: React.FC<ShiftTableProps> = ({ weeks }) => {
    const schedule = generateSchedule(weeks);

    return (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            {schedule.map((weekPlan, weekIndex) => {
                const summary = generateDailySummary(weekPlan);
                return (
                    <div
                        key={weekIndex}
                        className="mb-6 bg-white rounded-lg shadow p-4 border border-gray-200"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            Hafta {weekIndex + 1}
                        </h2>
                        {/* Haftalık Vardiya Özeti Kartı */}
                        <div className="mb-4 bg-gray-100 p-2 rounded text-xs text-gray-700">
                            <div className="font-semibold mb-1">Vardiya Özeti</div>
                            <div className="flex flex-wrap gap-2">
                                {days.map((day) => {
                                    const daySummary = shiftDetails
                                        .map((shift) => {
                                            const count = summary[`${day}-${shift.id}`];
                                            return `${shift.id}:${count}`;
                                        })
                                        .join(", ");
                                    return (
                                        <div key={day} className="whitespace-nowrap">
                                            <span className="font-bold">{day}:</span> {daySummary}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                                    Çalışan
                                </th>
                                {days.map((day) => (
                                    <th
                                        key={day}
                                        className="px-3 py-2 text-center text-sm font-semibold text-gray-900"
                                    >
                                        <div className="whitespace-nowrap">Hafta {weekIndex + 1}</div>
                                        <div className="text-xs text-gray-500">{day}</div>
                                    </th>
                                ))}
                                <th className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Toplam Saat
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {employees.map((emp) => {
                                // Toplam saat sütunu: örneğimizde sabit 180:00 gösteriliyor.
                                const totalShiftHours = 180;
                                return (
                                    <tr key={emp.name} className="hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                            {emp.name}
                                            <div className="text-xs text-gray-500">20 gün çalışma</div>
                                        </td>
                                        {days.map((day) => {
                                            const assignedShiftId = schedule[weekIndex][day][emp.name];
                                            const shiftInfo = shiftDetails.find(s => s.id === assignedShiftId);
                                            return (
                                                <td key={day} className="px-3 py-4 border text-center text-sm">
                                                    {assignedShiftId === 'X' || !shiftInfo ? (
                                                        <span className="text-gray-600 font-semibold">İzin</span>
                                                    ) : (
                                                        <div className={`${shiftColorClasses[shiftInfo.id]} p-1 rounded`}>
                                                            <div className="font-bold">{shiftInfo.id}</div>
                                                            <div className="text-xxs text-gray-500">{shiftInfo.time}</div>
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center font-medium text-gray-900">
                                            {totalShiftHours}:00
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
};

export default ShiftTable;
