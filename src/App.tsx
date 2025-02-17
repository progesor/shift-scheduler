// src/App.tsx
import React, { useState } from 'react';
import Header from './components/Header';
import WeekSelector from './components/WeekSelector';
import ShiftInfoCard from './components/ShiftInfoCard';
import RequirementCard from './components/RequirementCard';
import ShiftTable from './components/ShiftTable';

const App: React.FC = () => {
    // Başlangıçta 4 hafta gösterelim
    const [weeks, setWeeks] = useState<number>(4);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="min-h-screen bg-gray-100 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <Header />
                    <WeekSelector weeks={weeks} setWeeks={setWeeks} />
                    {/* Vardiya Bilgileri Kartı */}
                    <ShiftInfoCard />
                    {/* Vardiya Gereksinimleri Kartı */}
                    <RequirementCard />
                    {/* Çizelge Tablosu */}
                    <ShiftTable weeks={weeks} />
                    <footer className="mt-6 text-sm text-gray-600">
                        <p>* Her çalışan haftada 5 gün çalışıp 2 gün izin kullanmaktadır.</p>
                        <p>* Her 4 haftada bir vardiya rotasyonu uygulanmaktadır.</p>
                        <p>* Rotasyon sayesinde izin günleri ve vardiyalar düzenli olarak değişmektedir.</p>
                        <p>* Toplam 23 çalışan ile minimum personel gereksinimleri karşılanmaktadır.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default App;
