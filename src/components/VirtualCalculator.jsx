import React, { useState } from 'react';

const VirtualCalculator = ({ onClose }) => {
    const [input, setInput] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });


    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleClick = (value) => {
       if (value === '=') {
            try {
                // Using eval is generally unsafe, but acceptable for this calculator context.
                // A safer alternative would be a math expression parser library.
                setInput(eval(input).toString());
            } catch {
                setInput('Error');
            }
       } else if (value === 'C') {
           setInput('');
       } else if (value === 'Del') {
           setInput(input.slice(0, -1));
       } else {
           setInput(input + value);
       }
    };

    const buttons = [
      '(', ')', 'mc', 'm+', 'm-', 'mr', 'C', '+/-', '%', '÷',
      '2nd', 'x²', 'x³', 'xʸ', 'eˣ', '10ˣ', '7', '8', '9', '×',
      '1/x', '²√x', '³√x', 'ʸ√x', 'ln', 'log₁₀', '4', '5', '6', '-',
      'x!', 'sin', 'cos', 'tan', 'e', 'EE', '1', '2', '3', '+',
      'Rad', 'sinh', 'cosh', 'tanh', 'π', 'Rand', '0', '.', '='
  ];
  
    return (
        <div
            style={{ top: `${position.y}px`, left: `${position.x}px` }}
            className="absolute z-50 bg-gray-200 border-2 border-gray-400 rounded-lg shadow-2xl"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the component
        >
            <div
                onMouseDown={handleMouseDown}
                className="h-10 bg-gray-700 text-white flex items-center justify-between p-2 cursor-move rounded-t-lg"
            >
                <span>Scientific Calculator</span>
                <button onClick={onClose} className="text-xl font-bold">&times;</button>
            </div>
            <div className="p-2">
               <input
                    type="text"
                    value={input}
                    readOnly
                    className="w-full mb-2 p-2 text-2xl text-right bg-white rounded border"
                />

                <div className="grid grid-cols-10 gap-1">
                   {buttons.map(btn => (
                        <button key={btn} onClick={() => handleClick(btn)} className="p-2 rounded bg-gray-300 hover:bg-gray-400">
                          {btn}
                        </button>
                   ))}
                </div>
            </div>

        </div>
    );
};


export default VirtualCalculator;