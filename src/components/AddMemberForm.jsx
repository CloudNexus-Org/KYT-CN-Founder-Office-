import { useState } from "react";

const emptyForm = {
  name: "",
  role: "",
  team: "",
  email: "",
  image: "",
  linkedin: "",
};

const inputClassName =
  "w-full rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2.5 text-sm text-[#FFFFFF] outline-none transition placeholder:text-[#FFFFFF] focus:border-[#FFFFFF]";

const formFields = [
  { key: "name", label: "Name", placeholder: "Name", type: "text", required: true, autoComplete: "name" },
  { key: "role", label: "Role", placeholder: "Role", type: "text", required: true, autoComplete: "organization-title" },
  { key: "email", label: "Email", placeholder: "Email (optional)", type: "email", required: false, autoComplete: "email" },
  { key: "linkedin", label: "LinkedIn URL", placeholder: "LinkedIn URL (optional)", type: "url", required: false, autoComplete: "url" },
  { key: "image", label: "Image URL", placeholder: "Image URL (optional)", type: "url", required: false, autoComplete: "url" },
];

function AddMemberForm({ teamOptions, onSubmit }) {
  const [formState, setFormState] = useState({ ...emptyForm, team: "" });
  const [errors, setErrors] = useState({});

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;
    setFormState((prev) => ({ ...prev, [field]: nextValue }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formState.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!formState.role.trim()) {
      nextErrors.role = "Role is required.";
    }

    if (!formState.team) {
      nextErrors.team = "Team is required.";
    }

    if (formState.email && !/^\S+@\S+\.\S+$/.test(formState.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    const urlPattern = /^https?:\/\/.+/i;
    if (formState.linkedin && !urlPattern.test(formState.linkedin)) {
      nextErrors.linkedin = "LinkedIn URL must start with http:// or https://.";
    }

    if (formState.image && !urlPattern.test(formState.image)) {
      nextErrors.image = "Image URL must start with http:// or https://.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...formState,
      name: formState.name.trim(),
      role: formState.role.trim(),
      email: formState.email.trim(),
      linkedin: formState.linkedin.trim(),
      image: formState.image.trim(),
    });

    setFormState({ ...emptyForm, team: "" });
    setErrors({});
  };

  return (
    <aside className="glass-panel h-fit rounded-2xl p-5">
      <h2 className="font-display text-lg font-semibold text-[#FFFFFF]">Add Member</h2>

      <form onSubmit={submit} noValidate className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {formFields.slice(0, 2).map((field) => {
          const inputId = `add-member-${field.key}`;
          return (
            <div key={field.key}>
              <label htmlFor={inputId} className="sr-only">{field.label}</label>
              <input
                id={inputId}
                value={formState[field.key]}
                onChange={updateField(field.key)}
                placeholder={field.placeholder}
                type={field.type}
                autoComplete={field.autoComplete}
                aria-invalid={Boolean(errors[field.key])}
                aria-describedby={errors[field.key] ? `${inputId}-error` : undefined}
                className={inputClassName}
              />
              {errors[field.key] && (
                <p id={`${inputId}-error`} className="mt-1 text-xs text-[#FFFFFF]">{errors[field.key]}</p>
              )}
            </div>
          );
        })}
        <select
          id="add-member-team"
          value={formState.team}
          onChange={updateField("team")}
          aria-label="Select team"
          aria-invalid={Boolean(errors.team)}
          aria-describedby={errors.team ? "add-member-team-error" : undefined}
          className={inputClassName}
        >
          <option value="">Select Team</option>
          {teamOptions.map((teamName) => (
            <option key={teamName} value={teamName}>
              {teamName}
            </option>
          ))}
        </select>
        <div>
          {formFields.slice(2, 3).map((field) => {
            const inputId = `add-member-${field.key}`;
            return (
              <div key={field.key}>
                <label htmlFor={inputId} className="sr-only">{field.label}</label>
                <input
                  id={inputId}
                  value={formState[field.key]}
                  onChange={updateField(field.key)}
                  placeholder={field.placeholder}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  aria-invalid={Boolean(errors[field.key])}
                  aria-describedby={errors[field.key] ? `${inputId}-error` : undefined}
                  className={inputClassName}
                />
                {errors[field.key] && (
                  <p id={`${inputId}-error`} className="mt-1 text-xs text-[#FFFFFF]">{errors[field.key]}</p>
                )}
              </div>
            );
          })}
        </div>
        {formFields.slice(3).map((field) => {
          const inputId = `add-member-${field.key}`;
          return (
            <div key={field.key}>
              <label htmlFor={inputId} className="sr-only">{field.label}</label>
              <input
                id={inputId}
                value={formState[field.key]}
                onChange={updateField(field.key)}
                placeholder={field.placeholder}
                type={field.type}
                autoComplete={field.autoComplete}
                aria-invalid={Boolean(errors[field.key])}
                aria-describedby={errors[field.key] ? `${inputId}-error` : undefined}
                className={inputClassName}
              />
              {errors[field.key] && (
                <p id={`${inputId}-error`} className="mt-1 text-xs text-[#FFFFFF]">{errors[field.key]}</p>
              )}
            </div>
          );
        })}
        {errors.team && <p id="add-member-team-error" className="md:col-span-2 -mt-1 text-xs text-[#FFFFFF]">{errors.team}</p>}
        <button
          type="submit"
          className="w-full rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2.5 font-display text-sm font-semibold tracking-wide text-[#00AEEF] transition hover:border-[#FFFFFF] hover:text-[#FFFFFF] md:col-span-2"
        >
          Add Member to Team
        </button>
      </form>
    </aside>
  );
}

export default AddMemberForm;
