// src/App.tsx
import React, { useState } from 'react';
import WeekSelector from './components/WeekSelector';
import ShiftInfoCard from './components/ShiftInfoCard';
import RequirementCard from './components/RequirementCard';
import ShiftTable from './components/ShiftTable';
import ShiftStatistics from './components/ShiftStatistics';
import { generateSchedule } from './utils/shiftScheduler';

const App: React.FC = () => {
    const [weeks, setWeeks] = useState<number>(4);
    // Seçilen hafta sayısına göre programı hesaplayalım
    const schedule = generateSchedule(weeks);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="min-h-screen bg-gray-100 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Vardiya Çizelgesi
                        </h1>
                        <p className="text-gray-600">23 çalışan için optimize edilmiş vardiya planı</p>
                    </header>
                    <WeekSelector weeks={weeks} setWeeks={setWeeks} />
                    <ShiftInfoCard />
                    <RequirementCard />
                    {/* Seçilen hafta sayısına göre istatistikleri her zaman gösteriyoruz */}
                    <ShiftStatistics schedule={schedule} weeks={weeks} />
                    <ShiftTable weeks={weeks} />
                    <footer className="mt-6 text-sm text-gray-600">
                        <p>* Her çalışan haftada 5 gün çalışıp 2 gün izin kullanmaktadır.</p>
                        <p>* Her {weeks} haftada bir vardiya rotasyonu uygulanmaktadır.</p>
                        <p>* Rotasyon sayesinde izin günleri ve vardiyalar düzenli olarak değişmektedir.</p>
                        <p>* Toplam 23 çalışan ile minimum personel gereksinimleri karşılanmaktadır.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default App;
