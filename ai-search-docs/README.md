# AI Search documents

These Markdown files are what the "Ask about Cole" demo on the Cloudflare page
searches. They are uploaded to the R2 bucket `cole-portfolio-ai-search`, which the
AI Search instance `cole-portfolio` indexes.

Only put information here that is already public on colehuetten.me: anything in
these files can show up in an answer.

After editing, re-upload and re-index:

    npm run ai-search:sync
