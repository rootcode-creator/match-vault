"use client";

import React from "react";
import { OwnCapability } from "@stream-io/video-client";
import { Restricted } from "@stream-io/video-react-bindings";
import {
	ReactionsButton,
	RecordCallButton,
	ScreenShareButton,
	SpeakingWhileMutedNotification,
	ToggleAudioPublishingButton,
	ToggleVideoPublishingButton,
} from "@stream-io/video-react-sdk";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialogModal } from "@/components/AlertDialogModal";

type Props = {
	onLeave?: (err?: Error) => void;
};

const getScreenShareErrorMessage = (error: unknown) => {
	if (error instanceof DOMException) {
		if (error.name === "NotSupportedError") {
			return "Screen sharing isn’t supported on this browser/device. Try from a desktop browser.";
		}
		if (error.name === "NotAllowedError") {
			return "Screen sharing was blocked or canceled. Please allow permission and try again.";
		}
	}

	// Some platforms/browsers surface a generic NotAllowed message in the error text
	const message = error instanceof Error ? error.message : String(error ?? "");
	if (/not allowed by the user agent|not allowed by the platform/i.test(message)) {
		return "Screen sharing is blocked by the browser or platform. Try a supported browser or enable screen capture in settings.";
	}
	if (/getDisplayMedia/i.test(message) && /not a function|undefined/i.test(message)) {
		return "Screen sharing isn’t available on this browser/device. Try from a desktop browser.";
	}

	return "Failed to start screen sharing. Please try again.";
};

export default function FacetimeCallControls({ onLeave }: Props) {
	const [leaveDialogOpen, setLeaveDialogOpen] = React.useState(false);
	const [alertOpen, setAlertOpen] = React.useState(false);
	const [alertMessage, setAlertMessage] = React.useState("");

	const handleConfirmedLeave = async () => {
		setLeaveDialogOpen(false);
		if (onLeave) {
			try {
				await onLeave();
			} catch (error) {
				console.warn("Error during leave callback", error);
			}
		}
	};

	return (
		<div className='str-video__call-controls'>
			<Restricted requiredGrants={[OwnCapability.SEND_AUDIO]}>
				<SpeakingWhileMutedNotification>
					<ToggleAudioPublishingButton />
				</SpeakingWhileMutedNotification>
			</Restricted>
			<Restricted requiredGrants={[OwnCapability.SEND_VIDEO]}>
				<ToggleVideoPublishingButton />
			</Restricted>
			<Restricted requiredGrants={[OwnCapability.CREATE_REACTION]}>
				<ReactionsButton />
			</Restricted>
			<Restricted requiredGrants={[OwnCapability.SCREENSHARE]}>
				<ScreenShareButton onError={(err) => {
					setAlertMessage(getScreenShareErrorMessage(err));
					setAlertOpen(true);
				}} />
			</Restricted>
			<Restricted
				requiredGrants={[
					OwnCapability.START_RECORD_CALL,
					OwnCapability.STOP_RECORD_CALL,
				]}
			>
				<RecordCallButton />
			</Restricted>
			<AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
				<AlertDialogTrigger asChild>
					<Button
						variant='destructive'
						size='default'
						className='min-w-[108px] px-4 py-2 text-sm font-semibold'
						type='button'
					>
						Leave call
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Leave call</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to leave the call?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirmedLeave}>Leave</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{alertOpen ? (
				<AlertDialogModal
					open={alertOpen}
					onOpenChange={setAlertOpen}
					title="Screen share error"
					description={alertMessage}
					confirmLabel="OK"
					onConfirm={() => setAlertOpen(false)}
				/>
			) : null}
		</div>
	);
}
