import { useState, useEffect } from 'react';
import { fetchEvents, fetchNews } from '../api';
import { Search as SearchIcon, Calendar, Newspaper, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';

type Result = {
  id: string;
  type: 'event' | 'news';
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category?: string;
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [input, setInput] = useState(initialQuery);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    Promise.all([fetchEvents(), fetchNews()])
      .then(([events, news]) => {
        const q = query.toLowerCase();
        const eventResults: Result[] = events
          .filter(e =>
            e.title?.toLowerCase().includes(q) ||
            e.description?.toLowerCase().includes(q) ||
            e.location?.toLowerCase().includes(q) ||
            e.category?.toLowerCase().includes(q)
          )
          .map(e => ({
            id: e.id,
            type: 'event',
            title: e.title,
            excerpt: e.description,
            date: e.date,
            image: e.image,
            category: e.category,
          }));

        const newsResults: Result[] = news
          .filter(n =>
            n.title?.toLowerCase().includes(q) ||
            n.excerpt?.toLowerCase().includes(q) ||
            n.content?.toLowerCase().includes(q) ||
            n.author?.toLowerCase().includes(q)
          )
          .map(n => ({
            id: n.id,
            type: 'news',
            title: n.title,
            excerpt: n.excerpt,
            date: n.date,
            image: n.image,
          }));

        setResults([...eventResults, ...newsResults]);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(input.trim());
    setSearchParams(input.trim() ? { q: input.trim() } : {});
  };

  const clearSearch = () => {
    setInput('');
    setQuery('');
    setSearchParams({});
    setResults([]);
    setSearched(false);
  };

  const eventResults = results.filter(r => r.type === 'event');
  const newsResults = results.filter(r => r.type === 'news');

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <SEO title="Search" description="Search events and news at the Banjul International Convention Centre." />

      {/* Hero */}
      <section className="bg-[#1F85A8] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Search BICC</h1>
          <form onSubmit={handleSubmit} className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search events, news..."
              className="w-full pl-12 pr-24 py-4 rounded-xl text-gray-800 text-base outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
              autoFocus
            />
            {input && (
              <button type="button" onClick={clearSearch}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            )}
            <button type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Searching...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16">
            <SearchIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No results found</h3>
            <p className="text-gray-400 text-sm">Try different keywords or check the spelling.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-16 text-gray-400">
            <SearchIcon className="mx-auto mb-4 text-gray-300" size={48} />
            <p>Enter a search term above to find events and news.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-8">
              Found <span className="font-semibold text-[#1F85A8]">{results.length}</span> result{results.length !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-[#1F85A8]">"{query}"</span>
            </p>

            {/* Events */}
            {eventResults.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <Calendar size={18} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-[#1F85A8]">Events ({eventResults.length})</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {eventResults.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-4 p-4">
                      <img src={r.image} alt={r.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {r.category && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                              {r.category}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="font-bold text-[#1F85A8] text-sm line-clamp-2">{r.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            {newsResults.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <Newspaper size={18} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-[#1F85A8]">News ({newsResults.length})</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {newsResults.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-4 p-4">
                      <img src={r.image} alt={r.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-400">
                          {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <h3 className="font-bold text-[#1F85A8] text-sm line-clamp-2 mt-1">{r.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
