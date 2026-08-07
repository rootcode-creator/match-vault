import { getMemberPhotosByUserId } from "@/app/actions/memberActions";
import React from "react";
import MemberImage from "@/components/MemberImage";


export default async function PhotosPage({

  params,

}: {

  params: Promise<{ userId: string }>;

}) {

  const { userId } = await params;

  const photos = await getMemberPhotosByUserId(

    userId

  );
  return (
    <div className="p-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-950">Photos</h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Browse this member's photo gallery.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos &&
          photos.map((photo) => (
            <div key={photo.id}>
              <MemberImage photo={photo} />
            </div>
          ))}
      </div>
    </div>
  );

}