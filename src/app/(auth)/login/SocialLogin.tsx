import { Button } from "@heroui/react";
import { FaGithub } from "react-icons/fa";
import {FcGoogle} from "react-icons/fc";
import { signIn, signOut } from "next-auth/react";

export default function SocialLogin() {
  const providers = [
    {
      name: "google",
      icon: <FcGoogle size={20} />,
      text: "Google",
    },
    {
      name: "github",
      icon: <FaGithub size={20} />,
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
    <div className="mt-3 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          size="md"
          variant="bordered"
          className="h-9 w-full rounded-lg border-2 border-slate-400 bg-white text-slate-800 font-medium hover:bg-slate-50 sm:w-[44%]"
          onClick={() =>
            onClick(
              provider.name as "google" | "github"
            )
          }
        >
          {provider.icon}
          <span>{provider.text}</span>
        </Button>
      ))}
    </div>
  );
}