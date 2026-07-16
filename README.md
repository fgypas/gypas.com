# gypas.com

Personal portfolio website for Foivos Gypas — Bioinformatics Software Engineer.

A plain static site (HTML + CSS + JS), hosted on GitHub Pages at [gypas.com](https://gypas.com). No build step.

## Local preview

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
├── index.html      # The page
├── assets/
│   ├── css/        # Stylesheets (main.css, modern.css, enhancements.css, ...)
│   ├── js/         # jQuery + template scripts
│   └── fonts/      # Web fonts
├── images/         # Images
├── favicon.svg
└── CNAME           # Custom domain for GitHub Pages (gypas.com)
```

## Deployment

Hosted on **GitHub Pages** (Settings → Pages → Deploy from branch: `master` / root).
Any push to `master` publishes automatically. The `CNAME` file maps the site to `gypas.com`.

## Author

**Foivos Gypas** — [gypas.com](https://gypas.com) · [@fgypas](https://github.com/fgypas) · [LinkedIn](https://www.linkedin.com/in/foivosgypas/)
