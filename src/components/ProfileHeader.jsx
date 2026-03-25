import { useMemo, useState } from "react";
import SkillBadge from "./SkillBadge";

const initialsFromName = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "NA";

const resolveImageSrc = (value) => {
  const src = String(value || "").trim();
  if (!src) {
    return "";
  }
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${src.replace(/^\/+/, "")}`;
};

function ProfileHeader({ profile }) {
  const [imageFailed, setImageFailed] = useState(false);
  const fallback = useMemo(() => initialsFromName(profile.name), [profile.name]);
  const imageSrc = useMemo(() => resolveImageSrc(profile.image || profile.profileImageUrl), [profile.image, profile.profileImageUrl]);

  return (
    <aside className="glass-panel h-fit rounded-2xl p-5 md:p-6">
      <div className="mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#00AEEF] bg-[#000000]">
        {imageSrc && !imageFailed ? (
          <img
            src={imageSrc}
            alt={profile.name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="font-display text-4xl font-semibold text-[#00AEEF]">{fallback}</span>
        )}
      </div>

      <div className="mt-5 text-center md:text-left">
        <h1 className="font-display text-2xl font-bold text-[#FFFFFF]">{profile.name}</h1>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[#00AEEF]">{profile.role}</p>
      </div>

      {!!profile.tags?.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <SkillBadge key={tag} skill={tag} />
          ))}
        </div>
      )}
    </aside>
  );
}

export default ProfileHeader;
