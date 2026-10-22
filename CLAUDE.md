# Handover: weekend activity hub

The House of the People weekend page (Sessions 6 & 7, Assemble with the Odyssean Institute and Involve): a poll members fill in before the weekend, then a hub linking to the four activities (Iceberg futures, Underlying drivers Part 1 and Part 2, What's missing?). Owner: Yaz. UK English, plain language.

- **Source of truth is the claude.ai artifact** "Weekend Activities": https://claude.ai/artifact/EAZKT1mpWYiDegWEEUnuso. `index.html` is a straight copy of it. When asked to update the repo, read the artifact, save its HTML over `index.html`, run `node tools/check_poll.js`, then commit and push. Don't hand-edit `index.html` unless Yaz says the repo has become the source.
- **Firebase plan** (Claude Doc): https://claude.ai/artifact/XomTKKPxKYNgjWDMVq16G6. The poll writes `{name, pid, clusters, risks, at}` to `poll-s6`, id = `pid`. The rules allow exactly those fields: any change to the poll's document needs the rules changing first.
- The page's Firebase settings and SDK tags are inside `index.html` (no `firebase-config.js`). It skips Firebase on claude.ai hosts.
- `index.html` is ~400 KB, mostly base64 fonts on the first lines. Don't Read the whole file: search for `var URLS`, `var DEF={`, `function send(` or `poll-s6`.
- Edit text (bottom left) only works inside claude.ai; on GitHub Pages the page is read-only.
