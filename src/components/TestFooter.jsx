import React from 'react';

const TestFooter = ({ onMarkForReview, onClearResponse, onSaveAndNext, onPrevious, onSubmit, isSubmitting, isFirstQuestion, isLastQuestion }) => {
    return (
        <div className="flex-shrink-0 pt-2 border-t-2 border-gray-300 flex justify-between items-center bg-gray-100 p-2 rounded-b-md shadow-inner">
            {/* Left Side Buttons */}
            <div>
                <button
                    onClick={onMarkForReview}
                    className="bg-gray-200 border border-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 shadow-sm"
                >
                    Mark for Review &amp; Next
                </button>
                <button
                    onClick={onClearResponse}
                    className="ml-4 bg-gray-200 border border-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 shadow-sm"
                >
                    Clear Response
                </button>
            </div>

            {/* Right Side Buttons */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onPrevious}
                    disabled={isFirstQuestion}
                    className="bg-gray-200 border border-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 shadow-sm"
                >
                    Previous
                </button>
                <button
                    onClick={onSaveAndNext}
                    disabled={isLastQuestion}
                    className="bg-[#428bca] text-white font-bold px-8 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 shadow-sm border-b-2 border-blue-800"
                >
                    Save &amp; Next
                </button>
                 <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="bg-[#5cb85c] text-white font-bold px-10 py-2 w-80 mx-6 rounded-md hover:bg-green-700 disabled:bg-green-800 shadow-sm border-b-2 border-green-800"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default TestFooter;