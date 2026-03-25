import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AboutCloudnexusSection from "./components/AboutCloudnexusSection";
import OrgTree from "./components/OrgTree";
import ProfilePage from "./pages/ProfilePage";
import { initialOrgData } from "./data/orgData";
import { buildSearchMatches, getInitialCollapsedMap, updatePersonProfile } from "./utils/treeHelpers";

const ORG_DATA_STORAGE_KEY = "kyt_cn_org_data_v1";

const normalize = (value) => String(value || "").trim().toLowerCase();

const IMAGE_FIELDS = new Set(["image", "profileImageUrl", "secondaryImage", "secondaryImageUrl"]);

const isInlineImageValue = (value) =>
  typeof value === "string" && (value.startsWith("data:") || value.startsWith("blob:"));

const cloneData = (value) => {
  if (typeof window !== "undefined" && typeof window.structuredClone === "function") {
    return window.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const collectInlineImageCandidates = (input) => {
  const candidates = [];

  const visit = (node) => {
    if (Array.isArray(node)) {
      node.forEach((item) => visit(item));
      return;
    }

    if (!node || typeof node !== "object") {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (IMAGE_FIELDS.has(key) && isInlineImageValue(value)) {
        candidates.push({ target: node, key, size: value.length });
      }
      visit(value);
    });
  };

  visit(input);
  return candidates.sort((a, b) => b.size - a.size);
};

const persistOrgData = (data) => {
  const serialized = JSON.stringify(data);
  window.localStorage.setItem(ORG_DATA_STORAGE_KEY, serialized);
};

const persistOrgDataWithFallback = (data) => {
  try {
    persistOrgData(data);
    return;
  } catch (error) {
    const mutableData = cloneData(data);
    const candidates = collectInlineImageCandidates(mutableData);

    for (let index = 0; index < candidates.length; index += 1) {
      candidates[index].target[candidates[index].key] = "";
      try {
        persistOrgData(mutableData);
        console.warn(
          `Storage quota reached. Removed ${index + 1} oversized inline image(s) and preserved remaining data.`,
          error,
        );
        return;
      } catch {
        // Continue removing largest images until persistence succeeds.
      }
    }

    console.warn("Unable to persist org data: storage quota exceeded and no further fallback available.", error);
  }
};

const mergeFounders = (storedFounders = [], initialFounders = []) => {
  const byId = new Set(storedFounders.map((item) => item?.id).filter(Boolean));
  const missingInitial = initialFounders.filter((item) => item?.id && !byId.has(item.id));
  return [...storedFounders, ...missingInitial];
};

const mergeTeamMembers = (storedMembers = [], initialMembers = []) => {
  const byId = new Set(storedMembers.map((item) => item?.id).filter(Boolean));
  const missingInitial = initialMembers.filter((item) => item?.id && !byId.has(item.id));
  return [...storedMembers, ...missingInitial];
};

const mergeTeams = (storedTeams = [], initialTeams = []) => {
  const storedByName = new Map(storedTeams.map((team) => [normalize(team?.name), team]));

  const mergedInitialOrder = initialTeams.map((initialTeam) => {
    const storedTeam = storedByName.get(normalize(initialTeam?.name));
    if (!storedTeam) {
      return initialTeam;
    }

    return {
      ...initialTeam,
      ...storedTeam,
      teamLead: storedTeam.teamLead || initialTeam.teamLead,
      members: mergeTeamMembers(storedTeam.members || [], initialTeam.members || []),
    };
  });

  const initialNames = new Set(initialTeams.map((team) => normalize(team?.name)));
  const additionalStoredTeams = storedTeams.filter(
    (team) => !initialNames.has(normalize(team?.name)),
  );

  return [...mergedInitialOrder, ...additionalStoredTeams];
};

const mergeOrgDataWithInitial = (storedData, initialData) => {
  if (!storedData || typeof storedData !== "object") {
    return initialData;
  }

  return {
    ...initialData,
    ...storedData,
    founders: mergeFounders(storedData.founders || [], initialData.founders || []),
    techLead: {
      ...initialData.techLead,
      ...(storedData.techLead || {}),
      teams: mergeTeams(storedData.techLead?.teams || [], initialData.techLead?.teams || []),
    },
  };
};

const loadOrgDataFromStorage = () => {
  if (typeof window === "undefined") {
    return initialOrgData;
  }

  try {
    const raw = window.localStorage.getItem(ORG_DATA_STORAGE_KEY);
    if (!raw) {
      return initialOrgData;
    }

    const parsed = JSON.parse(raw);
    return mergeOrgDataWithInitial(parsed, initialOrgData);
  } catch {
    window.localStorage.removeItem(ORG_DATA_STORAGE_KEY);
    return initialOrgData;
  }
};

const initialData = loadOrgDataFromStorage();

function App() {
  const [orgData, setOrgData] = useState(initialData);
  const searchTerm = "";
  const [collapsedMap, setCollapsedMap] = useState(getInitialCollapsedMap(initialData));

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    persistOrgDataWithFallback(orgData);
  }, [orgData]);

  const searchMatches = useMemo(() => buildSearchMatches(orgData, searchTerm), [orgData, searchTerm]);

  const toggleTeam = (teamName) => {
    setCollapsedMap((prev) => ({ ...prev, [teamName]: !prev[teamName] }));
  };

  const handleSaveProfile = (id, updates) => {
    setOrgData((prev) => updatePersonProfile(prev, id, updates));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8 md:py-8">
            <header className="mb-6 rounded-2xl bg-[#000000] p-5 md:p-7">
              <div className="flex items-start gap-4 md:gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#00AEEF] bg-[#000000] md:h-20 md:w-20">
                  <img src="/assets/cloudnexus-logo.png" alt="CloudNexus" className="h-9 w-9 md:h-12 md:w-12" />
                </div>
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.24em] text-[#00AEEF] md:text-[0.92rem]">CLOUDNEXUS</p>
                  <h1 className="font-display text-2xl font-bold leading-tight text-[#FFFFFF] md:text-5xl">Know Your Team - CN Founder&apos;s Office</h1>
                  <p className="mt-2 text-sm text-[#FFFFFF] md:text-base">People, roles, and how to connect</p>
                </div>
              </div>
              <div className="mt-5 border-t border-[#00AEEF]" />
            </header>

            <OrgTree
              orgData={orgData}
              collapsedMap={collapsedMap}
              onToggleTeam={toggleTeam}
              searchMatches={searchMatches}
            />

            <AboutCloudnexusSection />
          </div>
        }
      />
      <Route path="/profile/:id" element={<ProfilePage orgData={orgData} onSaveProfile={handleSaveProfile} />} />
    </Routes>
  );
}

export default App;
