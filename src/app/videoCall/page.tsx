"use client";
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaLink, FaPlus, FaVideo } from "react-icons/fa";
import InstantMeeting from "./facetime-modals/InstantMeeting";
import UpcomingMeeting from "./facetime-modals/UpcomingMeeting";
import CreateLink from "./facetime-modals/CreateLink";
import JoinMeeting from "./facetime-modals/JoinMeeting";
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
    const [startInstantMeeting, setStartInstantMeeting] =
        useState<boolean>(false);
    const [joinMeeting, setJoinMeeting] = useState<boolean>(false);
    const [showUpcomingMeetings, setShowUpcomingMeetings] =
        useState<boolean>(false);
    const [showCreateLink, setShowCreateLink] = useState<boolean>(false);
    const [defaultRecipientUserIds, setDefaultRecipientUserIds] = useState<string[] | undefined>(undefined);
    const searchParams = useSearchParams();

    useEffect(() => {
        const withId = searchParams?.get("with") ?? undefined;
        if (withId) {
            setDefaultRecipientUserIds([withId]);
            setStartInstantMeeting(true);
        }
    }, [searchParams]);

    return (
        <>
            <main className='relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#EEEEEE] to-[#DDDDDD] px-4 py-10 sm:px-8 sm:py-14'>
                <div aria-hidden className='pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#000000]/10 blur-3xl' />
                <div aria-hidden className='pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-[#CB2957]/10 blur-3xl' />

                <div className='relative mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_30px_120px_-35px_rgba(15,23,42,0.35)] backdrop-blur-md sm:p-10'>
                    <div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-4'>
                            <div className='inline-flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-[#EEEEEE] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#CB2957] shadow-sm'>
                                <span className='inline-block h-2 w-2 rounded-full bg-[#CB2957] animate-pulse' />
                                Live room ready
                            </div>
                            <div>
                                <h1 className='text-4xl font-black leading-tight text-slate-900 sm:text-5xl tracking-tight'>FaceTime Hub</h1>
                                <p className='mt-3 max-w-xl text-sm text-slate-600 sm:text-base leading-relaxed'>Launch a call instantly, share a private invite, or schedule your next meeting from one streamlined dashboard.</p>
                            </div>
                        </div>

                        <button
                            className='inline-flex items-center gap-2 rounded-xl border border-[#DDDDDD] bg-white px-5 py-3 text-sm font-semibold text-[#CB2957] shadow-md transition-all hover:-translate-y-1 hover:border-[#CB2957] hover:shadow-lg hover:bg-[#FFEEF2]'
                            onClick={() => setShowUpcomingMeetings(true)}
                        >
                            <FaCalendarAlt className='text-[#CB2957]' />
                            Upcoming FaceTime
                        </button>
                    </div>

                    <div className='grid w-full grid-cols-1 gap-5 md:grid-cols-3'>
                        <button
                            className='group relative overflow-hidden rounded-2xl border border-[#DDDDDD] bg-gradient-to-br from-[#000000] to-[#000000] px-6 py-7 text-left text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
                            onClick={() => setShowCreateLink(true)}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                            <div className='relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#000000] shadow-md transition-all duration-300'>
                                <FaLink className='text-base' />
                            </div>
                            <p className='relative text-lg font-bold tracking-tight'>Create Link</p>
                            <p className='relative mt-2 text-sm text-[#DDDDDD] leading-relaxed'>Create a meeting link to share when you're ready.</p>
                        </button>

                        <button
                            className='group relative overflow-hidden rounded-2xl border border-[#CB2957] bg-gradient-to-br from-[#CB2957] to-[#CB2957] px-6 py-7 text-left text-white shadow-lg shadow-[#CB2957]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
                            onClick={() => setStartInstantMeeting(true)}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                            <div className='relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#CB2957] shadow-md transition-all duration-300'>
                                <FaPlus className='text-base' />
                            </div>
                            <p className='relative text-lg font-bold tracking-tight'>New FaceTime</p>
                            <p className='relative mt-2 text-sm text-[#EEEEEE] leading-relaxed'>Open a live room instantly and invite others with a single tap.</p>
                        </button>

                        <button
                            className='group relative overflow-hidden rounded-2xl border border-[#DDDDDD] bg-gradient-to-br from-[#EEEEEE] to-[#DDDDDD] px-6 py-7 text-left text-[#000000] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl'
                            onClick={() => setJoinMeeting(true)}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                            <div className='relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#000000]/5 shadow-md transition-all duration-300'>
                                <FaVideo className='text-base' />
                            </div>
                            <p className='relative text-lg font-bold tracking-tight'>Join FaceTime</p>
                            <p className='relative mt-2 text-sm text-[#000000] opacity-80 leading-relaxed'>Enter your invite details and join the call immediately.</p>
                        </button>
                    </div>
                </div>
            </main>

            {startInstantMeeting && (
                <InstantMeeting
                    enable={startInstantMeeting}
                    setEnable={setStartInstantMeeting}
                    recipientUserIds={defaultRecipientUserIds}
                />
            )}
            {showUpcomingMeetings && (
                <UpcomingMeeting
                    enable={showUpcomingMeetings}
                    setEnable={setShowUpcomingMeetings}
                />
            )}
            {showCreateLink && (
                <CreateLink enable={showCreateLink} setEnable={setShowCreateLink} recipientUserIds={defaultRecipientUserIds} />
            )}
            {joinMeeting && (
                <JoinMeeting enable={joinMeeting} setEnable={setJoinMeeting} />
            )}
        </>
    );
}