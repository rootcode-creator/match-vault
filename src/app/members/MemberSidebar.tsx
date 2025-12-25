"use client";

import { Member } from "@prisma/client";
import { calculateAge } from "@/lib/util";
import Link from "next/link";

type NavLink = { name: string; href: string };
type Props = { member: Member; navLinks?: NavLink[] };

export default function MemberSidebar({ member, navLinks }: Props) {
  const links: NavLink[] = navLinks ?? [
    { name: "Edit Profile", href: "/members/edit" },
    { name: "Update Photos", href: "/members/edit/photos" },
  ];
  return (
  <aside className="max-h-full lg:min-h-[70vh] rounded-2xl overflow-visible bg-white shadow-lg z-20">
    <div className="flex flex-col h-full">
        {/* Header with overlapping avatar */}
        <div className="relative">
          {/* Taller visual color block (absolute) so we can show more gradient without changing layout height */}
          {/* keep header height compact (h-36) so it doesn't intrude on the nav below */}
          <div
            className="absolute inset-x-0 top-0 h-36 rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, #e83e8c 0%, #f6d7ea 50%, #e83e8c 100%)' }}
          />
          {/* subtle overlay to increase contrast across the whole header (no boxes) */}
          <div className="absolute inset-x-0 top-0 h-36 rounded-t-2xl bg-black/12 pointer-events-none" />
          {/* radial mask removed: created a visible halo behind the header text; relying on subtle overlay + text shadow for contrast */}

          {/* Profile info sits visually inside the colored area (overlay) - color-only (no boxes) */}
          {/* position text a bit higher inside the compact header so it doesn't overlap the nav */}
          <div className="absolute inset-x-0 top-2 h-36 flex flex-col items-center justify-start pt-6 z-40">
            <div
              className="text-3xl font-bold text-white drop-shadow-[0_14px_28px_rgba(0,0,0,0.75)] leading-tight"
              style={{ WebkitTextStroke: '0.35px rgba(0,0,0,0.35)' }}
            >
              {member.name}
            </div>
            <div
              className="mt-1 text-sm text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
              style={{ WebkitTextStroke: '0.25px rgba(0,0,0,0.28)' }}
            >
              {calculateAge(member.dateOfBirth)} • {member.city || "Unknown"}
            </div>
            {/* Online moved here to sit immediately under the age line; subtle white-on-transparent style */}
            <div className="mt-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/95 text-primary font-medium text-xs px-3 py-1 shadow-sm ring-1 ring-white/70">
                <span aria-hidden className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Online
              </span>
            </div>
            
          </div>

          <div className="relative p-4">
            {/* position avatar so it overlaps the colored area; keep this container small so flow height doesn't increase */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2/3 z-50">
              {/* image blends into header using overlay blend; thin translucent ring for subtle separation */}
              <img
                src={member.image || "/images/user.png"}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover shadow-sm"
                draggable={false}
              />
            </div>
            <div className="h-6" />
          </div>
        </div>

        {/* Online moved into header above; keep the spacing here for visual rhythm */}
        <div className="px-4 mt-2" />

        {/* Scrollable main content so the sidebar fits in viewport; do not stretch to push footer down */}
      <div className="px-4 pt-0 pb-1 overflow-y-auto flex-1 min-h-0">
              {/* other profile content could go here (bio, stats) */}
            </div>

  {/* Footer - keep nav + Go back pinned to bottom */}
  {/* Add fixed spacer so there's a clear gap between the "Online" badge and the nav */}
  {/* ensure spacer clears the header so the nav buttons are never overlapped visually */}
  <div className="h-24 lg:h-28" />
    <div className="mt-auto px-4 pb-8">
      <nav>
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
             href={link.href}
               className="group block w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-neutral-900 transition-colors transition-opacity duration-300 ease-in-out hover:bg-[#e83e8c] hover:text-white hover:opacity-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <span className="flex items-center justify-center gap-3">
                  {/* icon selection based on link name */}
                  {link.name.toLowerCase().includes('photo') ? (
                    <svg aria-hidden className="w-5 h-5 text-neutral-500 group-hover:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2.5" y="5" width="19" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.5 10.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" fill="currentColor" />
                      <path d="M21 18.5l-5-5-4.5 4.5-3.5-3.5-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : link.name.toLowerCase().includes('chat') ? (
                    <svg aria-hidden className="w-5 h-5 text-neutral-500 group-hover:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 11.5a5 5 0 0 0-5-5H8.5a5 5 0 0 0-5 5v3.5a.75.75 0 0 0 .75.75H7l3 2.5 3-2.5h6.25A.75.75 0 0 0 21 15V11.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg aria-hidden className="w-5 h-5 text-neutral-500 group-hover:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12.5c2.5 0 4.5-2 4.5-4.5S14.5 3.5 12 3.5 7.5 5.5 7.5 7.999 9.5 12.5 12 12.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 20.5v-.75a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span className="text-center">{link.name.replace('Edit ', '').replace('Update ', '')}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Slight top margin to separate from nav, and breathing room below the footer */}
        <div className="h-4" />
        <div>
          <Link
          href="/members"
            className="inline-flex items-center justify-center w-full gap-2 rounded-full bg-white border border-gray-200 px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-colors transition-opacity duration-300 ease-in-out hover:bg-[#e83e8c] hover:text-white hover:opacity-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Go back
          </Link>
        </div>
      </nav>
    </div>
      </div>
    </aside>
  );
}