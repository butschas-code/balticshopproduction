# LV Price Compare

Latvia-first grocery price comparison MVP.  
Compares prices across **Rimi**, **Maxima** (Barbora.lv), **Top!** (promotions via etop.lv), and **Lidl** — with an adapter-based architecture that makes it easy to add new retailers or countries.

## Quick start

```bash
# 1. Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements-dev.txt

# 3. Optional: Maxima ingestion needs a browser engine
playwright install chromium

# 4. Local admin UI (pick one):
#    echo 'ALLOW_INSECURE_ADMIN=1' >> .env
#    # or set ADMIN_SECRET=your-long-random-secret (required on any network-facing host)

# 5. Run ingestion (scrapes retailers into SQLite)
python -m app.ingest_cli run

# 6. Start the web server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000** in your browser.

## Project structure

```
app/
  core/
    config.py        # env-var driven settings, retailer URL lists
    admin_auth.py    # shared secret / Basic auth for admin routes
    logging.py       # structured logger factory
    http.py          # requests session with retries, rate limiting
  db/
    base.py          # SQLAlchemy engine (SQLite WAL), declarative base
    models.py        # Retailer, ProductOffer, CanonicalProduct
    session.py       # session factory + FastAPI dependency
    migrate.py       # auto-create tables
  schemas/
    dto.py           # dataclasses shared between layers
  retailers/
    base.py          # RetailerAdapter ABC
    rimi_lv.py       # Rimi Latvia (category URLs + HTML / embedded JSON)
    maxima_lv.py     # Maxima via Barbora.lv (Playwright)
    top_lv.py        # Top! promotions via etop.lv JSON API
    lidl_lv.py       # Lidl Latvia search API
  services/
    normalize.py     # Latvian diacritics, tokenisation, trigrams
    match.py         # fuzzy similarity scoring
    pricing.py       # search + basket logic
    ingest.py        # orchestrates adapters → DB writes
  web/
    templates/       # Jinja2 HTML (index, results, basket)
    static/          # CSS
  main.py            # FastAPI app
  ingest_cli.py      # CLI entry-point
requirements.txt
README.md
```

## Running ingestion

```bash
# Run all adapters once (manual):
python -m app.ingest_cli run

# Or trigger via the API (requires admin credentials if ADMIN_SECRET is set):
curl -X POST http://localhost:8000/admin/run-ingest \
  -H "X-Admin-Secret: YOUR_ADMIN_SECRET"
# or:  -H "Authorization: Bearer YOUR_ADMIN_SECRET"
```

Each run creates a time-stamped snapshot — previous data is preserved for
price-history tracking.

### Automatic daily ingestion

```bash
# Run the daily script directly:
python run_daily_ingest.py
```

The script copies `prices.db` into `backups/` before ingesting and prunes old
backups. Logs go to both stdout and `logs/ingest.log`.

**macOS (launchd) — recommended for always-on Macs:**

```bash
# Create the plist (runs daily at 03:00):
cat > ~/Library/LaunchAgents/com.lvpricecompare.ingest.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.lvpricecompare.ingest</string>
  <key>ProgramArguments</key>
  <array>
    <string>/path/to/project/.venv/bin/python</string>
    <string>/path/to/project/run_daily_ingest.py</string>
  </array>
  <key>WorkingDirectory</key>
  <string>/path/to/project</string>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key><integer>3</integer>
    <key>Minute</key><integer>0</integer>
  </dict>
  <key>StandardOutPath</key>
  <string>/path/to/project/logs/launchd-stdout.log</string>
  <key>StandardErrorPath</key>
  <string>/path/to/project/logs/launchd-stderr.log</string>
</dict>
</plist>
EOF

# Load it:
launchctl load ~/Library/LaunchAgents/com.lvpricecompare.ingest.plist
```

**Linux/macOS (cron):**

```bash
# Edit crontab:
crontab -e

# Add (runs daily at 03:00):
0 3 * * * cd /path/to/project && .venv/bin/python run_daily_ingest.py
```

## Running the API server

```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production-style (example — put behind nginx/Caddy for TLS)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers
```

### Endpoints

| Method | Path                 | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | `/`                  | Home page (search + basket UI)       |
| GET    | `/health`            | Health check                         |
| GET    | `/search?q=piens`    | Product search (HTML)                |
| POST   | `/basket`            | Basket comparison (HTML form)        |
| POST   | `/admin/run-ingest`  | Trigger ingestion (auth if `ADMIN_SECRET` set) |
| GET    | `/lv/admin`, `/en/admin` | Admin dashboard (same auth rules) |
| GET    | `/api/search?q=...`  | Product search (JSON)                |
| POST   | `/api/basket`        | Basket comparison (JSON body: `{"items": ["milk", ...]}`) |

**Admin authentication:** If `ADMIN_SECRET` is set, use **HTTP Basic** in the browser (username `admin`, password = secret) or send `Authorization: Bearer …` / `X-Admin-Secret: …` for API calls. If `ADMIN_SECRET` is empty, admin is **disabled** unless `ALLOW_INSECURE_ADMIN=1` (local development only — never on a public host).

## Tests and CI

```bash
pip install -r requirements-dev.txt
python -m pytest tests/ -v
```

GitHub Actions runs the same suite on push/PR (see `.github/workflows/ci.yml`).

**Production / Vercel** use `requirements.txt` only (smaller bundle; no Playwright).  
**Deploy checklist:** see [DEPLOY.md](DEPLOY.md) (Vercel + Neon + GitHub Actions daily ingest).

## Hosting patterns: always-fresh data vs Vercel

**Choose a pattern:**

| Pattern | What you run | Database | Good for |
|--------|----------------|----------|----------|
| **A — Single long-lived host** | FastAPI + `run_daily_ingest.py` on one machine (Fly.io, Railway, Render, VPS, or Mac with cron/launchd) | **SQLite** (`prices.db`) or Postgres | Simplest ops; no Vercel. |
| **B — Hybrid (cloud ingest + app elsewhere)** | Scheduled **GitHub Actions** (see below) or a VPS runs ingest only; FastAPI stays on Fly/Railway/Render | **Postgres** (Neon, Supabase, etc.) shared by the job and the app | Vercel for static/marketing pages that call your API URL, or any split where the scraper is not on the web host. |

**Vercel limits (why ingest is not on Vercel):** Ingestion takes **many minutes** (Rimi + hundreds of Maxima/Barbora pages via **Playwright**). Vercel serverless **time limits** and **no durable SQLite** make it unsuitable for `run_daily_ingest.py`. Use Vercel only for a **frontend** or keep the **whole app** on a long-lived host (Pattern A).

**Postgres:** Set `DATABASE_URL` to your provider’s connection string. Plain `postgresql://` and `postgres://` URLs are rewritten to use the **psycopg** (v3) driver automatically in [app/core/config.py](app/core/config.py). File backups in [run_daily_ingest.py](run_daily_ingest.py) run **only** for on-disk SQLite, not Postgres.

### Scheduled ingest with GitHub Actions

Workflow: [.github/workflows/daily-ingest.yml](.github/workflows/daily-ingest.yml)

1. Create a **Postgres** database (e.g. [Neon](https://neon.tech), Supabase, Railway).
2. In the GitHub repo: **Settings → Secrets and variables → Actions**, add **`DATABASE_URL`** with the full connection string (include `?sslmode=require` if your host requires it).
3. The workflow runs **daily at 05:00 UTC** (edit the `cron` expression to change time) and can be triggered manually via **Actions → Daily ingest → Run workflow**.
4. Point your deployed FastAPI app at the **same** `DATABASE_URL` so the site shows data written by the Action.

If `DATABASE_URL` is missing, the workflow **skips** ingest and prints a notice (so forks and fresh clones do not fail).

## Production deployment checklist

1. **Python 3.12+** (CI uses 3.12; 3.11+ is generally fine).
2. **Playwright:** `pip install -r requirements.txt` then `playwright install chromium` on the ingest host (required for Maxima/Barbora).
3. **Environment:** Set `ADMIN_SECRET` to a long random value; leave `ALLOW_INSECURE_ADMIN` unset. Set `BASE_URL` to the public site URL (newsletter confirmation links). Optionally configure `SMTP_*` and `SMTP_TO` so [app/services/health.py](app/services/health.py) alerts can email on CRITICAL issues.
4. **App debug:** Keep `APP_DEBUG` unset or `false` so FastAPI does not run in debug mode.
5. **TLS and proxy:** Terminate HTTPS in **nginx**, **Caddy**, or similar; proxy to uvicorn with `--proxy-headers` if you rely on `X-Forwarded-*`.
6. **SQLite:** The app enables **WAL** on SQLite ([app/db/base.py](app/db/base.py)) so reads (web) and writes (ingest) contend less. Still avoid multiple writers on the same file; one scheduled ingest plus the web app reading is the expected pattern. For heavy concurrent writes, point `DATABASE_URL` at **Postgres** instead.
7. **Schedule:** Run [run_daily_ingest.py](run_daily_ingest.py) via cron/launchd/systemd — not only `POST /admin/run-ingest` — so backups and alert collection run consistently.
8. **Smoke after deploy:** `curl -sf https://your-domain/health` and spot-check yesterday’s ingest counts in `logs/ingest.log` or the admin dashboard.

## Adding retailer category URLs

Edit `app/core/config.py` → `RETAILER_CATEGORY_URLS`:

- **rimi_lv:** list of category page URLs (see existing examples).
- **maxima_lv** / **top_lv:** leave `[]` — those adapters discover or fetch the catalog without this list.
- **lidl_lv:** not keyed here; the Lidl adapter calls its API directly.

## Adding a new retailer / country

1. Create `app/retailers/newretailer.py` implementing `RetailerAdapter`
2. Register it in `app/retailers/__init__.py` → `ALL_ADAPTERS`
3. If the adapter reads from `RETAILER_CATEGORY_URLS`, add its URL list in `config.py`
4. Add a `RetailerInfo` entry in `app/core/retailer_meta.py` if the UI should describe catalog type
5. Run ingestion — done.

## Configuration (environment variables)

| Variable               | Default                        | Description                                      |
|------------------------|--------------------------------|--------------------------------------------------|
| `DATABASE_URL`         | `sqlite:///prices.db`          | SQLite path, or **Postgres** (`postgresql://` / `postgres://` → psycopg3). Use the same URL for the web app and for GitHub Actions ingest. |
| `ADMIN_SECRET`         | *(empty)*                      | Enables admin auth; use Basic (`admin`/secret), Bearer, or `X-Admin-Secret` |
| `ALLOW_INSECURE_ADMIN` | *(unset)*                      | If `1`/`true`, allow admin with no secret (dev only) |
| `APP_DEBUG`            | `false`                        | FastAPI `debug` (keep off in production)         |
| `BASE_URL`             | `http://localhost:8000`        | Public site URL for email links                  |
| `LOG_LEVEL`            | `INFO`                         | Python log level                                 |
| `USER_AGENT`           | Chrome-like string             | HTTP User-Agent header                           |
| `REQUEST_TIMEOUT`      | `15`                           | Seconds per HTTP request                         |
| `RETRY_COUNT`          | `3`                            | Max retries per request                          |
| `RATE_LIMIT_MIN`       | `0.5`                          | Min sleep between requests (s)                   |
| `RATE_LIMIT_MAX`       | `1.5`                          | Max sleep between requests (s)                   |
| `SMTP_HOST`            | *(empty)*                      | If set, enables email sending for alerts         |
| `SMTP_PORT`            | `587`                          | SMTP port                                        |
| `SMTP_USER` / `SMTP_PASS` | *(empty)*                   | Credentials if required                          |
| `SMTP_FROM` / `SMTP_TO` | *(empty)*                     | From address; comma-separated recipients         |

## Troubleshooting scraping

**No products returned for Rimi?**
- Rimi's e-shop is heavily JavaScript-rendered. The adapter tries multiple
  extraction strategies (GTM dataLayer, JSON-LD, embedded state, HTML cards).
  If none work, the page structure may have changed.
- Check logs (`LOG_LEVEL=DEBUG python -m app.ingest_cli run`) for which
  strategy was attempted.

**Maxima (Barbora) returning empty?**
- Ensure Playwright is installed and Chromium is available:  
  `pip install playwright && playwright install chromium`
- Barbora is a client-rendered SPA; ingestion is slower than API-based retailers.

**Top! returning empty?**
- The adapter calls etop.lv’s public JSON API. Check network/firewall and logs
  for HTTP errors; the API shape may change over time.

**Lidl returning fewer products than expected?**
- Lidl Latvia publishes a limited online assortment (~200+ items), not the
  full in-store range. See comments in [app/retailers/lidl_lv.py](app/retailers/lidl_lv.py).

**Rate-limited or blocked?**
- Increase `RATE_LIMIT_MIN` / `RATE_LIMIT_MAX` to slow down requests.
- Try a different `USER_AGENT` string.
- Some retailers may require cookies or sessions — extend the adapter's
  `get_session()` setup accordingly.

**SQLite locked or “database is locked”?**
- WAL mode is enabled automatically for SQLite. Avoid running **two ingestion
  processes** against the same file at once. If problems persist, stagger jobs
  or use Postgres.

## Tech stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, SQLite
- **Scraping:** requests, BeautifulSoup4, lxml, Playwright (Maxima)
- **Frontend:** Jinja2 server-rendered templates
- **Matching:** custom normalised-token + trigram similarity (no external NLP)
