const normalize = (value) => String(value || "").trim().toLowerCase();

const createMemberId = (name) => {
  const base = normalize(name).replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${base || "member"}-${Date.now().toString(36)}`;
};

export const getTeamOptions = (orgData) => orgData.techLead.teams.map((team) => team.name);

const withProfileDefaults = (person, fallbackTeam = "") => ({
  ...person,
  fullName: person.fullName || person.name || "",
  jobTitle: person.jobTitle || person.role || "",
  team: person.team || fallbackTeam || "Founder Office",
  location: person.location || "Remote",
  contactNumber: person.contactNumber || person.phone || "",
  dateOfJoining: person.dateOfJoining || person.doj || "",
  timeZone: person.timeZone || person.timezone || "Full Time",
  bio:
    person.bio ||
    "Focused on delivering reliable execution, team collaboration, and measurable outcomes.",
  professionalIntroduction:
    person.professionalIntroduction ||
    person.bio ||
    "Focused on delivering reliable execution, team collaboration, and measurable outcomes.",
  keySkillsExpertise:
    person.keySkillsExpertise ||
    (person.skills && person.skills.length
      ? person.skills.join(", ")
      : "Execution, Collaboration, Problem Solving"),
  experience: person.experience || "3+ years",
  profileImageUrl: person.profileImageUrl || person.image || "",
  secondaryImageUrl: person.secondaryImageUrl || person.secondaryImage || "",
  secondaryImage: person.secondaryImage || person.secondaryImageUrl || "",
  phone: person.phone || "",
  skills: person.skills || [],
  github: person.github || "",
  portfolio: person.portfolio || "",
  tags: person.tags || [],
  programmingSkills:
    person.programmingSkills ||
    "Java, Python, JavaScript",
  frameworkSkills:
    person.frameworkSkills ||
    "Spring Boot, React, Node.js",
  databaseSkills:
    person.databaseSkills ||
    "MySQL, MongoDB",
  toolsPlatforms:
    person.toolsPlatforms ||
    "Git, Docker, Kubernetes",
  cloudPlatforms:
    person.cloudPlatforms ||
    "AWS, Azure, GCP",
  apiMicroservices:
    person.apiMicroservices ||
    "API Development & Microservices Architecture",
  devopsPipelines:
    person.devopsPipelines ||
    "DevOps & CI/CD Pipelines",
});

const collectMemberTree = (member, teamName) => {
  const base = withProfileDefaults(member, teamName);
  const reports = (member.reports || []).flatMap((report) => collectMemberTree(report, teamName));
  return [base, ...reports];
};

const patchMemberTree = (member, updateIfMatch) => {
  const patched = updateIfMatch(member);
  const reports = (patched.reports || []).map((report) => patchMemberTree(report, updateIfMatch));
  return reports.length ? { ...patched, reports } : patched;
};

const collectMemberIds = (member) => {
  const ids = [member.id];
  (member.reports || []).forEach((report) => {
    ids.push(...collectMemberIds(report));
  });
  return ids;
};

const applyProfilePatch = (person, updates) => {
  const normalized = {
    ...person,
    ...updates,
  };

  return {
    ...normalized,
    name: updates.fullName ?? updates.name ?? normalized.name,
    fullName: updates.fullName ?? normalized.fullName ?? normalized.name,
    role: updates.jobTitle ?? updates.role ?? normalized.role,
    jobTitle: updates.jobTitle ?? normalized.jobTitle ?? normalized.role,
    image: updates.profileImageUrl ?? updates.image ?? normalized.image,
    profileImageUrl: updates.profileImageUrl ?? normalized.profileImageUrl ?? normalized.image,
    secondaryImage: updates.secondaryImageUrl ?? updates.secondaryImage ?? normalized.secondaryImage,
    secondaryImageUrl: updates.secondaryImageUrl ?? normalized.secondaryImageUrl ?? normalized.secondaryImage,
    phone: updates.contactNumber ?? updates.phone ?? normalized.phone,
    contactNumber: updates.contactNumber ?? normalized.contactNumber ?? normalized.phone,
    timezone: updates.timeZone ?? updates.timezone ?? normalized.timezone,
    timeZone: updates.timeZone ?? normalized.timeZone ?? normalized.timezone,
    doj: updates.dateOfJoining ?? updates.doj ?? normalized.doj,
    dateOfJoining: updates.dateOfJoining ?? normalized.dateOfJoining ?? normalized.doj,
    bio:
      updates.professionalIntroduction ??
      updates.bio ??
      normalized.bio,
    professionalIntroduction:
      updates.professionalIntroduction ??
      normalized.professionalIntroduction ??
      normalized.bio,
    keySkillsExpertise:
      updates.keySkillsExpertise ??
      normalized.keySkillsExpertise ??
      (normalized.skills || []).join(", "),
    programmingSkills:
      updates.programmingSkills ??
      normalized.programmingSkills,
    frameworkSkills:
      updates.frameworkSkills ??
      normalized.frameworkSkills,
    databaseSkills:
      updates.databaseSkills ??
      normalized.databaseSkills,
    toolsPlatforms:
      updates.toolsPlatforms ??
      normalized.toolsPlatforms,
    cloudPlatforms:
      updates.cloudPlatforms ??
      normalized.cloudPlatforms,
    apiMicroservices:
      updates.apiMicroservices ??
      normalized.apiMicroservices,
    devopsPipelines:
      updates.devopsPipelines ??
      normalized.devopsPipelines,
  };
};

export const flattenPeople = (orgData) => {
  const founders = orgData.founders.map((founder) => withProfileDefaults(founder, "Founders"));
  const techLead = [withProfileDefaults(orgData.techLead, "Technology Leadership")];
  const sideNode = orgData.techLead?.standaloneRightNode || orgData.techLead?.rightSideNode;
  const standaloneRightNode = sideNode
    ? [withProfileDefaults(sideNode, "Technology Leadership")]
    : [];
  const teamPeople = orgData.techLead.teams.flatMap((team) => {
    const lead = withProfileDefaults(team.teamLead, team.name);
    const members = team.members.flatMap((member) => collectMemberTree(member, team.name));
    return [lead, ...members];
  });

  return [...founders, ...techLead, ...standaloneRightNode, ...teamPeople];
};

export const getPersonById = (orgData, id) => flattenPeople(orgData).find((person) => person.id === id) || null;

export const updatePersonProfile = (orgData, id, updates) => {
  const updateIfMatch = (person) => (person.id === id ? applyProfilePatch(person, updates) : person);
  const sideNode = orgData.techLead.standaloneRightNode || orgData.techLead.rightSideNode;
  const updatedSideNode = sideNode ? updateIfMatch(sideNode) : sideNode;

  return {
    ...orgData,
    founders: orgData.founders.map(updateIfMatch),
    techLead: {
      ...updateIfMatch(orgData.techLead),
      standaloneRightNode: updatedSideNode,
      rightSideNode: updatedSideNode,
      teams: orgData.techLead.teams.map((team) => ({
        ...team,
        teamLead: updateIfMatch(team.teamLead),
        members: team.members.map((member) => patchMemberTree(member, updateIfMatch)),
      })),
    },
  };
};

export const getInitialCollapsedMap = (orgData) => {
  const state = {};
  orgData.techLead.teams.forEach((team) => {
    state[team.name] = false;
  });
  return state;
};

export const addMember = (orgData, memberInput) => {
  const selectedTeam = normalize(memberInput.team);

  return {
    ...orgData,
    techLead: {
      ...orgData.techLead,
      teams: orgData.techLead.teams.map((team) => {
        if (normalize(team.name) !== selectedTeam) {
          return team;
        }

        const member = {
          id: createMemberId(memberInput.name),
          name: memberInput.name.trim(),
          role: memberInput.role.trim(),
          team: team.name,
          image: memberInput.image?.trim() || "",
          email: memberInput.email?.trim() || "",
          linkedin: memberInput.linkedin?.trim() || "",
          phone: memberInput.phone?.trim() || "",
          skills: [],
          bio: "Recently added team member building impact across delivery, execution, and collaboration.",
          experience: "0-1 years",
          github: "",
          portfolio: "",
          tags: ["New Joiner"],
        };

        return {
          ...team,
          members: [...team.members, member],
        };
      }),
    },
  };
};

export const buildSearchMatches = (orgData, searchTerm) => {
  const term = normalize(searchTerm);
  if (!term) {
    return { personIds: new Set(), teamNames: new Set() };
  }

  const personIds = new Set();
  const teamNames = new Set();

  const checkPerson = (person, teamName = "") => {
    const nameHit = normalize(person.name).includes(term);
    const roleHit = normalize(person.role).includes(term);
    const teamHit = normalize(teamName).includes(term);

    if (nameHit || roleHit || teamHit) {
      personIds.add(person.id);
    }
  };

  orgData.founders.forEach((founder) => checkPerson(founder));
  checkPerson(orgData.techLead);
  const sideNode = orgData.techLead?.standaloneRightNode || orgData.techLead?.rightSideNode;
  if (sideNode) {
    checkPerson(sideNode, sideNode.team);
  }

  orgData.techLead.teams.forEach((team) => {
    const teamHit = normalize(team.name).includes(term);

    if (teamHit) {
      teamNames.add(team.name);
      personIds.add(team.teamLead.id);
      team.members.forEach((member) => {
        collectMemberIds(member).forEach((id) => personIds.add(id));
      });
    }

    checkPerson(team.teamLead, team.name);
    team.members.forEach((member) => {
      collectMemberTree(member, team.name).forEach((person) => checkPerson(person, team.name));
    });
  });

  return { personIds, teamNames };
};
