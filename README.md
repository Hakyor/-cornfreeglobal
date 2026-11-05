# CORN FREE

Independent international digital safety campaign website.
Static frontend (GitHub Pages) + Cloudflare Worker API + Cloudflare D1 database. No frameworks.

## Status you must know
- The code has been syntax-checked, but has **not** been run end-to-end against a live D1 database. Test the flow in section 6 after deploying.
- **Admin is NOT protected until you set an admin password** (section 3) or configure Cloudflare Access. Until then every `/api/admin/*` call returns `503 ADMIN_AUTH_NOT_CONFIGURED` and the admin UI says so. This is intentional.
- `privacy.html` is a template. Have it reviewed before launch.

## Structure
```
index.html about.html demands.html blog.html article.html join.html contact.html privacy.html 404.html
admin/        login, dashboard, blog, posts-editor, announcements, forms, settings
assets/       css/style.css, js/{config,i18n,api,main,blog,forms,admin}.js, img/ (logo.svg, logo-horizontal.svg, logo-512.png, favicons)
worker/       src/{index,routes,auth,validation}.js, migrations/0001_initial.sql, wrangler.toml
```

## 1. Prerequisites
Node.js 18+, a free Cloudflare account, a GitHub account. A domain on Cloudflare is strongly recommended (see section 3).

## 2. Deploy the Worker + database
```bash
cd worker
npm install
npx wrangler login

# create the database, then copy the printed database_id into wrangler.toml
npx wrangler d1 create corn-free-db

# create tables (remote = production)
npx wrangler d1 migrations apply corn-free-db --remote

# secrets (never committed)
npx wrangler secret put RATE_SALT        # any long random string
npx wrangler secret put ADMIN_EMAILS     # e.g. you@example.com,second@example.com
npx wrangler secret put CF_ACCESS_AUD    # filled in after section 3

# edit wrangler.toml: ALLOWED_ORIGINS and CF_ACCESS_TEAM_DOMAIN, then:
npx wrangler deploy
```
`ALLOWED_ORIGINS` = the exact origin(s) of your site, no trailing slash, comma-separated
(e.g. `https://www.example.com` or `https://YOUR-USER.github.io`).
Check it works: open `https://<your-worker-url>/api/health` → `{"ok":true,...}`.

Optional custom domain for the API (recommended): add to `wrangler.toml`
```toml
routes = [{ pattern = "api.example.com", custom_domain = true }]
```
and redeploy.

## 3. Admin password (simplest, no domain needed)
```bash
cd worker
npx wrangler secret put ADMIN_PASSWORD   # your password: 10+ characters, use a long passphrase
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"   # prints a random string
npx wrangler secret put SESSION_SECRET   # paste that random string
npx wrangler deploy
```
Open `/admin/`, type the password, done. The session lasts 12 hours (stored in the browser tab only) and "Sign out" clears it.
Login is limited to 10 attempts per 15 minutes per IP. To change the password, run the first command again and redeploy; changing `SESSION_SECRET` signs everyone out.
For local testing put both values in `worker/.dev.vars` (already git-ignored).

## 3b. Optional: Cloudflare Access instead of / as well as the password
Path-based protection needs the API on a **custom domain** in your Cloudflare account (workers.dev can only protect the whole Worker, which would also lock the public API).

1. Cloudflare dashboard → **Zero Trust** → choose a team name (your team domain is `TEAM.cloudflareaccess.com`).
2. **Access → Applications → Add → Self-hosted**. Application domain: `api.example.com`, path `api/admin/*`.
3. Add a policy: **Allow → Emails →** your admin emails.
4. In the application's settings:
   - **CORS**: allow credentials; allowed origin = your site origin; methods GET, POST, PUT, DELETE, OPTIONS; header `Content-Type`; and enable **Bypass OPTIONS requests to origin** (browser preflights carry no cookie).
   - If the site and API are on different registrable domains, set **SameSite attribute = None**. Safer: use sibling subdomains (`www.example.com` + `api.example.com`).
5. Copy the application's **Audience (AUD) tag**, then:
```bash
cd worker
npx wrangler secret put CF_ACCESS_AUD      # paste AUD tag
# set CF_ACCESS_TEAM_DOMAIN = "TEAM.cloudflareaccess.com" in wrangler.toml
npx wrangler deploy
```
The Worker verifies the Access JWT signature, issuer, audience, expiry **and** checks the email against `ADMIN_EMAILS` on every admin request.

## 4. Point the frontend at the API
Edit `assets/js/config.js`:
```js
API_BASE: 'https://api.example.com'   // your Worker URL, no trailing slash
```

## 5. Push to GitHub and publish
```bash
cd corn-free          # project root (the folder with index.html)
git init
git add .
git commit -m "Initial CORN FREE site"
git branch -M main
git remote add origin https://github.com/YOUR-USER/corn-free.git
git push -u origin main
```
Then GitHub → repo **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**.
Custom domain: add it under Pages and create the DNS CNAME GitHub asks for.
Admin pages are static files and visible to anyone; they contain no data. All data access is enforced by the Worker.

## 6. Test checklist
1. `/api/health` returns ok.
2. Submit join and contact forms (EN and AR) → rows appear in D1:
   `npx wrangler d1 execute corn-free-db --remote --command "SELECT * FROM contact_messages"`
3. Open `/admin/` → sign in via Access → dashboard loads.
4. Create a category, create + publish a post → appears on blog and home.
5. Create an active announcement → banner shows; dismiss → stays dismissed.
6. Sign in with a non-allowlisted email → 403.

## Local development
```bash
cd worker
npx wrangler d1 migrations apply corn-free-db --local
npx wrangler dev                       # API on http://localhost:8787
# in another terminal, from the project root:
python3 -m http.server 8788            # site on http://localhost:8788
```
Public pages and forms work locally. Admin returns 503 locally by design (Access cannot run locally).

## Writing posts
Plain text only: blank line = paragraph, `## ` = heading, lines starting `- ` = list. HTML is escaped.

## Supporter counter
The homepage and Join page show a live counter from `GET /api/stats`: the number of volunteer applications whose status is
`new`, `reviewing` or `accepted` (rejected/archived are not counted). The goal comes from the admin **Settings → Supporters goal**
(defaults to 1000). Applications are not email-verified, so mark spam as `rejected` or `archived` in Admin → Submissions to remove it from the count.

## Colors
Brand colors: navy #15395d and red #be2926. Change them in the variables at the top of `assets/css/style.css` (`--navy`, `--red`, `--a1`, `--a2`, `--grad`, `--bg`).
Logo files are in `assets/img/` (`logo.png` is used on the site).
