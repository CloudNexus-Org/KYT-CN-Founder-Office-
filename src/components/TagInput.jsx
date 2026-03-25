import { useState } from "react";

function TagInput({ label, tags, onChange, placeholder = "Add a skill and press Enter" }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const value = draft.trim();
    if (!value) {
      return;
    }
    if (tags.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...tags, value]);
    setDraft("");
  };

  const removeTag = (tag) => {
    onChange(tags.filter((item) => item !== tag));
  };

  return (
    <div className="form-field">
      <span className="form-label">{label}</span>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          className="form-input"
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-xl border-2 border-[#00AEEF] bg-[#000000] px-3 text-sm font-semibold text-[#00AEEF] transition duration-300 hover:border-[#FFFFFF] hover:text-[#FFFFFF]"
        >
          Add
        </button>
      </div>

      {!!tags.length && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => removeTag(tag)}
              className="rounded-full border border-[#00AEEF] bg-[#000000] px-3 py-1 text-xs font-semibold text-[#FFFFFF] transition duration-300 hover:border-[#FFFFFF]"
              title="Remove tag"
            >
              {tag} ×
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagInput;
