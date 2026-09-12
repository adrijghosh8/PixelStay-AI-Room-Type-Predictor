import { useId, useMemo, useState, useRef, useEffect } from 'react';
import '../styles/combobox.css';

export default function NeighbourhoodCombobox({ id, value, onChange, options, error, hint }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const listId = useId();
  const rootRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 30);
    return options.filter((o) => o.toLowerCase().includes(q)).slice(0, 30);
  }, [query, options]);

  const commit = (val) => {
    onChange(val);
    setQuery(val);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[highlight]) commit(filtered[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className={`field ${error ? 'field--error' : ''}`} ref={rootRef}>
      <label htmlFor={id} className="field__label">
        Neighbourhood
      </label>
      <div className="combobox">
        <input
          id={id}
          className="field__input"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Start typing…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(0);
            if (e.target.value === '') onChange('');
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-invalid={!!error}
        />
        {open && filtered.length > 0 && (
          <ul className="combobox__list" id={listId} role="listbox">
            {filtered.map((opt, i) => (
              <li
                key={opt}
                role="option"
                aria-selected={opt === value}
                className={`combobox__option ${i === highlight ? 'combobox__option--active' : ''}`}
                onMouseDown={() => commit(opt)}
                onMouseEnter={() => setHighlight(i)}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
        {open && filtered.length === 0 && (
          <ul className="combobox__list" role="listbox">
            <li className="combobox__empty">No matches</li>
          </ul>
        )}
      </div>
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && (
        <p className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
