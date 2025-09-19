// import React, { useState, useEffect, useRef } from 'react';
// import { evaluate } from 'mathjs';

// const VirtualCalculator = ({ onClose }) => {
//     const [display, setDisplay] = useState('0');
//     const [expressionDisplay, setExpressionDisplay] = useState('');
//     const [memory, setMemory] = useState(0);
//     const [showMemoryIndicator, setShowMemoryIndicator] = useState(false);
//     const [isHelpVisible, setHelpVisible] = useState(false);
//     const [isMinimized, setIsMinimized] = useState(false);
//     const [position, setPosition] = useState({ x: Math.max(window.innerWidth - 500, 10), y: 100 });
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//     const calcRef = useRef(null);
//     const [angleUnit, setAngleUnit] = useState('deg');
    
//     // Custom dragging implementation
//     const handleMouseDown = (e) => {
//         if (e.target.closest('.handle')) {
//             setIsDragging(true);
//             const rect = calcRef.current.getBoundingClientRect();
//             setDragOffset({
//                 x: e.clientX - rect.left,
//                 y: e.clientY - rect.top
//             });
//             e.preventDefault();
//         }
//     };
    
//     const handleMouseMove = (e) => {
//         if (isDragging) {
//             setPosition({
//                 x: Math.max(0, Math.min(window.innerWidth - 350, e.clientX - dragOffset.x)),
//                 y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
//             });
//         }
//     };
    
//     const handleMouseUp = () => {
//         setIsDragging(false);
//     };
    
//     // Add and remove event listeners
//     useEffect(() => {
//         document.addEventListener('mousemove', handleMouseMove);
//         document.addEventListener('mouseup', handleMouseUp);
        
//         return () => {
//             document.removeEventListener('mousemove', handleMouseMove);
//             document.removeEventListener('mouseup', handleMouseUp);
//         };
//     }, [isDragging, dragOffset]);
    
//     const calculateResult = (expression) => {
//         try {
//             // Replace special math functions
//             let expr = expression.replace(/π/g, 'pi')
//                                 .replace(/√/g, 'sqrt')
//                                 .replace(/\^/g, '**')
//                                 .replace(/×/g, '*')
//                                 .replace(/÷/g, '/');
            
//             // Handle trig functions based on angle unit
//             if (angleUnit === 'deg' && expr.match(/sin|cos|tan/)) {
//                 // Convert degrees to radians for trig functions
//                 expr = expr.replace(/sin\(([^)]+)\)/g, 'sin($1*pi/180)')
//                            .replace(/cos\(([^)]+)\)/g, 'cos($1*pi/180)')
//                            .replace(/tan\(([^)]+)\)/g, 'tan($1*pi/180)');
//             }
            
//             return evaluate(expr).toString();
//         } catch (error) {
//             return 'Error';
//         }
//     };
    
//     const handleButtonClick = (value) => {
//         if (value === 'C') {
//             setDisplay('0');
//             setExpressionDisplay('');
//         } else if (value === '←') {
//             setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
//         } else if (value === '=') {
//             try {
//                 const result = calculateResult(display);
//                 setExpressionDisplay(display + '=');
//                 setDisplay(result);
//             } catch {
//                 setDisplay('Error');
//             }
//         } else if (value === 'MS') {
//             setMemory(parseFloat(display));
//             setShowMemoryIndicator(true);
//         } else if (value === 'MR') {
//             setDisplay(memory.toString());
//         } else if (value === 'MC') {
//             setMemory(0);
//             setShowMemoryIndicator(false);
//         } else if (value === 'M+') {
//             setMemory(memory + parseFloat(display));
//             setShowMemoryIndicator(true);
//         } else if (value === 'M-') {
//             setMemory(memory - parseFloat(display));
//             setShowMemoryIndicator(true);
//         } else if (value === '+/-') {
//             setDisplay(d => d.startsWith('-') ? d.substring(1) : '-' + d);
//         } else if (['sin', 'cos', 'tan', 'log', 'ln'].includes(value)) {
//             setDisplay(d => d === '0' ? `${value}(` : `${d}${value}(`);
//         } else if (value === 'π') {
//             setDisplay(d => d === '0' ? '3.14159' : d + '3.14159');
//         } else if (value === 'e') {
//             setDisplay(d => d === '0' ? '2.71828' : d + '2.71828');
//         } else {
//             setDisplay(prev => (prev === '0' && value !== '.') ? value : prev + value);
//         }
//     };
    
//     const copyResult = () => {
//         navigator.clipboard.writeText(display);
//     };
    
//     // If minimized, just show a small floating button
//     if (isMinimized) {
//         return (
//             <div 
//                 ref={calcRef}
//                 className="z-50 fixed bg-blue-500 text-white rounded shadow-lg cursor-pointer"
//                 style={{ left: `${position.x}px`, top: `${position.y}px` }}
//                 onClick={() => setIsMinimized(false)}
//             >
//                 <div className="p-2 font-bold">Scientific Calculator</div>
//             </div>
//         );
//     }

//     return (
//         <div 
//             ref={calcRef}
//             className="z-50 fixed bg-[#e6eaef] rounded shadow-lg"
//             style={{ 
//                 left: `${position.x}px`, 
//                 top: `${position.y}px`,
//                 width: '475px'
//             }}
//         >
//             {/* Header */}
//             <div 
//                 className="handle bg-[#3986e1] text-white flex justify-between items-center px-3 py-1.5 cursor-grab rounded-t"
//                 onMouseDown={handleMouseDown}
//             >
//                 <span className="font-bold">Scientific Calculator</span>
//                 <div className="flex items-center">
//                     <button 
//                         onClick={copyResult} 
//                         className="px-3 py-1 bg-[#42d2f5] hover:bg-[#35c4e6] text-white text-xs mr-2 rounded"
//                     >
//                         Copy Result
//                     </button>
//                     <button 
//                         onClick={() => setHelpVisible(!isHelpVisible)} 
//                         className="px-3 py-1 bg-[#7b68ee] hover:bg-[#6a5acd] text-white text-xs mr-2 rounded"
//                     >
//                         {isHelpVisible ? 'Back' : 'Help'}
//                     </button>
//                     <button 
//                         onClick={() => setIsMinimized(true)} 
//                         className="px-2 text-xl font-bold mr-2 hover:text-gray-200"
//                     >
//                         −
//                     </button>
//                     <button 
//                         onClick={onClose} 
//                         className="px-2 text-xl font-bold hover:text-gray-200"
//                     >
//                         ×
//                     </button>
//                 </div>
//             </div>

//             {!isHelpVisible ? (
//                 <div className="p-2">
//                     {/* Display areas */}
//                     <div className="bg-white border border-gray-300 p-2 mb-2 h-10 rounded text-right text-gray-600">
//                         {expressionDisplay}
//                     </div>
//                     <div className="bg-white border border-gray-300 p-2 mb-2 h-10 text-right rounded flex items-center justify-end text-xl relative">
//                         {display}
//                         {showMemoryIndicator && (
//                             <span className="absolute left-2 top-2 text-xs font-bold">M</span>
//                         )}
//                     </div>
                    
//                     {/* Keypad */}
//                     <div className="calculator-keypad">
//                         {/* Row 1 */}
//                         <div className="flex gap-1 mb-1">
//                             <button className="calc-btn bg-gray-200 flex items-center text-xs px-3">
//                                 <span className="mr-1">mod</span>
//                                 <div className="inline-flex items-center">
//                                     <input 
//                                         type="radio" 
//                                         id="deg" 
//                                         name="angleUnit" 
//                                         checked={angleUnit === 'deg'} 
//                                         onChange={() => setAngleUnit('deg')}
//                                         className="h-3 w-3"
//                                     />
//                                     <label htmlFor="deg" className="ml-1 text-xs">Deg</label>
//                                 </div>
//                             </button>
//                             <button onClick={() => handleButtonClick('MC')} className="calc-btn bg-gray-200">MC</button>
//                             <button onClick={() => handleButtonClick('MR')} className="calc-btn bg-gray-200">MR</button>
//                             <button onClick={() => handleButtonClick('MS')} className="calc-btn bg-gray-200">MS</button>
//                             <button onClick={() => handleButtonClick('M+')} className="calc-btn bg-gray-200">M+</button>
//                             <button onClick={() => handleButtonClick('M-')} className="calc-btn bg-gray-200">M-</button>
//                             <button onClick={() => handleButtonClick('+/-')} className="calc-btn bg-gray-200">+/-</button>
//                             <button onClick={() => handleButtonClick('√')} className="calc-btn bg-gray-200">√</button>
//                             <button onClick={() => handleButtonClick('↑')} className="calc-btn bg-gray-200">↑</button>
//                             <button onClick={() => handleButtonClick('↓')} className="calc-btn bg-gray-200">↓</button>
//                         </div>

//                         {/* Row 2 */}
//                         <div className="flex gap-1 mb-1">
//                             <button onClick={() => handleButtonClick('7')} className="calc-btn bg-white">7</button>
//                             <button onClick={() => handleButtonClick('8')} className="calc-btn bg-white">8</button>
//                             <button onClick={() => handleButtonClick('9')} className="calc-btn bg-white">9</button>
//                             <button onClick={() => handleButtonClick('/')} className="calc-btn bg-white">/</button>
//                             <button onClick={() => handleButtonClick('%')} className="calc-btn bg-white">%</button>
//                             <button onClick={() => handleButtonClick('sinh')} className="calc-btn bg-gray-200">sinh</button>
//                             <button onClick={() => handleButtonClick('cosh')} className="calc-btn bg-gray-200">cosh</button>
//                             <button onClick={() => handleButtonClick('tanh')} className="calc-btn bg-gray-200">tanh</button>
//                             <button onClick={() => handleButtonClick('Exp')} className="calc-btn bg-gray-200">Exp</button>
//                             <button onClick={() => handleButtonClick('(')} className="calc-btn bg-gray-200">(</button>
//                             <button onClick={() => handleButtonClick(')')} className="calc-btn bg-gray-200">)</button>
//                         </div>

//                         {/* Row 3 */}
//                         <div className="flex gap-1 mb-1">
//                             <button onClick={() => handleButtonClick('4')} className="calc-btn bg-white">4</button>
//                             <button onClick={() => handleButtonClick('5')} className="calc-btn bg-white">5</button>
//                             <button onClick={() => handleButtonClick('6')} className="calc-btn bg-white">6</button>
//                             <button onClick={() => handleButtonClick('*')} className="calc-btn bg-white">*</button>
//                             <button onClick={() => handleButtonClick('1/x')} className="calc-btn bg-white">1/x</button>
//                             <button onClick={() => handleButtonClick('sinh⁻¹')} className="calc-btn bg-gray-200">
//                                 <span>sinh<sup>-1</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('cosh⁻¹')} className="calc-btn bg-gray-200">
//                                 <span>cosh<sup>-1</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('tanh⁻¹')} className="calc-btn bg-gray-200">
//                                 <span>tanh<sup>-1</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('log₂x')} className="calc-btn bg-gray-200 text-xs">log₂x</button>
//                             <button onClick={() => handleButtonClick('ln')} className="calc-btn bg-gray-200">ln</button>
//                             <button onClick={() => handleButtonClick('log')} className="calc-btn bg-gray-200">log</button>
//                         </div>

//                         {/* Row 4 */}
//                         <div className="flex gap-1 mb-1 relative">
//                             <button onClick={() => handleButtonClick('1')} className="calc-btn bg-white">1</button>
//                             <button onClick={() => handleButtonClick('2')} className="calc-btn bg-white">2</button>
//                             <button onClick={() => handleButtonClick('3')} className="calc-btn bg-white">3</button>
//                             <button onClick={() => handleButtonClick('-')} className="calc-btn bg-white">-</button>
//                             <button onClick={() => handleButtonClick('π')} className="calc-btn bg-gray-200">π</button>
//                             <button onClick={() => handleButtonClick('e')} className="calc-btn bg-gray-200">e</button>
//                             <button onClick={() => handleButtonClick('n!')} className="calc-btn bg-gray-200">n!</button>
//                             <button onClick={() => handleButtonClick('←')} className="calc-btn bg-red-500 text-white">←</button>
//                             <button onClick={() => handleButtonClick('C')} className="calc-btn bg-red-500 text-white">C</button>
//                             <button onClick={() => handleButtonClick('+/-')} className="calc-btn bg-red-500 text-white">+/-</button>
//                         </div>

//                         {/* Row 5 */}
//                         <div className="flex gap-1 mb-1 relative">
//                             <button onClick={() => handleButtonClick('0')} className="calc-btn bg-white">0</button>
//                             <button onClick={() => handleButtonClick('.')} className="calc-btn bg-white">.</button>
//                             <button onClick={() => handleButtonClick('+')} className="calc-btn bg-white">+</button>
//                             <button onClick={() => handleButtonClick('sin')} className="calc-btn bg-gray-200">sin</button>
//                             <button onClick={() => handleButtonClick('cos')} className="calc-btn bg-gray-200">cos</button>
//                             <button onClick={() => handleButtonClick('tan')} className="calc-btn bg-gray-200">tan</button>
//                             <button onClick={() => handleButtonClick('x^y')} className="calc-btn bg-gray-200">
//                                 <span>x<sup>y</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('x^3')} className="calc-btn bg-gray-200">
//                                 <span>x<sup>3</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('x^2')} className="calc-btn bg-gray-200">
//                                 <span>x<sup>2</sup></span>
//                             </button>
//                             <button 
//                                 onClick={() => handleButtonClick('=')} 
//                                 className="calc-btn bg-green-500 text-white absolute right-0 bottom-0 h-[74px]"
//                                 style={{width: '40px'}}
//                             >=</button>
//                         </div>

//                         {/* Row 6 */}
//                         <div className="flex gap-1 mb-1">
//                             <button onClick={() => handleButtonClick('sin⁻¹')} className="calc-btn bg-gray-200">
//                                 <span>sin<sup>-1</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('cos⁻¹')} className="calc-btn bg-gray-200">
//                                 <span>cos<sup>-1</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('tan⁻¹')} className="calc-btn bg-gray-200">
//                                 <span>tan<sup>-1</sup></span>
//                             </button>
//                             <button onClick={() => handleButtonClick('√x')} className="calc-btn bg-gray-200">√x</button>
//                             <button onClick={() => handleButtonClick('^3√x')} className="calc-btn bg-gray-200">∛x</button>
//                             <button onClick={() => handleButtonClick('|x|')} className="calc-btn bg-gray-200">|x|</button>
//                             <div className="flex-grow"></div>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 // Help screen content
//                 <div className="bg-gray-100 p-3 max-h-[400px] overflow-y-auto">
//                     <div className="text-center font-bold text-lg mb-2">Calculator Instructions</div>
//                     <p className="mb-3">
//                         Allows you to perform basic and complex mathematical operations such as 
//                         modulus, square root, cube root, trigonometric, exponential, logarithmic, 
//                         hyperbolic functions, etc. You can operate the calculator using the buttons 
//                         provided on screen with your mouse.
//                     </p>
                    
//                     <div className="text-green-700 font-bold border-b border-green-700 mb-2">Do's:</div>
//                     <ul className="list-disc pl-5 mb-4 space-y-1">
//                         <li>Be sure to press [C] when beginning a new calculation.</li>
//                         <li>You can simplify an equation using parenthesis and other mathematical operators.</li>
//                         <li>Use the predefined operations such as p (Pi), log, Exp to save time during calculation.</li>
//                         <li>Use memory function for calculating cumulative totals.
//                             <br/><strong>[M+]: Will add displayed value to memory.</strong>
//                             <br/><strong>[MR]: Will recall the value stored in memory.</strong>
//                             <br/><strong>[M-]: Subtracts the displayed value from memory.</strong>
//                         </li>
//                         <li>Be sure select the angle unit (Deg or Rad) before beginning any calculation. <strong>Note: By default angle unit is set as Degree</strong></li>
//                     </ul>
                    
//                     <div className="text-red-700 font-bold border-b border-red-700 mb-2">Dont's:</div>
//                     <ul className="list-disc pl-5 mb-4 space-y-1">
//                         <li>Perform multiple operations together.</li>
//                         <li>Leave parenthesis unbalanced.</li>
//                         <li>Change the angle unit (Deg or Rad) while performing a calculation.</li>
//                     </ul>
                    
//                     <div className="font-bold border-b border-gray-700 mb-2">Limitations:</div>
//                     <ul className="list-disc pl-5 space-y-1">
//                         <li>Keyboard operation is disabled.</li>
//                         <li>The output for a Factorial calculation is precise up to 14 digits.</li>
//                         <li>The output for Logarithmic and Hyperbolic calculations is precise up to 5 digits.</li>
//                         <li>Modulus (mod) operation performed on decimal numbers with 15 digits would not be precise. <strong>Use mod operation only if the number comprises of less than 15 digits.</strong></li>
//                         <li>The range of value supported by the calculator is 10<sup>-323</sup> to 10<sup>308</sup>.</li>
//                     </ul>
//                 </div>
//             )}

//             {/* CSS for calculator buttons */}
//             <style jsx>{`
//                 .calc-btn {
//                     min-width: 36px;
//                     height: 36px;
//                     display: flex;
//                     align-items: center;
//                     justify-content: center;
//                     border: 1px solid #ccc;
//                     border-radius: 2px;
//                     font-size: 14px;
//                     transition: all 0.1s;
//                 }
                
//                 .calc-btn:hover {
//                     filter: brightness(0.95);
//                 }
                
//                 .calc-btn:active {
//                     transform: scale(0.98);
//                     filter: brightness(0.9);
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default VirtualCalculator;


import React, { useState, useEffect, useRef } from 'react';
import { evaluate } from 'mathjs';

const VirtualCalculator = ({ onClose }) => {
    const [display, setDisplay] = useState('0');
    const [expressionDisplay, setExpressionDisplay] = useState('');
    const [memory, setMemory] = useState(0);
    const [showMemoryIndicator, setShowMemoryIndicator] = useState(false);
    const [isHelpVisible, setHelpVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: Math.max(window.innerWidth - 500, 10), y: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const calcRef = useRef(null);
    const [angleUnit, setAngleUnit] = useState('deg');
    
    // Custom dragging implementation
    const handleMouseDown = (e) => {
        if (e.target.closest('.handle')) {
            setIsDragging(true);
            const rect = calcRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
            e.preventDefault();
        }
    };
    
    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: Math.max(0, Math.min(window.innerWidth - 350, e.clientX - dragOffset.x)),
                y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
            });
        }
    };
    
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    
    // Add and remove event listeners
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset]);
    
    const calculateResult = (expression) => {
        try {
            // Replace special math functions
            let expr = expression.replace(/π/g, 'pi')
                                .replace(/√/g, 'sqrt')
                                .replace(/\^/g, '**')
                                .replace(/×/g, '*')
                                .replace(/÷/g, '/')
                                .replace(/mod/g, 'mod')
                                .replace(/log₂x/g, 'log2')
                                .replace(/logyˣ/g, (match) => {
                                    // Handle log base y of x
                                    return 'log(x, y)'.replace('y', '2'); // Default base 2
                                })
                                .replace(/eˣ/g, 'exp')
                                .replace(/10ˣ/g, '10^')
                                .replace(/y√x/g, 'nthRoot(x, y)')
                                .replace(/∛x/g, 'nthRoot(x, 3)')
                                .replace(/\|x\|/g, 'abs')
                                .replace(/n!/g, 'factorial')
                                .replace(/1\/x/g, '1/');
            
            // Handle trig functions based on angle unit
            if (angleUnit === 'deg' && expr.match(/sin|cos|tan/)) {
                // Convert degrees to radians for trig functions
                expr = expr.replace(/sin\(([^)]+)\)/g, 'sin($1*pi/180)')
                           .replace(/cos\(([^)]+)\)/g, 'cos($1*pi/180)')
                           .replace(/tan\(([^)]+)\)/g, 'tan($1*pi/180)');
            }
            
            // Handle inverse trig functions
            if (angleUnit === 'deg' && expr.match(/sin⁻¹|cos⁻¹|tan⁻¹/)) {
                expr = expr.replace(/sin⁻¹\(([^)]+)\)/g, 'asin($1)*180/pi')
                           .replace(/cos⁻¹\(([^)]+)\)/g, 'acos($1)*180/pi')
                           .replace(/tan⁻¹\(([^)]+)\)/g, 'atan($1)*180/pi');
            } else {
                expr = expr.replace(/sin⁻¹/g, 'asin')
                           .replace(/cos⁻¹/g, 'acos')
                           .replace(/tan⁻¹/g, 'atan');
            }
            
            // Handle hyperbolic functions
            expr = expr.replace(/sinh/g, 'sinh')
                       .replace(/cosh/g, 'cosh')
                       .replace(/tanh/g, 'tanh')
                       .replace(/sinh⁻¹/g, 'asinh')
                       .replace(/cosh⁻¹/g, 'acosh')
                       .replace(/tanh⁻¹/g, 'atanh');
            
            return evaluate(expr).toString();
        } catch (error) {
            return 'Error';
        }
    };
    
    const handleButtonClick = (value) => {
        if (value === 'C') {
            setDisplay('0');
            setExpressionDisplay('');
        } else if (value === '←') {
            setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0');
        } else if (value === '=') {
            try {
                const result = calculateResult(display);
                setExpressionDisplay(display + '=');
                setDisplay(result);
            } catch {
                setDisplay('Error');
            }
        } else if (value === 'MS') {
            setMemory(parseFloat(display));
            setShowMemoryIndicator(true);
        } else if (value === 'MR') {
            setDisplay(memory.toString());
        } else if (value === 'MC') {
            setMemory(0);
            setShowMemoryIndicator(false);
        } else if (value === 'M+') {
            setMemory(memory + parseFloat(display));
            setShowMemoryIndicator(true);
        } else if (value === 'M-') {
            setMemory(memory - parseFloat(display));
            setShowMemoryIndicator(true);
        } else if (value === '+/-') {
            setDisplay(d => d.startsWith('-') ? d.substring(1) : '-' + d);
        } else if (['sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'log', 'ln'].includes(value)) {
            setDisplay(d => d === '0' ? `${value}(` : `${d}${value}(`);
        } else if (['sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'sinh⁻¹', 'cosh⁻¹', 'tanh⁻¹'].includes(value)) {
            setDisplay(d => d === '0' ? `${value}(` : `${d}${value}(`);
        } else if (value === 'π') {
            setDisplay(d => d === '0' ? 'π' : d + 'π');
        } else if (value === 'e') {
            setDisplay(d => d === '0' ? 'e' : d + 'e');
        } else if (value === 'x²') {
            setDisplay(d => d === '0' ? '0' : `${d}^2`);
        } else if (value === 'x³') {
            setDisplay(d => d === '0' ? '0' : `${d}^3`);
        } else if (value === 'xʸ') {
            setDisplay(d => d === '0' ? '0' : `${d}^`);
        } else if (value === 'Exp') {
            setDisplay(d => d === '0' ? 'e^' : d + 'e^');
        } else if (value === 'mod') {
            setDisplay(d => d === '0' ? 'mod(' : d + 'mod');
        } else if (value === 'n!') {
            setDisplay(d => d === '0' ? '0!' : `${d}!`);
        } else if (value === '1/x') {
            setDisplay(d => d === '0' ? '1/' : `1/(${d})`);
        } else if (value === '√x') {
            setDisplay(d => d === '0' ? '√(' : `√(${d})`);
        } else if (value === '∛x') {
            setDisplay(d => d === '0' ? '∛(' : `∛(${d})`);
        } else if (value === '|x|') {
            setDisplay(d => d === '0' ? '|' : `|${d}|`);
        } else if (value === 'log₂x') {
            setDisplay(d => d === '0' ? 'log₂(' : `log₂(${d})`);
        } else if (value === 'logyˣ') {
            setDisplay(d => d === '0' ? 'logyˣ(' : `logyˣ(${d})`);
        } else if (value === 'eˣ') {
            setDisplay(d => d === '0' ? 'e^(' : `e^(${d})`);
        } else if (value === '10ˣ') {
            setDisplay(d => d === '0' ? '10^(' : `10^(${d})`);
        } else if (value === 'y√x') {
            setDisplay(d => d === '0' ? 'y√x(' : `y√x(${d})`);
        } else {
            setDisplay(prev => (prev === '0' && value !== '.') ? value : prev + value);
        }
    };
    
    const copyResult = () => {
        navigator.clipboard.writeText(display);
    };
    
    // If minimized, just show a small floating button
    if (isMinimized) {
        return (
            <div 
                ref={calcRef}
                className="z-50 fixed bg-blue-500 text-white rounded shadow-lg cursor-pointer"
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
                onClick={() => setIsMinimized(false)}
            >
                <div className="p-2 font-bold">Scientific Calculator</div>
            </div>
        );
    }

    return (
        <div 
            ref={calcRef}
            className="z-50 fixed bg-[#e6eaef] rounded shadow-lg unselectable"
            style={{ 
                left: `${position.x}px`, 
                top: `${position.y}px`,
                width: '463px',
                fontFamily: 'Arial, sans-serif'
            }}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Header */}
            <div 
                className="handle bg-[#3986e1] text-white flex justify-between items-center px-3 py-1.5 cursor-grab rounded-t"
                onMouseDown={handleMouseDown}
            >
                <span className="font-bold">Scientific Calculator</span>
                <div className="flex items-center">
                    <button 
                        onClick={copyResult} 
                        className="px-3 py-1 bg-[#42d2f5] hover:bg-[#35c4e6] text-white text-xs mr-2 rounded"
                    >
                        Copy Result
                    </button>
                    <button 
                        onClick={() => setHelpVisible(!isHelpVisible)} 
                        className="px-3 py-1 bg-[#7b68ee] hover:bg-[#6a5acd] text-white text-xs mr-2 rounded"
                    >
                        {isHelpVisible ? 'Back' : 'Help'}
                    </button>
                    <button 
                        onClick={() => setIsMinimized(true)} 
                        className="px-2 text-xl font-bold mr-2 hover:text-gray-200"
                    >
                        −
                    </button>
                    <button 
                        onClick={onClose} 
                        className="px-2 text-xl font-bold hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>
            </div>

            {!isHelpVisible ? (
                <div className="p-2">
                    {/* Display areas */}
                    <input 
                        type="text" 
                        className="w-full bg-white border border-gray-300 p-2 mb-2 h-8 rounded text-right text-gray-600 text-sm"
                        value={expressionDisplay}
                        readOnly
                    />
                    <div className="bg-white border border-gray-300 p-2 mb-2 h-10 text-right rounded flex items-center justify-end text-xl relative">
                        {display}
                        {showMemoryIndicator && (
                            <span className="absolute left-2 top-2 text-xs font-bold">M</span>
                        )}
                    </div>
                    
                    {/* Keypad */}
                    <div className="calculator-keypad">
                        {/* Row 1 */}
                        <div className="flex gap-1 mb-1">
                            <button onClick={() => handleButtonClick('mod')} className="calc-btn bg-gray-200 text-xs">mod</button>
                            <div className="calc-btn bg-gray-200 flex items-center text-xs px-1">
                                <div className="inline-flex items-center mr-2">
                                    <input 
                                        type="radio" 
                                        id="deg" 
                                        name="angleUnit" 
                                        checked={angleUnit === 'deg'} 
                                        onChange={() => setAngleUnit('deg')}
                                        className="h-3 w-3"
                                    />
                                    <label htmlFor="deg" className="ml-1 text-xs">Deg</label>
                                </div>
                                <div className="inline-flex items-center">
                                    <input 
                                        type="radio" 
                                        id="rad" 
                                        name="angleUnit" 
                                        checked={angleUnit === 'rad'} 
                                        onChange={() => setAngleUnit('rad')}
                                        className="h-3 w-3"
                                    />
                                    <label htmlFor="rad" className="ml-1 text-xs">Rad</label>
                                </div>
                            </div>
                            <button onClick={() => handleButtonClick('MC')} className="calc-btn bg-gray-200">MC</button>
                            <button onClick={() => handleButtonClick('MR')} className="calc-btn bg-gray-200">MR</button>
                            <button onClick={() => handleButtonClick('MS')} className="calc-btn bg-gray-200">MS</button>
                            <button onClick={() => handleButtonClick('M+')} className="calc-btn bg-gray-200">M+</button>
                            <button onClick={() => handleButtonClick('M-')} className="calc-btn bg-gray-200">M-</button>
                        </div>

                        {/* Row 2 */}
                        <div className="flex gap-1 mb-1">
                            <button onClick={() => handleButtonClick('sinh')} className="calc-btn bg-gray-200 text-xs">sinh</button>
                            <button onClick={() => handleButtonClick('cosh')} className="calc-btn bg-gray-200 text-xs">cosh</button>
                            <button onClick={() => handleButtonClick('tanh')} className="calc-btn bg-gray-200 text-xs">tanh</button>
                            <button onClick={() => handleButtonClick('Exp')} className="calc-btn bg-gray-200">Exp</button>
                            <button onClick={() => handleButtonClick('(')} className="calc-btn bg-gray-200">(</button>
                            <button onClick={() => handleButtonClick(')')} className="calc-btn bg-gray-200">)</button>
                            <button onClick={() => handleButtonClick('←')} className="calc-btn bg-red-500 text-white">
                                <div className="relative -top-1">←</div>
                            </button>
                            <button onClick={() => handleButtonClick('C')} className="calc-btn bg-red-500 text-white">C</button>
                            <button onClick={() => handleButtonClick('+/-')} className="calc-btn bg-gray-200">+/-</button>
                            <button onClick={() => handleButtonClick('√x')} className="calc-btn bg-gray-200">
                                <div className="relative top-0.5">√</div>
                            </button>
                        </div>

                        {/* Row 3 */}
                        <div className="flex gap-1 mb-1">
                            <button onClick={() => handleButtonClick('sinh⁻¹')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">sinh</span>
                                <span className="superscript">-1</span>
                            </button>
                            <button onClick={() => handleButtonClick('cosh⁻¹')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">cosh</span>
                                <span className="superscript">-1</span>
                            </button>
                            <button onClick={() => handleButtonClick('tanh⁻¹')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">tanh</span>
                                <span className="superscript">-1</span>
                            </button>
                            <button onClick={() => handleButtonClick('log₂x')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">log</span>
                                <span className="subscript">2</span>
                                <span className="baseele">x</span>
                            </button>
                            <button onClick={() => handleButtonClick('ln')} className="calc-btn bg-gray-200">ln</button>
                            <button onClick={() => handleButtonClick('log')} className="calc-btn bg-gray-200">log</button>
                            <button onClick={() => handleButtonClick('7')} className="calc-btn bg-white">7</button>
                            <button onClick={() => handleButtonClick('8')} className="calc-btn bg-white">8</button>
                            <button onClick={() => handleButtonClick('9')} className="calc-btn bg-white">9</button>
                            <button onClick={() => handleButtonClick('/')} className="calc-btn bg-white">/</button>
                            <button onClick={() => handleButtonClick('%')} className="calc-btn bg-white">%</button>
                        </div>

                        {/* Row 4 */}
                        <div className="flex gap-1 mb-1">
                            <button onClick={() => handleButtonClick('π')} className="calc-btn bg-gray-200">π</button>
                            <button onClick={() => handleButtonClick('e')} className="calc-btn bg-gray-200">e</button>
                            <button onClick={() => handleButtonClick('n!')} className="calc-btn bg-gray-200">n!</button>
                            <button onClick={() => handleButtonClick('logyˣ')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">log</span>
                                <span className="subscript">y</span>
                                <span className="baseele">x</span>
                            </button>
                            <button onClick={() => handleButtonClick('eˣ')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">e</span>
                                <span className="superscript">x</span>
                            </button>
                            <button onClick={() => handleButtonClick('10ˣ')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">10</span>
                                <span className="superscript">x</span>
                            </button>
                            <button onClick={() => handleButtonClick('4')} className="calc-btn bg-white">4</button>
                            <button onClick={() => handleButtonClick('5')} className="calc-btn bg-white">5</button>
                            <button onClick={() => handleButtonClick('6')} className="calc-btn bg-white">6</button>
                            <button onClick={() => handleButtonClick('*')} className="calc-btn bg-white">
                                <div className="relative top-1 text-xl">*</div>
                            </button>
                            <button onClick={() => handleButtonClick('1/x')} className="calc-btn bg-white">
                                <span className="baseele">1/x</span>
                            </button>
                        </div>

                        {/* Row 5 */}
                        <div className="flex gap-1 mb-1">
                            <button onClick={() => handleButtonClick('sin')} className="calc-btn bg-gray-200 text-xs">sin</button>
                            <button onClick={() => handleButtonClick('cos')} className="calc-btn bg-gray-200 text-xs">cos</button>
                            <button onClick={() => handleButtonClick('tan')} className="calc-btn bg-gray-200 text-xs">tan</button>
                            <button onClick={() => handleButtonClick('xʸ')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">x</span>
                                <span className="superscript">y</span>
                            </button>
                            <button onClick={() => handleButtonClick('x³')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">x</span>
                                <span className="superscript">3</span>
                            </button>
                            <button onClick={() => handleButtonClick('x²')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">x</span>
                                <span className="superscript">2</span>
                            </button>
                            <button onClick={() => handleButtonClick('1')} className="calc-btn bg-white">1</button>
                            <button onClick={() => handleButtonClick('2')} className="calc-btn bg-white">2</button>
                            <button onClick={() => handleButtonClick('3')} className="calc-btn bg-white">3</button>
                            <button onClick={() => handleButtonClick('-')} className="calc-btn bg-white">
                                <div className="relative -top-0.5 text-xl">-</div>
                            </button>
                        </div>

                        {/* Row 6 */}
                        <div className="flex gap-1 mb-1">
                            <button onClick={() => handleButtonClick('sin⁻¹')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">sin</span>
                                <span className="superscript">-1</span>
                            </button>
                            <button onClick={() => handleButtonClick('cos⁻¹')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">cos</span>
                                <span className="superscript">-1</span>
                            </button>
                            <button onClick={() => handleButtonClick('tan⁻¹')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">tan</span>
                                <span className="superscript">-1</span>
                            </button>
                            <button onClick={() => handleButtonClick('y√x')} className="calc-btn bg-gray-200 text-xs">
                                <span className="superscript" style={{top: '-8px'}}>y</span>
                                <span className="baseele" style={{fontSize: '1.2em', margin: '-6px 0 0 -9px'}}>√x</span>
                            </button>
                            <button onClick={() => handleButtonClick('∛x')} className="calc-btn bg-gray-200 text-xs">
                                <span className="text-base">∛x</span>
                            </button>
                            <button onClick={() => handleButtonClick('|x|')} className="calc-btn bg-gray-200 text-xs">
                                <span className="baseele">|x|</span>
                            </button>
                            <button onClick={() => handleButtonClick('0')} className="calc-btn bg-white">0</button>
                            <button onClick={() => handleButtonClick('.')} className="calc-btn bg-white">.</button>
                            <button onClick={() => handleButtonClick('+')} className="calc-btn bg-white">+</button>
                            <button 
                                onClick={() => handleButtonClick('=')} 
                                className="calc-btn bg-green-500 text-white"
                                style={{height: '74px'}}
                            >
                                <div className="mb-1">=</div>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // Help screen content
                <div className="bg-gray-100 p-3 max-h-[400px] overflow-y-auto text-sm">
                    <div className="text-center font-bold text-lg mb-2">Calculator Instructions</div>
                    <p className="mb-3">
                        Allows you to perform basic and complex mathematical operations such as 
                        modulus, square root, cube root, trigonometric, exponential, logarithmic, 
                        hyperbolic functions, etc. You can operate the calculator using the buttons 
                        provided on screen with your mouse.
                    </p>
                    
                    <div className="text-green-700 font-bold border-b border-green-700 mb-2">Do's:</div>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Be sure to press [C] when beginning a new calculation.</li>
                        <li>You can simplify an equation using parenthesis and other mathematical operators.</li>
                        <li>Use the predefined operations such as p (Pi), log, Exp to save time during calculation.</li>
                        <li>Use memory function for calculating cumulative totals.
                            <br/><strong>[M+]: Will add displayed value to memory.</strong>
                            <br/><strong>[MR]: Will recall the value stored in memory.</strong>
                            <br/><strong>[M-]: Subtracts the displayed value from memory.</strong>
                        </li>
                        <li>Be sure select the angle unit (Deg or Rad) before beginning any calculation. <strong>Note: By default angle unit is set as Degree</strong></li>
                    </ul>
                    
                    <div className="text-red-700 font-bold border-b border-red-700 mb-2">Dont's:</div>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Perform multiple operations together.</li>
                        <li>Leave parenthesis unbalanced.</li>
                        <li>Change the angle unit (Deg or Rad) while performing a calculation.</li>
                    </ul>
                    
                    <div className="font-bold border-b border-gray-700 mb-2">Limitations:</div>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Keyboard operation is disabled.</li>
                        <li>The output for a Factorial calculation is precise up to 14 digits.</li>
                        <li>The output for Logarithmic and Hyperbolic calculations is precise up to 5 digits.</li>
                        <li>Modulus (mod) operation performed on decimal numbers with 15 digits would not be precise. <strong>Use mod operation only if the number comprises of less than 15 digits.</strong></li>
                        <li>The range of value supported by the calculator is 10<sup>-323</sup> to 10<sup>308</sup>.</li>
                    </ul>
                </div>
            )}

            {/* CSS for calculator buttons */}
            <style jsx>{`
                .unselectable {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                .calc-btn {
                    min-width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                    font-size: 14px;
                    transition: all 0.1s;
                }
                
                .calc-btn:hover {
                    filter: brightness(0.95);
                }
                
                .calc-btn:active {
                    transform: scale(0.98);
                    filter: brightness(0.9);
                }
                
                .superscript {
                    position: relative;
                    top: -6px;
                    font-size: 70%;
                }
                
                .subscript {
                    position: relative;
                    bottom: -6px;
                    font-size: 70%;
                }
                
                .baseele {
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
};

export default VirtualCalculator;