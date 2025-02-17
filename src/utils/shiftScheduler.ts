// src/utils/shiftScheduler.ts

// Gün isimleri: 0 = Pazartesi, 1 = Salı, …, 6 = Pazar
export const days = ['Pzt', 'Sal', 'Çar', 'Perş', 'Cum', 'Cmt', 'Paz'];

// Vardiya detayları (6 çalışma vardiyası + İzin)
// Gereken minimum kişi sayıları:
//   G, A1, A2, D: 3 kişi, S1, S2: 2 kişi; İzin için 0.
export interface Shift {
    id: string;
    name: string;
    time: string;
    required: number;
}

export const shiftDetails: Shift[] = [
    { id: 'G', name: 'Gece', time: '00:00 - 09:00', required: 3 },
    { id: 'S1', name: 'Sabah', time: '09:00 - 18:00', required: 2 },
    { id: 'S2', name: 'Sabah2', time: '10:00 - 19:00', required: 2 },
    { id: 'A1', name: 'Akşam1', time: '15:00 - 00:00', required: 3 },
    { id: 'A2', name: 'Akşam2', time: '15:00 - 00:00', required: 3 },
    { id: 'D', name: 'Davul', time: '19:00 - 04:00', required: 3 },
    { id: 'X', name: 'İzin', time: '- - -', required: 0 },
];

// Çalışan verileri arayüzü
export interface Employee {
    name: string;
    baseOff: number; // Bu örnekte izin günleri, çalışanların ait olduğu izin grubunun offDays'uyla belirlenecek.
}

// Belirtilen çalışan sayısına göre çalışan listesini oluşturur.
export const generateEmployees = (employeeCount: number): Employee[] => {
    const emps: Employee[] = [];
    for (let i = 0; i < employeeCount; i++) {
        emps.push({ name: `Çalışan ${i + 1}`, baseOff: i % 7 });
    }
    return emps;
};

/**
 * generatePermissionGroups:
 * Çalışan listesini 7 gruba böler ve her gruba sabit 2 off günü atar.
 * Off günleri örnekte şu şekilde belirlenmiştir:
 *   Grup A: [0, 1] → Pazartesi, Salı
 *   Grup B: [1, 2] → Salı, Çarşamba
 *   Grup C: [2, 3] → Çarşamba, Perşembe
 *   Grup D: [3, 4] → Perşembe, Cuma
 *   Grup E: [4, 5] → Cuma, Cumartesi
 *   Grup F: [5, 6] → Cumartesi, Pazar
 *   Grup G: [6, 0] → Pazar, Pazartesi
 */
export interface PermissionGroup {
    group: string;
    employees: Employee[];
    offDays: number[];
}

export const generatePermissionGroups = (emps: Employee[]): PermissionGroup[] => {
    const groups: PermissionGroup[] = [];
    const groupSize = Math.ceil(emps.length / 7);
    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const offDaysList: number[][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
        [5, 6],
        [6, 0],
    ];
    for (let i = 0; i < 7; i++) {
        const groupEmployees = emps.slice(i * groupSize, (i + 1) * groupSize);
        groups.push({
            group: groupNames[i],
            employees: groupEmployees,
            offDays: offDaysList[i],
        });
    }
    return groups;
};

/**
 * generateSchedule:
 * Belirtilen hafta sayısı ve çalışan sayısına göre, her hafta için
 * her gün çalışanların atanmış vardiya kodlarını hesaplar.
 *
 * Kurallar:
 *  - Her çalışan haftada 7 gün içinde 5 gün çalışıp 2 gün izin yapar.
 *  - İzin günleri, her çalışanın ait olduğu izin grubunun offDays değerlerine göre belirlenir.
 *  - Çalışma günlerinde, her çalışanın "tercih edilen" vardiyası,
 *    ilk hafta global olarak (isim sırasına göre) round‑robin yöntemiyle atanır.
 *  - Sonraki haftalarda, vardiya, (initialShiftIndex + (week - 1)) mod 6 şeklinde
 *    rotasyonla belirlenir.
 *
 * Bu yöntemle, her çalışan haftada 5 gün çalışır (toplam 260 gün / 52 hafta) ve her vardiya,
 * ideal olarak 260/6 ≈ 43-44 gün çalışmayı sağlayacaktır.
 *
 * Önemli: Çalışanların sıralaması, isimdeki sayısal değeri esas alacak şekilde yapılmalıdır.
 *
 * @param weeks - Oluşturulacak hafta sayısı
 * @param employeeCount - Kullanıcı tarafından girilen çalışan sayısı
 * @returns schedule: Her hafta için { day: { employeeName: shiftId } } nesnesi.
 */
export const generateSchedule = (
    weeks: number,
    employeeCount: number
): Array<Record<string, Record<string, string>>> => {
    const emps = generateEmployees(employeeCount);
    // Çalışanları, isimdeki sayısal değere göre sıralayalım:
    const sortedEmps = emps.slice().sort((a, b) => {
        const numA = parseInt(a.name.replace(/\D/g, ''), 10);
        const numB = parseInt(b.name.replace(/\D/g, ''), 10);
        return numA - numB;
    });

    // Her çalışan için başlangıç vardiya indeksi: sortedEmps sırasındaki index mod 6
    const week1Assignments: Record<string, number> = {};
    sortedEmps.forEach((emp, i) => {
        week1Assignments[emp.name] = i % 6; // 0: G, 1: S1, ..., 5: D
    });

    // schedule[week][day][employee.name] = shift id
    const schedule: Array<Record<string, Record<string, string>>> = [];

    for (let week = 1; week <= weeks; week++) {
        const weekPlan: Record<string, Record<string, string>> = {};

        days.forEach((day, dayIndex) => {
            const daySchedule: Record<string, string> = {};

            // İzin günleri: Her çalışanın ait olduğu izin grubunun offDays değerine göre atanır.
            sortedEmps.forEach(emp => {
                const group = generatePermissionGroups(emps).find(g =>
                    g.employees.some(e => e.name === emp.name)
                );
                if (group && group.offDays.includes(dayIndex)) {
                    daySchedule[emp.name] = 'X';
                }
            });

            // Çalışma gününde (izin olmayanlar):
            const workingEmps = sortedEmps.filter(emp => daySchedule[emp.name] !== 'X');
            // Her çalışanın tercih edilen vardiyası:
            workingEmps.forEach(emp => {
                const initIndex = week1Assignments[emp.name]; // 0-5
                const shiftIndex = (initIndex + (week - 1)) % 6; // Haftalık rotasyon
                // Atanacak vardiya:
                daySchedule[emp.name] = shiftDetails.filter(s => s.id !== 'X')[shiftIndex].id;
            });

            weekPlan[day] = daySchedule;
        });

        schedule.push(weekPlan);
    }

    return schedule;
};
