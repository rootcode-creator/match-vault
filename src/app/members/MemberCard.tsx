"use client";
import LikeButton from "@/components/LikeButton";
import PresenceDot from "@/components/PresenceDot";
import { calculateAge } from "@/lib/util";
import { Card, CardBody, CardFooter } from "@heroui/react";

import type { Member } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";



type Props = {
    member: Member;
    likeIds: string[];
}

export default function MemberCard({
    member,
    likeIds,
}: Props) {

    const hasLiked = likeIds.includes(member.userId);

    const preventLinkAction = (e: React.MouseEvent) =>{
        e.preventDefault();
        e.stopPropagation();
    }
    return (
        <Card
            className="w-full overflow-hidden shadow-md rounded-2xl border border-default-200 bg-white hover:shadow-lg transition-shadow transform-gpu hover:-translate-y-0.5 focus-visible:outline-none"
        >
            <CardBody className="p-0">
                <Link
                    href={`/members/${member.userId}`}
                    aria-label={`View ${member.name}'s profile`}
                    className="relative block aspect-[4/3] overflow-hidden rounded-2xl transform-gpu transition-transform duration-200 hover:scale-[1.01] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                    <Image
                        draggable={false}
                        alt={`${member.name}'s photo`}
                        src={member.image || "/images/user.png"}
                        fill
                        sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 20vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover"
                    />
                </Link>

                <div onClick={preventLinkAction}>
                    <div className="absolute top-3 right-3 z-50 flex items-center gap-2">
                        <LikeButton
                            targetId={member.userId}
                            hasLiked={hasLiked}
                        />
                    </div>

                    <div className="absolute top-2 left-3 z-50">
                        <PresenceDot member={member} />
                    </div>
                    </div>

            </CardBody>
            <CardFooter className="flex flex-col items-start gap-1 px-2 sm:px-3 pb-3 pt-2 bg-transparent select-text">
                <div className="flex items-baseline gap-1 min-w-0 leading-tight">
                    <span className="font-semibold text-[15px] md:text-base text-foreground truncate select-text">
                        {member.name}
                    </span>
                    <span className="font-semibold text-[15px] md:text-base text-foreground whitespace-nowrap select-text">
                        , {calculateAge(member.dateOfBirth)}
                    </span>
                </div>
                <span className="text-sm text-default-500 truncate max-w-full select-text">{member.city}</span>
            </CardFooter>
        </Card>
    );



}