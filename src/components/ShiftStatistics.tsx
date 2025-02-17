// src/components/ShiftStatistics.tsx
import React from 'react';
import { employees, shiftDetails } from '../utils/shiftScheduler';

export interface EmployeeStats {
    [shiftId: string]: number;
}

interface ShiftStatisticsProps {
    schedule: Array<Record<string, Record<string, string>>>;
    weeks: number;
}

const ShiftStatistics: React.FC<ShiftStatisticsProps> = ({ schedule, weeks }) => {
    // Her çalışan için istatistikleri tutacak obje
    const employeeStats: Record<string, EmployeeStats> = {};

    // Başlangıçta her çalışan için tüm shift'ler için 0 değeri atanır.
    employees.forEach(emp => {
        employeeStats[emp.name] = {};
        shiftDetails.forEach(shift => {
            employeeStats[emp.name][shift.id] = 0;
        });
    });

    // Tüm haftaların schedule'ını dolaşarak, her çalışan için shift sayısını toplayalım.
    schedule.forEach(weekPlan => {
        Object.values(weekPlan).forEach(daySchedule => {
            Object.entries(daySchedule).forEach(([empName, shiftId]) => {
                employeeStats[empName][shiftId] = (employeeStats[empName][shiftId] || 0) + 1;
            });
        });
    });

    return (
        <div className="mb-6 bg-white rounded-lg shadow p-4 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                {weeks} Haftalık Çalışma İstatistikleri
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                            Çalışan
                        </th>
                        {shiftDetails.map(shift => (
                            <th
                                key={shift.id}
                                className="px-4 py-2 text-center text-sm font-semibold text-gray-900"
                            >
                                {shift.id}
                            </th>
                        ))}
                        <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900">
                            Toplam Gün
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map(emp => {
                        const stats = employeeStats[emp.name];
                        const totalDays = Object.values(stats).reduce((sum, val) => sum + val, 0);
                        return (
                            <tr key={emp.name} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{emp.name}</td>
                                {shiftDetails.map(shift => (
                                    <td key={shift.id} className="px-4 py-2 text-sm text-center text-gray-700">
                                        {stats[shift.id]}
                                    </td>
                                ))}
                                <td className="px-4 py-2 text-sm text-center font-medium text-gray-900">
                                    {totalDays}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShiftStatistics;
