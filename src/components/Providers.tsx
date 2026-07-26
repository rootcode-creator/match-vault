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
  useState,
} from "react";
import { AlertDialogModal } from "@/components/AlertDialogModal";
import { Toaster } from "sonner";
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
      getUnreadMessageCount()
        .then((count) => {
          updateUnreadCount(count);
        })
        .catch(() => {
          updateUnreadCount(0);
        });
      isUnreadCountSet.current = true;
    }
  }, [updateUnreadCount, userId]);
  // Suppress noisy NotAllowedError console messages in development that are
  // produced by the browser/platform when screen capture is blocked.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      try {
        const first = String(args[0] ?? "");
        if (
          first.includes("The request is not allowed by the user agent") ||
          /not allowed by the user agent|not allowed by the platform/i.test(first) ||
          first.includes("NotAllowedError")
        ) {
          return;
        }
      } catch {
        // fall through to default logging
      }
      return originalError.apply(console, args as any);
    };
    return () => {
      console.error = originalError;
    };
  }, []);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const handler = (ev: Event) => {
      try {
        // @ts-ignore
        const detail = ev?.detail ?? "Screen sharing blocked";
        setAlertMessage(String(detail));
        setAlertOpen(true);
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener("screenShareNotAllowed", handler as EventListener);
    return () => window.removeEventListener("screenShareNotAllowed", handler as EventListener);
  }, []);
  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, profileComplete);
  return (
    <SessionProvider>
      <HeroUIProvider>
        <Toaster position="bottom-right" richColors />
        <ToastContainer
          position="bottom-right"
          hideProgressBar
        />
        {alertOpen ? (
          <AlertDialogModal
            open={alertOpen}
            onOpenChange={setAlertOpen}
            title={"Screen sharing blocked"}
            description={alertMessage}
            confirmLabel={"OK"}
            onConfirm={() => setAlertOpen(false)}
          />
        ) : null}
        {children}
      </HeroUIProvider>
    </SessionProvider>
  );
}