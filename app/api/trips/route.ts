export async function POST(request: Request) {
  console.log("[api/trips] Vercel request received", { url: request.url });
  return Response.json(
    { error: "Trip storage is not connected yet. Add the production database before enabling live trip recording." },
    { status: 503 },
  );
}
