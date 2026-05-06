# Cousin Jack's Cafe Guildford

A premium Next.js starter website for **Cousin Jack's Cafe** in Guildford, NSW.

The repo is designed to be fast, local-SEO friendly, mobile-first, and easy to edit without adding unnecessary dependencies.

## What is included

- Next.js App Router with TypeScript
- Tailwind CSS v4 setup through PostCSS
- Motion animations using `motion/react`
- Lucide icons only, no heavy UI kit
- Local business metadata and JSON-LD
- Sitemap and robots routes
- Security headers in `next.config.ts`
- Central editable content in `lib/content.ts`
- Menu filtering and search
- Contact page with mailto-based enquiry flow
- CSS-only visual placeholders so the first version works before real photos are added

## Verified vs placeholder content

Public web search did not return a complete official Guildford menu, address, hours, phone number, or Google review dataset that could be safely copied into the website. Because of that, the project uses placeholder menu prices, hours, phone and email.

Before launch, update:

- `phone`
- `email`
- `address`
- `googleMapsUrl`
- `orderUrl`
- `hours`
- `menu` data and prices in `lib/menu-data.ts`
- real photos in the gallery/hero sections

All of those live in:

```txt
lib/content.ts
lib/menu-data.ts
```

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Production checks

```bash
npm run typecheck
npm run lint
npm run build
npm run security:audit
npm run security:prod
```

## Dependency policy

The package versions are pinned exactly. This reduces supply-chain drift and makes future audits easier.

Core versions at generation time:

- `next@16.2.4`
- `react@19.2.5`
- `react-dom@19.2.5`
- `tailwindcss@4.2.4`
- `@tailwindcss/postcss@4.2.4`
- `motion@12.38.0`
- `lucide-react@1.14.0`
- `typescript@6.0.3`
- `eslint@10.3.0`
- `eslint-config-next@16.2.4`

## Recommended deployment

Vercel is the simplest path:

1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Set the production domain.
4. Replace `cafe.siteUrl` in `lib/content.ts` with the real domain.
5. Add real photos and verified menu/hours.
6. Run `npm run security:prod` after each dependency update.

## Security / `npm audit`

`npm audit` may report a **moderate PostCSS advisory** via a nested copy that Next depends on. Do **not** run `npm audit fix --force` (it can force an ancient Next.js).

This repo pins **`postcss` to `8.5.10`** in `devDependencies` and uses an **`overrides`** entry so the nested install is aligned. After pulling changes, run **`npm install`** so your `package-lock.json` matches. Re-check with `npm audit`.

## Next upgrade ideas

- Add real Google Business Profile links once verified.
- Add real food/shopfront photography.
- Add online ordering buttons for the exact platform.
- Add catering enquiry backend with Resend, Formspree, Firebase or a simple API route.
- Add CMS later only if the cafe needs self-editing.
