import VisaLibrary from "@/components/visaLibrary";

export const dynamic = "force-dynamic";

export default function VisaPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Visa management</h1>
      <p>This workspace adds a visa requirements library, case workspace, and human approval stubs. Use the forms below to get started. This is a starter implementation — extend as needed for production.</p>
      <VisaLibrary />
      <section style={{ marginTop: 28 }}>
        <h2>Notes / next steps</h2>
        <ul>
          <li>Human approval flow and secure uploads are scaffolded in the DB and API. Implement a storage provider (S3/GCS) and auth for uploads.</li>
          <li>Skills library and browser-run enablement exists as a table. Add admin UI to author skills and enable per-run selection.</li>
          <li>Before production use: add authentication, server-side secret storage, and validate all inputs.</li>
        </ul>
      </section>
    </main>
  );
}
