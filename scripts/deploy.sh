#!/bin/sh
set -eu

REMOTE_HOST="rodrigo@76.13.173.181"
GIT_REMOTE="git@github.com:TozatoRodrigo/blog_de_ia.git"
ORIGIN="https://produtocomia.com.br"
HEAD_SHA="$(git rev-parse HEAD)"
KIND=daily
if test "$(git log -1 --format=%s)" = 'ops: make daily newsletter publication additive'; then KIND=setup; fi
STAMP="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short HEAD)-$(node -e 'console.log(require("crypto").randomBytes(4).toString("hex"))')"
EVIDENCE="$(mktemp -d /tmp/produtocomia-deploy-$STAMP-XXXXXX)"
INPUT="/tmp/produtocomia-$STAMP-input"
SITE_ARCHIVE="$EVIDENCE/site.tar.gz"
PREPARED=0
FINALIZED=0
OWN_LOCAL_LOCK=0
PUBLICATION_TOKEN="${PRODUTOCOMIA_PUBLICATION_TOKEN:-}"

assert_remote_head() {
  REMOTE_SHA="$(git ls-remote "$GIT_REMOTE" refs/heads/main | awk '{print $1}')"
  test "$REMOTE_SHA" = "$HEAD_SHA" || { echo 'Remote main differs from candidate HEAD; deployment blocked.' >&2; return 1; }
  test "$(git rev-parse HEAD)" = "$HEAD_SHA"
}
remote_action() {
  ssh "$REMOTE_HOST" sh -s -- "$1" "$STAMP" "${SITE_SHA:-not-prepared}" < scripts/lib/editorial-deploy-remote.sh
}
cleanup() {
  RESULT=$?
  trap - 0 1 2 15
  if test "$PREPARED" -eq 1 && test "$FINALIZED" -eq 0; then
    if remote_action rollback > "$EVIDENCE/rollback.log" 2>&1; then
      cat "$EVIDENCE/rollback.log" >&2
      if node scripts/newsletter-continuity.mjs verify "$EVIDENCE/baseline.json" "$ORIGIN" > "$EVIDENCE/rollback-verification.json" 2>&1; then
        echo 'Automatic rollback verified against the complete production baseline.' >&2
      else
        echo "Rollback public verification failed; inspect $EVIDENCE/rollback-verification.json." >&2
      fi
    else
      echo "Automatic rollback could not be confirmed; inspect $EVIDENCE/rollback.log. No alternate deploy attempted." >&2
    fi
    RESULT=1
  fi
  if test "$OWN_LOCAL_LOCK" -eq 1; then
    node scripts/newsletter-preflight.mjs unlock "$PUBLICATION_TOKEN" || RESULT=1
  fi
  echo "Deployment evidence preserved at $EVIDENCE" >&2
  exit "$RESULT"
}
trap cleanup 0 1 2 15

if test -z "$PUBLICATION_TOKEN"; then
  node scripts/newsletter-preflight.mjs lock official-deploy > "$EVIDENCE/local-lock.json"
  PUBLICATION_TOKEN="$(node -e 'console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).token)' "$EVIDENCE/local-lock.json")"
  OWN_LOCAL_LOCK=1
else
  node -e 'const fs=require("fs"); const owner=JSON.parse(fs.readFileSync("/private/tmp/produtocomia-publication.lock/owner.json","utf8")); if(owner.token!==process.argv[1])process.exit(1)' "$PUBLICATION_TOKEN"
fi
test -z "$(git status --porcelain --untracked-files=all -- . ':!node_modules' ':!arena/node_modules')" || { echo 'Publication checkout must be clean before official deploy.' >&2; exit 1; }
assert_remote_head
remote_action inspect > "$EVIDENCE/active-release.json"
BASE_SHA="$(node -e 'const fs=require("fs");const a=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));console.log(a.gitSha||"")' "$EVIDENCE/active-release.json")"
if test -z "$BASE_SHA"; then
  test "$KIND" = setup || { echo 'Production needs the reviewed static setup release before daily publication.' >&2; exit 1; }
  BASE_SHA="$(git rev-parse HEAD^)"
fi
node scripts/newsletter-preflight.mjs publication-contract "$KIND" "$BASE_SHA" "$HEAD_SHA" > "$EVIDENCE/publication-contract.json"
node scripts/newsletter-continuity.mjs capture "$ORIGIN" "$EVIDENCE/baseline.json"
node scripts/newsletter-preflight.mjs snapshot-validation "$EVIDENCE/validation-files.json"
npm run validate
node scripts/newsletter-preflight.mjs verify-build "$EVIDENCE/validation-files.json"
node scripts/newsletter-continuity.mjs verify-editions "$EVIDENCE/publication-contract.json" dist > "$EVIDENCE/edition-comparison.json"
node scripts/newsletter-continuity.mjs candidate "$EVIDENCE/baseline.json" dist > "$EVIDENCE/candidate-comparison.json"
node scripts/newsletter-continuity.mjs expect-candidate "$EVIDENCE/baseline.json" dist "$EVIDENCE/expected.json" > "$EVIDENCE/expected-summary.json"
test -z "$(git status --porcelain --untracked-files=all -- . ':!node_modules' ':!arena/node_modules')" || { echo 'Validation altered tracked or unexpected files; no deployment.' >&2; exit 1; }
node scripts/newsletter-infrastructure.mjs manifest "$PWD" "$EVIDENCE/infrastructure.json"
node -e 'const fs=require("fs");fs.writeFileSync(process.argv[1],JSON.stringify({version:1,gitSha:process.argv[2],baseSha:process.argv[3],kind:process.argv[4],createdAt:new Date().toISOString(),origin:"https://produtocomia.com.br"},null,2)+"\n",{flag:"wx"})' "$EVIDENCE/release.json" "$HEAD_SHA" "$BASE_SHA" "$KIND"
tar -C dist -czf "$SITE_ARCHIVE" .
SITE_SHA="$(shasum -a 256 "$SITE_ARCHIVE" | awk '{print $1}')"
shasum -a 256 "$SITE_ARCHIVE"
assert_remote_head
ssh "$REMOTE_HOST" mkdir -m 700 "$INPUT"
scp "$SITE_ARCHIVE" "$REMOTE_HOST:$INPUT/site.tar.gz"
scp "$EVIDENCE/infrastructure.json" "$EVIDENCE/release.json" "$EVIDENCE/baseline.json" scripts/newsletter-infrastructure.mjs deploy/nginx.conf "$REMOTE_HOST:$INPUT/"
remote_action prepare > "$EVIDENCE/prepare.log" 2>&1
cat "$EVIDENCE/prepare.log"
PREPARED=1
assert_remote_head
remote_action activate > "$EVIDENCE/activate.log" 2>&1
cat "$EVIDENCE/activate.log"
node scripts/smoke-test.mjs "$ORIGIN" > "$EVIDENCE/smoke.log" 2>&1
node scripts/newsletter-continuity.mjs verify "$EVIDENCE/expected.json" "$ORIGIN" > "$EVIDENCE/postdeploy-comparison.json"
assert_remote_head
remote_action finalize > "$EVIDENCE/finalize.log" 2>&1
cat "$EVIDENCE/finalize.log"
FINALIZED=1
echo "Release $STAMP published successfully from $HEAD_SHA."
