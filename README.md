# 旅行的故事

Personal site for **宋佳强 (Jiaqiang Song)** — blog, app introductions, and app docs. Built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

- Chinese is the default locale at `/`
- English lives under `/en/`
- Blog: `/blog`
- Apps: `/apps`
- Docs: `/docs`

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds the site and publishes it with GitHub Pages.

1. Push this **source** to `SongJiaqiang/songjiaqiang.github.io` on the `main` branch.
2. In the repo: **Settings → Pages → Source = GitHub Actions**.
3. Custom domain `songqianli.com` is set via `public/CNAME`.

Do not push generated HTML the old Hexo way. After the first deploy, rotate the old Gitalk GitHub OAuth secret if it is still active — it was stored in the former Butterfly theme config and is not used here.
