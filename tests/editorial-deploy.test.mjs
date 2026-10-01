import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const deploy = await readFile(new URL('../scripts/deploy.sh', import.meta.url), 'utf8');
test('daily official deployment never packages or restarts the lead service', () => {
  assert.doesNotMatch(deploy, /SERVICE_ARCHIVE|docker compose[^\n]*(?:down|up)|docker (?:stop|restart|rm)/);
  assert.match(deploy, /npm run validate/);
  assert.match(deploy, /newsletter-continuity\.mjs.*capture/);
  assert.match(deploy, /newsletter-continuity\.mjs.*candidate/);
  assert.match(deploy, /newsletter-continuity\.mjs.*verify/);
  assert.match(deploy, /git ls-remote.*refs\/heads\/main/);
});

test('official deployment keeps rollback active during complete public verification', () => {
  assert.match(deploy, /editorial-deploy-remote\.sh/);
  assert.match(deploy, /rollback/);
  assert.ok(deploy.indexOf('newsletter-continuity.mjs verify') < deploy.indexOf('remote_action finalize'));
});

test('initial SSH inspection tolerates omitted empty digest without any production mutation', () => {
  const result=spawnSync('sh',['scripts/lib/editorial-deploy-remote.sh','inspect','test-ssh-args'],{encoding:'utf8',env:{...process.env,EDITORIAL_DEPLOY_TEST:'1',EDITORIAL_DEPLOY_TEST_BASE:join(tmpdir(),'newsletter-absent-test-base'),EDITORIAL_DEPLOY_TEST_SITE_CONTAINER:'newsletter-test-site',EDITORIAL_DEPLOY_TEST_LEADS_CONTAINER:'newsletter-test-leads',EDITORIAL_DEPLOY_TEST_INPUT:join(tmpdir(),'newsletter-absent-test-input')}});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual(JSON.parse(result.stdout),{legacy:true,gitSha:null});
  assert.match(deploy,/SITE_SHA:-not-prepared/);
  assert.match(deploy,/echo "Deployment evidence preserved at \$EVIDENCE" >&2/);
});
