"use client";
import { useGetCallById } from "../../facetime-hooks/useGetCallById";
import {
	StreamCall,
	StreamTheme,
	PaginatedGridLayout,
	SpeakerLayout,
	CallControls
} from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

export default function FaceTimePage() {
	const { id } = useParams<{ id: string }>();
	const { call, isCallLoading } = useGetCallById(id);
	const [confirmJoin, setConfirmJoin] = useState<boolean>(false);
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const router = useRouter();

	const handleJoin = async () => {
		if (!call || isJoining) return;
		setIsJoining(true);

		try {
			await call.join({ create: false, video: false });
			await call.camera.disable();
			setConfirmJoin(true);
		} catch (error) {
			console.error(error);
			alert("Failed to join call. Please check camera/microphone permissions and try again.");
		} finally {
			setIsJoining(false);
		}
	};

	if (isCallLoading) return <p>Loading...</p>;

	if (!call) return (<p>Call not found</p>);

	return (
		<main className='min-h-screen w-full items-center justify-center'>
			<StreamCall call={call}>
			<StreamTheme>
				{confirmJoin ? <MeetingRoom /> : (
					<div className='flex flex-col items-center justify-center gap-5'>
							<h1 className='text-3xl font-bold'>Join Call</h1>
							<p className='text-lg'>Are you sure you want to join this call?</p>
							<div className='flex gap-5'>
								<button onClick={handleJoin} disabled={isJoining} className='px-4 py-3 bg-green-600 text-green-50 disabled:opacity-50'>
									{isJoining ? "Joining..." : "Join"}
								</button>
								<button onClick={() => router.push("/")} className='px-4 py-3 bg-red-600 text-red-50'>Cancel</button>
							</div>
						</div>
				)}
				</StreamTheme>
			</StreamCall>
		</main>
	);

}

const MeetingRoom = () => {
	const [layout, setLayout] = useState<CallLayoutType>("grid");
	const router = useRouter();

	const handleLeave = () => {
		confirm("Are you sure you want to leave the call?") && router.push("/");
	};

	const CallLayout = () => {
		switch (layout) {
			case "grid":
				return <PaginatedGridLayout />;
			case "speaker-right":
				return <SpeakerLayout participantsBarPosition='left' />;
			default:
				return <SpeakerLayout participantsBarPosition='right' />;
		}
	};

	return (
		<section className='relative min-h-screen w-full overflow-hidden pt-4'>
			<div className='relative flex size-full items-center justify-center'>
				<div className='flex size-full max-w-[1000px] items-center'>
					<CallLayout />
				</div>
				<div className='fixed bottom-0 flex w-full items-center justify-center gap-5'>
					<CallControls onLeave={handleLeave} />
				</div>
			</div>
		</section>
	);
};