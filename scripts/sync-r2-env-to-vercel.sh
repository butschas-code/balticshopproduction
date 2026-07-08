#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.local ]; then
  echo "Missing .env.local"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env.local
set +a

vercel_env_production() {
  local name="$1"
  local value="$2"
  vercel env rm "$name" production --yes 2>/dev/null || true
  printf '%s' "$value" | vercel env add "$name" production
}

echo "Setting Vercel production env vars for balticsproducts..."
vercel_env_production R2_ACCOUNT_ID "$R2_ACCOUNT_ID"
vercel_env_production R2_BUCKET "$R2_BUCKET"
vercel_env_production R2_ENDPOINT "$R2_ENDPOINT"
vercel_env_production R2_ACCESS_KEY_ID "$R2_ACCESS_KEY_ID"
vercel_env_production R2_SECRET_ACCESS_KEY "$R2_SECRET_ACCESS_KEY"
vercel_env_production CLOUDFLARE_API_TOKEN "$CLOUDFLARE_API_TOKEN"

if [ -n "${NEXT_PUBLIC_R2_PUBLIC_URL:-}" ]; then
  vercel_env_production NEXT_PUBLIC_R2_PUBLIC_URL "$NEXT_PUBLIC_R2_PUBLIC_URL"
else
  echo "NEXT_PUBLIC_R2_PUBLIC_URL not set yet — run npm run r2:setup after enabling R2"
fi

echo "Done."
