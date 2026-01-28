import React from 'react';
import { getAuthUserId } from '@/app/actions/authActions';
import { getMemberByUserId, getMemberPhotosByUserId } from '@/app/actions/memberActions';
import PhotosClient from './PhotosClient';



export default async function PhotosPage() {

    const userId = await getAuthUserId();
    const member = await getMemberByUserId(userId);
    const photos = await getMemberPhotosByUserId(userId);

    return <PhotosClient member={member ?? null} photos={photos ?? null} />;
}
