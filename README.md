# CIP Day 2026: Sports & Activities

Live brackets, league table and results for CIP Day 2026.

**Site:** https://saishubhaml.github.io/CIP-DAY/

Players open the site to see who is playing what and how each game is going. Organisers sign in at the bottom of the page and record results, which everyone then sees.

## Games

| Game | Entries | Format |
|---|---|---|
| Badminton, Table Tennis | Individuals | Knockout bracket, separate for men and women |
| Tug of War | Teams | Knockout bracket |
| Volleyball | Teams | League, then a final between the top two |
| Slow Cycling, Lemon Spoon Race | Individuals | Single event: 1st, 2nd, 3rd |
| Three Leg Race | Pairs | Single event: 1st, 2nd, 3rd |
| Beg Borrow Steal | Teams | Single event: 1st, 2nd, 3rd |

## How it works

The site is static and hosted on GitHub Pages. There is no server.

- **Results** are stored in `results.json` in this repository. Every visitor's page reads that file and re-checks it every 30 seconds.
- **Organisers** sign in with a GitHub access token that has write access to this repository. Each change they make is saved to `results.json` through the GitHub API, so GitHub decides who may edit.
- **Players** need no account and see a view-only page.

## Files

```
index.html        Page skeleton; loads the stylesheet and scripts
css/styles.css    All styling, including dark mode
js/data.js        Sign-ups, games, the badminton draw, coordinators, default times
js/util.js        HTML escaping and date/time formatting
js/store.js       Shared state: reading and saving results.json, organiser sign-in
js/games.js       Game rules: teams, knockout brackets, the league, progress
js/views.js       Builds the HTML for each page
js/main.js        Click, form and drag-and-drop handlers; starts the app
photos/           Coordinator photos
results.json      Results, draws, teams and match times saved from the site
```

The scripts are plain files loaded in the order above and share one global scope; there is no build step.

## Running it locally

Open `index.html` in a browser. Opened from disk, the page is in local preview: everything is editable and changes are kept in that browser only, so nothing reaches the live site.

## Making changes

`results.json` changes every time an organiser saves, so pull before pushing:

```
git pull --rebase
git push origin main
```
