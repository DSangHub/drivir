// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
export {};
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const drivers = sqliteTable("drivers", {
  id: text("id").primaryKey(),
  email: text("email"),
  displayName: text("display_name"),
  totalPoints: integer("total_points").notNull().default(0),
  safeStreak: integer("safe_streak").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const trips = sqliteTable("trips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  driverId: text("driver_id").notNull().references(() => drivers.id),
  destinationLabel: text("destination_label").notNull(),
  targetMinutes: integer("target_minutes").notNull(),
  safeScore: integer("safe_score"),
  pointsEarned: integer("points_earned").notNull().default(0),
  status: text("status", { enum: ["planned", "active", "complete"] }).notNull().default("planned"),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const drivingEvents = sqliteTable("driving_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tripId: integer("trip_id").notNull().references(() => trips.id),
  eventType: text("event_type", { enum: ["smooth_brake", "hard_brake", "complete_stop", "lane_change", "speeding"] }).notNull(),
  safe: integer("safe", { mode: "boolean" }).notNull(),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).notNull(),
});
