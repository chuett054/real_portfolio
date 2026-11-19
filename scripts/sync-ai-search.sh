#!/bin/sh
# Upload ai-search-docs/*.md to the R2 bucket and re-index the AI Search instance.
set -e
cd "$(dirname "$0")/.."
BUCKET=cole-portfolio-ai-search
INSTANCE=cole-portfolio
for f in ai-search-docs/*.md; do
  name=$(basename "$f")
  [ "$name" = "README.md" ] && continue
  echo "Uploading $name"
  npx wrangler r2 object put "$BUCKET/$name" --file "$f" --content-type text/markdown --remote
done
npx wrangler ai-search jobs create "$INSTANCE"
