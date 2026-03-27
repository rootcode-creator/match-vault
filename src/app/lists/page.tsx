import React from "react";
import {
  fetchCurrentUserLikeIds,
  fetchLikeMembers,
} from "../actions/likeActions";
import ListsTab from "./ListsTab";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ListsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const type =
    params.type === "source" ||
    params.type === "target" ||
    params.type === "mutual"
      ? params.type
      : "source";

  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikeMembers(type);

  return (
    <div>
      <ListsTab
        members={members}
        likeIds={likeIds}
      />
    </div>
  );
}