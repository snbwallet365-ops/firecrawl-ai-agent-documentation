import { db } from "@/db";
import { visaRequirements } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(visaRequirements).orderBy(desc(visaRequirements.createdAt)).limit(200);
    return Response.json({ data: rows });
  } catch (err) {
    return Response.json({ error: "Could not read visa requirements." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON body required." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid body." }, { status: 400 });
  const record = body as Record<string, unknown>;
  const country = typeof record.country === "string" ? record.country.trim() : "";
  const visaType = typeof record.visaType === "string" ? record.visaType.trim() : "";
  if (!country || !visaType) return Response.json({ error: "country and visaType are required." }, { status: 400 });
  try {
    const insert = await db.insert(visaRequirements).values({
      country,
      visaType,
      notes: typeof record.notes === "string" ? record.notes : undefined,
      sourceUrl: typeof record.sourceUrl === "string" ? record.sourceUrl : undefined,
      lastVerified: typeof record.lastVerified === "string" ? new Date(record.lastVerified) : undefined,
    }).returning();
    return Response.json({ data: insert });
  } catch (err) {
    return Response.json({ error: "Could not save requirement." }, { status: 500 });
  }
}
