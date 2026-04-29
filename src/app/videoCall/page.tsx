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
            <main className='relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.2),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(20,184,166,0.2),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ecfdf5_60%,#f0fdfa_100%)] px-4 py-10 sm:px-8 sm:py-14'>
                <div aria-hidden className='pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl' />
                <div aria-hidden className='pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl' />

                <div className='relative mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_30px_120px_-35px_rgba(15,23,42,0.35)] backdrop-blur-md sm:p-10'>
                    <div className='flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-4'>
                            <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 shadow-sm'>
                                <span className='inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
                                Live room ready
                            </div>
                            <div>
                                <h1 className='text-4xl font-black leading-tight text-slate-900 sm:text-5xl tracking-tight'>FaceTime Hub</h1>
                                <p className='mt-3 max-w-xl text-sm text-slate-600 sm:text-base leading-relaxed'>Jump into a call instantly, share a secure invite link, or plan your next meeting from one clean dashboard.</p>
                            </div>
                        </div>

                        <button
                            className='inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-md transition-all hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:bg-emerald-50'
                            onClick={() => setShowUpcomingMeetings(true)}
                        >
                            <FaCalendarAlt className='text-emerald-600' />
                            Upcoming FaceTime
                        </button>
                    </div>

                    <div className='grid w-full grid-cols-1 gap-5 md:grid-cols-3'>
                        <button
                            className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-700 to-slate-800 px-6 py-7 text-left text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-900/30'
                            onClick={() => setShowCreateLink(true)}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                            <div className='relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-md group-hover:from-slate-500 group-hover:to-slate-600 transition-all duration-300'>
                                <FaLink className='text-base' />
                            </div>
                            <p className='relative text-lg font-bold tracking-tight'>Create Link</p>
                            <p className='relative mt-2 text-sm text-slate-300 leading-relaxed'>Generate an invite and share it anytime.</p>
                        </button>

                        <button
                            className='group relative overflow-hidden rounded-2xl border border-emerald-400/70 bg-gradient-to-br from-emerald-500 via-emerald-550 to-emerald-600 px-6 py-7 text-left text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-600/40'
                            onClick={() => setStartInstantMeeting(true)}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                            <div className='relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-md group-hover:from-emerald-300 group-hover:to-emerald-400 transition-all duration-300'>
                                <FaPlus className='text-base' />
                            </div>
                            <p className='relative text-lg font-bold tracking-tight'>New FaceTime</p>
                            <p className='relative mt-2 text-sm text-emerald-50 leading-relaxed'>Start a room now and invite others in one click.</p>
                        </button>

                        <button
                            className='group relative overflow-hidden rounded-2xl border border-teal-400/70 bg-gradient-to-br from-teal-500 via-teal-550 to-emerald-600 px-6 py-7 text-left text-white shadow-lg shadow-teal-600/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-600/40'
                            onClick={() => setJoinMeeting(true)}
                        >
                            <div className='absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                            <div className='relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 shadow-md group-hover:from-teal-300 group-hover:to-emerald-400 transition-all duration-300'>
                                <FaVideo className='text-base' />
                            </div>
                            <p className='relative text-lg font-bold tracking-tight'>Join FaceTime</p>
                            <p className='relative mt-2 text-sm text-emerald-50 leading-relaxed'>Paste your invite details and jump straight in.</p>
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