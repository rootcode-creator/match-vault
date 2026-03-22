import React from 'react';
import { getMembers } from '../actions/memberActions';
import MemberCard from './MemberCard';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';
import PaginationComponent from '@/components/PaginationComponent';
import Filters from '@/components/navbar/Filters';
import { GetMemberParams, UserFilters } from '@/types';

export default async function MembersPage({searchParams,}:{
  searchParams: Promise<GetMemberParams>;
}) {
  const params = await searchParams;
  const {items:members, totalCount}= await getMembers(params);
  const likeIds = await fetchCurrentUserLikeIds();

  if (!members?.length) {
    return (
      <div className="mt-6 mb-10 px-4 sm:px-6 lg:px-8">
        <p className="text-default-500">No members found.</p>
      </div>
    );
  }

  return (
    <div className="mb-10 px-4 sm:px-6 lg:px-8">
      <Filters />

      <div className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
       {members &&
          members.map((member) => (
            <MemberCard
              member={member}
              key={member.id}
              likeIds={likeIds}
            />
          ))}
      </div>

      <PaginationComponent />
    </div>
  );
}

