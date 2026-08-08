"use client";

import { auth } from "@/auth";
import { Photo, Role } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import React from "react";
import { Button, Image } from "@heroui/react";
import clsx from "clsx";
import {
  ImCheckmark,
  ImCross,
} from "react-icons/im";
import { useRole } from "@/hooks/useRole";
import {
  approvePhoto,
  rejectPhoto,
} from "@/app/actions/adminActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  photo: Photo | null;
};

export default function MemberImage({
  photo,
}: Props) {
  const role = useRole();
  const isAdmin = role === "ADMIN";
  const router = useRouter();

  if (!photo) return null;

  const approve = async (photoId: string) => {
    try {
      await approvePhoto(photoId);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const reject = async (photo: Photo) => {
    try {
      await rejectPhoto(photo);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative w-full h-full">
      {photo?.publicId ? (
        <CldImage
          alt="Image of member"
          src={photo.publicId}
          width={600}
          height={600}
          crop="fill"
          gravity="faces"
          className={clsx(
            "w-full h-full object-cover",
            {
              "opacity-60": !photo.isApproved && !isAdmin,
            }
          )}
          priority
        />
      ) : (
        <Image
          src={photo?.url || "/images/user.png"}
          alt="Image of user"
          className="w-full h-full object-cover"
        />
      )}

      {/* Awaiting approval badge for non-admins */}
      {!photo?.isApproved && !isAdmin && (
        <div className="absolute top-3 left-3 z-40 inline-flex min-w-max items-center justify-center rounded-full border border-default-200 bg-white px-3 py-1.5 text-xs font-semibold text-default-900 shadow-sm shadow-default-100/40 sm:text-sm">
          <span className="whitespace-nowrap">
            Awaiting approval
          </span>
        </div>
      )}

      {/* Admin action overlay */}
      {isAdmin && (
        <div className="absolute bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 p-1 shadow-sm">
          <Button
            onClick={() => approve(photo.id)}
            color="success"
            variant="bordered"
            aria-label="Approve photo"
            className="h-9 w-9 rounded-full p-0 flex items-center justify-center transition-colors"
          >
            <ImCheckmark size={16} />
          </Button>
          <Button
            onClick={() => reject(photo)}
            color="danger"
            variant="bordered"
            aria-label="Reject photo"
            className="h-9 w-9 rounded-full p-0 flex items-center justify-center transition-colors"
          >
            <ImCross size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}