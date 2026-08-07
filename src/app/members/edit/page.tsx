import React from 'react';
import EditForm from './EditForm';
import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId } from '@/app/actions/memberActions';
import { notFound } from 'next/navigation';

export default async function MemberEditPage() {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);
  if (!member) return notFound();

  return (
    <div className="flex h-full w-full max-w-none flex-col overflow-hidden rounded-[28px] border border-black bg-white px-8 py-8 shadow-sm">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-950">Edit Profile</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Update your name, bio, and location details so other members can find you.
        </p>
      </div>
      <div className="mt-8 flex-1">
        <EditForm member={member} />
      </div>
    </div>
  );
}
