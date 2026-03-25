import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OrgNodeCard from "./OrgNodeCard";

const initialsFromName = (name = "") =>
  String(name)
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

function NodeCard({ person, highlighted = false }) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  const avatarFallback = useMemo(() => initialsFromName(person.name), [person.name]);
  const imageSrc = useMemo(() => resolveImageSrc(person.image || person.profileImageUrl), [person.image, person.profileImageUrl]);
  const hasImage = !!imageSrc && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  const openProfile = () => {
    navigate(`/profile/${person.id}`);
  };

  return (
    <motion.article
      layout
      initial={shouldReduceMotion ? false : { y: 8 }}
      animate={shouldReduceMotion ? {} : { y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 220,
              damping: 22,
              mass: 0.9,
            }
      }
      className="mx-auto"
    >
      <OrgNodeCard
        name={person.name}
        role={person.role}
        image={hasImage ? imageSrc : ""}
        initials={avatarFallback}
        highlighted={highlighted}
        onClick={openProfile}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openProfile();
          }
        }}
      />
    </motion.article>
  );
}

export default NodeCard;
