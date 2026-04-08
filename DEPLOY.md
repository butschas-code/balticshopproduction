# Deploy to Vercel (free tier) + daily scrape (free)

The web app runs on **Vercel**. Scraping is too long for serverless, so **GitHub Actions** runs **`run_daily_ingest.py` daily** into a free **Postgres** database (e.g. Neon). Vercel reads the same database.

## 1. Neon Postgres (free)

1. Sign up at [neon.tech](https://neon.tech) and create a project + database.
2. Copy the connection string (starts with `postgresql://` or `postgres://`).  
   The app rewrites it to use the **psycopg** driver automatically.

## 2. GitHub repository secrets

In **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
|--------|---------|
| `DATABASE_URL` | Same Postgres URL as above (required for **Daily ingest** workflow). |

**Tip:** For **unlimited** GitHub Actions minutes for scheduled ingest, keep the repository **public**. Private repos use the free minute quota.

## 3. Vercel project

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework: **Other** or auto-detect (Python / FastAPI). The serverless entry is [`api/index.py`](api/index.py) (Vercel only matches Python functions under `api/` when using `vercel.json` `functions`).
3. **Environment variables** (Production + Preview if you want):

| Variable | Example | Notes |
|----------|---------|--------|
| `DATABASE_URL` | *(same as Neon)* | Required — SQLite does not persist on Vercel. |
| `BASE_URL` | `https://your-project.vercel.app` | Newsletter links; no trailing slash. |
| `ADMIN_SECRET` | long random string | Protects `/admin` and `POST /admin/run-ingest`. |
| `APP_DEBUG` | `false` | Leave off in production. |

4. Deploy. First request may be slow (cold start); `create_tables()` runs on startup.

## 4. Daily ingest schedule

Workflow: `.github/workflows/daily-ingest.yml`

- Runs **05:00 UTC** every day (edit `cron` to change).
- **Run workflow manually** in the Actions tab to seed data immediately after adding `DATABASE_URL`.

Until `DATABASE_URL` is set, the workflow **skips** with a notice (no failure).

## 5. Optional: trigger ingest from your machine

```bash
export DATABASE_URL="postgresql://..."
pip install -r requirements.txt
pip install "playwright>=1.40.0"
playwright install chromium
python run_daily_ingest.py
```

## Limits

- **Vercel Hobby:** function duration (see `vercel.json` `maxDuration`). Heavy pages may need tuning or a paid plan.
- **Ingest on Vercel:** not supported (timeouts + Playwright). Use Actions or a local/VPS run only.
