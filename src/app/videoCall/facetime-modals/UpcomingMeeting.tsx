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
				{upcomingCalls?.map((call) => (
					 <div className='bg-gray-100 py-3 px-4 rounded flex items-center justify-between' key={call.id}>
                    <div className="w-2/3 flex items-center space-x-4 justify-between">
							<p className='text-sm'>{call.description}</p>
							<p className='text-xs'>{formatDateTime(new Date(call.startsAt).toLocaleString())}</p>
                    </div>
                    
						<div className="flex items-center gap-2">
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
						</div>
                </div>

				))}
              
            </div>
        </>
    );
}