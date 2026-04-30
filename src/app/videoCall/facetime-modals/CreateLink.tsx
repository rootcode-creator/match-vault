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
import { Fragment, SetStateAction, useState, Dispatch } from "react";

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

export default function CreateLink({ enable, setEnable, recipientUserIds }: Props) {
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
							<DialogPanel className='w-full max-w-lg transform rounded-2xl bg-white max-h-[85vh] overflow-y-auto align-middle shadow-xl transition-all text-center'>
								<div className='flex items-start justify-between gap-4 px-4 pt-4'>
									<div className='text-left'>
										<DialogTitle as='h3' className='text-lg font-bold leading-6 text-green-600'>
											Create Link
										</DialogTitle>
										<Description className='mt-1 text-xs opacity-40'>
											Generate a shareable FaceTime invite.
										</Description>
									</div>
									<button
										onClick={closeModal}
										className='rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
										aria-label='Close modal'
									>
										<FaTimes size={20} />
									</button>
								</div>
								<div className='px-4 pb-4 pt-6'>
									{showMeetingLink ? (
										<MeetingLink facetimeLink={facetimeLink} />
									) : (
										<MeetingForm
											setShowMeetingLink={setShowMeetingLink}
											setFacetimeLink={setFacetimeLink}
											recipientUserIds={recipientUserIds}
										/>
									)}
								</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}

function toIsoFromDatetimeLocal(value: string) {
	// datetime-local returns e.g. "2026-04-29T13:45" (no timezone).
	// Parsing that string with `new Date(value)` is inconsistent across environments.
	// Build a local Date explicitly to preserve the user's intended local time.
	const [datePart, timePart] = value.split("T");
	if (!datePart || !timePart) throw new Error("Invalid date/time");

	const [year, month, day] = datePart.split("-").map(Number);
	const [hour, minute] = timePart.split(":").map(Number);
	const dt = new Date(year, month - 1, day, hour, minute, 0, 0);
	if (Number.isNaN(dt.getTime())) throw new Error("Invalid date/time");
	return dt.toISOString();
}

const MeetingForm = ({
	setShowMeetingLink,
	setFacetimeLink,
	recipientUserIds,
}: {
	setShowMeetingLink: React.Dispatch<SetStateAction<boolean>>;
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
			const startsAtIso = toIsoFromDatetimeLocal(dateTime);

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

			// Store meeting metadata in our DB
			const saveRes = await fetch("/api/facetime/meetings", {
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
			if (!saveRes.ok) {
				const payload = await saveRes.json().catch(() => ({} as any));
				console.warn("Failed to save meeting", payload?.error ?? saveRes.statusText);
			}

			setFacetimeLink(createData.callId);
			setShowMeetingLink(true);
			console.log("Meeting Created!");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to create Meeting";
			console.error("CreateLink create error:", error);
			alert(message);
		} finally {
			setIsCreating(false);
		}
	};

	// Parse current date and time for form
	const today = new Date();
	const initialDate = today.toISOString().split("T")[0];
	const [selectedDate, setSelectedDate] = useState<string>(initialDate);
	const [selectedTime, setSelectedTime] = useState<string>("10:00");
	const [dateTime, setDateTime] = useState<string>(`${initialDate}T10:00`);
	const timeOptions = [
		"08:00",
		"08:30",
		"09:00",
		"09:30",
		"10:00",
		"10:30",
		"11:00",
		"11:30",
		"12:00",
		"12:30",
		"13:00",
		"13:30",
		"14:00",
		"14:30",
		"15:00",
		"15:30",
		"16:00",
		"16:30",
		"17:00",
		"17:30",
		"18:00",
		"18:30",
		"19:00",
		"19:30",
	];

	// Generate calendar days
	const generateCalendarDays = () => {
		const [year, month, day] = selectedDate.split("-").map(Number);
		const firstDay = new Date(year, month - 1, 1);
		const lastDay = new Date(year, month, 0);
		const prevLastDay = new Date(year, month - 1, 0);

		const firstDayOfWeek = firstDay.getDay();
		const daysInMonth = lastDay.getDate();
		const daysInPrevMonth = prevLastDay.getDate();

		const days: { date: string; isCurrentMonth: boolean }[] = [];

		// Previous month days
		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const prevDate = daysInPrevMonth - i;
			const prevMonth = month === 1 ? 12 : month - 1;
			const prevYear = month === 1 ? year - 1 : year;
			days.push({
				date: `${prevYear}-${String(prevMonth).padStart(2, "0")}-${String(
					prevDate
				).padStart(2, "0")}`,
				isCurrentMonth: false,
			});
		}

		// Current month days
		for (let i = 1; i <= daysInMonth; i++) {
			days.push({
				date: `${year}-${String(month).padStart(2, "0")}-${String(i).padStart(
					2,
					"0"
				)}`,
				isCurrentMonth: true,
			});
		}

		// Next month days
		const remainingDays = 42 - days.length; // 6 weeks * 7 days
		for (let i = 1; i <= remainingDays; i++) {
			const nextMonth = month === 12 ? 1 : month + 1;
			const nextYear = month === 12 ? year + 1 : year;
			days.push({
				date: `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(
					i
				).padStart(2, "0")}`,
				isCurrentMonth: false,
			});
		}

		return days;
	};

	const calendarDays = generateCalendarDays();
	const [year, month] = selectedDate.split("-").map(Number);
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const handleDateChange = (date: string) => {
		setSelectedDate(date);
		setDateTime(`${date}T${selectedTime}`);
	};

	const handleTimeChange = (time: string) => {
		setSelectedTime(time);
		setDateTime(`${selectedDate}T${time}`);
	};

	const handlePrevMonth = () => {
		const [y, m, d] = selectedDate.split("-").map(Number);
		const newMonth = m === 1 ? 12 : m - 1;
		const newYear = m === 1 ? y - 1 : y;
		const newDate = new Date(newYear, newMonth - 1, 1);
		const formattedDate = newDate.toISOString().split("T")[0];
		setSelectedDate(formattedDate);
	};

	const handleNextMonth = () => {
		const [y, m, d] = selectedDate.split("-").map(Number);
		const newMonth = m === 12 ? 1 : m + 1;
		const newYear = m === 12 ? y + 1 : y;
		const newDate = new Date(newYear, newMonth - 1, 1);
		const formattedDate = newDate.toISOString().split("T")[0];
		setSelectedDate(formattedDate);
	};

	return (
		<>
			<DialogTitle as="h3" className="text-lg font-bold leading-6 text-green-600">
				Schedule a FaceTime
			</DialogTitle>

			<Description className="text-xs opacity-40 mb-4">
				Schedule a FaceTime meeting with your cliq
			</Description>

			<form className="w-full" onSubmit={handleStartMeeting}>
				<label
					className="block text-left text-sm font-medium text-gray-700"
					htmlFor="description"
				>
					Meeting Description
				</label>
				<input
					type="text"
					name="description"
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="mt-1 block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-3"
					required
					placeholder="Enter a description for the meeting"
				/>

				<label className="block text-left text-sm font-medium text-gray-700 mb-3">
					Date and Time
				</label>

				{/* Calendar */}
				<div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
					<div className="flex items-center justify-between mb-3">
						<button
							type="button"
							onClick={handlePrevMonth}
							className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
						>
							←
						</button>
						<h3 className="text-sm font-semibold text-gray-800">
							{monthNames[month - 1]} {year}
						</h3>
						<button
							type="button"
							onClick={handleNextMonth}
							className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
						>
							→
						</button>
					</div>

					{/* Weekday headers */}
					<div className="grid grid-cols-7 gap-1 mb-2">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<div
								key={day}
								className="text-center text-xs font-semibold text-gray-500 h-8 flex items-center justify-center"
							>
								{day}
							</div>
						))}
					</div>

					{/* Calendar days */}
					<div className="grid grid-cols-7 gap-1">
						{calendarDays.map((day) => (
							<button
								key={day.date}
								type="button"
								onClick={() => handleDateChange(day.date)}
								className={`h-8 text-xs rounded flex items-center justify-center transition ${
									selectedDate === day.date
										? "bg-green-600 text-white font-semibold"
										: day.isCurrentMonth
											? "text-gray-900 hover:bg-gray-100"
											: "text-gray-400"
								}`}
							>
								{parseInt(day.date.split("-")[2])}
							</button>
						))}
					</div>
				</div>

				{/* Time input */}
				<label
					className="block text-left text-sm font-medium text-gray-700 mb-2"
					htmlFor="time"
				>
					Time
				</label>
				<select
					id="time"
					name="time"
					value={selectedTime}
					onChange={(e) => handleTimeChange(e.target.value)}
					className="block w-full text-sm py-3 px-4 border-gray-200 border-[1px] rounded mb-4 bg-white"
					required
				>
					{timeOptions.map((time) => (
						<option key={time} value={time}>
							{new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], {
								hour: "numeric",
								minute: "2-digit",
							})}
						</option>
					))}
				</select>

			<button className="w-full bg-green-600 text-white py-3 rounded mt-4 font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isCreating}>
				{isCreating ? "Creating..." : "Create FaceTime"}
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
				You can share the facetime link with your participants
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
		</>
	);
};
