#!/usr/bin/env bash

set -euo pipefail

readonly RELEASE_TAG="${1:-}"
readonly RELEASE_SHA="${2:-}"
readonly DEPLOYMENT_BRANCH="cloudflare-production"
readonly SEMVER_TAG_PATTERN='^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$'

if [[ ! "$RELEASE_TAG" =~ $SEMVER_TAG_PATTERN ]]; then
  echo "Release tags must use semantic versioning, for example v1.0.0." >&2
  exit 1
fi

if [[ ! "$RELEASE_SHA" =~ ^[0-9a-f]{40}$ ]]; then
  echo "The release commit must be a full Git SHA." >&2
  exit 1
fi

if [[ "${PROMOTE_VALIDATE_ONLY:-0}" == "1" ]]; then
  exit 0
fi

git push --force origin "${RELEASE_SHA}:refs/heads/${DEPLOYMENT_BRANCH}"
