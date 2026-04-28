"use client";
import { useGetCallById } from "../../facetime-hooks/useGetCallById";
import {
	StreamCall,
	StreamTheme,
	PaginatedGridLayout,
	CallControls,
	Call,
	useCallStateHooks
} from "@stream-io/video-react-sdk";
import ParticipantPinOverlay from "../components/ParticipantPinOverlay";
import { useQualityFallback } from "../hooks/useQualityFallback";
import { useParams } from "next/navigation";
const logCallLifecycle = (...args: unknown[]) => {
	if (process.env.NODE_ENV !== "production") {
		console.info("[FaceTime lifecycle]", ...args);
	}
};
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FaceTimePage() {
	const { id } = useParams<{ id: string }>();
	const { call, isCallLoading } = useGetCallById(id);
	const [confirmJoin, setConfirmJoin] = useState<boolean>(false);
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
	const [microphoneEnabled, setMicrophoneEnabled] = useState<boolean>(true);
	const router = useRouter();

	useEffect(() => {
		return () => {
			if (!call || !confirmJoin) return;
			logCallLifecycle("leave:cleanup:start", { callId: call.id });

			void call.leave().catch((error) => {
				logCallLifecycle("leave:cleanup:error", { callId: call.id, error });
				console.warn("Error leaving call during cleanup", error);
			});
		};
	}, [call, confirmJoin]);

	const handleJoin = async () => {
		if (!call || isJoining) return;
		setIsJoining(true);
		logCallLifecycle("join:start", { callId: call.id, cameraEnabled, microphoneEnabled });

		try {
			await call.join({
				create: false,
				video: cameraEnabled,
			});

			// The SDK's JoinCallData type doesn't accept an `audio` option.
			// Toggle microphone and camera after joining if the call object exposes those APIs.
			try {
				const c: any = call;
				if (c.microphone && typeof c.microphone.enable === "function") {
					try {
						const isEnabled = !!c.microphone.enabled;
						if (microphoneEnabled && !isEnabled) await c.microphone.enable();
						else if (!microphoneEnabled && isEnabled) await c.microphone.disable();
					} catch (e) {
						console.warn("Error toggling microphone", e);
					}
				}

				if (c.camera && typeof c.camera.enable === "function") {
					try {
						const isCamEnabled = !!c.camera.enabled;
						if (cameraEnabled && !isCamEnabled) await c.camera.enable();
						else if (!cameraEnabled && isCamEnabled) await c.camera.disable();
					} catch (e) {
						console.warn("Error toggling camera", e);
					}
				}
			} catch (err) {
				console.warn("Microphone/camera toggle not available on call object", err);
			}

			logCallLifecycle("join:success", { callId: call.id });
			setConfirmJoin(true);
		} catch (error) {
			logCallLifecycle("join:error", { callId: call.id, error });
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
				{confirmJoin ? <MeetingRoom call={call} /> : (
					<div className='flex flex-col items-center justify-center gap-5'>
							<h1 className='text-3xl font-bold'>Join Call</h1>
							<p className='text-lg'>Are you sure you want to join this call?</p>
							<div className='flex flex-wrap items-center justify-center gap-3'>
								<button
									type='button'
									onClick={() => setCameraEnabled((current) => !current)}
									className={`rounded-full px-4 py-2 text-sm font-semibold transition ${cameraEnabled ? "bg-green-600 text-white" : "bg-slate-200 text-slate-700"}`}
								>
									Camera {cameraEnabled ? "On" : "Off"}
								</button>
								<button
									type='button'
									onClick={() => setMicrophoneEnabled((current) => !current)}
									className={`rounded-full px-4 py-2 text-sm font-semibold transition ${microphoneEnabled ? "bg-green-600 text-white" : "bg-slate-200 text-slate-700"}`}
								>
									Mic {microphoneEnabled ? "On" : "Off"}
								</button>
							</div>
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

const MeetingRoom = ({ call }: { call: Call }) => {
	const router = useRouter();
	const { useParticipants } = useCallStateHooks();
	const participants = useParticipants();
	const hasMultipleParticipants = participants.length >= 2;

	useQualityFallback();

	const handleLeave = async () => {
		if (!confirm("Are you sure you want to leave the call?")) return;
		logCallLifecycle("leave:manual:start", { callId: call.id });

		try {
			if (call && typeof call.leave === "function") {
				await call.leave();
			}
			logCallLifecycle("leave:manual:success", { callId: call.id });
		} catch (error) {
			logCallLifecycle("leave:manual:error", { callId: call.id, error });
			console.warn("Error leaving call", error);
		} finally {
			router.push("/");
		}
	};

	return (
		<section className={`facetime-room relative flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950/95 ${hasMultipleParticipants ? "facetime-room--multi" : ""}`}>
			<div className={`flex-1 min-h-0 w-full pb-24 pt-2 sm:pt-3 ${hasMultipleParticipants ? "px-0" : "px-4 sm:px-6"}`}>
				<div className={`h-full w-full ${hasMultipleParticipants ? "bg-slate-950 p-0" : "rounded-2xl bg-slate-900/80 p-2 shadow-2xl shadow-black/40"}`}>
					{/* Keep a stable tile grid to avoid active-speaker auto switching */}
					<PaginatedGridLayout ParticipantViewUI={ParticipantPinOverlay} />
				</div>
			</div>
			<div className='pointer-events-none absolute bottom-6 left-0 right-0 flex w-full items-center justify-center'>
				<div className='pointer-events-auto rounded-full bg-slate-900/90 px-4 py-2 shadow-xl shadow-black/40'>
					<CallControls onLeave={handleLeave} />
				</div>
			</div>
		</section>
	);
};