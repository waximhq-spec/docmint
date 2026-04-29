import { useState, useEffect, useRef } from 'react';

export default function LocationInput({ value, onChange, placeholder = "Search address..." }) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length < 3) {
      setResults([]);
      return;
    }

    try {
      // Using OpenStreetMap Nominatim for free global address search
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=5`);
      const data = await res.json();
      setResults(data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Address search failed", err);
    }
  };

  const selectAddress = (item) => {
    const fullAddr = item.display_name;
    setQuery(fullAddr);
    onChange(fullAddr);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query.length >= 3 && setShowDropdown(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {showDropdown && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          marginTop: '4px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {results.map((item, i) => (
            <div
              key={i}
              onClick={() => selectAddress(item)}
              style={{
                padding: '10px 14px',
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: i === results.length - 1 ? 'none' : '1px solid #f0f0f0',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
