import React, { useEffect, useMemo, useRef, useState } from 'react';

const MultiSelectSearch = ({ options, selectedItems, onSelectionChange, placeholder, name, isOpen, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(null); // Signal to parent to close this dropdown
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const handleSelect = (option) => {
    const newSelection = { ...selectedItems };
    if (newSelection[option.id]) {
      delete newSelection[option.id];
    } else {
      newSelection[option.id] = option.name;
    }
    onSelectionChange(newSelection);
  };

  const selectedCount = Object.keys(selectedItems).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="border border-gray-300 rounded-md p-2 cursor-pointer flex justify-between items-center bg-white" 
        onClick={() => onToggle(name)}
      >
        <span>
          {selectedCount > 0 ? `${selectedCount} item(s) selected` : <span className="text-gray-500">{placeholder}</span>}
        </span>
        <span className="text-gray-500">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border-b sticky top-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          <ul>
            {filteredOptions.map(option => (
              <li
                key={option.id}
                className="p-2 hover:bg-blue-100 cursor-pointer flex items-center"
                onClick={() => handleSelect(option)}
              >
                <input
                  type="checkbox"
                  checked={!!selectedItems[option.id]}
                  readOnly
                  className="mr-2 h-4 w-4 accent-blue-600"
                />
                {option.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectSearch;