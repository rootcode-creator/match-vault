import { getMemberPhotosByUserId } from "@/app/actions/memberActions";
import React from "react";
import CardInnerWrapper from "@/components/CardInnerWrapper";
import MemberImage from "@/components/MemberImage";


export default async function PhotosPage({

  params,

}: {

  params: { userId: string };

}) {

  const photos = await getMemberPhotosByUserId(

    params.userId

  );
  return (
    <CardInnerWrapper



      header="Photos"


      body={

        <div className="grid grid-cols-5 gap-3">

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