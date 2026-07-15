# Pre Go-Live Checklist

Date: 2026-03-09

## Build and Quality
- [x] `npm run check` passes (TypeScript OK)
- [x] `npm run build` passes (client + server bundle OK)
- [ ] Address optional bundle-size warning from Vite (non-blocking)

## Runtime Smoke Tests (local production build)
- [x] `GET /` returns `200`
- [x] `GET /robots.txt` returns `200`
- [x] `GET /sitemap.xml` returns `200`
- [x] `GET /feed.xml` returns `200`
- [x] `GET /rss.xml` returns `301` to `/feed.xml` (expected)

## Required Environment for Production
- [ ] Set `SESSION_SECRET` (required, startup fails without it)
- [ ] Set `DATABASE_URL` (otherwise app falls back to in-memory storage)
- [ ] Set `STRIPE_SECRET_KEY` only when payment flow is enabled
- [ ] Set `PUBLIC_SITE_URL` to public HTTPS domain for canonical URLs, sitemap, RSS links, and SEO ping

## Final Launch Gates
- [ ] Configure reverse proxy / hosting with HTTPS and correct domain
- [ ] Verify `robots.txt` policy matches launch strategy
- [ ] Submit sitemap URL in search consoles (Google, Bing)
- [ ] Run final real-content review for all public pages

## Notes
- Current status is technically ready at code/build level.
- Main blockers for real production are environment configuration and hosting/domain setup.
