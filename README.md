# CypherConnect

**Community site for underground artists — Hip-Hop, Ghazal, Singer-Songwriter.**

Find your next beat — discover artists, join open mics, and find your perfect collaborator.

## Quick Start

```bash
# Serve locally (requires Python 3)
cd cypherconnect
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

## Features

- **Artist Directory** — Search and filter by genre, city, skills, availability
- **Artist Profiles** — Bio, sample tracks, badges, social links
- **Events & Open Mics** — Genre tabs, list/calendar view, RSVP, performer sign-up
- **Community Hub** — Announcements, collab calls, post composer
- **AI Matchmaker** — Explainable collaborator suggestions (opt-in, human-approved)
- **Account System** — Sign up, onboarding wizard, profile settings (localStorage-based)

## AI Matchmaker

The matchmaker uses a **deterministic scoring algorithm** (not ML):

| Factor | Points |
|---|---|
| Shared genre | +3 |
| Same city | +2 |
| Complementary skills | +2 |
| Both available | +1 |
| Both featured | +1 |
| Nearby cities | +1 |

Every suggestion includes an explainability string. AI never auto-messages or auto-books.

### Turning Off AI Demo
Remove or hide the `.matchmaker-panel` elements in `js/pages/artist-profile.js`. The matching logic lives in `js/matchmaker.js`.

## Editing Content (CMS)

All content lives in JSON files:

| File | Content |
|---|---|
| `data/artists.json` | Artist profiles (name, bio, genres, skills, etc.) |
| `data/events.json` | Events (title, venue, date, RSVP count, etc.) |
| `data/posts.json` | Community feed posts |

**To add an artist:** Copy an entry in `artists.json`, update the fields, and add a photo to `images/`.

**To add an event:** Copy an entry in `events.json` and update. Supported genres: `Hip-Hop`, `Ghazal`, `Singer-Songwriter`.

## Project Structure

```
cypherconnect/
├── index.html          ← Main entry point
├── css/
│   ├── design-system.css  ← Colors, typography, animations, utilities
│   └── components.css     ← All component & layout styles
├── js/
│   ├── app.js          ← Data loading & route registration
│   ├── router.js       ← Hash-based SPA router
│   ├── layout.js       ← Navbar & Footer
│   ├── matchmaker.js   ← AI matching algorithm
│   ├── utils.js        ← Helpers (dates, search, toast, localStorage)
│   └── pages/
│       ├── home.js     ← Landing page
│       ├── artists.js  ← Artist directory
│       ├── artist-profile.js ← Individual profile
│       ├── events.js   ← Events & open mics
│       ├── community.js ← Community hub
│       ├── about.js    ← About, FAQ, contact
│       └── account.js  ← Auth & dashboard
├── data/               ← JSON "CMS" files
│   ├── artists.json
│   ├── events.json
│   └── posts.json
└── images/             ← Generated placeholder images
```

## Design System

| Token | Value |
|---|---|
| Background | `#0a0e17` (primary), `#0f1724` (secondary) |
| Purple accent | `#8a4bff` |
| Orange accent | `#ff7a59` |
| Teal highlight | `#00e6ff` |
| Headings font | Outfit (Google Fonts) |
| Body font | Inter (Google Fonts) |

## Tech Stack

- **Pure HTML / CSS / JavaScript** — no build tools needed
- **Hash-based SPA routing** — all navigation via `#/path`
- **localStorage** — simulated auth and user state
- **JSON files** — content management
- **Python `http.server`** — local development server

## Replacing Sample Data

1. Edit JSON files in `data/` with your real artist/event info
2. Replace images in `images/` (keep same filenames or update paths in JSON)
3. Update SEO meta tags in `index.html`

## Privacy & Ethics

- AI matching is **opt-in only** (checkbox in account settings)
- All suggestions are **explainable** (shows why each match was made)
- AI **never auto-messages** or auto-books — human approval required
- Opt-out available anytime from the dashboard

## License

MIT
