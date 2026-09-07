# DASPA logo

The wordmark lives in CSS on the site (`a.logo` in `assets/site.css`). These files are
that same lockup as standalone assets, for anything off-site: decks, PDFs, ad accounts,
supplier forms, email signatures. Rebuild with `python3 scripts/build-logo.py` after any
change to the logo tokens in `assets/site.css`.

## Files

| File | Use |
| --- | --- |
| `daspa-logo-on-dark.svg` | Wordmark for navy or dark backgrounds. Default. |
| `daspa-logo-on-dark-tagline.svg` | Same, with GET YOUR SUPER BACK under it. |
| `daspa-logo-on-light.svg` | Wordmark for white or light backgrounds. |
| `daspa-logo-on-light-tagline.svg` | Same, with the tagline. |
| `daspa-logo-mono-white.svg` | One-colour white, for photos, embroidery, faxable forms. |
| `daspa-logo-mono-navy.svg` | One-colour navy, same purpose on light stock. |
| `daspa-icon.svg` | Square app mark: navy tile, yellow D. |
| `*-800.png`, `*-1600.png` | Raster fallbacks, transparent background, for tools that reject SVG. |
| `daspa-icon-512.png`, `daspa-icon-180.png` | App icon and Apple touch icon sizes. |

Type is outlined in the SVGs, so nothing depends on Plus Jakarta Sans being installed.

## Colours

| Element | On dark | On light |
| --- | --- | --- |
| DASP | `#ffffff` | `#14164A` navy |
| A | `#4A7BFF` accent | `#3844CA` brand blue |
| Full stop | `#fae541` yellow | `#eed935` gold |
| Tagline | `#aeb6d8` | `#5a6480` |

The A and the full stop shift on light backgrounds because `#4A7BFF` and `#fae541` are
both set for a navy ground and go weak on white.

## Rules

- Clear space around the lockup is baked into the SVG (16% of the cap height on every
  side). Do not crop into it.
- Minimum width 90px on screen, 25mm in print. Below that use `daspa-icon.svg`.
- Do not restretch, recolour outside the table above, add effects, or set the wordmark
  in another typeface. The type is Plus Jakarta Sans Bold at 0.04em tracking.
- Backgrounds: navy `#14164A` or white. On a photo, use the mono files.
