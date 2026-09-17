import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { drivers, trips } from "../../../db/schema";

export async function POST(request: Request) {
  const driverId = request.headers.get("oai-authenticated-user-id");
  if (!driverId) return Response.json({ error: "Sign in required" }, { status: 401 });

  const body = await request.json() as { destination?: string; targetMinutes?: number };
  const destination = body.destination?.trim();
  const targetMinutes = Number(body.targetMinutes);
  if (!destination || targetMinutes < 10 || targetMinutes > 240) return Response.json({ error: "Enter a destination and a safe arrival window." }, { status: 400 });

  const db = getDb();
  const existing = await db.select({ id: drivers.id }).from(drivers).where(eq(drivers.id, driverId)).limit(1);
  if (!existing.length) {
    await db.insert(drivers).values({ id: driverId, email: request.headers.get("oai-authenticated-user-email"), createdAt: new Date() });
  }
  const [trip] = await db.insert(trips).values({ driverId, destinationLabel: destination, targetMinutes, createdAt: new Date() }).returning();
  return Response.json({ trip }, { status: 201 });
}
