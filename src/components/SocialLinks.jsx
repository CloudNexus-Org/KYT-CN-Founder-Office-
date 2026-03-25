const links = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
];

function SocialLinks({ profile }) {
  const active = links.filter((item) => profile[item.key]);

  if (!active.length) {
    return <p className="text-sm text-[#FFFFFF]">No social links provided.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {active.map((item) => (
        <a
          key={item.key}
          href={profile[item.key]}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[#00AEEF] bg-[#000000] px-3 py-2 text-sm font-medium text-[#FFFFFF] transition duration-300 hover:border-[#FFFFFF]"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

export default SocialLinks;
