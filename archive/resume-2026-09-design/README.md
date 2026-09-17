# Résumé — design / portfolio version (archived 2026-09-17)

The résumé as it stood before it was retargeted at engineering roles. Headed
"Designer & Full-Stack Developer", led with a portrait, and gave design equal
weight with development.

| File | What it is |
| --- | --- |
| `resumeData.js` | The content, exactly as `src/components/About/resumeData.js` held it. |
| `jeremy-ahamioje-resume.pdf` | One-page A4, real text, printed from the component on 2026-09-01. |
| `jeremy-ahamioje-resume.png` | Same render as an image, 1992×2419. |

Nothing here is served. To bring this version back on the site, copy
`resumeData.js` over the live one and restore the `Resume.jsx` layout from
commit `916e8a3` — the current component renders a different structure
(projects, skills groups, no portrait) and will not lay this data out as it was.

Employer names were never supplied for the 2021–22 and 2022–23 entries; this
version omitted them rather than invent any, and so does the current one.
