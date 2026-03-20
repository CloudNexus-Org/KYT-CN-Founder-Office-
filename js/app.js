// AI assisted development
/**
 * Know Your Team (CN Founder's Office) — data, search, and render.
 * Groups: Leadership, Technology (Founder's Office), Revenue Operations.
 */

(function () {
  "use strict";

  /** @typedef {{ id: string, group: string, name: string, role: string, department: string, location: string, phone: string, telHref: string, doj: string, timezone: string, skills: string[], bio: string | null, photoUrl: string | null }} Employee */

  /** @type {Employee[]} */
  const EMPLOYEES = [
    {
      id: "kaustubh-singh",
      group: "Leadership",
      name: "Kaustubh Singh",
      role: "Founder & CEO",
      department: "Founder's Office",
      location: "Hyderabad",
      phone: "+91 92010 04208",
      telHref: "tel:+919201004208",
      doj: "08 Dec 2023",
      timezone: "Full-time",
      skills: [],
      bio: null,
      photoUrl: null,
    },
    {
      id: "yash",
      group: "Technology",
      name: "Yash",
      role: "CTO",
      department: "Founder's Office",
      location: "Hyderabad",
      phone: "9098964288",
      telHref: "tel:+919098964288",
      doj: "18 Jan 2025",
      timezone: "Full-time",
      skills: [
        "Technology Strategy & Vision",
        "System Architecture",
        "Data Engineering",
        "Cloud Computing",
        "AI/ML",
        "Leadership",
        "Product Development",
        "Stakeholder Management",
      ],
      bio:
        "Passionate technologist focused on scalable solutions and innovation. Inspired by football mindset—consistency, teamwork, and high performance. Combines strategic thinking with hands-on execution.",
      photoUrl: null,
    },
    {
      id: "shoaib-akhtar",
      group: "Technology",
      name: "Shoaib Akhtar",
      role: "Technical Head",
      department: "Founder's Office",
      location: "Hyderabad",
      phone: "8770569958",
      telHref: "tel:+918770569958",
      doj: "21 Jan 2025",
      timezone: "Full-time",
      skills: ["Data Engineering", "Data Science"],
      bio:
        "Technology leader focused on innovation, learning, and building high-performing teams.",
      photoUrl: null,
    },
    {
      id: "aryan-patel",
      group: "Revenue Operations",
      name: "Aryan Patel",
      role: "RevOps",
      department: "Revenue Operations",
      location: "Hyderabad",
      phone: "+91 6263774189",
      telHref: "tel:+916263774189",
      doj: "20 Jan 2025",
      timezone: "Full-time",
      skills: [
        "Time Management",
        "Problem Solving",
        "Revenue Strategy",
        "Process Optimization",
        "Cross-team Coordination",
      ],
      bio:
        "Focused on solving operational challenges and driving revenue growth through process improvements and performance tracking.",
      photoUrl: null,
    },
    {
      id: "satyam-tiwari",
      group: "Revenue Operations",
      name: "Satyam Tiwari",
      role: "RevOps",
      department: "Founder's Office",
      location: "Hyderabad",
      phone: "8305412608",
      telHref: "tel:+918305412608",
      doj: "21 Jul 2025",
      timezone: "Full-time",
      skills: ["RevOps", "Data Analysis", "Pipeline Management", "Process Optimization"],
      bio:
        "Driven RevOps professional aligning teams and leveraging data for scalable growth.",
      photoUrl: null,
    },
  ];

  const GROUP_ORDER = ["Leadership", "Technology", "Revenue Operations"];

  const root = document.getElementById("directory-root");
  const searchInput = document.getElementById("search-input");
  const searchStatus = document.getElementById("search-status");

  /**
   * Placeholder avatar (initials) — no external photo required.
   * @param {string} name
   * @returns {string}
   */
  function avatarUrl(name) {
    const enc = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/initials/svg?seed=${enc}&fontFamily=sans-serif&fontSize=42&backgroundType=gradientLinear`;
  }

  /**
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * @param {Employee} emp
   * @returns {string} lowercase haystack for search
   */
  function searchHaystack(emp) {
    const skillText = emp.skills.join(" ");
    return [emp.name, emp.role, emp.department, emp.location, skillText].join(" ").toLowerCase();
  }

  /**
   * @param {Employee[]} list
   * @param {string} query
   * @returns {Employee[]}
   */
  function filterEmployees(list, query) {
    const q = query.trim().toLowerCase();
    if (!q) return list.slice();
    return list.filter((e) => searchHaystack(e).includes(q));
  }

  /**
   * @param {Employee[]} list
   * @returns {Map<string, Employee[]>}
   */
  function groupByGroup(list) {
    const map = new Map();
    for (const g of GROUP_ORDER) map.set(g, []);
    for (const emp of list) {
      const arr = map.get(emp.group);
      if (arr) arr.push(emp);
    }
    return map;
  }

  /**
   * @param {Employee} emp
   * @returns {string}
   */
  function cardHtml(emp) {
    const imgSrc = emp.photoUrl || avatarUrl(emp.name);
    const skillsHtml =
      emp.skills.length > 0
        ? `<ul class="employee-card__tags" aria-label="Key skills">
            ${emp.skills
              .map((s) => `<li class="employee-card__tag">${escapeHtml(s)}</li>`)
              .join("")}
           </ul>`
        : `<ul class="employee-card__tags" aria-label="Key skills">
            <li class="employee-card__tag employee-card__tag--muted">Not listed</li>
           </ul>`;

    const bioHtml = emp.bio
      ? `<p class="employee-card__bio">${escapeHtml(emp.bio)}</p>`
      : `<p class="employee-card__bio employee-card__bio--placeholder">Professional introduction not provided yet.</p>`;

    return `
      <article class="employee-card" data-employee-id="${escapeHtml(emp.id)}">
        <div class="employee-card__top">
          <div class="employee-card__photo-wrap">
            <img
              class="employee-card__photo"
              src="${escapeHtml(imgSrc)}"
              alt=""
              width="88"
              height="88"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="employee-card__identity">
            <h2 class="employee-card__name">${escapeHtml(emp.name)}</h2>
            <p class="employee-card__role">${escapeHtml(emp.role)}</p>
            <p class="employee-card__dept">${escapeHtml(emp.department)}</p>
          </div>
        </div>
        <div class="employee-card__body">
          <div class="employee-card__meta">
            <div class="employee-card__meta-row">
              <span class="employee-card__meta-label">Location</span>
              <span>${escapeHtml(emp.location)}</span>
            </div>
            <div class="employee-card__meta-row">
              <span class="employee-card__meta-label">Contact</span>
              <a href="${escapeHtml(emp.telHref)}">${escapeHtml(emp.phone)}</a>
            </div>
            <div class="employee-card__meta-row">
              <span class="employee-card__meta-label">Date of joining</span>
              <span>${escapeHtml(emp.doj)}</span>
            </div>
            <div class="employee-card__meta-row">
              <span class="employee-card__meta-label">Time zone</span>
              <span>${escapeHtml(emp.timezone)}</span>
            </div>
          </div>
          <div>
            <p class="employee-card__skills-title">Key skills</p>
            ${skillsHtml}
          </div>
          <div>
            <p class="employee-card__skills-title">Introduction</p>
            ${bioHtml}
          </div>
        </div>
      </article>
    `;
  }

  /**
   * @param {Employee[]} filtered
   */
  function render(filtered) {
    if (!root) return;

    if (filtered.length === 0) {
      root.innerHTML = `
        <div class="empty-state" role="status">
          <strong>No matches</strong>
          Try another name, role, department, or skill keyword.
        </div>
      `;
      return;
    }

    const grouped = groupByGroup(filtered);
    const sections = [];

    for (const groupName of GROUP_ORDER) {
      const members = grouped.get(groupName) || [];
      if (members.length === 0) continue;
      sections.push(`
        <section class="directory-section" aria-labelledby="section-${slug(groupName)}">
          <div class="section-heading">
            <h2 class="section-heading__title" id="section-${slug(groupName)}">${escapeHtml(groupName)}</h2>
            <span class="section-heading__count">${members.length} ${members.length === 1 ? "person" : "people"}</span>
          </div>
          <div class="card-grid">
            ${members.map((e) => cardHtml(e)).join("")}
          </div>
        </section>
      `);
    }

    root.innerHTML = sections.join("");
  }

  /**
   * @param {string} s
   */
  function slug(s) {
    return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  /**
   * @param {Employee[]} filtered
   * @param {string} query
   */
  function updateStatus(filtered, query) {
    if (!searchStatus) return;
    const total = EMPLOYEES.length;
    if (!query.trim()) {
      searchStatus.textContent = `Showing all ${total} CloudNexus team members.`;
      return;
    }
    if (filtered.length === 0) {
      searchStatus.textContent = `No results for “${query.trim()}”.`;
      return;
    }
    searchStatus.textContent = `Showing ${filtered.length} of ${total} matching “${query.trim()}”.`;
  }

  function init() {
    const run = () => {
      const q = searchInput ? searchInput.value : "";
      const filtered = filterEmployees(EMPLOYEES, q);
      render(filtered);
      updateStatus(filtered, q);
      if (root) root.setAttribute("aria-busy", "false");
    };

    run();

    if (searchInput) {
      searchInput.addEventListener("input", run);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
