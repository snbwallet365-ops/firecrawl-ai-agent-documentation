"use client";

import { useEffect, useState } from "react";

export default function VisaLibrary() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ country: "", visaType: "", notes: "", sourceUrl: "", lastVerified: "" });

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/visa/requirements', { cache: 'no-store' });
      const body = await res.json();
      setItems(Array.isArray(body.data) ? body.data : []);
    } catch {
      // ignore
    } finally { setLoading(false); }
  }

  async function save(e: Event) {
    e.preventDefault();
    try {
      const res = await fetch('/api/visa/requirements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Save failed');
      await load();
      setForm({ country: '', visaType: '', notes: '', sourceUrl: '', lastVerified: '' });
    } catch (err) {
      alert(String(err));
    }
  }

  return (
    <div>
      <h2>Visa requirements library</h2>
      <p>Store per-country and visa-type requirements, source links, and last-verified dates. This is a minimal starter UI.</p>
      <form onSubmit={(e) => void save(e as unknown as Event)}>
        <input value={form.country} onChange={(e) => setForm((s) => ({ ...s, country: (e.target as HTMLInputElement).value }))} placeholder="Country" required />
        <input value={form.visaType} onChange={(e) => setForm((s) => ({ ...s, visaType: (e.target as HTMLInputElement).value }))} placeholder="Visa type" required />
        <input value={form.sourceUrl} onChange={(e) => setForm((s) => ({ ...s, sourceUrl: (e.target as HTMLInputElement).value }))} placeholder="Source URL" />
        <input value={form.lastVerified} onChange={(e) => setForm((s) => ({ ...s, lastVerified: (e.target as HTMLInputElement).value }))} placeholder="Last verified (ISO)" />
        <textarea value={form.notes} onChange={(e) => setForm((s) => ({ ...s, notes: (e.target as HTMLTextAreaElement).value }))} placeholder="Notes" />
        <button type="submit">Save requirement</button>
      </form>

      <h3>Existing</h3>
      {loading ? <p>Loading…</p> : <ul>{items.map((it) => <li key={it.id}>{it.country} · {it.visaType} — {it.sourceUrl} ({it.lastVerified ?? 'never'})</li>)}</ul>}
    </div>
  );
}
