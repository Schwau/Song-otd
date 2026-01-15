export async function GET(_req, { params }) {
  const { code } = await params; // Next 16: params is a Promise

  // Stub validation rules (später Supabase)
  const looksValid =
    typeof code === "string" &&
    code.length >= 4 &&
    code.length <= 64 &&
    !/[^a-zA-Z0-9-_]/.test(code); // basic charset

  // Example: treat "dead" codes as invalid
  const valid = looksValid && code !== "0000" && code.toLowerCase() !== "invalid";

  if (!valid) {
    return Response.json(
      { valid: false },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Fake group info for now
  return Response.json(
    {
      valid: true,
      groupName: "Beispielgruppe",
      memberCount: 5,
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
