import React from "react";
import {
  fetchCurrentUserLikeIds,
  fetchLikeMembers,
} from "../actions/likeActions";
import ListsTab from "./ListsTab";

export const dynamic = "force-dynamic";

export default async function ListsPage({
  searchParams,
}: {
  searchParams: { type: string };
}) {
  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikeMembers(
    searchParams.type
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