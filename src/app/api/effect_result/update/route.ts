export async function POST() {
  return Response.json(
    { error: "Client-side result updates are disabled." },
    { status: 410 }
  );
}
