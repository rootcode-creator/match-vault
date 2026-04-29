"use client";
import { useGetCallById } from "../../facetime-hooks/useGetCallById";
import {
	StreamCall,
	StreamTheme,
	CallControls,
	Call,
	useCallStateHooks
} from "@stream-io/video-react-sdk";
import StableVideoGrid from "../components/StableVideoGrid";
import ParticipantPinOverlay from "../components/ParticipantPinOverlay";
import { useQualityFallback } from "../hooks/useQualityFallback";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const logCallLifecycle = (...args: unknown[]) => {
	if (process.env.NODE_ENV !== "production") {
		console.info("[FaceTime lifecycle]", ...args);
	}
};

const isAlreadyLeftError = (error: unknown) => {
	const message = error instanceof Error ? error.message : String(error ?? "");
	return message.toLowerCase().includes("already been left");
};

// Suppress noisy but non-fatal Stream/Dynascale errors in console
if (typeof window !== "undefined") {
	const originalError = console.error;
	console.error = function (...args: unknown[]) {
		const message = String(args[0] ?? "");
		const isDynascaleAbort =
			message.includes("[DynascaleManager]") &&
			message.includes("Failed to play stream");
		const isSfuStatsReport =
			message.includes("[SfuStatsReporter]") &&
			message.includes("Failed to flush");

		if (isDynascaleAbort || isSfuStatsReport) {
			logCallLifecycle("stream:recovery:ignore-error", message);
			return;
		}

		return originalError.apply(console, args as Parameters<typeof originalError>);
	};
}

export default function FaceTimePage() {
	const { id } = useParams<{ id: string }>();
	const { call, isCallLoading } = useGetCallById(id);
	const [confirmJoin, setConfirmJoin] = useState<boolean>(false);
	const [isJoining, setIsJoining] = useState<boolean>(false);
	const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
	const [microphoneEnabled, setMicrophoneEnabled] = useState<boolean>(true);
	const leaveInFlightRef = useRef<Promise<void> | null>(null);
	const router = useRouter();

	const leaveCallSafely = useCallback(async (source: "manual" | "cleanup") => {
		if (!call || typeof call.leave !== "function") return;

		if (leaveInFlightRef.current) {
			await leaveInFlightRef.current;
			return;
		}

		const callingState = (call as any)?.state?.callingState;
		if (callingState === "left" || callingState === "idle") {
			logCallLifecycle(`leave:${source}:already-left`, { callId: call.id, callingState });
			return;
		}

		const leavePromise = (async () => {
			logCallLifecycle(`leave:${source}:start`, { callId: call.id, callingState });
			try {
				await call.leave();
				logCallLifecycle(`leave:${source}:success`, { callId: call.id });
			} catch (error) {
				if (isAlreadyLeftError(error)) {
					logCallLifecycle(`leave:${source}:already-left`, { callId: call.id });
					return;
				}

				logCallLifecycle(`leave:${source}:error`, { callId: call.id, error });
				console.warn("Error leaving call", error);
			} finally {
				leaveInFlightRef.current = null;
			}
		})();

		leaveInFlightRef.current = leavePromise;
		await leavePromise;
	}, [call]);

	useEffect(() => {
		return () => {
			if (!call || !confirmJoin) return;
			void leaveCallSafely("cleanup");
		};
	}, [call, confirmJoin, leaveCallSafely]);

	const handleJoin = async () => {
		if (!call || isJoining) return;
		setIsJoining(true);
		logCallLifecycle("join:start", { callId: call.id, cameraEnabled, microphoneEnabled });

		try {
			// Ensure we're listening to call state updates
			const unsubscribe = call.on("call.updated", (payload: any) => {
				logCallLifecycle("call:updated", { callId: call.id, payload });
			});

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
				{confirmJoin ? <MeetingRoom call={call} onLeaveCall={() => leaveCallSafely("manual")} /> : (
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

const MeetingRoom = ({ call, onLeaveCall }: { call: Call; onLeaveCall: () => Promise<void> }) => {
	const router = useRouter();
	const { useParticipants } = useCallStateHooks();
	const participants = useParticipants();
	const hasMultipleParticipants = participants.length >= 2;

	useQualityFallback();

	// Debug logging for participants - only log when count changes to avoid infinite loops
	useEffect(() => {
		console.debug("[MeetingRoom] Participants updated:", {
			count: participants.length,
			participants: participants.map((p) => ({
				sessionId: p.sessionId,
				name: p.name,
				isLocalParticipant: p.isLocalParticipant,
			})),
		});
	}, [participants.length]);

	const handleLeave = async () => {
		if (!confirm("Are you sure you want to leave the call?")) return;

		try {
			await onLeaveCall();
		} catch (error) {
			console.warn("Error leaving call", error);
		} finally {
			router.push("/");
		}
	};

	return (
		<section className={`facetime-room relative flex h-[100dvh] w-full flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 ${hasMultipleParticipants ? "facetime-room--multi" : ""}`}>
			<div className={`flex-1 min-h-0 w-full pb-24 pt-2 sm:pt-3 ${hasMultipleParticipants ? "px-0" : "px-4 sm:px-6"}`}>
				<div className={`h-full w-full ${hasMultipleParticipants ? "bg-slate-100 p-0" : "rounded-2xl bg-white/90 p-2 shadow-xl shadow-slate-200/50 border border-slate-200"}`}>
					<StableVideoGrid ParticipantViewUI={ParticipantPinOverlay} />
				</div>
			</div>
			<div className='pointer-events-none absolute bottom-8 left-0 right-0 z-50 flex w-full items-center justify-center'>
				<div className='pointer-events-auto rounded-full bg-white/95 px-5 py-3 shadow-2xl shadow-slate-400/30 border border-slate-200 backdrop-blur-md'>
					<CallControls onLeave={handleLeave} />
				</div>
			</div>
		</section>
	);
};