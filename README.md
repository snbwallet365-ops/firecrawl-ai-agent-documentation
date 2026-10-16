# Firecrawl AI agent workspace

This repository started from the Firecrawl workspace template and includes additional scaffolding for a visa agency workflow:

- Visa requirements library (DB table + API + simple UI)
- Visa case workspace table and API endpoints
- Human approval log table
- Skills library and uploads metadata table (placeholders)

Important notes

- Files uploaded by clients require a storage provider (S3/GCS). The uploads table holds metadata and a storage key — files are not stored in the database.
- This repository does not include authentication. Add an auth layer (NextAuth, Clerk, or similar) before using in production.
- To deploy the app publicly, use Vercel (recommended) or Netlify and set DATABASE_URL and FIRECRAWL_API_KEY as environment variables.

How to run locally

1. Set DATABASE_URL to a Postgres instance.
2. Install dependencies: npm install
3. Run the dev server: npm run dev

DB Migrations

This project uses Drizzle ORM. Add migrations or use drizzle-kit to create the new tables defined in src/db/schema.ts.

Next steps I can help with

- Add file upload integration (S3) and secure upload endpoints.
- Implement the human approval UI with field-by-field summaries and an approval workflow.
- Add authentication and per-user workspaces.
- Deploy to Vercel and wire environment variables (I can provide deployment steps but cannot deploy to Vercel on your behalf without your credentials).
