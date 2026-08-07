# The Modern Paradox Website — V1 Draft

Static website draft for `themodernparadox.com`.

## V1 structure

- `/` — Home
- `/part-iv/` — Part IV audio hub with six MP3 sections
- `/read/part-iv/` — continuous Part IV reader with section anchors
- `/for-teaching/` — lightweight teaching/discussion layer
- `/respond/` — structured response model; public submission infrastructure intentionally deferred
- `/about/` — manuscript/project context
- `/academy/` — Neverlost Academy placeholder

## Audio

The six web MP3 files were converted from the approved WAV masters at 96 kbps mono and are stored in:

`assets/audio/part-iv/`

The WAV masters should remain outside the public website repository unless archival storage is intentionally desired.

## Design intent

The Modern Paradox should remain visually and conceptually distinct from Neverlost Systems:
- restrained, literary presentation
- philosophy first
- no SaaS/product visual language
- clear but limited cross-link to Neverlost Systems

## GitHub Pages

This draft includes:
- `.nojekyll`
- `CNAME` set to `themodernparadox.com`

After creating the repository, upload these files to the default branch and configure GitHub Pages to deploy from the branch root. DNS for the custom domain must also point to GitHub Pages before the domain will resolve.

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

## Brand system

V1 visual identity is intentionally literary/editorial rather than product/SaaS:

- warm cream: `#F7F3E9`
- near-black ink: `#171512`
- antique gold: `#A79567`
- editorial wordmark as the primary identity
- gold intersection mark as the primary symbol
- thin rules, centered diamond details, square editorial controls
- no card shadows or rounded product UI language

Vector assets live in:

`assets/brand/`

The intersection mark is path-based SVG traced from the approved reference artwork. The editorial wordmark is currently SVG text so the exact final typeface can remain adjustable; once the typeface is formally locked, the production wordmark should be converted to outlines.
