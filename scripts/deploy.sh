#!/bin/sh
set -eu

REMOTE_HOST="rodrigo@76.13.173.181"
REMOTE_BASE="/home/rodrigo/apps/radar-ia"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
ARCHIVE="/tmp/produtocomia-${STAMP}.tar.gz"
REMOTE_ARCHIVE="/tmp/produtocomia-${STAMP}.tar.gz"
REMOTE_NGINX="/tmp/produtocomia-nginx-${STAMP}.conf"

npm run validate
tar -C dist -czf "$ARCHIVE" .
shasum -a 256 "$ARCHIVE"

scp "$ARCHIVE" "${REMOTE_HOST}:${REMOTE_ARCHIVE}"
scp deploy/nginx.conf "${REMOTE_HOST}:${REMOTE_NGINX}"

ssh "$REMOTE_HOST" sh -s -- "$STAMP" "$REMOTE_ARCHIVE" "$REMOTE_NGINX" <<'REMOTE'
set -eu
STAMP="$1"
ARCHIVE="$2"
NEW_NGINX="$3"
BASE="/home/rodrigo/apps/radar-ia"
RELEASE="$BASE/releases/$STAMP"
BACKUP_HTML="$BASE/backups/$STAMP-html"
BACKUP_NGINX="$BASE/backups/$STAMP-nginx.conf"

test -d "$BASE"
mkdir -p "$RELEASE" "$BASE/backups"
tar -xzf "$ARCHIVE" -C "$RELEASE"
test -s "$RELEASE/index.html"
test -s "$RELEASE/llms.txt"
test -s "$NEW_NGINX"
docker stop produtocomia
mv "$BASE/html" "$BACKUP_HTML"
if test -f "$BASE/nginx.conf"; then cp "$BASE/nginx.conf" "$BACKUP_NGINX"; fi
mv "$RELEASE" "$BASE/html"
mv "$NEW_NGINX" "$BASE/nginx.conf"
docker start produtocomia
ATTEMPT=1
until docker exec produtocomia wget -q -O /dev/null http://127.0.0.1/; do
  test "$ATTEMPT" -lt 15
  ATTEMPT=$((ATTEMPT + 1))
  sleep 1
done
REMOTE

PUBLISHED=0
ATTEMPT=1
while test "$ATTEMPT" -le 10; do
  if node scripts/smoke-test.mjs https://produtocomia.com.br; then PUBLISHED=1; break; fi
  echo "Site ainda inicializando; nova tentativa $ATTEMPT/10 em 3s."
  sleep 3
  ATTEMPT=$((ATTEMPT + 1))
done

if test "$PUBLISHED" -eq 1; then
  echo "Release $STAMP published successfully."
else
  echo "Smoke test failed; restoring $STAMP backup." >&2
  ssh "$REMOTE_HOST" sh -s -- "$STAMP" <<'REMOTE'
set -eu
STAMP="$1"
BASE="/home/rodrigo/apps/radar-ia"
docker stop produtocomia
mv "$BASE/html" "$BASE/releases/$STAMP-failed"
mv "$BASE/backups/$STAMP-html" "$BASE/html"
if test -f "$BASE/backups/$STAMP-nginx.conf"; then cp "$BASE/backups/$STAMP-nginx.conf" "$BASE/nginx.conf"; fi
docker start produtocomia
REMOTE
  curl -fsS https://produtocomia.com.br/ >/dev/null
  exit 1
fi
