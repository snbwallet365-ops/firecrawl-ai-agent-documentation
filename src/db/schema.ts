import { pgTable, serial, timestamp, varchar, text } from "drizzle-orm/pg-core";

/** Minimal, privacy-conscious activity log. API keys, prompts, and page content are never stored. */
export const automationRuns = pgTable("automation_runs", {
  id: serial("id").primaryKey(),
  operation: varchar("operation", { length: 32 }).notNull(),
  label: varchar("label", { length: 180 }).notNull(),
  status: varchar("status", { length: 24 }).notNull(),
  externalId: varchar("external_id", { length: 128 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Visa requirements library. Stores a summary, source link, and last-verified date. */
export const visaRequirements = pgTable("visa_requirements", {
  id: serial("id").primaryKey(),
  country: varchar("country", { length: 100 }).notNull(),
  visaType: varchar("visa_type", { length: 100 }).notNull(),
  notes: text("notes"),
  sourceUrl: varchar("source_url", { length: 512 }),
  lastVerified: timestamp("last_verified", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Per-country / per-visa-type document checklist items (simple list as text per item). */
export const visaDocuments = pgTable("visa_documents", {
  id: serial("id").primaryKey(),
  requirementId: varchar("requirement_id", { length: 64 }),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description"),
  required: varchar("required", { length: 8 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Visa application cases for clients. Tracks status, deadlines, assigned agent, and next action. */
export const visaCases = pgTable("visa_cases", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 180 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  visaType: varchar("visa_type", { length: 100 }).notNull(),
  status: varchar("status", { length: 80 }).notNull(),
  assignedAgent: varchar("assigned_agent", { length: 120 }),
  deadline: timestamp("deadline", { withTimezone: true }),
  nextAction: text("next_action"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Human approval log for automated submissions. */
export const approvals = pgTable("approvals", {
  id: serial("id").primaryKey(),
  caseId: varchar("case_id", { length: 64 }).notNull(),
  reviewer: varchar("reviewer", { length: 180 }).notNull(),
  approved: varchar("approved", { length: 8 }).notNull(),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Reusable skills / workflows for the browser agent. */
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  description: text("description"),
  code: text("code"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** Basic uploads table (reference only - storing files requires a storage provider).
 *  This table stores metadata and a storage key (S3, GCS, etc.) — files themselves are not stored in the DB.
 */
export const uploads = pgTable("uploads", {
  id: serial("id").primaryKey(),
  caseId: varchar("case_id", { length: 64 }),
  filename: varchar("filename", { length: 260 }).notNull(),
  storageKey: varchar("storage_key", { length: 512 }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
});
