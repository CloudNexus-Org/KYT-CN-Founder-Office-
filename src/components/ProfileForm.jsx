import { useEffect, useMemo, useState } from "react";
import Button from "./Button";
import InputField from "./InputField";
import TagInput from "./TagInput";
import TextAreaField from "./TextAreaField";
import "../styles/form.css";

const buildInitialForm = (profile) => ({
  fullName: profile.fullName || profile.name || "",
  jobTitle: profile.jobTitle || profile.role || "",
  location: profile.location || "",
  contactNumber: profile.contactNumber || profile.phone || "",
  dateOfJoining: profile.dateOfJoining || "",
  timeZone: profile.timeZone || "Full Time",
  keySkillsExpertise: profile.keySkillsExpertise || (profile.skills || []).join(", "),
  professionalIntroduction: profile.professionalIntroduction || profile.bio || "",
  profileImageUrl: profile.profileImageUrl || profile.image || "",
  linkedinUrl: profile.linkedin || "",
  skills: profile.skills || [],
});

function ProfileForm({ profile, onSave }) {
  const initialForm = useMemo(() => buildInitialForm(profile), [profile]);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setFormData(initialForm);
    setErrors({});
    setSavedMessage("");
  }, [initialForm]);

  const setValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSavedMessage("");
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValue(name, value);
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Name is required.";
    }
    if (!formData.jobTitle.trim()) {
      nextErrors.jobTitle = "Job title is required.";
    }
    if (!String(formData.contactNumber).trim()) {
      nextErrors.contactNumber = "Contact number is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      name: formData.fullName.trim(),
      jobTitle: formData.jobTitle.trim(),
      role: formData.jobTitle.trim(),
      location: formData.location.trim(),
      contactNumber: String(formData.contactNumber).trim(),
      phone: String(formData.contactNumber).trim(),
      dateOfJoining: formData.dateOfJoining,
      timeZone: formData.timeZone,
      keySkillsExpertise: formData.keySkillsExpertise.trim(),
      professionalIntroduction: formData.professionalIntroduction.trim(),
      bio: formData.professionalIntroduction.trim(),
      profileImageUrl: formData.profileImageUrl.trim(),
      image: formData.profileImageUrl.trim(),
      linkedin: formData.linkedinUrl.trim(),
      skills: formData.skills,
      tags: formData.skills.slice(0, 4),
    };

    if (onSave) {
      onSave(profile.id, payload);
    }

    console.log("Saved profile data", payload);
    setSavedMessage("Profile saved successfully.");
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      jobTitle: "",
      location: "",
      contactNumber: "",
      dateOfJoining: "",
      timeZone: "Full Time",
      keySkillsExpertise: "",
      professionalIntroduction: "",
      profileImageUrl: "",
      linkedinUrl: "",
      skills: [],
    });
    setErrors({});
    setSavedMessage("");
  };

  return (
    <form className="form-shell" onSubmit={handleSubmit}>
      <h2 className="font-display text-xl font-bold text-[#FFFFFF]">Editable Profile Form</h2>
      <p className="mt-1 text-sm text-[#FFFFFF]">Update employee profile details using controlled input fields.</p>

      <section className="form-section mt-5">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[#00AEEF]">Basic Information</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter full name"
            required
            error={errors.fullName}
          />
          <InputField
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            placeholder="e.g. Team Lead"
            required
            error={errors.jobTitle}
          />
          <InputField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g. Hyderabad"
          />
          <InputField
            label="Contact Number"
            name="contactNumber"
            type="number"
            value={formData.contactNumber}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
            error={errors.contactNumber}
          />
          <InputField
            label="Date of Joining"
            name="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={handleInputChange}
          />

          <label className="form-field">
            <span className="form-label">Time Zone</span>
            <select
              name="timeZone"
              value={formData.timeZone}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>
          </label>

          <InputField
            label="Profile Image URL"
            name="profileImageUrl"
            value={formData.profileImageUrl}
            onChange={handleInputChange}
            placeholder="https://..."
          />
          <InputField
            label="LinkedIn URL"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </section>

      <section className="form-section mt-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[#00AEEF]">Key Skills & Expertise</h3>
        <div className="mt-3">
          <TextAreaField
            label="Key Skills Description"
            name="keySkillsExpertise"
            value={formData.keySkillsExpertise}
            onChange={handleInputChange}
            placeholder="Describe core expertise, domain strengths, and specialization..."
            rows={4}
            maxLength={400}
          />
        </div>

        <div className="mt-3">
          <TagInput
            label="Skills as Tags"
            tags={formData.skills}
            onChange={(next) => setValue("skills", next)}
          />
        </div>
      </section>

      <section className="form-section mt-4">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-[#00AEEF]">Professional Introduction</h3>
        <div className="mt-3">
          <TextAreaField
            label="Introduction"
            name="professionalIntroduction"
            value={formData.professionalIntroduction}
            onChange={handleInputChange}
            placeholder="Write a short professional summary. Multiple paragraphs are supported."
            rows={6}
            maxLength={700}
          />
        </div>
      </section>

      <section className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
        {savedMessage && <span className="text-sm font-medium text-[#FFFFFF]">{savedMessage}</span>}
      </section>
    </form>
  );
}

export default ProfileForm;
