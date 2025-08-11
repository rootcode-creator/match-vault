import { getAuthUserId } from "@/app/actions/authActions";
import { getMemberByUserId } from "@/app/actions/memberActions";
import { redirect, notFound } from "next/navigation";
import EditPageClient from "./EditPageClient";

export default async function MemberEditPage() {
  const userId = await getAuthUserId();
  if (!userId) redirect("/login");

  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  return <EditPageClient member={member} />;
}