# Mazag (مزاج) — Egypt by Mood

Mazag is a mood-based discovery app for Egypt. Instead of asking *where* you want to go, it asks *how you feel*, then hands you a small curated bundle: **a place to visit, an Egyptian film (or a film set in Egypt) and a song to play**.

- **Live demo:** https://YOUR-PROJECT.vercel.app
- **Repository:** https://github.com/marina-samyy/mazag

## 1. The idea

Most travel sites start with a list of cities and attractions. People often start from a feeling instead: "I want something quiet", "I miss the old days", "I need an adventure". Mazag turns that feeling into a concrete plan and a cultural experience (place + cinema + music), not just a destination.

## 2. Objectives

- Build a complete, responsive React front-end using functional components and Hooks.
- Practise client-side routing, global state, local persistence and reusable components.
- Show a design system where the **mood changes the whole interface**, not just one button colour.
- Keep data separate from UI so the content is easy to extend.

## 3. Main features

- Four moods (Nostalgic, Adventurous, Romantic, Calm), each with its own colours, fonts, card style and details.
- **Surprise me** button that opens a random valid mood.
- Mood bundle page: places, a film (poster and rating from APIs) and a song (cover art and a 30-second preview from an API, plus a YouTube link).
- Place details page: gallery, description, reasons to visit, general tips, Google Maps link, and a live summary + image fetched from the Wikipedia API (with loading and error states).
- Favorites (mood bundles and places) saved with Zustand + `localStorage`; they survive a refresh.
- Toast notifications for every favorite action.
- Custom 404 page.
- Responsive layout, keyboard focus styles, skip link, `prefers-reduced-motion` support.

## 4. Technologies

| Tool | Why it is used |
|---|---|
| React 18 + Vite | Components, Hooks, fast dev server and build |
| Bootstrap 5 | Grid, utilities, navbar, responsive layout |
| React Router 6 | Real client-side routes and URL params |
| Zustand (+ persist) | Small global store for favorites, saved to localStorage |
| Framer Motion | One gentle page fade; automatically reduced for reduced-motion users |
| React Hot Toast | Feedback messages |
| Lucide React | Icons |
| Wikipedia, iTunes Search and TMDB APIs | Live place summaries, film posters and ratings, song previews |

No backend and no authentication. External data comes from three free APIs (Wikipedia, iTunes Search and TMDB); only TMDB needs a free key, kept in an environment variable, and the app works without it.

## 5. How the mood concept works

Each mood is a block of CSS variables in `src/index.css`, selected by a `data-mood` attribute:

```css
[data-mood='calm'] { --bg: #eef0e6; --accent: #4a6b5a; --font-display: 'Lora', serif; --radius: 1.5rem; ... }
```

The hook `useMoodTheme(moodId)` sets `document.documentElement.dataset.mood`. Every component uses `var(--bg)`, `var(--accent)`, `var(--radius)` and so on, so the entire page changes together.

| Mood | Palette | Character |
|---|---|---|
| Nostalgic | beige, faded rose, vintage brown | serif type, sepia photos, film-grain overlay, small radius |
| Adventurous | sand, terracotta, olive | condensed type, diagonal texture, hard offset shadows |
| Romantic | dusty rose, burgundy, champagne | elegant italic serif, warm glow, gold double-line card frame |
| Calm | sage, cream, muted blue | soft serif, large radius, slower transitions, more space |

Mood cards on the home page set `data-mood` on themselves, so each card previews its own palette.

## 6. Folder structure

```
mazag/
├── public/
│   ├── favicon.svg
│   └── images/            moods/  places/  posters/   (generated SVG art, see IMAGES.md)
├── screenshots/           screenshots of the app pages
├── src/
│   ├── components/        Navbar, Footer, MoodCard, PlaceCard, MovieCard, MusicCard,
│   │                      FavoriteButton, ImageWithFallback, PageTransition, ScrollToTop, WikipediaSummary
│   ├── pages/             Home, MoodPage, PlaceDetails, Favorites, NotFound
│   ├── data/              moods.json, places.json, movies.json, music.json
│   ├── store/             useFavoritesStore.js
│   ├── hooks/             useMoodTheme.js, useDocumentTitle.js, useWikipediaSummary.js, useItunesTrack.js, useTmdbMovie.js
│   ├── utils/             dataHelpers.js
│   ├── App.jsx            route table
│   ├── main.jsx           entry point
│   └── index.css          themes and global styles
├── tools/generate_images.py   script that draws the SVG artwork
├── IMAGES.md              how to swap in real photos
├── vercel.json            makes direct links and refresh work on Vercel
├── index.html
├── package.json
└── vite.config.js
```

## 7. Routes

| Route | Page |
|---|---|
| `/` | Home: hero, four mood cards, Surprise me |
| `/mood/:moodName` | Mood bundle (`nostalgic`, `adventurous`, `romantic`, `calm`) |
| `/place/:id` | Place details (optional `?mood=` keeps the theme) |
| `/favorites` | Saved bundles and places |
| `*` | Custom 404 page |

## 8. Data organisation

Data lives in `src/data/` as JSON, separate from components. Items reference each other by ID:

- `moods.json` — `id`, `name`, `arabicName`, `tagline`, `description`, `placeIds[]`, `movieId`, `musicId`
- `places.json` — `id`, `name`, `governorate`, `region`, `moodIds[]`, `summary`, `description`, `reasonsToVisit[]`, `visitorTips[]`, `mapQuery`, `images[]`
- `movies.json` — `id`, `wikiTitle`, `tmdbQuery`, `title`, `year`, `director`, `connection`, `poster`, `synopsis`
- `music.json` — `id`, `title`, `artist`, `year`, `note`, `searchQuery`, `youtubeId`

`src/utils/dataHelpers.js` is the only file that imports the JSON; components call helpers such as `getMoodById` and `getPlacesForMood`.

**Facts vs editorial:** titles, years, directors, artists and governorates are factual. `description`, `synopsis`, `note` and `tagline` are editorial and are labelled "Our take" in the UI. The app contains **no coordinates, ticket prices or opening hours**; maps use a Google Maps search link built from the place name, and the UI tells visitors to check hours locally.

**Music links:** each track opens a YouTube *search* (no guessed video IDs). To embed a video, paste its ID into `youtubeId` in `music.json`; the player appears automatically.

**Favorites:** stored in `localStorage` under the key `mazag-favorites`.

## 9. Data sources: local JSON and external APIs

The app uses **both**. The local JSON files are the base of the project. The APIs only add extra live information on top, and the app keeps working if any API fails or there is no internet.

| Content | Source |
|---|---|
| Moods, taglines, descriptions | Local JSON (`src/data/moods.json`) |
| Places: descriptions, reasons to visit, visitor tips | Local JSON (`src/data/places.json`) |
| Film title, year, director; song title, artist | Local JSON (`movies.json`, `music.json`) |
| Place summary and image | Wikipedia API |
| Film poster and rating | TMDB API (Wikipedia as backup, then a local title card) |
| Song cover art and 30-second preview | iTunes Search API |
| Saved favorites | Browser `localStorage` (through Zustand) |

### The APIs

| API | Key needed? | Used for | Where |
|---|---|---|---|
| Wikipedia REST API (`/page/summary/{title}`) | No | Place summary and image; backup film poster | Place Details page; movie card |
| iTunes Search API (`itunes.apple.com/search`) | No | Song artwork and a 30-second audio preview | Music card |
| TMDB API (`/3/search/movie`) | **Yes, free** | Real film poster and rating | Movie card |

- **How:** custom hooks `useWikipediaSummary.js`, `useItunesTrack.js` and `useTmdbMovie.js` in `src/hooks/` use `fetch` inside `useEffect` and keep the result in `useState`.
- **States handled:** loading, success and error. `AbortController` cancels a request if the user leaves the page.
- **Fallback chain for film posters:** TMDB, then Wikipedia, then the local title card in `public/images/posters/`.
- **Which item:** places and films have a `wikiTitle`; films also have a `tmdbQuery`; songs have a `searchQuery`.

### TMDB API key (environment variable)

1. Create a free account at [themoviedb.org](https://www.themoviedb.org), then go to **Settings → API** and request a key (personal / educational use). Copy the **API Key** (v3), not the long "Read Access Token".
2. In the project root, copy `.env.example` to `.env` and paste your key:
   ```
   VITE_TMDB_API_KEY=your_key_here
   ```
3. Restart `npm run dev` (Vite only reads `.env` at startup).
4. On Vercel: **Project → Settings → Environment Variables**, add `VITE_TMDB_API_KEY`, then redeploy.

`.env` is listed in `.gitignore`, so the key is never pushed to GitHub. Note: any `VITE_` variable is bundled into the browser code, so the key is visible to someone who inspects the site. This is acceptable for a free, read-only TMDB key in a student project, and you can regenerate the key afterwards. Without a key, the app simply skips TMDB and uses Wikipedia posters.

Attribution: This product uses the TMDB API but is not endorsed or certified by TMDB. Wikipedia text is under the CC BY-SA licence. The song preview is credited to Apple Music on the card.

## 10. Installation

Prerequisites: [Node.js](https://nodejs.org) 18 or newer and Git.

```bash
git clone https://github.com/marina-samyy/mazag.git
cd mazag
npm install
npm run dev
```

Open the URL printed in the terminal (usually http://localhost:5173).

Optional: to enable TMDB film data, copy `.env.example` to `.env` and add your key (see section 9).

## 11. Production build

```bash
npm run build      # creates the dist/ folder
npm run preview    # serves the build locally to test it
```

## 12. Images

The project includes generated SVG illustrations (moods, places and film title cards) in `public/images/`, created by `tools/generate_images.py`. They are illustrations, not photographs, and the film "posters" are typographic title cards, not the official posters. To use real photos instead, see [IMAGES.md](IMAGES.md). If an image file is missing, a coloured placeholder is shown, so nothing looks broken.



## 13. Deployment

The app is deployed on Vercel. `vercel.json` rewrites all routes to `index.html`, so direct links and page refresh work with React Router. The TMDB key is set as the environment variable `VITE_TMDB_API_KEY` in the Vercel project settings (see section 9).

Live demo: https://YOUR-PROJECT.vercel.app

## 14. Limitations and future ideas

- Only four moods and a small curated dataset; more moods, places and films can be added in the JSON files.
- Artwork is illustrated, not photographic; real photos can replace it (see IMAGES.md).
- Songs link to YouTube search instead of fixed videos.
- Visitor information is general advice only; it is not live data.
- Possible future work: search and filters, a map view with verified coordinates, an Arabic interface (RTL), user-created mood bundles, automated tests.

## Credits

- Place summaries and film posters/articles: [Wikipedia](https://www.wikipedia.org) (text under CC BY-SA).
- Film posters and ratings: [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Song previews and cover art: Apple Music via the iTunes Search API.
- Icons: [Lucide](https://lucide.dev). Fonts: Google Fonts. UI framework: Bootstrap.
- Place and mood artwork: illustrations drawn by the script `tools/generate_images.py`.

## Author

Marina Samy
