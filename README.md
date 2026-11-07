# Arena Elite — Project Review 2 (React + Vite)

A modular React + Vite implementation of the uploaded Arena Elite portal. Existing feature areas are represented as distinct modules, with Review 2 requirements added alongside them. The visual direction remains the dark navy / gold Arena Elite theme. The running app uses local CSS and system fonts and does not require remote font, icon, stylesheet, or script URLs.

## Quick start

1. Install Node.js 20.19+ or 22.12+.
2. Open this folder in VS Code.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).

To verify a production build:

```bash
npm run build
npm run preview
```

The deployable website is generated in `dist/`.

## Demo login accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@arenaelite.gg` | `Admin@123` |
| User | `user@arenaelite.gg` | `User@123` |

Open `/#/organizer/login` or choose **Organizer? Open the Organizer portal** on the login screen to sign in or create a separate Organizer account. Public signup creates Player/User accounts only; it cannot assign Admin. Admin and Player login behavior remains available on the standard login screen.

Organizer accounts manage their own tournaments, registrations, matches, results, standings, profile, and password in a dedicated portal. Tournament records carry the creating account's unique ID, and organizer operations scope all reads and changes to that ID. Players can submit a team registration from the public Tournaments list for an accepting tournament.

**Security note:** This is a front-end review/demo authentication flow. Passwords and roles are stored in browser Local Storage and can be inspected or changed by the browser user. Do not use this implementation for real customer accounts or production authorization. A production app needs trusted backend authentication and server-side role checks.

## Modules retained / represented

### Public and user-facing modules
- Home / spectator dashboard
- Tournaments
- Matches / live matches
- Leaderboards
- Teams
- Players
- Community
- Signed-in account/session
- Review 2 Checklist

### Organizer Portal
- Separate Organizer login/signup
- Organizer-only dashboard, tournaments, registration review, matches/results, leaderboard, and profile/settings
- Organizer-scoped ownership checks for tournament records and related data

### Enterprise Admin Portal
- Admin Dashboard
- Players
- Teams
- Tournaments
- Registrations
- Matches
- Leaderboard
- Community Moderation
- Reports & Safety
- Announcements
- Analytics
- Audit Logs
- Settings

Each area is kept in its own small module file under `src/modules/`. Organizer pages are grouped under `src/modules/organizer/`. Shared table rendering and styling live in `src/modules/DataModule.jsx` and `src/styles.css`.

## Local Storage

- `arenaEliteUsersV2`: demo accounts and accounts created from Sign up
- `arenaEliteSessionV2`: current signed-in account
- `arenaEliteReview2Data`: shared tournament data, organizer ownership metadata, registrations, matches, and audit history

Use a fresh browser profile or clear these keys in DevTools → Application → Local Storage to reset the demo data.

## Organizer workflow

1. Start the app and choose **Organizer? Open the Organizer portal** on the login screen.
2. Create an Organizer account, or sign in with that account later through the same Organizer login.
3. Publish a tournament (or save it as a draft) in **Create Tournament**.
4. Sign in as a Player/User and register a team from **Tournaments**.
5. Sign back in as the Organizer to approve/reject teams, schedule matches, record scores, and view the recalculated leaderboard.

For testing role isolation, create two Organizer accounts and verify each sees only the tournaments they created. Admin and User demo credentials above remain unchanged.

**Important limitation:** Authentication, passwords, role checks, and owner scoping run in the browser and use Local Storage. These checks provide demo functionality and UI-level isolation, not production security: users can inspect or alter browser data. Production deployment requires server-backed authentication, authorization on every API/data operation, and protected password storage.

## GitHub instructions

1. Create a new repository on GitHub, for example `arena-elite-review2`.
2. In this project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Prepare Arena Elite Review 2 project"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/arena-elite-review2.git
   git push -u origin main
   ```

3. Replace `YOUR-USERNAME` with your GitHub username. Keep the repository URL ready for review.

## Vercel deployment

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository.
3. Confirm the Vercel project settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Select **Deploy**.
5. Open the generated Vercel URL and test both demo logins, sign-up, navigation, and admin actions.
6. Keep both GitHub and Vercel URLs ready for the review.

## Project structure

```text
arena-elite-review2/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── CHANGES.md
├── public/assets/             # local image/video assets
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── auth.js
│   ├── data.js
│   ├── store.js
│   ├── styles.css
│   ├── components/Auth.jsx
│   └── modules/
│       ├── DataModule.jsx
│       ├── public/             # public-facing feature modules
│       └── admin/              # separate Admin feature modules
└── legacy-source/              # uploaded source files retained for reference
```

## Next steps before review

- [ ] Run `npm install` and `npm run dev`.
- [ ] Test Admin and User demo accounts.
- [ ] Create an Organizer account from `/#/organizer/login` and verify tournament, registration, match, team, and report modules.
- [ ] Create a User account and verify it can sign in again.
- [ ] Check every public module and Admin panel.
- [ ] Run `npm run build`.
- [ ] Push to GitHub.
- [ ] Deploy to Vercel and verify the live URL.
- [ ] Bring the GitHub and Vercel URLs to the review.

## Source note

The upload included the main `index.html`, spectator HTML/CSS/JS, profile/login pages, video/image assets, README and CHANGES notes. The README described a split `css/` and `js/` tree, but those referenced split files were not among the uploaded files. The uploaded monolithic `index.html` also references those missing CSS/JS files. The React implementation therefore reconstructs the feature areas described in the supplied CHANGES notes and visible HTML, while retaining uploaded source copies under `legacy-source/` for reference. It does not claim byte-for-byte preservation of unavailable source modules.
