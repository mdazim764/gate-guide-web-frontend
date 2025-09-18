// src/components/SectionTabs.jsx
import React from 'react';

const SectionTabs = ({ sections, currentSection, setCurrentSection }) => {
    return (
        <div className="bg-gray-100 p-1 rounded-lg shadow-inner flex items-center space-x-2">
            {sections.map(section => (
                <button
                    key={section.name}
                    onClick={() => setCurrentSection(section.name)}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                        currentSection === section.name 
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-transparent text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {section.name}
                </button>
            ))}
        </div>
    );
};

export default SectionTabs;