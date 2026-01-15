import InviteClient from "./InviteClient";

export default async function InvitePage({ params }) {
  const { code = "" } = await params; // ✅ Next 16 expects await
  return <InviteClient code={code} />;
}
