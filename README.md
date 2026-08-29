# The Modern Paradox Website — V1

Static website for `themodernparadox.com`.

## Site structure

- `/` — Home
- `/part-i/` — Part I audio hub with seven public MP3 sections
- `/read/part-i/` — continuous Part I reader with section anchors
- `/part-v/` — clean alias for the public Part V audio hub
- `/read/part-v/` — clean alias for the public Part V reader
- `/part-iv/` — retained legacy route for the Part V audio hub
- `/read/part-iv/` — retained legacy route for the Part V reader
- `/respond/` — structured response model; public submission infrastructure intentionally deferred
- `/about/` — manuscript/project context

The complete manuscript has five parts. Parts I and V are public. Parts II–IV remain unpublished and are represented only by titles, descriptions, and status labels; no private manuscript prose is served by the site.

The Contact / Manuscript Inquiry dialog follows the Neverlost Systems implementation: native browser validation, FormSubmit delivery, a hidden honeypot field, and a post-submission redirect. It does not expose credentials in client-side code.

## Audio

The site is wired to seven Part I MP3s in `assets/audio/part-i/` and seven Part V MP3s in the legacy `assets/audio/part-iv/` directory. The binary MP3 files are prepared locally from the WAV masters at 96 kbps mono. See each audio folder README for the exact filenames.

The WAV masters remain outside the public website repository.

## Visual identity

The site is intentionally literary/editorial rather than product/SaaS:

- warm cream: `#F7F3E9`
- near-black ink: `#171512`
- antique gold: `#A79567`
- editorial wordmark as the V1 live identity
- thin rules and centered diamond motifs
- no card shadows or rounded product UI language

The intersection mark remains the intended Modern Paradox symbol. A provisional corrected version is saved in Canva, but rejected traced/hand-built SVG versions are deliberately excluded from this deployment. The exact production mark will be swapped in after a clean master export.

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

Those should be added only after real reader use provides evidence that they are needed.
