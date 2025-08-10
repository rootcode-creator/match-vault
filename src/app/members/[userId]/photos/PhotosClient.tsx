"use client";

import { Image } from "@heroui/react";
import React from "react";

type Photo = { id: string; url: string };

export default function PhotosClient({ photos }: { photos: Photo[] }) {
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold text-foreground">Photos</h2>
      <div className="my-3 h-px bg-default-200" />

      {photos.length === 0 ? (
        <div className="text-sm text-default-500">No photos.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photos.map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden rounded-xl">
              <Image
                src={p.url}
                alt="Member photo"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}