const Pagination = ({ page, pages, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="pagination">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span>
        Page {page} of {pages}
      </span>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;