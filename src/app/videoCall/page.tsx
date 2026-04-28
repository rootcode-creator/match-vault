"use client";
import { useState } from "react";
import { FaCalendarAlt, FaLink, FaPlus, FaVideo } from "react-icons/fa";
import InstantMeeting from "./facetime-modals/InstantMeeting";
import UpcomingMeeting from "./facetime-modals/UpcomingMeeting";
import CreateLink from "./facetime-modals/CreateLink";
import JoinMeeting from "./facetime-modals/JoinMeeting";

export default function Dashboard() {
    const [startInstantMeeting, setStartInstantMeeting] =
        useState<boolean>(false);
    const [joinMeeting, setJoinMeeting] = useState<boolean>(false);
    const [showUpcomingMeetings, setShowUpcomingMeetings] =
        useState<boolean>(false);
    const [showCreateLink, setShowCreateLink] = useState<boolean>(false);

    return (
        <>
            <main className='relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_15%_15%,rgba(16,185,129,0.2),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(20,184,166,0.2),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ecfdf5_60%,#f0fdfa_100%)] px-4 py-10 sm:px-8 sm:py-14'>
                <div aria-hidden className='pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl' />
                <div aria-hidden className='pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-teal-300/20 blur-3xl' />

                <div className='relative mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-white/70 bg-white/75 p-6 shadow-[0_30px_120px_-35px_rgba(15,23,42,0.35)] backdrop-blur-md sm:p-10'>
                    <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='space-y-3'>
                            <div className='inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700'>
                                <span className='inline-block h-2 w-2 rounded-full bg-emerald-500' />
                                Live room ready
                            </div>
                            <div>
                                <h1 className='text-3xl font-black leading-tight text-slate-900 sm:text-5xl'>FaceTime Hub</h1>
                                <p className='mt-2 max-w-xl text-sm text-slate-600 sm:text-base'>Jump into a call instantly, share a secure invite link, or plan your next meeting from one clean dashboard.</p>
                            </div>
                        </div>

                        <button
                            className='inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md'
                            onClick={() => setShowUpcomingMeetings(true)}
                        >
                            <FaCalendarAlt className='text-emerald-600' />
                            Upcoming FaceTime
                        </button>
                    </div>

                    <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-3'>
                        <button
                            className='group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-700 px-5 py-6 text-left text-white shadow-lg shadow-slate-800/20 transition duration-200 hover:-translate-y-1 hover:bg-slate-800'
                            onClick={() => setShowCreateLink(true)}
                        >
                            <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20'>
                                <FaLink className='text-sm' />
                            </div>
                            <p className='text-lg font-bold'>Create Link</p>
                            <p className='mt-1 text-sm text-slate-200'>Generate an invite and share it anytime.</p>
                        </button>

                        <button
                            className='group relative overflow-hidden rounded-2xl border border-emerald-400/60 bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-6 text-left text-white shadow-lg shadow-emerald-700/30 transition duration-200 hover:-translate-y-1 hover:from-emerald-500 hover:to-emerald-700'
                            onClick={() => setStartInstantMeeting(true)}
                        >
                            <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20'>
                                <FaPlus className='text-sm' />
                            </div>
                            <p className='text-lg font-bold'>New FaceTime</p>
                            <p className='mt-1 text-sm text-emerald-50'>Start a room now and invite others in one click.</p>
                        </button>

                        <button
                            className='group relative overflow-hidden rounded-2xl border border-teal-400/60 bg-gradient-to-br from-teal-500 to-emerald-600 px-5 py-6 text-left text-white shadow-lg shadow-teal-700/30 transition duration-200 hover:-translate-y-1 hover:from-teal-500 hover:to-emerald-700'
                            onClick={() => setJoinMeeting(true)}
                        >
                            <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/20'>
                                <FaVideo className='text-sm' />
                            </div>
                            <p className='text-lg font-bold'>Join FaceTime</p>
                            <p className='mt-1 text-sm text-emerald-50'>Paste your invite details and jump straight in.</p>
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