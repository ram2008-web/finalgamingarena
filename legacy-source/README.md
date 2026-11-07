# Arena Elite — Modular Build

This is the same Arena Elite site (public platform + Enterprise Admin Portal)
you had as one big HTML file, split into a normal multi-file front-end
project: one `index.html` shell, CSS broken out by concern, and JavaScript
broken out module-by-module.

**Nothing was rewritten.** Every file below was produced by mechanically
slicing the original file at its existing section comments, then verified
by re-joining all the pieces and comparing the result to the original
**byte-for-byte**. The split is guaranteed behavior-identical.

## How to run it

Just open **[`index.html`](./index.html)** in Chrome or Edge. No build step,
no server, no npm install. Everything loads via plain `<link>` and
`<script src>` tags.

> **Why isn't the HTML itself split into per-page files too?**
> Browsers can't `fetch()` or `import` local files across `file://` URLs —
> Chrome blocks it as a cross-origin request even for files sitting right
> next to each other. That only works if the site is served over `http://`
> (e.g. via `npx serve` or VS Code's Live Server). Since the brief was
> "must open directly by double-clicking it," the view markup (nav +
> every page section + modals) stays in one `index.html` shell — that part
> of the ask and the "no server" ask are mutually exclusive, so this favors
> the one that was stated as a hard requirement. CSS and JS don't have that
> restriction, so those are fully split and load as real separate files.

## Folder structure

```
arena-elite-admin/
├── index.html                        — app shell: <head>, nav, every view section, every modal
├── README.md                         — this file
├── CHANGES.md                        — what the Admin Portal added, diff-style
├── css/
│   ├── 01-tokens-base.css            — CSS variables, reset, base typography
│   ├── 02-buttons-badges.css         — buttons, badges, small UI atoms
│   ├── 03-nav-hero.css               — top nav bar + hero section
│   ├── 04-cards-tables.css           — cards, data tables, public view layout
│   ├── 05-admin-portal.css           — admin sidebar, admin cards/tables
│   └── 06-premium-overrides.css      — final visual-polish layer
└── js/
    ├── 01-state.js                   — state object + seed/demo data
    ├── 02-router.js                  — switchView() / view routing
    ├── 03-views-public.js            — home, tournaments, matches, leaderboard, teams, players, community, login
    ├── 04-organizer.js               — Organizer Dashboard
    ├── 05-admin-auth.js              — admin login gate, auth-tab switching
    ├── admin/
    │   ├── 00-admin-shell.js         — sidebar routing, panel switcher, quick actions, global search
    │   ├── 01-dashboard.js           — Admin Dashboard (stats + charts + audit stream)
    │   ├── 02-players.js             — Player Management
    │   ├── 03-teams.js               — Team Management
    │   ├── 04-tournaments.js         — Tournament Management
    │   ├── 05-registrations.js       — Registration approvals
    │   ├── 06-matches.js             — Match Management
    │   ├── 07-leaderboard.js         — Leaderboard Management
    │   ├── 08-moderation.js          — Community Moderation
    │   ├── 09-reports.js             — Reports & Safety
    │   ├── 10-announcements.js       — Announcement Center
    │   ├── 11-analytics.js           — Admin Analytics charts
    │   ├── 12-auditlogs.js           — Audit Logs
    │   └── 13-settings.js            — Admin Settings + global search helper
    ├── 06-shared-handlers.js         — handlers shared by public site + admin (e.g. Create Tournament)
    ├── 07-main-init.js               — defines and calls init()
    └── 08-micro-interactions.js      — scroll-reveal / pointer-glow layer
```

Every path above is a real file — click through from this list, or open
them directly from the `css/` and `js/` folders.

## Load order matters

These are classic `<script>` tags (not ES modules — modules also get
blocked by the same `file://` CORS rule above), so they share one global
scope and **must load in the order listed in `index.html`**, which mirrors
the original file's top-to-bottom order exactly:

`state → router → public views → organizer → admin auth → the 14 admin
panel files → shared handlers → main init → micro-interactions`

If you reorder the `<script>` tags, things defined later (e.g. `state`)
won't exist yet for code that runs earlier, and you'll get
`ReferenceError`s in the console. Leave the order as-is unless you're
deliberately restructuring.

## Editing tips

- A CSS tweak to, say, the admin sidebar → `css/05-admin-portal.css` only.
- A bug in the Players panel → `js/admin/02-players.js` only.
- Adding a brand-new admin panel → duplicate one of the `js/admin/*.js`
  files as a pattern, add its `<script src>` line in `index.html` in the
  same position, and add its sidebar `<a data-adminpanel="...">` entry in
  `index.html`.
