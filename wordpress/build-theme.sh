#!/usr/bin/env bash
# Build linkone-theme.zip ready for WordPress upload.
#
# Usage:
#   ./wordpress/build-theme.sh
#
# Resulting file: wordpress/linkone-theme.zip
#   Upload via WP admin → Appearance → Themes → Add New Theme → Upload Theme.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
THEME_DIR="${SCRIPT_DIR}/linkone-theme"
ASSETS_DIR="${THEME_DIR}/assets"
OUT="${SCRIPT_DIR}/linkone-theme.zip"

if [[ ! -d "${THEME_DIR}" ]]; then
  echo "✗ Theme directory not found: ${THEME_DIR}" >&2
  exit 1
fi

# Sync assets from the repo root so the theme always packages the latest LP.
mkdir -p "${ASSETS_DIR}"
cp "${REPO_ROOT}/styles.css"  "${ASSETS_DIR}/styles.css"
cp "${REPO_ROOT}/script.js"   "${ASSETS_DIR}/script.js"
cp "${REPO_ROOT}/favicon.svg" "${ASSETS_DIR}/favicon.svg"

# Build the zip.
rm -f "${OUT}"
( cd "${SCRIPT_DIR}" && zip -rq "${OUT}" linkone-theme \
    -x '*/.DS_Store' '*/.git/*' '*/node_modules/*' )

SIZE=$(du -h "${OUT}" | awk '{print $1}')
echo "✓ Built ${OUT} (${SIZE})"
echo "  Upload via WP admin → Appearance → Themes → Add New Theme → Upload Theme."
