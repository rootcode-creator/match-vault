import React from 'react';
import { getMembers } from '../actions/memberActions';
import MemberCard from './MemberCard';
import { fetchCurrentUserLikeIds } from '../actions/likeActions';
import PaginationComponent from '@/components/PaginationComponent';
import Filters from '@/components/navbar/Filters';
import { GetMemberParams } from '@/types';
import EmptyState from '@/components/EmptyState';
import { getAuthUserIdOrNull } from '../actions/authActions';
import { redirect } from 'next/navigation';

export default async function MembersPage({searchParams,}:{
  searchParams: Promise<GetMemberParams>;
}) {
  const userId = await getAuthUserIdOrNull();

  if (!userId) {
    redirect('/login');
  }

  const params = await searchParams;
  
  const {items:members, totalCount}= await getMembers(params);
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <div className="mb-10 px-4 sm:px-6 lg:px-8">
      <Filters />

      {!members?.length ? (
        <EmptyState />
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {members.map((member) => (
            <MemberCard
              member={member}
              key={member.id}
              likeIds={likeIds}
            />
          ))}
        </div>
      )}

      {!!members.length && (
        <PaginationComponent totalCount={totalCount} />
      )}
    </div>
  );
}

