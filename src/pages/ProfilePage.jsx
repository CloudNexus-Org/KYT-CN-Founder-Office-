import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { getPersonById } from "../utils/treeHelpers";

const resolveImageSrc = (value) => {
  const src = String(value || "").trim();
  if (!src) {
    return "";
  }
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }
  return `/${src.replace(/^\/+/, "")}`;
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read selected image file."));
    reader.readAsDataURL(file);
  });

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load selected image."));
    image.src = src;
  });

const compressImageDataUrl = async (file) => {
  const rawDataUrl = await fileToDataUrl(file);
  if (!file.type.startsWith("image/")) {
    return rawDataUrl;
  }

  try {
    const image = await loadImageElement(rawDataUrl);
    const maxDimension = 420;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return rawDataUrl;
    }

    context.drawImage(image, 0, 0, width, height);
    const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.72);

    return compressedDataUrl.length < rawDataUrl.length ? compressedDataUrl : rawDataUrl;
  } catch {
    return rawDataUrl;
  }
};

const buildInitialForm = (profile) => ({
  fullName: profile.fullName || profile.name || "",
  jobTitle: profile.jobTitle || profile.role || "",
  team: profile.team || "Founder Office",
  location: profile.location || "",
  contactNumber: profile.contactNumber || profile.phone || "",
  dateOfJoining: profile.dateOfJoining || "",
  timeZone: profile.timeZone || "Full Time",
  keySkillsExpertise: profile.keySkillsExpertise || (profile.skills || []).join(", "),
  professionalIntroduction: profile.professionalIntroduction || profile.bio || "",
  profileImageUrl: profile.profileImageUrl || profile.image || "",
  secondaryImageUrl: profile.secondaryImageUrl || profile.secondaryImage || "/assets/cloudnexus-logo.png",
  linkedin: profile.linkedin || "",
  github: profile.github || "",
  portfolio: profile.portfolio || "",
  programmingSkills: profile.programmingSkills || "Java, Python, JavaScript",
  frameworkSkills: profile.frameworkSkills || "Spring Boot, React, Node.js",
  databaseSkills: profile.databaseSkills || "MySQL, MongoDB",
  toolsPlatforms: profile.toolsPlatforms || "Git, Docker, Kubernetes",
  cloudPlatforms: profile.cloudPlatforms || "AWS, Azure, GCP",
  apiMicroservices: profile.apiMicroservices || "API Development & Microservices Architecture",
  devopsPipelines: profile.devopsPipelines || "DevOps & CI/CD Pipelines",
});

function ProfilePage({ orgData, onSaveProfile }) {
  const { id } = useParams();
  const profile = useMemo(() => getPersonById(orgData, id), [orgData, id]);
  const initialForm = useMemo(() => (profile ? buildInitialForm(profile) : null), [profile]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [savedMessage, setSavedMessage] = useState("");
  const [primaryFileLabel, setPrimaryFileLabel] = useState("");
  const primaryFileInputRef = useRef(null);

  useEffect(() => {
    setFormData(initialForm);
    setIsEditing(false);
    setSavedMessage("");
    setPrimaryFileLabel("");
  }, [initialForm]);

  if (!profile) {
    return (
      <motion.main
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8"
      >
        <div className="glass-panel rounded-2xl p-6 text-center">
          <h1 className="font-display text-2xl font-bold text-[#FFFFFF]">Profile not found</h1>
          <p className="mt-2 text-sm text-[#FFFFFF]">This member may have been removed or the profile ID is incorrect.</p>
          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl border-2 border-[#00AEEF] bg-[#000000] px-4 py-2 text-sm font-semibold text-[#00AEEF] transition duration-300 hover:border-[#FFFFFF] hover:text-[#FFFFFF]"
          >
            Back to Organization Tree
          </Link>
        </div>
      </motion.main>
    );
  }

  const setValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSavedMessage("");
  };

  const handleSave = () => {
    if (!formData.fullName.trim() || !formData.jobTitle.trim()) {
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      name: formData.fullName.trim(),
      jobTitle: formData.jobTitle.trim(),
      role: formData.jobTitle.trim(),
      team: formData.team.trim(),
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
      secondaryImageUrl: formData.secondaryImageUrl.trim(),
      secondaryImage: formData.secondaryImageUrl.trim(),
      linkedin: formData.linkedin.trim(),
      github: formData.github.trim(),
      portfolio: formData.portfolio.trim(),
      programmingSkills: formData.programmingSkills.trim(),
      frameworkSkills: formData.frameworkSkills.trim(),
      databaseSkills: formData.databaseSkills.trim(),
      toolsPlatforms: formData.toolsPlatforms.trim(),
      cloudPlatforms: formData.cloudPlatforms.trim(),
      apiMicroservices: formData.apiMicroservices.trim(),
      devopsPipelines: formData.devopsPipelines.trim(),
      skills: formData.keySkillsExpertise
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    onSaveProfile(profile.id, payload);
    setIsEditing(false);
    setSavedMessage("Profile saved successfully.");
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setSavedMessage("");
    setPrimaryFileLabel("");
  };

  const handlePrimaryImageFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const value = await compressImageDataUrl(file);
    if (!value) {
      return;
    }

    setValue("profileImageUrl", value);
    setPrimaryFileLabel(file.name);
  };

  const primaryImage = resolveImageSrc((formData?.profileImageUrl || profile.profileImageUrl || profile.image));
  const secondaryImage = resolveImageSrc((formData?.secondaryImageUrl || profile.secondaryImageUrl || profile.secondaryImage || "/assets/cloudnexus-logo.png"));
  const skills = (formData?.keySkillsExpertise || profile.keySkillsExpertise || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const technicalRows = [
    { label: "Programming", key: "programmingSkills" },
    { label: "Frameworks", key: "frameworkSkills" },
    { label: "Databases", key: "databaseSkills" },
    { label: "Tools & Platforms", key: "toolsPlatforms" },
    { label: "Cloud Platforms", key: "cloudPlatforms" },
    { label: "API Development & Microservices", key: "apiMicroservices" },
    { label: "DevOps & CI/CD Pipelines", key: "devopsPipelines" },
  ];

  return (
    <motion.main
      initial={{ y: 14 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex h-[100dvh] w-full max-w-[860px] flex-col overflow-hidden px-3 py-3 md:px-4 md:py-4"
    >
      <div className="mb-3 flex flex-shrink-0 items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border-2 border-[#00AEEF] bg-[#000000] px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition duration-300 hover:border-[#FFFFFF]"
        >
          ← Back to Org Tree
        </Link>
        <p className="text-xs uppercase tracking-[0.16em] text-[#FFFFFF]">Profile view</p>
      </div>

      <section className="glass-panel flex min-h-0 flex-1 flex-col rounded-2xl p-3 md:p-3.5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[#FFFFFF]">Member Profile</p>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border-2 border-[#00AEEF] bg-[#000000] px-4 py-2 text-sm font-semibold text-[#00AEEF] transition duration-300 hover:border-[#FFFFFF] hover:text-[#FFFFFF]"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl border-2 border-[#00AEEF] bg-[#000000] px-4 py-2 text-sm font-semibold text-[#00AEEF] transition duration-300 hover:border-[#FFFFFF] hover:text-[#FFFFFF]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border-2 border-[#FFFFFF] bg-[#000000] px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition duration-300 hover:border-[#00AEEF]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#00AEEF]">Editing mode enabled</p>
        ) : null}

        <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">

        <form
          id="member-profile-form"
          className="rounded-2xl border border-[#2a3238] bg-[#0f1114]"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <div className="grid grid-cols-1 gap-3 border-b border-[#2a3238] p-3 md:grid-cols-[auto_1fr_auto] md:items-start">
            <div className="h-14 w-14 overflow-hidden rounded-xl border border-[#00AEEF] bg-[#000000]">
              {primaryImage ? <img src={primaryImage} alt="Profile" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[#00AEEF]">No image</div>}
            </div>

            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => setValue("fullName", event.target.value)}
                  className="w-full rounded-lg border border-[#00AEEF] bg-[#000000] px-2 py-1 text-lg font-bold text-[#FFFFFF] outline-none"
                />
              ) : (
                <h1 className="text-lg font-bold text-[#FFFFFF]">{formData?.fullName || profile.name}</h1>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(event) => setValue("jobTitle", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#00AEEF] bg-[#000000] px-2 py-1 text-base font-semibold text-[#00AEEF] outline-none"
                />
              ) : (
                <p className="mt-1 text-base font-semibold text-[#00AEEF]">{formData?.jobTitle || profile.role}</p>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={formData.team}
                  onChange={(event) => setValue("team", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#00AEEF] bg-[#000000] px-2 py-1 text-sm text-[#dbe6f3] outline-none"
                />
              ) : (
                <p className="mt-1 text-sm text-[#dbe6f3]">{formData?.team || "Founder Office"}</p>
              )}
            </div>

            <div className="h-14 w-14 overflow-hidden rounded-xl border border-[#00AEEF] bg-[#000000] md:justify-self-end">
              {secondaryImage ? <img src={secondaryImage} alt="Secondary" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-[#00AEEF]">No image</div>}
            </div>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 gap-3 border-b border-[#2a3238] p-3 md:grid-cols-2">
              <div>
                <input
                  ref={primaryFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePrimaryImageFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => primaryFileInputRef.current?.click()}
                  className="w-full rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2 text-left text-sm font-semibold text-[#00AEEF] transition duration-300 hover:border-[#FFFFFF] hover:text-[#FFFFFF]"
                >
                  Choose first image from file manager
                </button>
                <p className="mt-2 truncate text-xs text-[#dbe6f3]">
                  {primaryFileLabel || formData.profileImageUrl || "No file selected"}
                </p>
              </div>
              <input
                type="text"
                value={formData.secondaryImageUrl}
                onChange={(event) => setValue("secondaryImageUrl", event.target.value)}
                placeholder="Secondary image URL"
                className="w-full rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2 text-sm text-[#FFFFFF] outline-none"
              />
            </div>
          ) : null}

          <div className="p-3">
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              {[
                { label: "Location", key: "location" },
                { label: "Contact details", key: "contactNumber" },
                { label: "Date of joining", key: "dateOfJoining" },
                { label: "Time zone shift", key: "timeZone" },
              ].map((field) => (
                <div key={field.key} className="flex items-center gap-2">
                  <span className="font-semibold text-[#FFFFFF]">{field.label}:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData[field.key]}
                      onChange={(event) => setValue(field.key, event.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-[#00AEEF] bg-[#000000] px-2 py-1 text-[#dbe6f3] outline-none"
                    />
                  ) : (
                    <span className="text-[#dbe6f3]">{formData?.[field.key] || "-"}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {savedMessage ? <p className="px-4 pb-4 text-sm font-semibold text-[#FFFFFF]">{savedMessage}</p> : null}
        </form>

        <div className="rounded-xl border border-[#00AEEF] bg-[#000000] p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[#FFFFFF]">Key Skills</p>
          {isEditing ? (
            <textarea
              rows={2}
              value={formData.keySkillsExpertise}
              onChange={(event) => setValue("keySkillsExpertise", event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2 text-sm text-[#FFFFFF] outline-none"
            />
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.length ? skills.map((skill) => (
                <span key={skill} className="rounded-lg border border-[#00AEEF] bg-[#000000] px-3 py-1.5 text-sm font-semibold text-[#FFFFFF]">{skill}</span>
              )) : <p className="text-sm text-[#FFFFFF]">No skills listed.</p>}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#00AEEF] bg-[#000000] p-3">
          <h2 className="text-lg font-semibold text-[#4d7fc2]">Technical Development Skills</h2>
          <div className="mt-3 max-h-[24dvh] space-y-3 overflow-y-auto pr-1 text-sm md:max-h-[28dvh]">
            {technicalRows.map((item) => (
              <div key={item.key} className="flex items-start gap-2">
                <span className="mt-1 text-[#FFFFFF]">•</span>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-[#FFFFFF]">{item.label}: </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData[item.key]}
                      onChange={(event) => setValue(item.key, event.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#00AEEF] bg-[#000000] px-2 py-1 text-[#dbe6f3] outline-none"
                    />
                  ) : (
                    <span className="text-[#dbe6f3]">{formData?.[item.key] || "-"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#00AEEF] bg-[#000000] p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[#FFFFFF]">Short professional introduction / bio</p>
          {isEditing ? (
            <textarea
              rows={5}
              value={formData.professionalIntroduction}
              onChange={(event) => setValue("professionalIntroduction", event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2 text-sm text-[#FFFFFF] outline-none"
            />
          ) : (
            <p className="mt-2 text-sm leading-7 text-[#FFFFFF]">{formData?.professionalIntroduction || "No introduction added yet."}</p>
          )}
        </div>

        <div className="rounded-xl border border-[#00AEEF] bg-[#000000] p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-[#FFFFFF]">Social Links</p>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            {[
              { key: "linkedin", label: "LinkedIn" },
              { key: "github", label: "GitHub" },
              { key: "portfolio", label: "Portfolio" },
            ].map((item) => (
              <div key={item.key}>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData[item.key]}
                    onChange={(event) => setValue(item.key, event.target.value)}
                    placeholder={`${item.label} URL`}
                    className="w-full rounded-xl border border-[#00AEEF] bg-[#000000] px-3 py-2 text-sm text-[#FFFFFF] outline-none"
                  />
                ) : formData?.[item.key] ? (
                  <a
                    href={formData[item.key]}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-[#00AEEF] bg-[#000000] px-3 py-2 text-sm font-medium text-[#FFFFFF] transition duration-300 hover:border-[#FFFFFF]"
                  >
                    {item.label}
                  </a>
                ) : (
                  <p className="text-sm text-[#FFFFFF]">{item.label}: Not provided</p>
                )}
              </div>
            ))}
          </div>
        </div>

        </div>

      </section>
    </motion.main>
  );
}

export default ProfilePage;
