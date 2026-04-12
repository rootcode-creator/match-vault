"use client";

import { toggleLikeMember } from "@/app/actions/likeActions";
import { useRouter } from "next/navigation";
import React from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
} from "react-icons/ai";
import { toast } from "react-toastify";

type Props = {
  targetId: string;
  hasLiked: boolean;
};

export default function LikeButton({
  targetId,
  hasLiked,
}: Props) {
  const router = useRouter();

  async function toggleLike() {
    try {
      await toggleLikeMember(targetId, hasLiked);
      router.refresh();
    } catch {
      toast.error("Failed to update like. Please try again.");
    }
  }

  return (
    <div
      onClick={toggleLike}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={
          hasLiked
            ? "fill-indigo-600"
            : "fill-neutral-500/70"
        }
      />
    </div>
  );
}