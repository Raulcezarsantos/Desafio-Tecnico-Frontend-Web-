interface PaginationBarProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination-bar">
            <button
                className="secondary-button"
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>

            <span>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
                className="secondary-button"
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
}
