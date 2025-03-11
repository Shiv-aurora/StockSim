import React, { useState, useCallback, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { stockAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchStocks = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const searchResults = await stockAPI.searchStocks(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchStocks(value);
  };

  const handleResultClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setShowResults(true)}
          placeholder="Search stocks..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      {showResults && (query || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-card rounded-lg shadow-lg border border-border">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((result) => (
                <li
                  key={result.symbol}
                  onClick={() => handleResultClick(result.symbol)}
                  className="p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <div className="font-medium">{result.symbol}</div>
                  <div className="text-sm text-muted-foreground">{result.name}</div>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-4 text-center text-muted-foreground">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;