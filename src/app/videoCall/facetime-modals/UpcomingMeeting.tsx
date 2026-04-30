"use client";
import {
	Dialog,
	DialogTitle,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { Fragment } from "react";
import { useGetCalls } from "../facetime-hooks/useGetCalls";
import { formatDateTime } from "../facetime-lib/util";
import Link from "next/link";

interface Props {
	enable: boolean;
	setEnable: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UpcomingMeeting({ enable, setEnable }: Props) {
	const closeModal = () => setEnable(false);

	return (
		<>
			<Transition appear show={enable} as={Fragment}>
				<Dialog as='div' className='relative z-[100]' onClose={closeModal}>
					<TransitionChild
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 z-[100] bg-black/75' />
					</TransitionChild>

					<div className='fixed inset-0 z-[110] overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<TransitionChild
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'
							>
								<DialogPanel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 align-middle text-center shadow-xl transition-all'>
									<div className='flex items-center justify-between gap-8 pb-6 border-b border-gray-200'>
										<DialogTitle as='h3' className='text-lg font-bold leading-6 text-green-600 flex-1 text-left'>
											Upcoming FaceTime
										</DialogTitle>
										<button
											onClick={closeModal}
											className='flex-shrink-0 rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
											aria-label='Close modal'
										>
											<FaTimes size={20} />
										</button>
									</div>

									<MeetingList />
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

const MeetingList = () => { 
	const { upcomingCalls, isLoading, removeUpcomingCall } = useGetCalls();

	if (isLoading) { 
		return (
			<>
				<div className='flex flex-col space-y-4'>
					<p className="text-sm text-gray-600">Loading...</p>
				
				</div>
			</>
		)
	}
	
	if (upcomingCalls?.length === 0) { 
		return (
			<>
				<div className='flex flex-col space-y-4'>
					<p className="text-sm text-gray-600">No upcoming calls</p>
				
				</div>
			</>
		)
	}
	
    return (
        <>
			<div className='mt-6 flex flex-col space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
				{upcomingCalls?.map((call: any) => (
					<div className='bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow' key={call.id}>
						{/* Meeting Title */}
						<h4 className='text-base font-bold text-slate-900 mb-3 line-clamp-1'>{call.description}</h4>
						
						{/* Date and Time */}
						<div className='mb-4 pb-4 border-b border-slate-100'>
							<p className='text-xs text-slate-600'>
								<span className='font-semibold text-slate-700'>Date & Time:</span> {formatDateTime(new Date(call.startsAt).toLocaleString())}
							</p>
						</div>

						{/* Meeting Participants */}
						<div className='mb-4'>
							<p className='text-xs font-semibold text-slate-700 mb-2.5 uppercase tracking-wide'>Meeting with</p>
							<div className='flex flex-wrap gap-2'>
								{call.isCreator ? (
									call.recipients && call.recipients.length > 0 ? (
										call.recipients.map((recipient: any) => (
											<div key={recipient.id} className='inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs border border-emerald-200 hover:border-emerald-300 transition-colors'>
												{recipient.image && (
													<img
														src={recipient.image}
														alt={recipient.name}
														className='h-5 w-5 rounded-full object-cover border border-slate-200'
													/>
												)}
												<span className='text-slate-700 font-medium'>{recipient.name}</span>
											</div>
										))
									) : (
										<span className='text-xs text-slate-500 italic'>No recipients invited yet</span>
									)
								) : (
									<div className='inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs border border-blue-200 hover:border-blue-300 transition-colors'>
										{call.creatorImage && (
											<img
												src={call.creatorImage}
												alt={call.creatorName}
												className='h-5 w-5 rounded-full object-cover border border-slate-200'
											/>
										)}
										<span className='text-slate-700 font-medium'>{call.creatorName || 'Unknown'}</span>
									</div>
								)}
							</div>
						</div>
                    
						{/* Action Buttons */}
						{call.isCreator ? (
							<div className='flex gap-2 pt-2'>
								<button
									type="button"
									className='flex-1 bg-slate-600 hover:bg-slate-700 text-white text-sm font-semibold py-2.5 px-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md'
									onClick={async () => {
										const res = await fetch(`/api/facetime/meetings/${encodeURIComponent(call.callId)}`, {
											method: "DELETE",
											credentials: "include",
										});
										if (res.ok) {
											removeUpcomingCall(call.callId);
											return;
										}

										const payload = await res.json().catch(() => ({} as any));
										alert(payload?.error ?? "Failed to complete meeting");
									}}
								>
									Complete
								</button>
								<Link className='flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 px-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-center flex items-center justify-center'
								href={`/videoCall/facetime/${call.callId}`}
								>
									Start now
								</Link>
							</div>
						) : (
							<Link className='block w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-center'
							href={`/videoCall/facetime/${call.callId}`}
							>
								Join Meeting
							</Link>
						)}
                </div>

				))}
              
            </div>
        </>
    );
}