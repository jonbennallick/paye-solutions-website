#!/usr/bin/env bash
# deploy-cpanel.sh — push Website Files/ to cPanel via FTPS using lftp.
# Local-only (cPanel host blocks GitHub Actions IPs). One-shot: run from project root.
#
# First-time setup:
#   1. brew install lftp
#   2. cp .env.example .env  &&  edit .env with your FTP creds
#   3. chmod +x deploy-cpanel.sh
#
# Run:  ./deploy-cpanel.sh

set -euo pipefail

cd "$(dirname "$0")"

if [ -f .env ]; then
  set -a; source .env; set +a
fi

: "${FTP_HOST:?FTP_HOST not set (put it in .env)}"
: "${FTP_USER:?FTP_USER not set}"
: "${FTP_PASS:?FTP_PASS not set}"

LOCAL_DIR="Website Files"
REMOTE_DIR="/"  # FTP user is chrooted to public_html

if ! command -v lftp >/dev/null 2>&1; then
  echo "lftp not installed. Run:  brew install lftp" >&2
  exit 1
fi

echo "Deploying '$LOCAL_DIR' -> $FTP_HOST:$REMOTE_DIR (FTPS)"

lftp -u "$FTP_USER","$FTP_PASS" -e "
  set ftp:ssl-force yes
  set ftp:ssl-protect-data yes
  set ssl:verify-certificate no
  set ftp:passive-mode yes
  mirror --reverse --delete --verbose \
    --exclude-glob .git \
    --exclude-glob .git/ \
    --exclude-glob .DS_Store \
    --exclude-glob Archive.zip \
    --exclude-glob .netlify/ \
    '$LOCAL_DIR/' '$REMOTE_DIR'
  bye
" "$FTP_HOST"

echo "Deploy complete."
