"use client";

import { getUnreadMessageCount } from "@/app/actions/messageActions";
import useMessageStore from "@/hooks/useMessageStore";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { HeroUIProvider } from "@heroui/system";
import React, {
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
  userId,
  profileComplete,
}: {
  children: ReactNode;
  userId: string | null;
  profileComplete: boolean;
}) {
  const isUnreadCountSet = useRef(false);
  const updateUnreadCount = useMessageStore(
    (state) => state.updateUnreadCount
  );

  useEffect(() => {
    if (!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then((count) => {
        updateUnreadCount(count);
      });
      isUnreadCountSet.current = true;
    }
  }, [updateUnreadCount, userId]);
  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, profileComplete);
  return (
    <SessionProvider>
      <HeroUIProvider>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
        />
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}