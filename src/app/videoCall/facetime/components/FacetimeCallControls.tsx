"use client";

import React from "react";
import { OwnCapability } from "@stream-io/video-client";
import { Restricted } from "@stream-io/video-react-bindings";
import {
	CancelCallButton,
	ReactionsButton,
	RecordCallButton,
	ScreenShareButton,
	SpeakingWhileMutedNotification,
	ToggleAudioPublishingButton,
	ToggleVideoPublishingButton,
} from "@stream-io/video-react-sdk";

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

	const message = error instanceof Error ? error.message : String(error ?? "");
	if (/getDisplayMedia/i.test(message) && /not a function|undefined/i.test(message)) {
		return "Screen sharing isn’t available on this browser/device. Try from a desktop browser.";
	}

	return "Failed to start screen sharing. Please try again.";
};

export default function FacetimeCallControls({ onLeave }: Props) {
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
				<ScreenShareButton onError={(err) => alert(getScreenShareErrorMessage(err))} />
			</Restricted>
			<Restricted
				requiredGrants={[
					OwnCapability.START_RECORD_CALL,
					OwnCapability.STOP_RECORD_CALL,
				]}
			>
				<RecordCallButton />
			</Restricted>
			<CancelCallButton onLeave={onLeave} />
		</div>
	);
}
