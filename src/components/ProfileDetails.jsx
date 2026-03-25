import SkillBadge from "./SkillBadge";
import SocialLinks from "./SocialLinks";

function ProfileDetails({ profile }) {
  const rows = [
    { label: "Full Name", value: profile.name },
    { label: "Role / Position", value: profile.role },
    { label: "Team Name", value: profile.team || "Founder Office" },
    { label: "Experience", value: profile.experience || "Not provided" },
    { label: "Email", value: profile.email || "Not provided" },
    { label: "Phone", value: profile.phone || "Not provided" },
  ];

  return (
    <section className="glass-panel rounded-2xl p-5 md:p-6">
      <h2 className="font-display text-xl font-bold text-[#FFFFFF]">Profile Details</h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-[#00AEEF] bg-[#000000] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-[#FFFFFF]">{row.label}</p>
            <p className="mt-1 text-sm font-semibold text-[#FFFFFF]">{row.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-[#00AEEF] bg-[#000000] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[#FFFFFF]">Bio / Description</p>
        <p className="mt-2 text-sm leading-7 text-[#FFFFFF]">{profile.bio || "No bio added yet."}</p>
      </div>

      <div className="mt-5 rounded-xl border border-[#00AEEF] bg-[#000000] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[#FFFFFF]">Skills</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.skills?.length ? profile.skills.map((skill) => <SkillBadge key={skill} skill={skill} />) : <p className="text-sm text-[#FFFFFF]">No skills listed yet.</p>}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-[#00AEEF] bg-[#000000] p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-[#FFFFFF]">Social Links</p>
        <div className="mt-3">
          <SocialLinks profile={profile} />
        </div>
      </div>
    </section>
  );
}

export default ProfileDetails;
