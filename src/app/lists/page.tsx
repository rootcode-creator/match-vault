import React from "react";
import {
  fetchCurrentUserLikeIds,
  fetchLikeMembers,
} from "../actions/likeActions";
import ListsTab from "./ListsTab";

export default async function ListsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikeMembers(
    type ?? "source"
  );

  return (
    <div>
      <ListsTab
        members={members}
        likeIds={likeIds}
      />
    </div>
  );
}