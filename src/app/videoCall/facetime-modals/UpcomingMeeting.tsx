"use client";
import {
	Dialog,
	DialogTitle,
	DialogPanel,
	Transition,
	TransitionChild,
} from "@headlessui/react";
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
				<Dialog as='div' className='relative z-10' onClose={closeModal}>
					<TransitionChild
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<div className='fixed inset-0 bg-black/75' />
					</TransitionChild>

					<div className='fixed inset-0 overflow-y-auto'>
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
								<DialogPanel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all text-center'>
									<DialogTitle
										as='h3'
										className='text-lg font-bold leading-6 text-green-600 mb-4'
									>
										Upcoming FaceTime
									</DialogTitle>

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
			<div className='flex flex-col space-y-4'>
				{upcomingCalls?.map((call: any) => (
					 <div className='bg-gray-100 py-4 px-4 rounded flex flex-col gap-3' key={call.id}>
						<div className="space-y-2">
							<p className='text-sm font-semibold text-gray-800'>{call.description}</p>
							
							{call.isCreator ? (
								<>
									<p className='text-xs text-gray-600'>
										<span className='font-medium'>Date:</span> {formatDateTime(new Date(call.startsAt).toLocaleString())}
									</p>
									
									{call.recipients && call.recipients.length > 0 && (
										<div className='space-y-2'>
											<p className='text-xs font-medium text-gray-700'>Meeting with:</p>
											<div className='flex flex-wrap gap-2'>
												{call.recipients.map((recipient: any) => (
													<div key={recipient.id} className='flex items-center gap-1 bg-white px-2 py-1 rounded text-xs border border-gray-300'>
														{recipient.image && (
															<img 
																src={recipient.image} 
																alt={recipient.name}
																className='h-5 w-5 rounded-full object-cover'
															/>
														)}
														<span className='text-gray-700'>{recipient.name}</span>
													</div>
												))}
											</div>
										</div>
									)}
								</>
							) : (
								<>
									<div className='flex items-center gap-2'>
										{call.creatorImage && (
											<img 
												src={call.creatorImage} 
												alt={call.creatorName}
												className='h-6 w-6 rounded-full object-cover'
											/>
										)}
										<p className='text-xs text-gray-600'>
											<span className='font-medium'>Scheduled by:</span> {call.creatorName || 'Unknown'}
										</p>
									</div>
									<p className='text-xs text-gray-600'>
										<span className='font-medium'>Date:</span> {formatDateTime(new Date(call.startsAt).toLocaleString())}
									</p>
								</>
							)}
						</div>
                    
						<div className="flex items-center gap-2">
							{call.isCreator ? (
								<>
									<button
										type="button"
										className='bg-slate-700 text-sm px-4 py-2 hover:bg-slate-800 text-white rounded-md shadow-sm'
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
									<Link className='bg-green-500 text-sm px-4 py-2 hover:bg-green-700 text-white rounded-md shadow-sm'
									href={`/videoCall/facetime/${call.callId}`}
									>
										Start now
									</Link>
								</>
							) : (
								<Link className='bg-blue-500 text-sm px-4 py-2 hover:bg-blue-700 text-white rounded-md shadow-sm w-full text-center'
								href={`/videoCall/facetime/${call.callId}`}
								>
									Join Meeting
								</Link>
							)}
						</div>
                </div>

				))}
              
            </div>
        </>
    );
}