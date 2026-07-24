import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange, onSubmit, placeholder = 'Search events, venues, cities...' }) => {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <Search size={18} />
      <input value={value} onChange={onChange} placeholder={placeholder} />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;