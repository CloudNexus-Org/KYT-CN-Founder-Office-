function SkillBadge({ skill }) {
  return (
    <span className="rounded-full border border-[#00AEEF] bg-[#000000] px-3 py-1 text-xs font-semibold tracking-wide text-[#FFFFFF] transition duration-300 hover:border-[#FFFFFF] hover:text-[#FFFFFF]">
      {skill}
    </span>
  );
}

export default SkillBadge;
