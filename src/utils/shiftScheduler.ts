// src/utils/shiftScheduler.ts

// Gün isimleri: 0 = Pazartesi, 1 = Salı, …, 6 = Pazar
export const days = ['Pzt', 'Sal', 'Çar', 'Perş', 'Cum', 'Cmt', 'Paz'];

// Vardiya detayları (6 çalışma vardiyası + İzin)
// Her çalışma vardiyası için gereken minimum kişi: 3, İzin için 0.
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

// Çalışan verileri: Her çalışan için isim ve baseOff (0–6 arası; çalışanın başlangıç izin günü ofseti)
// Örneğimizde 28 çalışan üretiyoruz.
export interface Employee {
    name: string;
    baseOff: number;
}

export const employees: Employee[] = Array.from({ length: 28 }, (_, i) => ({
    name: `Çalışan ${i + 1}`,
    baseOff: i % 7, // Her çalışan için farklı baseOff değeri.
}));

/**
 * generateSchedule:
 * Her hafta için, her gün çalışanların atanmış vardiya kodlarını hesaplar.
 *
 * Her çalışan için o haftanın izin günleri:
 *    offDay1 = (emp.baseOff + week - 1) mod 7
 *    offDay2 = (emp.baseOff + week) mod 7
 *
 * Eğer günün indexi (0–6) bu değerlerden biri ise, o gün çalışan "İzin" (X) alır.
 * Aksi halde, o gün çalışanlar global olarak sıralanır (örneğin, isim sırasına göre)
 * ve round‑robin yöntemiyle, "X" hariç 6 vardiyadan (G, S1, S2, A1, A2, D) birine atanır.
 * Haftalık ofset eklenerek vardiya rotasyonu sağlanır.
 *
 * @param weeks - Kaç haftalık plan oluşturulacak
 * @returns schedule: Array; her hafta için { day: { employeeName: shiftId } } nesnesi.
 */
export const generateSchedule = (weeks: number): Array<Record<string, Record<string, string>>> => {
    // Çalışma günlerinde kullanılacak vardiyalar ("X" hariç)
    const availableShifts = shiftDetails.filter((shift) => shift.id !== 'X'); // 6 vardiya
    const availableShiftsCount = availableShifts.length; // 6

    // schedule[week][day][employee.name] = shift id
    const schedule: Array<Record<string, Record<string, string>>> = [];

    for (let week = 1; week <= weeks; week++) {
        const weekPlan: Record<string, Record<string, string>> = {};

        days.forEach((day, dayIndex) => {
            // Önce, o gün çalışacak (izinli olmayan) çalışanları belirleyelim.
            const workingEmployees = employees.filter(emp => {
                const offDay1 = (emp.baseOff + week - 1) % 7;
                const offDay2 = (emp.baseOff + week) % 7;
                return !(dayIndex === offDay1 || dayIndex === offDay2);
            });
            // Sıralı bir liste oluşturalım (örneğin, isim sırasına göre)
            const sortedWorking = workingEmployees.slice().sort((a, b) => a.name.localeCompare(b.name));

            // Round-robin yöntemiyle vardiya ataması: Her çalışan için shift = availableShifts[(globalIndex + weekOffset) mod 6]
            const daySchedule: Record<string, string> = {};
            sortedWorking.forEach((emp, i) => {
                const shift = availableShifts[(i + (week - 1)) % availableShiftsCount];
                daySchedule[emp.name] = shift.id;
            });

            // Diğer çalışanlar (izinli olanlar) için: atama "X"
            const offEmployees = employees.filter(emp => {
                const offDay1 = (emp.baseOff + week - 1) % 7;
                const offDay2 = (emp.baseOff + week) % 7;
                return dayIndex === offDay1 || dayIndex === offDay2;
            });
            offEmployees.forEach(emp => {
                daySchedule[emp.name] = 'X';
            });

            // Tüm çalışanların atamasını içeren gün planını ekleyelim.
            weekPlan[day] = daySchedule;
        });

        schedule.push(weekPlan);
    }

    return schedule;
};
