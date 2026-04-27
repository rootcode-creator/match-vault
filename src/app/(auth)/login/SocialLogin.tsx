import { Button } from "@heroui/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn, signOut } from "next-auth/react";

export default function SocialLogin() {
  const providers = [
    {
      name: "google",
      icon: <FcGoogle size={18} />,
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
    <div className="mt-4 w-full">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="h-px flex-1 bg-default-200" />
        <span className="text-lg text-default-800">Or Sign In with</span>
        <span className="h-px flex-1 bg-default-200" />
      </div>

      <div className="flex w-full items-center justify-center gap-5">
        {providers.map((provider) => (
          <Button
            key={provider.name}
            aria-label={provider.text}
            isIconOnly
            size="sm"
            variant="bordered"
            className="h-10 w-10 min-w-10 rounded-full border border-default-200 bg-white text-slate-600 shadow-none transition hover:border-default-300 hover:bg-default-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
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
    </div>
  );
}