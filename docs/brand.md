# Cognitive Blends brand system

Source of truth: the living style guide at `/brand`. The shop is the brand in use. Do not invent a second visual language.

`/brand` is always password-gated (`ACCESS_PASSWORD`). Tokens live in `src/app/globals.css` `:root`. Components consume those tokens — never hardcode hex in JSX.

## Three layers

1. Narrative — `src/content/brand.ts` and `/brand` §§01
2. Tokens — `globals.css`
3. Components — `src/components/ui`

## Type

Loaded only from `src/app/layout.tsx` via `next/font`:

- Display: EB Garamond
- Body / UI: Assistant

Taken from the live Shopify theme.

## Colour

Extracted from cognitiveblends.com: paper `#FAFAF9`, ink `#121212`, teal `#108474`, gold `#FFB200`.

## File map

| Path | Role |
| --- | --- |
| `src/app/globals.css` | Tokens and component CSS |
| `src/app/brand/page.tsx` | Living guidelines |
| `src/components/ui/` | Atoms the shop must compose |
| `src/content/brand.ts` | Copy and token tables |
