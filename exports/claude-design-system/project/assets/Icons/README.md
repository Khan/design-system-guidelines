# Icons

Khan Academy concept icons: content types and activities (`activities/`),
learning progress (`progress/`), and gems and streaks (`motivation/`).
Use them instead of a Phosphor lookalike whenever you show a Khan Academy
concept. Phosphor stays for UI glyphs such as arrows and close.

The activities and progress files are circled icons in `thunderblocks`
(light) colors: every color in them is a learning-state token. For
`syl-dark`, swap each hex for its dark value; the tables are in the
"Asset catalog" section. Motivation icons are multicolor and work in both
themes.

These are uploads: to get one, read `project/design-system.json`, take `assetGroups.Icons.files["<name>"].blob`, and `read` that id as the path. In an artifact, inline the SVG or use a `data:` URI.
