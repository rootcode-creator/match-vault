"use client";
import {
	Dialog,
	DialogTitle,
	DialogPanel,
	Transition,
	Description,
	TransitionChild,
} from "@headlessui/react";
import { FaCopy, FaTimes } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";
import { Fragment, useState, Dispatch, SetStateAction } from "react";
import Link from "next/link";

async function readApiError(response: Response) {
	try {
		const payload = await response.json();
		if (payload?.error) return String(payload.error);
	} catch {
		// fall through to generic status text
	}

	return response.statusText || `Request failed with status ${response.status}`;
}

interface Props {
	enable: boolean;
	setEnable: React.Dispatch<React.SetStateAction<boolean>>;
	recipientUserIds?: string[] | undefined;
}

export default function InstantMeeting({ enable, setEnable, recipientUserIds }: Props) {
	const [showMeetingLink, setShowMeetingLink] = useState(false);
	const [facetimeLink, setFacetimeLink] = useState<string>("");

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
								<div className='flex items-start justify-between gap-4 pb-6'>
									<DialogTitle as='h3' className='text-lg font-bold leading-6 text-green-600'>
										Create Instant FaceTime
									</DialogTitle>
									<button
										onClick={closeModal}
										className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
										aria-label='Close modal'
									>
										<FaTimes size={20} />
									</button>
								</div>
								{showMeetingLink ? (
									<MeetingLink facetimeLink={facetimeLink} />
								) : (
									<MeetingForm
										setShowMeetingLink={setShowMeetingLink}
										setFacetimeLink={setFacetimeLink}
										recipientUserIds={recipientUserIds}
									/>
								)}
							</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

const MeetingForm = ({
	setShowMeetingLink,
	setFacetimeLink,
	recipientUserIds,
}: {
	setShowMeetingLink: Dispatch<SetStateAction<boolean>>;
	setFacetimeLink: Dispatch<SetStateAction<string>>;
	recipientUserIds?: string[] | undefined;
}) => {
	const [description, setDescription] = useState<string>("");
	const [isCreating, setIsCreating] = useState(false);

	const handleStartMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!description || isCreating) return;

		setIsCreating(true);
		try {
			const id = crypto.randomUUID();
			const startsAtIso = new Date(Date.now()).toISOString();

			// Create call via API endpoint
			const createRes = await fetch("/api/facetime/create-call", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					callId: id,
					description,
					startsAt: startsAtIso,
				}),
			});

			if (!createRes.ok) {
				throw new Error(await readApiError(createRes));
			}

			const createData = await createRes.json();
			setFacetimeLink(createData.callId);

			// Persist meeting metadata with optional recipients
			try {
				await fetch("/api/facetime/meetings", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						callId: createData.callId,
						description,
						startsAt: startsAtIso,
						recipientUserIds: recipientUserIds ?? [],
					}),
				});
			} catch (err) {
				console.warn("Failed to save instant meeting metadata", err);
			}

			setShowMeetingLink(true);
			console.log("Meeting Created!");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to create Meeting";
			console.error("InstantMeeting create error:", error);
			alert(message);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<>
			<DialogTitle
				as='h3'
				className='text-lg font-bold leading-6 text-green-600'
			>
				Create Instant FaceTime
			</DialogTitle>

			<Description className='text-xs opacity-40 mb-4'>
				You can start a new FaceTime instantly.
			</Description>

			<form className='w-full' onSubmit={handleStartMeeting}>
				<label
					className='block text-left text-sm font-medium text-gray-700'
					htmlFor='description'
				>
					Meeting Description
				</label>
				<input
					type='text'
					name='description'
					id='description'
					value={description}
					required
					onChange={(e) => setDescription(e.target.value)}
					className='mt-1 block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-3'
					placeholder='Enter a description for the meeting'
				/>

				<button className='w-full bg-green-600 text-white py-3 rounded mt-4' disabled={isCreating}>
					{isCreating ? "Creating..." : "Proceed"}
				</button>
			</form>
		</>
	);
};

const MeetingLink = ({ facetimeLink }: { facetimeLink: string }) => {
	const [copied, setCopied] = useState<boolean>(false);
	const handleCopy = () => setCopied(true);
	const envHost = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
	const host = typeof window !== "undefined" && window.location?.origin
		? window.location.origin.replace(/\/$/, "")
		: envHost;
	const basePath = host.endsWith("/videoCall/facetime") ? host : `${host}/videoCall/facetime`;
	const meetingUrl = `${basePath}/${facetimeLink}`;

	return (
		<>
			<DialogTitle
				as='h3'
				className='text-lg font-bold leading-6 text-green-600'
			>
				Copy FaceTime Link
			</DialogTitle>

			<Description className='text-xs opacity-40 mb-4'>
				You can start a new FaceTime instantly.
			</Description>

			<div className='bg-gray-100 p-4 rounded flex items-center justify-between'>
				<p className='text-xs text-gray-500'>{meetingUrl}</p>

				<CopyToClipboard
					onCopy={handleCopy}
					text={meetingUrl}
				>
					<FaCopy className='text-green-600 text-lg cursor-pointer' />
				</CopyToClipboard>
			</div>

			{copied && (
				<p className='text-red-600 text-xs mt-2'>Link copied to clipboard</p>
			)}

			<Link href={meetingUrl} className='w-full block bg-green-600 text-white py-3 rounded mt-4'>
				Start FaceTime
			</Link>
		</>
	);
};