import { redirect } from "next/navigation";

export default async function ShortInvite({ params }) {
  const { code } = await params; // Next 16
  redirect(`/invite/${code}`);
}
