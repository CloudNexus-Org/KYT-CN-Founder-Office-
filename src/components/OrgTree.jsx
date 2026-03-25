import FounderNode from "./FounderNode";
import NodeCard from "./NodeCard";

const TARGET_COUNTS = {
  catalyst: 2,
  ariba: 15,
  beyonders: 7,
};

const collectWithReports = (person) => [
  person,
  ...((person?.reports || []).flatMap((report) => collectWithReports(report))),
];

const uniqueById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
};

const resolveTargetCount = (teamName = "") => {
  const value = String(teamName).toLowerCase();
  if (value.includes("catalyst")) {
    return TARGET_COUNTS.catalyst;
  }
  if (value.includes("ariba")) {
    return TARGET_COUNTS.ariba;
  }
  if (value.includes("beyonders")) {
    return TARGET_COUNTS.beyonders;
  }
  return 0;
};

const buildReferenceBranches = (teams = []) => {
  const preferredNames = ["catalyst", "ariba", "beyonders"];

  const preferredTeams = preferredNames
    .map((namePart) => teams.find((team) => String(team?.name || "").toLowerCase().includes(namePart)))
    .filter(Boolean);

  const fallbackTeams = teams.filter(
    (team) => !preferredTeams.some((preferred) => preferred.name === team.name),
  );

  const selectedTeams = [...preferredTeams, ...fallbackTeams].slice(0, 3);

  return selectedTeams.map((team) => {
    const targetCount = resolveTargetCount(team.name);
    const teamPool = uniqueById([
      team.teamLead,
      ...(team.members || []).flatMap((member) => collectWithReports(member)),
    ]);

    return {
      title: team.name,
      cards: teamPool.slice(0, targetCount),
    };
  });
};

const getSectionWidthClass = (teamName = "") => {
  const value = String(teamName).toLowerCase();
  if (value.includes("ariba")) {
    return "w-full lg:w-[46%]";
  }
  if (value.includes("beyonders")) {
    return "w-full lg:w-[34%]";
  }
  return "w-full lg:w-[20%]";
};

const getSectionInnerWidthClass = (teamName = "") => {
  const value = String(teamName).toLowerCase();
  if (value.includes("ariba")) {
    return "max-w-[720px]";
  }
  if (value.includes("beyonders")) {
    return "max-w-[550px]";
  }
  return "max-w-[400px]";
};

const isAribaBranch = (teamName = "") =>
  String(teamName).toLowerCase().includes("ariba");

const isBeyondersBranch = (teamName = "") =>
  String(teamName).toLowerCase().includes("beyonders");

const getBranchGridClass = (teamName = "") => {
  if (isAribaBranch(teamName)) {
    return "grid w-full grid-cols-1 gap-6 justify-items-center md:grid-cols-2 lg:grid-cols-3";
  }
  if (isBeyondersBranch(teamName)) {
    return "grid w-full content-start justify-center justify-items-center gap-6 [grid-template-columns:repeat(2,minmax(150px,150px))]";
  }
  return "grid w-full content-start justify-center justify-items-center gap-3 sm:gap-4 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]";
};

function OrgTree({ orgData, collapsedMap, onToggleTeam, searchMatches }) {
  const topFounder = orgData.founders?.[0] || null;
  const secondFounder = orgData.founders?.[1] || null;
  const middleNode = orgData.techLead || null;
  const rightSideNode = orgData.techLead?.standaloneRightNode || orgData.techLead?.rightSideNode || null;
  const referenceBranches = buildReferenceBranches(orgData.techLead?.teams || []);

  if (!topFounder) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] overflow-hidden py-2">
      <section className="mx-auto mt-4 max-w-[172px]">
        <div className="mx-auto">
          <FounderNode person={topFounder} highlighted={searchMatches.personIds.has(topFounder.id)} />
        </div>
      </section>

      {secondFounder ? (
        <>
          <div className="mx-auto mt-3 h-10 w-px bg-[#00AEEF]" />
          <section className="mx-auto max-w-[172px]">
            <div>
              <FounderNode person={secondFounder} highlighted={searchMatches.personIds.has(secondFounder.id)} />
            </div>
          </section>

          {middleNode ? (
            <>
              {rightSideNode ? (
                <>
                  <div className="relative mx-auto mt-3 h-12 w-full max-w-[900px]">
                    <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-[#00AEEF]" />
                    <div className="absolute left-1/2 top-4 h-px w-[33.33%] bg-[#00AEEF]" />
                    <div className="absolute left-1/2 top-4 h-8 w-px -translate-x-1/2 bg-[#00AEEF]" />
                    <div className="absolute left-[83.33%] top-4 h-8 w-px -translate-x-1/2 bg-[#00AEEF]" />
                  </div>

                  <section className="mx-auto grid w-full max-w-[900px] grid-cols-3">
                    <div className="col-start-2 justify-self-center">
                      <FounderNode person={middleNode} highlighted={searchMatches.personIds.has(middleNode.id)} />
                    </div>
                    <div className="col-start-3 justify-self-center">
                      <NodeCard person={rightSideNode} highlighted={searchMatches.personIds.has(rightSideNode.id)} />
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <div className="mx-auto mt-3 h-8 w-px bg-[#00AEEF]" />
                  <section className="mx-auto max-w-[172px]">
                    <div>
                      <FounderNode person={middleNode} highlighted={searchMatches.personIds.has(middleNode.id)} />
                    </div>
                  </section>
                </>
              )}

              {referenceBranches.length ? (
                <>
                  <div className="mx-auto mt-3 h-6 w-px bg-[#00AEEF]" />
                  <div className="relative mx-auto h-8 w-full max-w-[1200px]">
                    <div className="absolute left-1/2 top-0 h-px w-[86%] -translate-x-1/2 bg-[#00AEEF]" />
                    <div className="absolute left-[16.67%] top-0 h-8 w-px -translate-x-1/2 bg-[#00AEEF]" />
                    <div className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-[#00AEEF]" />
                    <div className="absolute left-[83.33%] top-0 h-8 w-px -translate-x-1/2 bg-[#00AEEF]" />
                  </div>

                  <section className="mt-2 flex flex-col lg:flex-row w-full gap-8 px-6">
                    {referenceBranches.map((branch) => (
                      <div key={branch.title} className={[getSectionWidthClass(branch.title), "flex justify-center"].join(" ")}>
                        <div
                          className={[
                            getSectionInnerWidthClass(branch.title),
                            "flex h-full w-full min-w-0 flex-col items-center justify-start rounded-2xl border border-[#00AEEF] bg-[rgba(0,174,239,0.06)] p-4 shadow-[0_0_24px_rgba(0,174,239,0.08)]",
                          ].join(" ")}
                        >
                          <div className={getBranchGridClass(branch.title)}>
                            {branch.cards.map((person) => (
                              <div
                                key={person.id}
                                className={isAribaBranch(branch.title) || isBeyondersBranch(branch.title) ? "w-[150px] max-w-[152px] flex-shrink-0" : ""}
                              >
                                <NodeCard
                                  person={person}
                                  highlighted={searchMatches.personIds.has(person.id)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </section>
                </>
              ) : null}
            </>
          ) : null}
        </>
      ) : null}
    </main>
  );
}

export default OrgTree;
