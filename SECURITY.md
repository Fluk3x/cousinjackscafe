# Security Notes

This starter intentionally keeps the dependency tree small. Fewer dependencies means fewer supply-chain risks.

## Current safeguards

- Exact dependency versions in `package.json`
- Security headers in `next.config.ts`
- No old `next-pwa` style plugin
- No Axios dependency
- No random animation/icon/UI packages
- No postinstall-heavy packages added by hand
- No secrets committed
- Mailto-only contact flow, so no backend secrets are required

## Audit commands

Run after install and before deployment:

```bash
npm audit --audit-level=low
npm audit --omit=dev --audit-level=low
```

## Safer install workflow

For first install on a machine you trust:

```bash
npm install --ignore-scripts
npm audit --audit-level=low
npm rebuild
npm run check
```

This lets you inspect the dependency tree before allowing lifecycle scripts.

## Update policy

When updating packages:

1. Update one group at a time.
2. Run `npm audit --audit-level=low`.
3. Run `npm run check`.
4. Commit the lockfile only after checks pass.
5. Avoid typosquatted packages and packages with unclear maintainers.
