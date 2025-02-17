// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vardiya Çizelgesi</h1>
            <p className="text-gray-600">23 çalışan için optimize edilmiş vardiya planı</p>
        </header>
    );
};

export default Header;
