import { db } from "@/db";
import { visaCases, approvals } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(visaCases).orderBy(desc(visaCases.createdAt)).limit(200);
    return Response.json({ data: rows });
  } catch (err) {
    return Response.json({ error: "Could not read visa cases." }, { status: 500 });
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
  const clientName = typeof record.clientName === "string" ? record.clientName.trim() : "";
  const country = typeof record.country === "string" ? record.country.trim() : "";
  const visaType = typeof record.visaType === "string" ? record.visaType.trim() : "";
  if (!clientName || !country || !visaType) return Response.json({ error: "clientName, country and visaType are required." }, { status: 400 });
  try {
    const insert = await db.insert(visaCases).values({
      clientName,
      country,
      visaType,
      status: typeof record.status === "string" ? record.status : "open",
      assignedAgent: typeof record.assignedAgent === "string" ? record.assignedAgent : undefined,
      deadline: typeof record.deadline === "string" ? new Date(record.deadline) : undefined,
      nextAction: typeof record.nextAction === "string" ? record.nextAction : undefined,
    }).returning();
    return Response.json({ data: insert });
  } catch (err) {
    return Response.json({ error: "Could not create visa case." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON body required." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return Response.json({ error: "Invalid body." }, { status: 400 });
  const record = body as Record<string, unknown>;
  const caseId = typeof record.caseId === "number" ? record.caseId : undefined;
  if (!caseId) return Response.json({ error: "caseId is required for updates." }, { status: 400 });
  try {
    // Minimal update - in real app validate fields carefully
    await db.update(visaCases).set({
      status: typeof record.status === "string" ? record.status : undefined,
      assignedAgent: typeof record.assignedAgent === "string" ? record.assignedAgent : undefined,
      nextAction: typeof record.nextAction === "string" ? record.nextAction : undefined,
    }).where(visaCases.id.eq(caseId));
    return Response.json({ data: true });
  } catch (err) {
    return Response.json({ error: "Could not update visa case." }, { status: 500 });
  }
}
