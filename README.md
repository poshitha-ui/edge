# Edge Ark: homepage concept (pass 1)

Independent portfolio redesign of edgeark.com.au. Not the official site.

## Run locally

    npm install
    npm run build      # compiles src/input.css -> dist/output.css (Tailwind v4)
    npm start          # serves on http://localhost:8080
    npm run dev        # optional: rebuild CSS on change (separate terminal)

dist/output.css is already built, so index.html also opens from any static server.

## Structure

    index.html            all nine sections
    src/input.css         Tailwind v4 entry: theme tokens + components
    src/main.js           header, menu, scroll-spy, reveal, FAQ, form
    assets/images|icons   generated SVG visuals, concept logo mark
    assets/fonts          self-hosted Manrope (latin)

## To confirm / replace

- Hero and About visuals are generated SVG placeholders.
- Logo mark is a concept mark, not Edge Ark's official logo.
- Principles "Sustainable / Consistent / Diverse" have no description on the source site (marked TODO in index.html).
- Form is not wired up: set FORM_ENDPOINT in src/main.js to enable live submission.
