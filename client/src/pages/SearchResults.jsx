import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import EventGrid from '../components/EventGrid';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import { eventService } from '../services/eventService';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    dateFilter: searchParams.get('dateFilter') || '',
    city: searchParams.get('city') || '',
    sortBy: searchParams.get('sortBy') || 'newest'
  });

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await eventService.getEvents({ ...filters, page, limit: 12 });
      setEvents(data.events || []);
      setPagination(data.pagination || { page: 1, pages: 1 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(Number(searchParams.get('page') || 1));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchParams({ ...filters, page: '1' });
    fetchEvents(1);
  };

  const handleReset = () => {
    const next = { keyword: '', category: '', dateFilter: '', city: '', sortBy: 'newest' };
    setFilters(next);
    setSearchParams({ page: '1' });
    fetchEvents(1);
  };

  return (
    <section className="page-panel">
      <span className="eyebrow">Search</span>
      <h1>Find the right event</h1>
      <SearchBar value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} onSubmit={handleSearch} />
      <FilterPanel filters={filters} setFilters={setFilters} onApply={() => fetchEvents(1)} onReset={handleReset} />
      {loading ? <Loader label="Searching events" /> : <EventGrid events={events} onRegister={(event) => navigate(`/events/${event._id}`)} />}
      <Pagination page={pagination.page} pages={pagination.pages} onPageChange={(page) => fetchEvents(page)} />
    </section>
  );
};

export default SearchResults;