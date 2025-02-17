// src/utils/shiftScheduler.ts

// Gün isimleri: 0 = Pazartesi, 1 = Salı, …, 6 = Pazar
export const days = ['Pzt', 'Sal', 'Çar', 'Perş', 'Cum', 'Cmt', 'Paz'];

// Vardiya detayları (6 çalışma vardiyası + İzin)
// Çalışma vardiyaları için gereken minimum kişi: 3, İzin için 0.
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

// Çalışan verileri arayüzü
export interface Employee {
    name: string;
    baseOff: number; // 0-6 arası; çalışanın başlangıç izin ofseti
}

// Belirtilen çalışan sayısına göre çalışan listesini oluşturur.
export const generateEmployees = (employeeCount: number): Employee[] => {
    const emps: Employee[] = [];
    for (let i = 0; i < employeeCount; i++) {
        emps.push({ name: `Çalışan ${i + 1}`, baseOff: i % 7 });
    }
    return emps;
};

// İzin grubu arayüzü
export interface PermissionGroup {
    group: string;
    employees: Employee[];
    offDays: number[]; // gün indexleri (0: Pzt, …, 6: Paz)
}

// Çalışan listesini 7 eşit (gerektiğinde kalanlarla) gruba böler.
// Örneğin: Grup A: Pazartesi & Salı, Grup B: Salı & Çarş, …, Grup G: Pazar & Pazartesi
export const generatePermissionGroups = (emps: Employee[]): PermissionGroup[] => {
    const groups: PermissionGroup[] = [];
    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const n = emps.length;
    const baseSize = Math.floor(n / 7);
    const remainder = n % 7;
    let start = 0;
    for (let i = 0; i < 7; i++) {
        const groupSize = baseSize + (i < remainder ? 1 : 0);
        const groupEmployees = emps.slice(start, start + groupSize);
        start += groupSize;
        let offDays: number[] = [];
        if (i === 0) offDays = [0, 1];
        else if (i === 1) offDays = [1, 2];
        else if (i === 2) offDays = [2, 3];
        else if (i === 3) offDays = [3, 4];
        else if (i === 4) offDays = [4, 5];
        else if (i === 5) offDays = [5, 6];
        else if (i === 6) offDays = [6, 0];
        groups.push({ group: groupNames[i], employees: groupEmployees, offDays });
    }
    return groups;
};

/**
 * generateSchedule:
 * Belirtilen hafta sayısı ve çalışan sayısına göre her hafta için,
 * her gün her çalışanın atanmış vardiya kodlarını hesaplar.
 *
 * Her çalışan için o haftanın izin günleri:
 *    offDay1 = (emp.baseOff + week - 1) mod 7
 *    offDay2 = (emp.baseOff + week) mod 7
 *
 * Eğer günün indexi (0–6) bu değerlerden biri ise, o gün çalışan "İzin" (X) alır.
 * Aksi halde, o gün çalışma günündeki çalışanlar global olarak (isim sırasına göre)
 * sıralanır ve round‑robin yöntemiyle "X" hariç 6 vardiyadan (G, S1, S2, A1, A2, D)
 * yalnızca 1 vardiyaya atanır.
 *
 * @param weeks - Oluşturulacak hafta sayısı
 * @param employeeCount - Kullanıcı tarafından girilen çalışan sayısı
 * @returns schedule: Her hafta için, { day: { employeeName: shiftId } } nesnesi.
 */
export const generateSchedule = (
    weeks: number,
    employeeCount: number
): Array<Record<string, Record<string, string>>> => {
    const emps = generateEmployees(employeeCount);
    const permissionGroups = generatePermissionGroups(emps);
    const availableShifts = shiftDetails.filter((shift) => shift.id !== 'X'); // 6 vardiya
    const availableShiftsCount = availableShifts.length;

    // schedule[week][day][employee.name] = shift id
    const schedule: Array<Record<string, Record<string, string>>> = [];

    for (let week = 1; week <= weeks; week++) {
        const weekPlan: Record<string, Record<string, string>> = {};
        days.forEach((day, dayIndex) => {
            const daySchedule: Record<string, string> = {};
            // Önce, her çalışan için izin durumunu belirleyelim.
            emps.forEach((emp) => {
                const offDay1 = (emp.baseOff + week - 1) % 7;
                const offDay2 = (emp.baseOff + week) % 7;
                if (dayIndex === offDay1 || dayIndex === offDay2) {
                    daySchedule[emp.name] = 'X';
                }
            });
            // Çalışma günlerinde (izinli olmayanlar): global olarak isim sırasına göre atama yapalım.
            const workingEmployees = emps.filter((emp) => !daySchedule[emp.name]);
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

