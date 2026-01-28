import PusherServer from "pusher";
import PusherClient from "pusher-js";

const CLUSTER = "ap1";

declare global {
  var pusherServerInstance: PusherServer | undefined;
  var pusherClientInstance: PusherClient | undefined;
}

const globalForPusher = globalThis as typeof globalThis & {
  pusherServerInstance?: PusherServer;
  pusherClientInstance?: PusherClient;
};

if (typeof window === "undefined") {
  if (!globalForPusher.pusherServerInstance) {
    globalForPusher.pusherServerInstance = new PusherServer({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      secret: process.env.PUSHER_APP_SECRET!,
      cluster: CLUSTER,
      useTLS: true,
    });
  }
}

if (typeof window !== "undefined") {
  if (!globalForPusher.pusherClientInstance) {
    globalForPusher.pusherClientInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: CLUSTER,
        channelAuthorization: {
          endpoint: "/api/pusher-auth",
          transport: "ajax",
        },
      }
    );
  }
}

export const pusherServer = globalForPusher.pusherServerInstance;
export const pusherClient = globalForPusher.pusherClientInstance;

export function getPusherServer(): PusherServer {
  if (!globalForPusher.pusherServerInstance) {
    throw new Error(
      "Pusher server is not initialized. This must run on the server with PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_APP_KEY, and PUSHER_APP_SECRET configured."
    );
  }

  return globalForPusher.pusherServerInstance;
}

export function getPusherClient(): PusherClient {
  if (!globalForPusher.pusherClientInstance) {
    throw new Error(
      "Pusher client is not initialized. This must run in the browser with NEXT_PUBLIC_PUSHER_APP_KEY configured."
    );
  }

  return globalForPusher.pusherClientInstance;
}


