import { useMemo } from "react";

const initialsFromName = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "NA";

function OrgNodeCard({
  name,
  role,
  image,
  initials,
  highlighted = false,
  onClick,
  onKeyDown,
}) {
  const hasImage = Boolean(image);
  const fallbackInitials = useMemo(() => initials || initialsFromName(name), [initials, name]);
  const interactive = typeof onClick === "function";

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={["org-node", highlighted ? "org-node--highlighted" : ""].join(" ")}
    >
      <div className="avatar">
        {hasImage ? (
          <img src={image} alt={name} loading="lazy" className="avatar-image" />
        ) : (
          <span className="avatar-initials">
            {fallbackInitials}
          </span>
        )}
      </div>

      <h3 className="name">{name}</h3>
      <p className="role">{role}</p>
    </div>
  );
}

export default OrgNodeCard;
