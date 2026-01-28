"use client";

import { getUnreadMessageCount } from "@/app/actions/messageActions";
import useMessageStore from "@/hooks/useMessageStore";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { HeroUIProvider } from "@heroui/react";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string | null;
}) {
  const isUnreadCountSet = useRef(false);
  const setUnreadCount = useMessageStore(
    (state) => state.setUnreadCount
  );

  const initUnreadCount = useCallback(
    (amount: number) => {
      setUnreadCount(amount);
    },
    [setUnreadCount]
  );

  useEffect(() => {
    if (!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then((count) => {
        initUnreadCount(count);
      });
      isUnreadCountSet.current = true;
    }
  }, [initUnreadCount, userId]);
  usePresenceChannel(userId);
  useNotificationChannel(userId);
  return (
    <HeroUIProvider>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
      />
      {children}
    </HeroUIProvider>
  );
}