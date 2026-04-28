"use client";
import { useState } from "react";
import { FaLink, FaVideo } from "react-icons/fa";
import InstantMeeting from "../facetime-modals/InstantMeeting";
import UpcomingMeeting from "../facetime-modals/UpcomingMeeting";
import CreateLink from "../facetime-modals/CreateLink";
import JoinMeeting from "../facetime-modals/JoinMeeting";

export default function Dashboard() {
    const [startInstantMeeting, setStartInstantMeeting] =
        useState<boolean>(false);
    const [joinMeeting, setJoinMeeting] = useState<boolean>(false);
    const [showUpcomingMeetings, setShowUpcomingMeetings] =
        useState<boolean>(false);
    const [showCreateLink, setShowCreateLink] = useState<boolean>(false);

    return (
        <>
            <main className='min-h-screen w-full bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-4 py-10 sm:px-8'>
                <div className='mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-6 rounded-2xl border border-emerald-100 bg-white/80 p-8 text-center shadow-xl shadow-emerald-100/40 backdrop-blur sm:p-12'>
                    <div className='flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-1 text-emerald-700'>
                        <span className='text-xs font-semibold uppercase tracking-[0.2em]'>Live</span>
                        <span className='text-xs'>Instant video chat</span>
                    </div>
                    <div className='space-y-2'>
                        <h1 className='text-3xl font-bold text-slate-900 sm:text-4xl'>FaceTime</h1>
                        <p className='text-sm text-slate-500 sm:text-base'>Create a link, start a call now, or hop into an invite.</p>
                    </div>
                    <button
                        className='text-emerald-700 underline-offset-4 hover:underline text-sm'
                        onClick={() => setShowUpcomingMeetings(true)}
                    >
                        Upcoming FaceTime
                    </button>

                    <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        <button
                            className='group flex min-h-[96px] w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-4 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
                            onClick={() => setShowCreateLink(true)}
                        >
                            <FaLink className='mb-2 text-slate-500 transition group-hover:text-slate-700' />
                            <span className='text-sm font-semibold'>Create link</span>
                            <span className='text-xs text-slate-400'>Share later</span>
                        </button>
                        <button
                            className='group flex min-h-[96px] w-full flex-col items-center justify-center rounded-xl bg-emerald-500 px-4 py-4 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg'
                            onClick={() => setStartInstantMeeting(true)}
                        >
                            <FaVideo className='mb-2 text-white/90' />
                            <span className='text-sm font-semibold'>New FaceTime</span>
                            <span className='text-xs text-emerald-100'>Start now</span>
                        </button>
                        <button
                            className='group flex min-h-[96px] w-full flex-col items-center justify-center rounded-xl bg-emerald-500 px-4 py-4 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-lg'
                            onClick={() => setJoinMeeting(true)}
                        >
                            <FaVideo className='mb-2 text-white/90' />
                            <span className='text-sm font-semibold'>Join FaceTime</span>
                            <span className='text-xs text-emerald-100'>Use a link</span>
                        </button>
                    </div>
                </div>
            </main>

            {startInstantMeeting && (
                <InstantMeeting
                    enable={startInstantMeeting}
                    setEnable={setStartInstantMeeting}
                />
            )}
            {showUpcomingMeetings && (
                <UpcomingMeeting
                    enable={showUpcomingMeetings}
                    setEnable={setShowUpcomingMeetings}
                />
            )}
            {showCreateLink && (
                <CreateLink enable={showCreateLink} setEnable={setShowCreateLink} />
            )}
            {joinMeeting && (
                <JoinMeeting enable={joinMeeting} setEnable={setJoinMeeting} />
            )}
        </>
    );
}