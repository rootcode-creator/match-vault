import { getMemberPhotosByUserId } from "@/app/actions/memberActions";
import React from "react";
import CardInnerWrapper from "@/components/CardInnerWrapper";
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
    <CardInnerWrapper



      header="Photos"


      body={

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

          {photos &&
            photos.map((photo) => (
              <div key={photo.id}>
                <MemberImage photo={photo} />
              </div>
            ))}

        </div>
       }


    />

  );

}