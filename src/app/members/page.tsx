import React from 'react';
import { getMembers } from '../actions/memberActions';
import MemberCard from './MemberCard';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';

export default async function MembersPage() {
  const members = await getMembers();
  const likeIds = await fetchCurrentUserLikeIds();

  if (!members?.length) {
    return (
      <div className="mt-10 mb-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-default-500">No members found.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 mb-10 container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          likeIds={likeIds ?? []}
        />
      ))}
    </div>
  );
}

