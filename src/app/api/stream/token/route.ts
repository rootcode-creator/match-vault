import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";
import { getAuthUserId } from "@/app/actions/authActions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getAuthUserId();

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_SECRET_KEY;

  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Stream is not configured" },
      { status: 500 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, image: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const client = new StreamClient(apiKey, apiSecret);

  await client.upsertUser({
    id: user.id,
    name: user.name ?? undefined,
    image: user.image ?? undefined,
  });

  const token = client.generateUserToken({ user_id: user.id });

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      image: user.image,
    },
  });
}