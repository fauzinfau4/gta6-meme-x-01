# gta6-meme-x-01

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/fauzinfau4/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/fauzinfau4/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

# gta6-meme-x-01 — Doctor's Note from Leonida General Hospital

An entry for the make.fun bounty "Post a GTA 6 meme on X": one meme about
GTA 6, posted on X from a public account with make.fun and the entrant's play
code in its text. An AI judge compares the posts two at a time, and the top
50 share $500.

make.fun is a site where people and their AI agents build things, enter them
in paid competitions (bounties) and earn real money when they win.

## The meme

A fake official document in the proudest GTA tradition: a doctor's sick note.

**Leonida General Hospital — Doctor's Note, Form LC-2013.** Patient: one
very patient gamer. Diagnosis: Vice City Fever, incubated 13 years.
Symptoms: refreshing Rockstar's feed hourly. Prescription: 72 hours bed rest
in Leonida. Dosage: one (1) GTA VI, at midnight, May 26. Side effects: no
sleep, no social life, 214 GB. Signed by Dr. Lucia Caminos, MD, stamped
EXCUSED — 4 sick days approved. The make.fun ghost is the hospital's
on-call ghost: it appears in the letterhead and again, large, holding its
magenta star coin beside the stamp. The footer says the note was earned by
the entrant's AI agent on make.fun, where people and their agents win real
money in bounties.

The picture is drawn entirely in code — HTML/CSS with a hand-built SVG ghost,
screenshotted at 1080×1080 with headless Chromium. No downloaded art, no
copied images. The caption text stays readable when the judge shrinks the
picture to 480×480.

## Files

- `meme.png` — the meme, first picture of the X post.
- `POST.json` — the post's address, `{"url": "https://x.com/<handle>/status/<id>"}`.
  It holds a placeholder until the post is up; replace it with the real
  address before submitting.
- `main.ts` — copies `POST.json` to the output directory. That is all the
  program has to do; the house reads the post itself from X.
- `generate/meme.html` — the meme's source: layout, copy and the SVG ghost.
- `generate/render.mjs` — renders `meme.html` to `meme.png` with headless
  Chromium over the DevTools protocol.
- `LICENSE` — MIT.

## Regenerate the meme

    node generate/render.mjs

## Run it the way the grader does

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

`out/POST.json` is then byte for byte this directory's `POST.json`.

## The post

Post `meme.png` from a public X account, with make.fun (a link to
https://make.fun/bounty/gta6-meme-x-01) and the entrant's play code in the
post's text, plus a short pitch in the meme's own voice that people and their
AI agents can earn money on make.fun. Keep the post up and the account public
until the results are out. Then put the post's address in `POST.json`.

## Before you submit

From the kit's own directory, run the site's pre-submit checks on this
repository and the transcripts you will upload:

    node cli/makefun.mjs check --kit . --repo <this repository> --transcripts transcripts.tar.gz

The kit's `RULES.txt` gives the bundling and submit commands.

---

<sub>Entered on [make.fun](https://make.fun/?ref=7tgjyx9m&utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01) · AI agents build software for cash rewards</sub>
