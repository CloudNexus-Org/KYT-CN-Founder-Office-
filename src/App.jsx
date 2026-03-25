import { useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AboutCloudnexusSection from "./components/AboutCloudnexusSection";
import OrgTree from "./components/OrgTree";
import ProfilePage from "./pages/ProfilePage";
import { initialOrgData } from "./data/orgData";
import { buildSearchMatches, getInitialCollapsedMap, updatePersonProfile } from "./utils/treeHelpers";

function App() {
  const [orgData, setOrgData] = useState(initialOrgData);
  const searchTerm = "";
  const [collapsedMap, setCollapsedMap] = useState(getInitialCollapsedMap(initialOrgData));

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
