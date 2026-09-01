# Cognitive Blends brand system

Source of truth: the living style guide at `/brand`. The shop is the brand in use. Do not invent a second visual language.

`/brand` is always password-gated (`ACCESS_PASSWORD`). Tokens live in `src/app/globals.css` `:root`. Components consume those tokens — never hardcode hex in JSX.

## Three layers

1. Narrative — `src/content/brand.ts` and `/brand` §§01
2. Tokens — `globals.css`
3. Components — `src/components/ui`

## Type

Loaded only from `src/app/layout.tsx` via `next/font`:

- Display: EB Garamond 400
- Body / UI: Assistant 400 / 700

Taken from the live Shopify theme (Dawn settings + homepage sections).

## Colour

Extracted from cognitiveblends.com: charcoal `#252525`, sand `#C9B288`, teal `#00A29B`, ink `#121212` / `#FFFFFF`. Judge.me teal `#108474` is the review widget only. Buttons and inputs are square (`--buttons-radius: 0px`).

## File map

| Path | Role |
| --- | --- |
| `src/app/globals.css` | Tokens and component CSS |
| `src/app/brand/page.tsx` | Living guidelines |
| `src/components/ui/` | Atoms the shop must compose |
| `src/content/brand.ts` | Copy and token tables |
