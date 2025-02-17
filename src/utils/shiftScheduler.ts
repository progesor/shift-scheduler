// src/utils/shiftScheduler.ts

// Gün isimleri: 0 = Pazartesi, 1 = Salı, …, 6 = Pazar
export const days = ['Pzt', 'Sal', 'Çar', 'Perş', 'Cum', 'Cmt', 'Paz'];

// Vardiya detayları (6 çalışma vardiyası + İzin)
// Her çalışma vardiyası için gereken kişi sayısı: 3, izin için 0.
export interface Shift {
    id: string;
    name: string;
    time: string;
    required: number;
}

export const shiftDetails: Shift[] = [
    { id: 'G', name: 'Gece', time: '00:00 - 09:00', required: 3 },
    { id: 'S1', name: 'Sabah', time: '09:00 - 18:00', required: 3 },
    { id: 'S2', name: 'Sabah2', time: '10:00 - 19:00', required: 3 },
    { id: 'A1', name: 'Akşam1', time: '15:00 - 00:00', required: 3 },
    { id: 'A2', name: 'Akşam2', time: '15:00 - 00:00', required: 3 },
    { id: 'D', name: 'Davul', time: '19:00 - 04:00', required: 3 },
    { id: 'X', name: 'İzin', time: '- - -', required: 0 },
];

// Çalışan verileri: Her çalışan için isim ve baseOff (0–6; çalışanın başlangıç izin ofseti)
// Örneğimizde 28 çalışan üretiyoruz.
export interface Employee {
    name: string;
    baseOff: number;
}
export const employees: Employee[] = Array.from({ length: 24 }, (_, i) => ({
    name: `Çalışan ${i + 1}`,
    baseOff: i % 7,
}));

/**
 * generateSchedule:
 * Her hafta için her gün çalışanların atanmış vardiya kodlarını hesaplar.
 *
 * Her çalışan için o haftanın izin günleri:
 *    offDay1 = (emp.baseOff + week - 1) mod 7
 *    offDay2 = (emp.baseOff + week) mod 7
 *
 * Eğer günün indexi (0–6) bu değerlerden biri ise, o gün çalışan "İzin" (X) alır.
 * Aksi halde, o gün çalışma günündeki çalışanlar global olarak (isim sırasına göre) sıralanır
 * ve round‑robin yöntemiyle "X" hariç 6 vardiyadan (G, S1, S2, A1, A2, D) yalnızca bir vardiyaya atanır.
 *
 * @param weeks - Oluşturulacak hafta sayısı
 * @returns schedule: Array; her hafta için { day: { employeeName: shiftId } } nesnesi.
 */
export const generateSchedule = (weeks: number): Array<Record<string, Record<string, string>>> => {
    // Çalışma günlerinde kullanılacak vardiyalar ("X" hariç)
    const availableShifts = shiftDetails.filter(shift => shift.id !== 'X'); // 6 vardiya
    const availableShiftsCount = availableShifts.length;

    // schedule[week][day][employee.name] = shift id
    const schedule: Array<Record<string, Record<string, string>>> = [];

    for (let week = 1; week <= weeks; week++) {
        const weekPlan: Record<string, Record<string, string>> = {};
        days.forEach((day, dayIndex) => {
            const daySchedule: Record<string, string> = {};

            // Çalışanların o gün izinli olup olmadığını kontrol edelim:
            employees.forEach(emp => {
                // Her çalışan için izin günleri:
                const offDay1 = (emp.baseOff + week - 1) % 7;
                const offDay2 = (emp.baseOff + week) % 7;
                if (dayIndex === offDay1 || dayIndex === offDay2) {
                    daySchedule[emp.name] = 'X';
                }
            });

            // Çalışma gününde (izinli olmayanlar): global olarak isim sırasına göre atama yapalım.
            const workingEmployees = employees.filter(emp => !daySchedule[emp.name]);
            const sortedWorking = workingEmployees.slice().sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            sortedWorking.forEach((emp, i) => {
                const shift = availableShifts[(i + (week - 1)) % availableShiftsCount];
                daySchedule[emp.name] = shift.id;
            });

            weekPlan[day] = daySchedule;
        });
        schedule.push(weekPlan);
    }
    return schedule;
};
