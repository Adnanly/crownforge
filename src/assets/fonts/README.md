# Bundled fonts

These files are loaded with `next/font/local` in `src/app/(public)/layout.jsx`, so production builds never download fonts from Google.
All fonts are licensed under the SIL Open Font License 1.1 (license text sits next to each font).

| File | Family | Axis / weights | Role (CSS variable) |
| --- | --- | --- | --- |
| `PlusJakartaSans-Variable-latin.woff2` | Plus Jakarta Sans | variable, 500-700 | Display headings (`--font-display`) |
| `Inter-Variable-latin.woff2` | Inter | variable, 400-700 | Body and UI text (`--font-inter`) |
| `JetBrainsMono-Variable-latin.woff2` | JetBrains Mono | variable, 400-500 | Monospace labels (`--font-mono`) |

The woff2 files are the Latin subset published by Google Fonts (fonts.gstatic.com), fetched once during development.
`Inter-Regular-latin.ttf` and `BebasNeue-Regular.ttf` are older static files that the site no longer references; they are kept with their licenses.
