# Founder Office Org Tree (React + Tailwind)

A fully dynamic, scalable org chart system with a dark SaaS dashboard aesthetic.

## Stack

- React (Vite)
- Tailwind CSS
- Framer Motion

## Features

- JSON-based single source of truth for founders, tech lead, teams, leads, and members
- Dynamic tree rendering from data
- Add Member form with automatic team assignment
- Search across name, role, and team with node highlighting
- Team-level expand/collapse with smooth animation
- Responsive layout:
  - Desktop: full tree with 5 team columns
  - Tablet: stacked multi-column team layout
  - Mobile: accordion-style team sections
- Avatar fallback initials when images are missing
- Lazy-loaded profile images
- Optional quick links (email / LinkedIn)
- Scrollable member containers in teams

## Folder Structure

src/
- components/
  - AddMemberForm.jsx
  - ConnectorLines.jsx
  - FounderNode.jsx
  - MemberCard.jsx
  - NodeCard.jsx
  - OrgTree.jsx
  - SearchBar.jsx
  - TeamLeadCard.jsx
  - TeamSection.jsx
  - TechLeadNode.jsx
- data/
  - orgData.js
- styles/
  - globals.css
- utils/
  - treeHelpers.js
- App.jsx
- main.jsx

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Data Model Example

```js
{
  founders: [
    { id: "founder-1", name: "Founder 1", role: "CEO", image: "" },
    { id: "founder-2", name: "Founder 2", role: "Co-Founder", image: "" }
  ],
  techLead: {
    id: "tech-lead-1",
    name: "Tech Lead",
    role: "CTO",
    teams: [
      {
        name: "Ariba",
        teamLead: { id: "lead-ariba", name: "TL Name", role: "Team Lead" },
        members: [{ id: "m1", name: "John Doe", role: "Frontend Dev", team: "Ariba" }]
      }
    ]
  }
}
```

## Core Logic

- addMember(orgData, memberInput): auto-routes members to the matching team.
- buildSearchMatches(orgData, searchTerm): returns sets of matching person IDs and team names for UI highlighting.
- getInitialCollapsedMap(orgData): initializes team collapse state.

## Notes

- Existing legacy static files in css/ and js/ are no longer used by the Vite app.
- Team and profile images can be updated in src/data/orgData.js.
