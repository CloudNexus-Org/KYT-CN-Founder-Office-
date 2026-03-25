import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import MemberCard from "./MemberCard";
import TeamLeadCard from "./TeamLeadCard";

const teamSubtitleMap = {
  "Catalyst (RevOps)": "RevOps",
  Ariba: "Product Engineering",
  Beyonders: "AI Lab",
  Eternals: "Platform",
  Sentinels: "Security & QA",
};

function TeamSection({ team, collapsed, onToggle, matches }) {
  const subtitle = teamSubtitleMap[team.name] || "Team";
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="glass-panel relative flex h-full min-h-[560px] flex-col rounded-2xl p-3.5"
    >
      <div className="absolute left-1/2 -top-6 hidden h-6 w-px -translate-x-1/2 bg-[#00AEEF] xl:block" />
      <button
        onClick={() => onToggle(team.name)}
        className="flex min-h-[82px] w-full items-start justify-between gap-3 px-1 pb-2 text-left"
      >
        <span className="block min-h-[68px]">
          <span className="block min-h-[48px] font-display text-2xl font-semibold leading-tight text-[#FFFFFF]">{team.name}</span>
          <span className="mt-0.5 block text-xs text-[#FFFFFF]">{subtitle}</span>
        </span>
        <span
          className={[
            "pt-1 text-xs font-semibold text-[#00AEEF] transition-transform duration-300",
            collapsed ? "rotate-180" : "rotate-0",
          ].join(" ")}
        >
          {collapsed ? "Expand" : "Collapse"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="open"
            initial={shouldReduceMotion ? false : { height: 0 }}
            animate={shouldReduceMotion ? {} : { height: "auto" }}
            exit={shouldReduceMotion ? {} : { height: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFFFFF]">Team Lead</p>
            <div className="mx-auto my-2 h-5 w-px bg-[#00AEEF]" />
            <div className="min-h-[112px]">
              <TeamLeadCard person={team.teamLead} highlighted={matches.personIds.has(team.teamLead.id)} />
            </div>
            <p className="mt-3 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFFFFF]">Members</p>
            <div className="mt-2 space-y-3 overflow-y-auto pr-1 column-scroll max-h-[348px]">
              {team.members.map((member) => (
                <MemberCard key={member.id} member={member} highlighted={matches.personIds.has(member.id)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default TeamSection;
