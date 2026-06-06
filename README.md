# JS Forge — Interactive JavaScript Course

A self-paced, black & white JavaScript learning site. Built with plain
HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

## Folder structure

```
js-forge/
├── index.html        # Page markup (links the CSS and JS below)
├── css/
│   └── styles.css    # All styling (monochrome theme, grid background, layout)
└── js/
    ├── data.js       # Course content: lessons, quizzes, challenges, flashcards
    └── app.js        # All app logic: routing, lessons, tracer, unlock system, modal
```

`data.js` loads before `app.js`. `data.js` defines the global `COURSE`
object (plus `CHALLENGES`, etc.) that `app.js` reads — so the order in
`index.html` matters; keep `data.js` first.

## How to run

Easiest: just double-click `index.html` to open it in a browser.

Recommended (avoids any browser file:// restrictions): serve the folder
with a tiny local server, then open the printed URL.

```bash
# Python 3
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000

## Features

- 5 lessons, each with explanation, analogies, diagrams, runnable code,
  quiz, interview questions, and practice problems
- Sequential unlock — finish a lesson to unlock the next
- Home progress dashboard (finished / pending / currently reading)
- Step-by-step execution tracer that steps through real `for` loops
- 8 code challenges with hints and solutions
- Flashcards, quick revision, achievements, stats
- Light / dark theme toggle
- Intro modal with rules (reopen any time via the ⓘ button in the nav)

## Note on saved progress

Progress (XP, completed lessons, unlocks, notes, "don't show intro again")
is stored in the browser's `localStorage`, per device. Clearing browser
data resets it. Some sandboxed preview environments block localStorage,
so progress may not persist there — it works normally when you host or
open the files yourself.

## Editing content

To change lessons, quizzes, or challenges, edit `js/data.js` only — the
content is data-driven, so the UI updates automatically. Styling lives
entirely in `css/styles.css`; behaviour in `js/app.js`.
