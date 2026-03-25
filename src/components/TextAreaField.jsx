function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 5,
  maxLength,
}) {
  const count = value?.length || 0;

  return (
    <label className="form-field">
      <span className="form-label">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="form-input min-h-28 resize-y"
      />
      {maxLength ? <span className="form-hint">{count}/{maxLength}</span> : null}
    </label>
  );
}

export default TextAreaField;
