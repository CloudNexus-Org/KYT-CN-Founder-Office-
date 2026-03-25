function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = "",
}) {
  return (
    <label className="form-field">
      <span className="form-label">
        {label}
        {required && <span className="ml-1 text-[#00AEEF]">*</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          "form-input",
          error ? "border-[#FFFFFF] focus:border-[#FFFFFF]" : "",
        ].join(" ")}
      />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}

export default InputField;
