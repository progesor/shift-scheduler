// src/components/Collapsible.tsx
import React, { useState } from 'react';

interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="border rounded-lg shadow mb-4">
            <div
                className="bg-gray-200 p-3 flex justify-between items-center cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <span className="font-semibold text-gray-800">{title}</span>
                <span className="text-gray-600">{open ? '-' : '+'}</span>
            </div>
            {open && <div className="p-4">{children}</div>}
        </div>
    );
};

export default Collapsible;
