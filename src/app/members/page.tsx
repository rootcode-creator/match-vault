import React from 'react';
import { getMembers } from '../actions/memberActions';
import MemberCard from './MemberCard';

export default async function MembersPage() {
  const members = await getMembers();
  return (
    <div className="mt-10 mb-10 container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">

      {members &&

        members.map((member) => (

          <MemberCard

            member={member}
            key={member.id}

          />
        ))}
    </div>
  );
}

