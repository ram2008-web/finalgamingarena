# Changes — Enterprise Admin Portal

This documents what was **added on top of** the original public Arena
Elite site (Home / Tournaments / Matches / Leaderboards / Teams / Players
/ Community / Organizer Dashboard / Login). Nothing listed below removed
or altered existing public-site behavior — it's additive, shown diff-style.

A note on methodology: this is a structured summary of the admin-specific
sections (identified directly from the code's own section comments and
verified by reading each block), not a machine-generated `git diff` — the
pre-admin-portal file wasn't retained separately to diff against
byte-for-byte. Everything named below is confirmed present in the code.

## Navigation

```diff
  <button id="createTourneyBtn">Create Tournament</button>
  <button id="navLoginBtn">Log in</button>
+ <button id="navAdminBtn" data-view-link="admin" title="Enterprise Admin Portal">Admin</button>
  <button id="avatarBtn">...</button>
```
+ Mobile nav drawer: `Admin Portal` link (gold-accent, shield icon)
+ Hero area: "Access Enterprise Admin Portal →" link

## Access control

```diff
+ state.userRole        // "player" | "organizer" | "admin"
+ state.isAdmin         // false by default
+ state.adminUser       // { name, email, role, avatar }
```
+ New view `data-view="admin"` / `id="view-admin"`, gated behind an admin
  login form (`adminGateEmail` / `adminGatePass`) — a non-admin visiting
  the Admin Portal sees the login gate, not admin content.
+ `ADMIN AUTHENTICATION & ACCESS GATE` module: auth-tab switching, login
  submit handler, "Sign out of Admin Portal" confirmation.

## Admin Dashboard

+ Header: **Admin Control Center** / "Monitor and manage the Arena Elite
  competitive ecosystem."
+ Stat cards computed from live state where the data already existed
  (players, teams, tournaments, live matches, pending registrations,
  reports, prize money) rather than hardcoded.
+ Quick actions: Create Tournament, Manage Players, Review Registrations,
  Publish Announcement, Review Reports, Update Match Result.
+ Audit-stream preview feeding from the same log every other admin action
  writes to.

## New sidebar + 13 management panels

```diff
  <aside class="admin-side" id="adminSideNav">
+   <a data-adminpanel="dashboard">Dashboard</a>
+   <a data-adminpanel="players">Players</a>
+   <a data-adminpanel="teams">Teams</a>
+   <a data-adminpanel="tournaments">Tournaments</a>
+   <a data-adminpanel="registrations">Registrations</a>
+   <a data-adminpanel="matches">Matches</a>
+   <a data-adminpanel="leaderboard">Leaderboard</a>
+   <a data-adminpanel="community">Community Moderation</a>
+   <a data-adminpanel="reports">Reports & Safety</a>
+   <a data-adminpanel="announcements">Announcements</a>
+   <a data-adminpanel="analytics">Analytics</a>
+   <a data-adminpanel="audit">Audit Logs</a>
+   <a data-adminpanel="settings">Settings</a>
  </aside>
```

Each panel is a working, wired-up feature, not a static mock:

| Panel | What actually works |
|---|---|
| Players | search, view profile modal, suspend/activate |
| Teams | filter by game/status, suspend/activate |
| Tournaments | edit modal, approve/pause/cancel, toggle live |
| Registrations | approve / reject / flag, filter chips |
| Matches | start match, edit score modal |
| Leaderboard | recalculate rankings, adjust points modal |
| Community Moderation | hide / approve / delete a post |
| Reports & Safety | resolve a report |
| Announcements | compose + publish, delete |
| Analytics | date-range chips redraw the charts |
| Audit Logs | search, filter, export |
| Settings | save / reset admin-configurable settings |

Every mutating action (`adminApproveReg`, `togglePlayerStatus`,
`toggleTourneyLive`, `hidePost`, `adminScoreMatch`, …) writes an entry to
the shared audit log and calls `toast()` for feedback, reusing the
existing helpers rather than duplicating them.

## CSS

```diff
  /* TOKENS & BASE */
  /* BUTTONS & BADGES */
  /* NAV & HERO */
  /* CARDS & TABLES */
+ /* ADMIN PORTAL STYLES */
  /* PREMIUM ELITE OVERRIDE */
```

New rules for: the admin sidebar and its active/hover states, admin stat
cards, the admin header bar, panel badges/counts, and the admin-specific
table variants — all built on the same `--accent` / spacing / radius
tokens as the rest of the site, not a separate design system.
