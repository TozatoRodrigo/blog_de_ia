#!/bin/sh
set -eu

REMOTE_HOST="rodrigo@76.13.173.181"
REMOTE_BASE="/home/rodrigo/apps/radar-ia"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
SITE_ARCHIVE="/tmp/produtocomia-${STAMP}-site.tar.gz"
SERVICE_ARCHIVE="/tmp/produtocomia-${STAMP}-service.tar.gz"
REMOTE_SITE_ARCHIVE="/tmp/produtocomia-${STAMP}-site.tar.gz"
REMOTE_SERVICE_ARCHIVE="/tmp/produtocomia-${STAMP}-service.tar.gz"

npm run validate
tar -C dist -czf "$SITE_ARCHIVE" .
tar -czf "$SERVICE_ARCHIVE" services/download-leads config/downloads.json deploy/docker-compose.yml deploy/nginx.conf
SITE_SHA="$(shasum -a 256 "$SITE_ARCHIVE" | awk '{print $1}')"
SERVICE_SHA="$(shasum -a 256 "$SERVICE_ARCHIVE" | awk '{print $1}')"
shasum -a 256 "$SITE_ARCHIVE"
shasum -a 256 "$SERVICE_ARCHIVE"

scp "$SITE_ARCHIVE" "${REMOTE_HOST}:${REMOTE_SITE_ARCHIVE}"
scp "$SERVICE_ARCHIVE" "${REMOTE_HOST}:${REMOTE_SERVICE_ARCHIVE}"

ssh "$REMOTE_HOST" sh -s -- "$STAMP" "$REMOTE_SITE_ARCHIVE" "$REMOTE_SERVICE_ARCHIVE" "$SITE_SHA" "$SERVICE_SHA" <<'REMOTE'
set -eu
STAMP="$1"
SITE_ARCHIVE="$2"
SERVICE_ARCHIVE="$3"
EXPECTED_SITE_SHA="$4"
EXPECTED_SERVICE_SHA="$5"
BASE="/home/rodrigo/apps/radar-ia"
STAGE="$BASE/releases/$STAMP-stage"
NEW_SITE="$STAGE/html"
NEW_SERVICE_ROOT="$STAGE/service-root"
NEW_PRIVATE="$STAGE/private-downloads"
BACKUP_ROOT="$BASE/backups/$STAMP"
BACKUP_HTML="$BACKUP_ROOT/html"
BACKUP_PRIVATE="$BACKUP_ROOT/private-downloads"
BACKUP_NGINX="$BACKUP_ROOT/nginx.conf"
BACKUP_COMPOSE="$BACKUP_ROOT/docker-compose.yml"
BACKUP_SERVICE="$BACKUP_ROOT/services/download-leads"
BACKUP_CATALOG="$BACKUP_ROOT/config/downloads.json"
FAILED="$BASE/releases/$STAMP-failed"
ACTIVE=0

rollback() {
  test "$ACTIVE" -eq 1 || return 0
  set +e
  docker compose -f "$BASE/docker-compose.yml" down
  mkdir -p "$FAILED/services" "$FAILED/config"
  if test -d "$BACKUP_HTML"; then test -d "$BASE/html" && mv "$BASE/html" "$FAILED/html"; mv "$BACKUP_HTML" "$BASE/html"; fi
  if test -d "$BACKUP_PRIVATE"; then test -d "$BASE/private-downloads" && mv "$BASE/private-downloads" "$FAILED/private-downloads"; mv "$BACKUP_PRIVATE" "$BASE/private-downloads"; fi
  if test -f "$BACKUP_NGINX"; then test -f "$BASE/nginx.conf" && mv "$BASE/nginx.conf" "$FAILED/nginx.conf"; mv "$BACKUP_NGINX" "$BASE/nginx.conf"; fi
  if test -f "$BACKUP_COMPOSE"; then test -f "$BASE/docker-compose.yml" && mv "$BASE/docker-compose.yml" "$FAILED/docker-compose.yml"; mv "$BACKUP_COMPOSE" "$BASE/docker-compose.yml"; fi
  if test -d "$BACKUP_SERVICE"; then test -d "$BASE/services/download-leads" && mv "$BASE/services/download-leads" "$FAILED/services/download-leads"; mkdir -p "$BASE/services"; mv "$BACKUP_SERVICE" "$BASE/services/download-leads"; fi
  if test -f "$BACKUP_CATALOG"; then test -f "$BASE/config/downloads.json" && mv "$BASE/config/downloads.json" "$FAILED/config/downloads.json"; mkdir -p "$BASE/config"; mv "$BACKUP_CATALOG" "$BASE/config/downloads.json"; fi
  docker compose -f "$BASE/docker-compose.yml" up -d --build
  set -e
}
trap rollback 0 1 2 15

test -d "$BASE"
test -f "$BASE/.env.download-leads"
ENV_MODE="$(stat -c %a "$BASE/.env.download-leads")"
test "$ENV_MODE" = "600"
test "$(sha256sum "$SITE_ARCHIVE" | awk '{print $1}')" = "$EXPECTED_SITE_SHA"
test "$(sha256sum "$SERVICE_ARCHIVE" | awk '{print $1}')" = "$EXPECTED_SERVICE_SHA"

mkdir -p "$NEW_SITE" "$NEW_SERVICE_ROOT" "$BACKUP_ROOT/services" "$BACKUP_ROOT/config" "$BASE/releases" "$BASE/backups" "$BASE/services" "$BASE/config" "$BASE/lead-data"
chmod 700 "$BASE/lead-data"
tar -xzf "$SITE_ARCHIVE" -C "$NEW_SITE"
tar -xzf "$SERVICE_ARCHIVE" -C "$NEW_SERVICE_ROOT"
test -s "$NEW_SITE/index.html"
test -s "$NEW_SITE/llms.txt"
test -d "$NEW_SITE/downloads"
test -s "$NEW_SERVICE_ROOT/services/download-leads/src/server.mjs"
test -s "$NEW_SERVICE_ROOT/config/downloads.json"
test -s "$NEW_SERVICE_ROOT/deploy/nginx.conf"
test -s "$NEW_SERVICE_ROOT/deploy/docker-compose.yml"
mv "$NEW_SITE/downloads" "$NEW_PRIVATE"

ACTIVE=1
docker compose -f "$BASE/docker-compose.yml" down
mv "$BASE/html" "$BACKUP_HTML"
test -d "$BASE/private-downloads" && mv "$BASE/private-downloads" "$BACKUP_PRIVATE"
mv "$BASE/nginx.conf" "$BACKUP_NGINX"
mv "$BASE/docker-compose.yml" "$BACKUP_COMPOSE"
test -d "$BASE/services/download-leads" && mv "$BASE/services/download-leads" "$BACKUP_SERVICE"
test -f "$BASE/config/downloads.json" && mv "$BASE/config/downloads.json" "$BACKUP_CATALOG"

mv "$NEW_SITE" "$BASE/html"
mv "$NEW_PRIVATE" "$BASE/private-downloads"
mv "$NEW_SERVICE_ROOT/services/download-leads" "$BASE/services/download-leads"
mv "$NEW_SERVICE_ROOT/config/downloads.json" "$BASE/config/downloads.json"
mv "$NEW_SERVICE_ROOT/deploy/nginx.conf" "$BASE/nginx.conf"
mv "$NEW_SERVICE_ROOT/deploy/docker-compose.yml" "$BASE/docker-compose.yml"

docker compose -f "$BASE/docker-compose.yml" up -d --build
ATTEMPT=1
until docker exec produtocomia wget -q -O /dev/null http://127.0.0.1/ \
  && test "$(docker inspect --format '{{.State.Health.Status}}' produtocomia-download-leads 2>/dev/null)" = "healthy"; do
  test "$ATTEMPT" -lt 30
  ATTEMPT=$((ATTEMPT + 1))
  sleep 2
done
ACTIVE=0
trap - 0 1 2 15
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
BACKUP="$BASE/backups/$STAMP"
FAILED="$BASE/releases/$STAMP-failed"

docker compose -f "$BASE/docker-compose.yml" down
mkdir -p "$FAILED/services" "$FAILED/config" "$BASE/services" "$BASE/config"
mv "$BASE/html" "$FAILED/html"
mv "$BASE/private-downloads" "$FAILED/private-downloads"
mv "$BASE/nginx.conf" "$FAILED/nginx.conf"
mv "$BASE/docker-compose.yml" "$FAILED/docker-compose.yml"
mv "$BASE/services/download-leads" "$FAILED/services/download-leads"
mv "$BASE/config/downloads.json" "$FAILED/config/downloads.json"
mv "$BACKUP/html" "$BASE/html"
test -d "$BACKUP/private-downloads" && mv "$BACKUP/private-downloads" "$BASE/private-downloads"
mv "$BACKUP/nginx.conf" "$BASE/nginx.conf"
mv "$BACKUP/docker-compose.yml" "$BASE/docker-compose.yml"
test -d "$BACKUP/services/download-leads" && mv "$BACKUP/services/download-leads" "$BASE/services/download-leads"
test -f "$BACKUP/config/downloads.json" && mv "$BACKUP/config/downloads.json" "$BASE/config/downloads.json"
docker compose -f "$BASE/docker-compose.yml" up -d --build
REMOTE
  curl -fsS https://produtocomia.com.br/ >/dev/null
  exit 1
fi
