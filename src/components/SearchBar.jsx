function SearchBar({ value, onChange }) {
  const inputId = "team-search";

  return (
    <label className="block w-full" htmlFor={inputId}>
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">Search People, Role, Team</span>
      <div className="rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2.5">
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type name, role, or team..."
          autoComplete="off"
          spellCheck={false}
          aria-label="Search people by name, role, or team"
          className="w-full bg-[#000000] text-sm text-[#FFFFFF] placeholder:text-[#FFFFFF] focus:outline-none"
        />
      </div>
    </label>
  );
}

export default SearchBar;
