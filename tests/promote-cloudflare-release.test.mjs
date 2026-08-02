import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

const scriptPath = path.join(
  process.cwd(),
  "scripts",
  "promote-cloudflare-release.sh",
);
const releaseSha = "0123456789abcdef0123456789abcdef01234567";

function validateRelease(tag, sha = releaseSha) {
  return spawnSync("bash", [scriptPath, tag, sha], {
    encoding: "utf8",
    env: {
      ...process.env,
      PROMOTE_VALIDATE_ONLY: "1",
    },
  });
}

test("accepts stable and prerelease semantic-version tags", () => {
  assert.equal(validateRelease("v1.0.0").status, 0);
  assert.equal(validateRelease("v2.4.0-rc.1+build.7").status, 0);
});

test("rejects tags that are not semantic versions", () => {
  const result = validateRelease("production");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /semantic versioning/);
});

test("rejects abbreviated or malformed commit identifiers", () => {
  const result = validateRelease("v1.0.0", "dd8dc07");

  assert.equal(result.status, 1);
  assert.match(result.stderr, /full Git SHA/);
});
