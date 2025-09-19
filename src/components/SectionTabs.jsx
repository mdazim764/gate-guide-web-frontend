// src/components/SectionTabs.jsx
import React from 'react';

const SectionTabs = ({ sections, currentSection, setCurrentSection }) => {
    return (
        <div className="flex items-center space-x-1">
            {sections.map(section => (
                <button
                    key={section.name}
                    onClick={() => setCurrentSection(section.name)}
                    // Classes meticulously matched to the official UI
                    className={`px-4 py-2 text-sm font-bold rounded-t-md border-b-0 transition-all ${
                        currentSection === section.name 
                        ? 'bg-[#31708f] text-white shadow-inner' // Active state: dark blue
                        : 'bg-[#e4eff7] text-[#31708f] border border-gray-300 hover:bg-gray-300' // Inactive state: light blue
                    }`}
                >
                    {section.name}
                </button>
            ))}
        </div>
    );
};

export default SectionTabs;