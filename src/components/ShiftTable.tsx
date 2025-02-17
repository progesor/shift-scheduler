import React from 'react';

interface ShiftTableProps {
    weeks: number;
}

// 7 günlük gün isimleri (0: Pazartesi, 1: Salı, … 6: Pazar)
const days = ['Pzt', 'Sal', 'Çar', 'Perş', 'Cum', 'Cmt', 'Paz'];

// Vardiya detayları (6 vardiya + İzin)
// Her vardiya için gereken kişi sayısı 3 (İzin için 0)
interface Shift {
    id: string;
    name: string;
    time: string;
    required: number;
}

const shiftDetails: Shift[] = [
    { id: 'G', name: 'Gece', time: '00:00 - 09:00', required: 3 },
    { id: 'S1', name: 'Sabah', time: '09:00 - 18:00', required: 3 },
    { id: 'S2', name: 'Sabah2', time: '10:00 - 19:00', required: 3 },
    { id: 'A1', name: 'Akşam1', time: '15:00 - 00:00', required: 3 },
    { id: 'A2', name: 'Akşam2', time: '15:00 - 00:00', required: 3 },
    { id: 'D', name: 'Davul', time: '19:00 - 04:00', required: 3 },
    { id: 'X', name: 'İzin', time: '- - -', required: 0 },
];

// Vardiya hücrelerinin arka plan renkleri (A2 için örnekte turuncu kullanıldı)
const shiftColorClasses: Record<string, string> = {
    G: 'bg-purple-200 hover:bg-purple-300',
    S1: 'bg-blue-200 hover:bg-blue-300',
    S2: 'bg-green-200 hover:bg-green-300',
    A1: 'bg-yellow-200 hover:bg-yellow-300',
    A2: 'bg-orange-200 hover:bg-orange-300', // A2 için güncellendi
    D: 'bg-red-200 hover:bg-red-300',
    X: 'bg-gray-200 hover:bg-gray-300',
};

// Çalışan verileri: Her çalışan için isim ve baseOff (0-6 arası, başlangıç izin ofseti)
// Örneğimizde 28 çalışan üretiyoruz; baseOff değerini sırasıyla (i mod 7) atıyoruz.
interface Employee {
    name: string;
    baseOff: number;
}
const employees: Employee[] = Array.from({ length: 28 }, (_, i) => ({
    name: `Çalışan ${i + 1}`,
    baseOff: i % 7, // her çalışan farklı baseOff
}));

/**
 * Her hafta için, her gün çalışanların atamasını hesaplayan fonksiyon.
 * Her çalışan haftada 5 gün çalışıp 2 gün izin kullanacak şekilde rotasyonlu izin günleri belirlenir.
 *
 * Her hafta için, her çalışan için o haftaya özel izin günleri:
 *   offDay1 = (baseOff + week - 1) mod 7
 *   offDay2 = (baseOff + week) mod 7
 *
 * Eğer gün (0-6) bu offDay'lerden biriyse, çalışan için "İzin" (X) atanır.
 * Aksi halde, o gün için çalışanlar (izinli olmayanlar) toplanır ve sırası,
 * round-robin yöntemiyle (çalışanların çalışma sırasına göre) 6 vardiyadan atanır.
 */
const generateSchedule = (weeks: number) => {
    // available vardiyalar: "X" hariç, 6 vardiya
    const availableShifts = shiftDetails.filter((shift) => shift.id !== 'X'); // 6 vardiya
    const availableShiftsCount = availableShifts.length; // 6

    // schedule: week => day (isim) => mapping: employee name -> shift id (string)
    const schedule: Array<Record<string, Record<string, string>>> = [];

    for (let week = 1; week <= weeks; week++) {
        const weekPlan: Record<string, Record<string, string>> = {};

        days.forEach((day, dayIndex) => {
            // İlk olarak, belirli bir gün için her çalışan için "İzin" veya çalışma durumunu belirleyeceğiz.
            // Çalışanların çalışma günlerini ayrı bir diziye toplayalım.
            const daySchedule: Record<string, string> = {};
            const workingEmployees: Employee[] = [];

            employees.forEach((emp) => {
                // Her çalışan için o haftanın izin günlerini hesaplayalım:
                const offDay1 = (emp.baseOff + week - 1) % 7;
                const offDay2 = (emp.baseOff + week) % 7;
                if (dayIndex === offDay1 || dayIndex === offDay2) {
                    daySchedule[emp.name] = 'X'; // İzin
                } else {
                    workingEmployees.push(emp);
                }
            });

            // Çalışanlar çalışma günündeyse, round-robin yöntemiyle 6 vardiyaya eşit dağıtım yapalım.
            workingEmployees.forEach((emp, idx) => {
                const shift = availableShifts[idx % availableShiftsCount];
                daySchedule[emp.name] = shift.id;
            });

            weekPlan[day] = daySchedule;
        });
        schedule.push(weekPlan);
    }
    return schedule;
};

const ShiftTable: React.FC<ShiftTableProps> = ({ weeks }) => {
    const schedule = generateSchedule(weeks);

    return (
        <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
            {schedule.map((weekPlan, weekIndex) => (
                <div
                    key={weekIndex}
                    className="mb-6 bg-white rounded-lg shadow p-4 border border-gray-200"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Hafta {weekIndex + 1}
                    </h2>
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
                            const totalShiftHours = 180; // Örneğimizde sabit değer (dinamik hesaplama yapılabilir)
                            return (
                                <tr key={emp.name} className="hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                                        {emp.name}
                                        <div className="text-xs text-gray-500">20 gün çalışma</div>
                                    </td>
                                    {days.map((day, dayIndex) => {
                                        const shiftId = schedule[weekIndex][day][emp.name];
                                        // shiftId "X" ise izin, aksi halde ilgili vardiya bilgilerini gösterelim.
                                        const shiftInfo = shiftDetails.find((s) => s.id === shiftId);
                                        return (
                                            <td key={day} className="px-3 py-4 border text-center text-sm">
                                                {shiftId === 'X' || !shiftInfo ? (
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
            ))}
        </div>
    );
};

export default ShiftTable;
