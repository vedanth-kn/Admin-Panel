import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="flex justify-center items-center space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            
            {getPageNumbers().map((pageNum, index) => (
                <button
                    key={index}
                    onClick={() => typeof pageNum === 'number' ? onPageChange(pageNum) : null}
                    disabled={pageNum === '...'}
                    className={`w-8 h-8 flex items-center justify-center rounded-xl
                        ${pageNum === currentPage 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-600 hover:bg-gray-100'
                        } ${pageNum === '...' ? 'cursor-default hover:bg-transparent' : ''}`}
                >
                    {pageNum}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
};

export default Pagination;