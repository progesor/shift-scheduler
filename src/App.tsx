// src/App.tsx
import React, { useState, useMemo } from 'react';
import WeekSelector from './components/WeekSelector';
import ShiftInfoCard from './components/ShiftInfoCard';
import RequirementCard from './components/RequirementCard';
import ShiftTable from './components/ShiftTable';
import ShiftStatistics from './components/ShiftStatistics';
import Collapsible from './components/Collapsible';
import { generateSchedule } from './utils/shiftScheduler';

const App: React.FC = () => {
    const [weeks, setWeeks] = useState<number>(4);
    const [employeeCount, setEmployeeCount] = useState<number>(28);

    const schedule = useMemo(() => generateSchedule(weeks, employeeCount), [weeks, employeeCount]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="min-h-screen bg-gray-100 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Vardiya Çizelgesi
                        </h1>
                        <p className="text-gray-600">Optimized vardiya planı</p>
                    </header>
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <WeekSelector weeks={weeks} setWeeks={setWeeks} />
                        <div>
                            <label
                                htmlFor="employeeCount"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Çalışan Sayısı
                            </label>
                            <input
                                type="number"
                                id="employeeCount"
                                value={employeeCount}
                                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                                className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                min={1}
                            />
                        </div>
                    </div>
                    <Collapsible title="Vardiya Bilgileri">
                        <ShiftInfoCard />
                    </Collapsible>
                    <Collapsible title="Vardiya Gereksinimleri">
                        <RequirementCard />
                    </Collapsible>
                    <Collapsible title={`${weeks} Haftalık Çalışma İstatistikleri`}>
                        <ShiftStatistics schedule={schedule} weeks={weeks} />
                    </Collapsible>
                    <Collapsible title="Haftalık Vardiya Çizelgesi">
                        <ShiftTable weeks={weeks} employeeCount={employeeCount} />
                    </Collapsible>
                    <footer className="mt-6 text-sm text-gray-600">
                        <p>* Her çalışan haftada 5 gün çalışıp 2 gün izin kullanmaktadır.</p>
                        <p>* Her {weeks} haftada bir vardiya rotasyonu uygulanmaktadır.</p>
                        <p>* Rotasyon sayesinde izin günleri ve vardiyalar düzenli olarak değişmektedir.</p>
                        <p>* Çalışan sayısı kullanıcı tarafından belirlenmektedir.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default App;
