import { useState, useRef, useEffect } from "react";
import PAKISTAN_CITIES from "../../utils/pakistanCities";

const SearchableCitySelect = ({ value = "", onChange, error, disabled }) => {
  const [search, setSearch] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = search
    ? PAKISTAN_CITIES.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase()),
      )
    : PAKISTAN_CITIES;

  const handleSelect = (city) => {
    setSearch(city);
    onChange(city);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    onChange(e.target.value);
    setOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        value={search}
        onChange={handleChange}
        onFocus={() => !disabled && setOpen(true)}
        onKeyDown={!disabled ? handleKeyDown : undefined}
        placeholder="Search city..."
        autoComplete="off"
        disabled={disabled}
        className={`w-full bg-white/5 border rounded-xl px-3 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-red-500" : "border-white/10"
        }`}
      />

      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-xl bg-[#1a1a2e] border border-white/10 shadow-2xl shadow-black/50"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-slate-500 text-sm text-center">
              No cities found
            </li>
          ) : (
            filtered.map((city, i) => (
              <li
                key={city}
                onMouseDown={() => handleSelect(city)}
                onMouseEnter={() => setHighlightedIndex(i)}
                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                  i === highlightedIndex
                    ? "bg-red-900/40 text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {city}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableCitySelect;
