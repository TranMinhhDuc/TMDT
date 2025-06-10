import React from 'react';

const Pagination = ({ page, totalPages, currentPage, setPage }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfWindow = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, page - halfWindow);
        let endPage = Math.min(totalPages, page + halfWindow);

        if (endPage - startPage + 1 < maxPagesToShow) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    return (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-10 py-6">
            <button
                className="px-3 py-1 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                onClick={() => setPage(1)}
                disabled={page === 1}
                title="Trang đầu"
            >
                «
            </button>

            <button
                className="px-4 py-1 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
            >
                Trước
            </button>

            {getPageNumbers().map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={`px-4 py-1 rounded-full border transition-all duration-200 shadow-sm ${
                        page === pageNumber
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white border-gray-300 hover:bg-blue-50 text-gray-800'
                    }`}
                    onClick={() => setPage(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}

            <button
                className="px-4 py-1 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
            >
                Sau
            </button>

            <button
                className="px-3 py-1 rounded-full bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                title="Trang cuối"
            >
                »
            </button>

            <span className="ml-4 text-sm text-gray-500">
                Trang {currentPage} / {totalPages}
            </span>
        </div>
    );
};

export default Pagination;
