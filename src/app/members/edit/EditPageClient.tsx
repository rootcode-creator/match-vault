"use client";
import EditForm from "./EditForm";

type Props = { member: any };

export default function EditPageClient({ member }: Props) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
      <EditForm member={member} />
    </div>
  );
}