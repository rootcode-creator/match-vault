import { getMemberPhotosByUserId } from "@/app/actions/memberActions";
import React from "react";
import PhotosClient from "./PhotosClient";

export default async function PhotosPage({
  params,
}: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const photos = await getMemberPhotosByUserId(userId);
  return <PhotosClient photos={photos ?? []} />;
}