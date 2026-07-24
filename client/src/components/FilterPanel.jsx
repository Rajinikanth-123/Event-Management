import { categories, filterOptions, sortOptions } from '../utils/constants';

const FilterPanel = ({ filters, setFilters, onApply, onReset }) => {
  return (
    <div className="filter-panel">
      <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select value={filters.dateFilter} onChange={(event) => setFilters({ ...filters, dateFilter: event.target.value })}>
        <option value="">Any Time</option>
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <select value={filters.sortBy} onChange={(event) => setFilters({ ...filters, sortBy: event.target.value })}>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <input value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })} placeholder="City" />
      <input value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} placeholder="Keyword" />
      <div className="filter-actions">
        <button type="button" className="primary-button" onClick={onApply}>
          Apply Filters
        </button>
        <button type="button" className="text-button" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;