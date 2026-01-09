import React, { useState, useEffect } from 'react';

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
    const [query, setQuery] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(query);
        }, 300); // Debounce for 300ms

        return () => clearTimeout(timeoutId);
    }, [query, onSearch]);

    return (
        <div className="search-bar" style={{ position: 'relative', flexGrow: 1, maxWidth: '400px' }}>
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                <SearchIcon />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                    fontSize: '1rem',
                    borderRadius: '2rem', // Pill shape
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'hsl(var(--color-surface))',
                    color: 'hsl(var(--color-text))',
                    outline: 'none',
                    transition: 'box-shadow 0.2s'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px hsla(var(--color-primary), 0.3)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
            />
        </div>
    );
};

export default SearchBar;
