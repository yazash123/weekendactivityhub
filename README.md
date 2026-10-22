# Weekend activity hub

The House of the People weekend page (Sessions 6 & 7): the poll members fill in before the weekend, then the hub that sends them into each activity.

- **Live page:** https://yazash123.github.io/weekendactivityhub/ (add `#activities` to open the hub, `#map` for the risk map; no hash opens the poll)
- **In Webflow:** paste `webflow-embed.html` into one Code Embed in a full-width section (not a Container). The same hash links work on the Webflow address, for example `…/your-page#activities`.

## Files

| file | what it is |
|---|---|
| `index.html` | the page, copied straight from the claude.ai artifact "Weekend Activities" (https://claude.ai/artifact/EAZKT1mpWYiDegWEEUnuso). Don't hand-edit it: make changes in the artifact and copy it over again. |
| `webflow-embed.html` | the one Webflow embed. Passes `#activities`, `#map`, `#iceberg`, `#drivers`, `#drivers2` and `#missing` through. |
| `tools/check_poll.js` | checks the poll writes exactly `{name, pid, clusters, risks, at}` to `poll-s6`, on desktop and phone. |
| `tools/fakefirebase.js` | the stand-in for Firebase that `check_poll.js` uses. |
| `.nojekyll` | tells GitHub Pages to serve the page as is. |

## The poll and Firebase

The poll saves one document per person to the Firestore collection `poll-s6` in the project `session-5-activity`, the same project as the other activity pages. The document id is the person's browser id (`pid`), so sending again replaces their vote.

Unlike the activity repos there is no `firebase-config.js`: the page carries its Firebase settings and the two SDK script tags itself. Inside claude.ai those scripts can't load, so the artifact keeps answers in the browser as a preview; on GitHub Pages they go to Firestore.

Votes are only accepted once the rules in section 4.6 of the Firebase plan are published (https://claude.ai/artifact/XomTKKPxKYNgjWDMVq16G6). The rules allow exactly those five fields, so if the poll ever writes anything else, every vote is refused: run the check after any change.

```
npm i -g playwright   # once
node tools/check_poll.js
```

The page's links to the activities are in `var URLS` near the top of the page script, and Drivers Part 2's opening date is `var PART2_FROM`.

## Updating the page

1. Change the artifact in claude.ai.
2. Save its HTML over `index.html`, run `node tools/check_poll.js`, and push.
3. GitHub Pages republishes in a minute or two. The Webflow embed points at the live page, so it needs no change. People may need to reload.

## Publishing

Repo Settings → Pages → Deploy from a branch → `main` / root.
