import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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
