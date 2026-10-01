#!/bin/sh
# Internal implementation of scripts/deploy.sh; never invoke manually in production.
set -eu
ACTION="$1"
STAMP="$2"
EXPECTED_SITE_SHA="$3"
BASE="/home/rodrigo/apps/radar-ia"
SITE_CONTAINER="produtocomia"
LEADS_CONTAINER="produtocomia-download-leads"
INPUT="/tmp/produtocomia-$STAMP-input"
if test "${EDITORIAL_DEPLOY_TEST:-0}" = "1"; then
  BASE="$EDITORIAL_DEPLOY_TEST_BASE"
  SITE_CONTAINER="$EDITORIAL_DEPLOY_TEST_SITE_CONTAINER"
  LEADS_CONTAINER="$EDITORIAL_DEPLOY_TEST_LEADS_CONTAINER"
  INPUT="$EDITORIAL_DEPLOY_TEST_INPUT"
  case "$SITE_CONTAINER:$LEADS_CONTAINER" in newsletter-test-*:newsletter-test-*) ;; *) exit 1 ;; esac
  test "$BASE" != /home/rodrigo/apps/radar-ia
fi
case "$STAMP" in ''|*[!a-zA-Z0-9-]*) echo 'Invalid release identifier' >&2; exit 1 ;; esac
LOCK="$BASE/.publication-lock"
STAGE="$BASE/releases/$STAMP"
NEW_SITE="$BASE/html/.releases/$STAMP"
STATE="$STAGE/state"

sha() { node -e 'const fs=require("fs"),crypto=require("crypto"); console.log(crypto.createHash("sha256").update(fs.readFileSync(process.argv[1])).digest("hex"))' "$1"; }
containers() {
  docker inspect --format '{{.Id}} {{.State.StartedAt}}' "$SITE_CONTAINER"
  docker inspect --format '{{.Id}} {{.State.StartedAt}}' "$LEADS_CONTAINER"
}
healthy() {
  test "$(docker inspect --format '{{.State.Health.Status}}' "$LEADS_CONTAINER")" = healthy
  docker exec "$SITE_CONTAINER" wget -q -O /dev/null http://127.0.0.1/
}
release_lock() {
  if test -f "$LOCK/owner" && test "$(cat "$LOCK/owner")" = "$STAMP"; then
    unlink "$LOCK/owner"
    rmdir "$LOCK"
  fi
}
owned_lock() { test -f "$LOCK/owner" && test "$(cat "$LOCK/owner")" = "$STAMP"; }
compare_infrastructure() {
  node "$INPUT/newsletter-infrastructure.mjs" compare "$BASE" "$INPUT/infrastructure.json"
  node "$INPUT/newsletter-infrastructure.mjs" runtime "$BASE" "$INPUT/infrastructure.json" "$LEADS_CONTAINER"
}
swap_pointer() {
  TARGET="$1"
  LINK="$BASE/html/.current-$STAMP"
  test ! -e "$LINK" && test ! -L "$LINK"
  ln -s "$TARGET" "$LINK"
  node -e 'require("fs").renameSync(process.argv[1],process.argv[2])' "$LINK" "$BASE/html/current"
}
unchanged_containers() { containers > "$STAGE/containers.after"; cmp "$STAGE/containers.before" "$STAGE/containers.after"; }
rollback() {
  if test -f "$STATE" && test "$(cat "$STATE")" = rolled-back; then
    unchanged_containers
    healthy
    echo "Release $STAMP was already rolled back automatically; verified."
    return 0
  fi
  owned_lock
  if test -f "$STATE" && test "$(cat "$STATE")" = activated; then
    PREVIOUS="$(cat "$STAGE/previous-target")"
    if test "$PREVIOUS" = LEGACY; then
      test -L "$BASE/html/current"
      test "$(readlink "$BASE/html/current")" = ".releases/$STAMP"
      unlink "$BASE/html/current"
    else
      swap_pointer "$PREVIOUS"
    fi
    # Preserve the file inode: it is bind-mounted into the running Nginx container.
    cat "$STAGE/nginx.before" > "$BASE/nginx.conf"
    docker exec "$SITE_CONTAINER" nginx -t
    docker exec "$SITE_CONTAINER" nginx -s reload
    unchanged_containers
    healthy
    printf '%s\n' rolled-back > "$STATE"
    echo "Release $STAMP rolled back automatically; containers preserved."
  elif test -d "$STAGE"; then
    printf '%s\n' cancelled > "$STATE"
  fi
  release_lock
}

case "$ACTION" in
  inspect)
    if test -L "$BASE/html/current"; then
      CURRENT="$(readlink "$BASE/html/current")"
      case "$CURRENT" in .releases/*) ;; *) exit 1 ;; esac
      case "$CURRENT" in *..*) exit 1 ;; esac
      ACTIVE_RELEASE="${CURRENT#.releases/}"
      node -e 'const fs=require("fs");const r=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));console.log(JSON.stringify({legacy:false,gitSha:r.gitSha,release:process.argv[2]}))' "$BASE/releases/$ACTIVE_RELEASE/release.json" "$ACTIVE_RELEASE"
    else
      printf '%s\n' '{"legacy":true,"gitSha":null}'
    fi
    ;;
  prepare)
    test -d "$BASE/html"
    test -f "$BASE/.env.download-leads"
    test "$(node -e 'console.log((require("fs").statSync(process.argv[1]).mode & 511).toString(8))' "$BASE/.env.download-leads")" = 600
    test -d "$BASE/lead-data"
    test -d "$BASE/private-downloads"
    test -d "$BASE/services/download-leads"
    mkdir -m 700 "$LOCK" || { echo 'Another publication owns the production lock; no activation.' >&2; exit 1; }
    printf '%s\n' "$STAMP" > "$LOCK/owner"
    trap release_lock 0 1 2 15
    test ! -e "$STAGE"
    mkdir -p "$STAGE" "$BASE/html/.releases"
    node -e 'const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));if(!["setup","daily"].includes(r.kind)||!(/^[a-f0-9]{40}$/).test(r.gitSha)||!(/^[a-f0-9]{40}$/).test(r.baseSha))throw Error("Invalid reviewed release contract")' "$INPUT/release.json"
    compare_infrastructure > "$STAGE/infrastructure.before.json"
    healthy
    containers > "$STAGE/containers.before"
    cp "$BASE/nginx.conf" "$STAGE/nginx.before"
    if test -L "$BASE/html/current"; then
      PREVIOUS="$(readlink "$BASE/html/current")"
      case "$PREVIOUS" in .releases/*) ;; *) echo 'Unexpected active pointer' >&2; exit 1 ;; esac
      case "$PREVIOUS" in *..*) exit 1 ;; esac
      test -d "$BASE/html/$PREVIOUS"
      printf '%s\n' "$PREVIOUS" > "$STAGE/previous-target"
      OLD_SITE="$BASE/html/$PREVIOUS"
      node -e 'const fs=require("fs"),path=require("path");const proposed=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));const active=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));if(proposed.baseSha!==active.gitSha)throw Error("Active release advanced; editorial deployment blocked")' "$INPUT/release.json" "$BASE/releases/${PREVIOUS#.releases/}/release.json"
    else
      test ! -e "$BASE/html/current"
      printf '%s\n' LEGACY > "$STAGE/previous-target"
      OLD_SITE="$BASE/html"
      node -e 'const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));if(r.kind!=="setup")throw Error("Initial static migration requires reviewed setup publication")' "$INPUT/release.json"
    fi
    test "$(sha "$INPUT/site.tar.gz")" = "$EXPECTED_SITE_SHA"
    test "$(sha "$INPUT/nginx.conf")" = "$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).nginx.sha256)' "$INPUT/infrastructure.json")"
    test ! -e "$NEW_SITE"
    mkdir "$NEW_SITE"
    tar -xzf "$INPUT/site.tar.gz" -C "$NEW_SITE"
    chmod -R u=rwX,go=rX "$NEW_SITE"
    test -s "$NEW_SITE/index.html"
    test -s "$NEW_SITE/en/index.html"
    test -s "$NEW_SITE/llms-full.txt"
    test -s "$NEW_SITE/_newsletter-redirects.map"
    # Keep immutable assets used by already open sessions; never overwrite candidate files.
    for ASSET_DIRECTORY in _astro arena/assets; do
      if test -d "$OLD_SITE/$ASSET_DIRECTORY"; then
        mkdir -p "$NEW_SITE/$ASSET_DIRECTORY"
        find "$OLD_SITE/$ASSET_DIRECTORY" -type f -exec sh -c '
          SOURCE_ROOT="$1"; TARGET_ROOT="$2"; shift 2
          for SOURCE_FILE do
            RELATIVE_FILE="${SOURCE_FILE#"$SOURCE_ROOT"/}"
            TARGET_FILE="$TARGET_ROOT/$RELATIVE_FILE"
            if test ! -e "$TARGET_FILE"; then
              mkdir -p "$(dirname "$TARGET_FILE")"
              cp -p "$SOURCE_FILE" "$TARGET_FILE"
            fi
          done
        ' sh "$OLD_SITE/$ASSET_DIRECTORY" "$NEW_SITE/$ASSET_DIRECTORY" {} +
      fi
    done
    cp "$INPUT/release.json" "$STAGE/release.json"
    cp "$INPUT/baseline.json" "$STAGE/baseline.json"
    cp "$INPUT/infrastructure.json" "$STAGE/infrastructure.json"
    printf '%s\n' prepared > "$STATE"
    trap - 0 1 2 15
    echo "Release $STAMP prepared; active site unchanged."
    ;;
  activate)
    owned_lock
    test "$(cat "$STATE")" = prepared
    compare_infrastructure > "$STAGE/infrastructure.activation.json"
    unchanged_containers
    healthy
    printf '%s\n' activated > "$STATE"
    trap 'rollback' 0 1 2 15
    swap_pointer ".releases/$STAMP"
    cat "$INPUT/nginx.conf" > "$BASE/nginx.conf"
    docker exec "$SITE_CONTAINER" nginx -t
    docker exec "$SITE_CONTAINER" nginx -s reload
    unchanged_containers
    healthy
    trap - 0 1 2 15
    echo "Release $STAMP activated; awaiting full public verification."
    ;;
  finalize)
    owned_lock
    test "$(cat "$STATE")" = activated
    test "$(readlink "$BASE/html/current")" = ".releases/$STAMP"
    compare_infrastructure > "$STAGE/infrastructure.after.json"
    unchanged_containers
    healthy
    printf '%s\n' verified > "$STATE"
    release_lock
    echo "Release $STAMP finalized; site and lead container identities unchanged."
    ;;
  rollback) rollback ;;
  *) echo 'Unsupported editorial deployment action' >&2; exit 1 ;;
esac
