#!/bin/bash
# Auto-bump cache version, commit, and push.
# Usage: ./deploy.sh "commit message"

set -e

MSG="${1:-Update site}"
TIMESTAMP=$(date +%s)

# Replace any ?v=... with ?v=<timestamp> across all HTML files
for f in *.html; do
  sed -i '' "s/?v=[0-9]*/?v=$TIMESTAMP/g" "$f"
done

git add -A
git commit -m "$MSG

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push
echo "Deployed with cache version $TIMESTAMP"
