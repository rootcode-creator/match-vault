"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import MemberPhotos from '@/components/MemberPhotos';
import type { Member, Photo } from '@prisma/client';
import CardInnerWrapper from '@/components/CardInnerWrapper';

const MemberPhotoUpload = dynamic(() => import('./MemberPhotoUpload'), {
  ssr: false,
});

type Props = {
  member: Member | null;
  photos: Photo[] | null;
};

export default function PhotosClient({ member, photos }: Props) {
  return (


        <CardInnerWrapper header="Edit Profile" body={
          <>
          
              <MemberPhotoUpload />
        <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image} />
      
          
          </>
        } />


    
  );
}
