"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import MemberPhotos from '@/components/MemberPhotos';
import type { Member, Photo } from '@prisma/client';

const MemberPhotoUpload = dynamic(() => import('./MemberPhotoUpload'), {
  ssr: false,
});

type Props = {
  member: Member | null;
  photos: Photo[] | null;
};

export default function PhotosClient({ member, photos }: Props) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-black bg-white px-8 py-8 shadow-sm">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-950">Update Photos</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Add or manage your profile photos so other members can see your best look.
        </p>
      </div>
      <div className="mt-8 space-y-6 flex-1">
        <MemberPhotoUpload />
        <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
      </div>
    </div>
  );
}
