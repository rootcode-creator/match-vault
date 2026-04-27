import { Button } from "@heroui/react";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { signIn, signOut } from "next-auth/react";

export default function SocialLogin() {
  const providers = [
    {
      name: "google",
      icon: <FaGoogle size={22} />,
      text: "Google",
    },
    {
      name: "github",
      icon: <FaGithub size={22} />,
      text: "GitHub",
    },
  ];

  const onClick = async (
    provider: "google" | "github"
  ) => {
    await signOut({ redirect: false });

    if (provider === "google") {
      await signIn(provider, { callbackUrl: "/members" }, { prompt: "select_account" });
      return;
    }

    await signIn(provider, {
      callbackUrl: "/members",
    });
  };

  return (
    <div className="mt-3 flex w-full items-center justify-center gap-6">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          aria-label={provider.text}
          isIconOnly
          size="sm"
          variant="bordered"
          className="h-14 w-14 min-w-14 rounded-2xl border border-slate-200 bg-transparent text-slate-700 shadow-[0_4px_12px_-6px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-black/5 hover:text-slate-900 hover:shadow-[0_10px_22px_-10px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          onClick={() =>
            onClick(
              provider.name as "google" | "github"
            )
          }
        >
          <span className="shrink-0">{provider.icon}</span>
        </Button>
      ))}
    </div>
  );
}