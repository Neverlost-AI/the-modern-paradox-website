# The Modern Paradox Website — V1

Static website for `themodernparadox.com`.

## V1 structure

- `/` — Home
- `/part-iv/` — Part IV audio hub with seven MP3 sections
- `/read/part-iv/` — continuous Part IV reader with section anchors
- `/for-teaching/` — lightweight teaching/discussion layer
- `/respond/` — structured response model; public submission infrastructure intentionally deferred
- `/about/` — manuscript/project context
- `/academy/` — Neverlost Academy placeholder

## Audio

The site is wired to seven approved web MP3s in `assets/audio/part-iv/`. The binary MP3 files are prepared locally from the WAV masters at 96 kbps mono. See the audio folder README for the exact filenames.

The WAV masters remain outside the public website repository.

## Visual identity

The site is intentionally literary/editorial rather than product/SaaS:

- warm cream: `#F7F3E9`
- near-black ink: `#171512`
- antique gold: `#A79567`
- editorial wordmark as the V1 live identity
- thin rules and centered diamond motifs
- no card shadows or rounded product UI language

The intersection mark remains the intended Modern Paradox symbol. A provisional corrected version is saved in Canva, but rejected traced/hand-built SVG versions are deliberately excluded from this deployment. The exact production mark will be swapped in after a clean master export. The spiral is reserved for Neverlost Academy.

## GitHub Pages

The repository includes `.nojekyll` and a `CNAME` for `themodernparadox.com`. GitHub Pages and DNS still need to be enabled/configured in repository/domain settings if they are not already active.

## V1 boundaries

Not included yet:

- public comments
- student accounts
- analytics
- newsletter
- CMS
- database
- moderation backend

Those should be added only after real reader/classroom use provides evidence that they are needed.
