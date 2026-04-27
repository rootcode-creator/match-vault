"use client";

import {
  profileSchema,
} from "@/lib/schemas/RegisterSchema";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
} from "react-hook-form";
import { RiProfileLine } from "react-icons/ri";
import ProfileForm from "../register/ProfileDetailsForm";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@heroui/react";
import { completeSocialLoginProfile } from "@/app/actions/authActions";
import { signIn } from "next-auth/react";

type ProfileSchema = z.infer<typeof profileSchema>;

export default function CompleteProfileForm() {
  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (
    data: ProfileSchema
  ) => {
    const result =
      await completeSocialLoginProfile(data);

    if (result.status === "success") {
      signIn(result.data, {
        callbackUrl: "/members",
      });
      return;
    }

    const errorMessage =
      typeof result.error === "string"
        ? result.error
        : result.error.map((issue) => issue.message).join(", ");

    setError("root.serverError", {
      type: "server",
      message: errorMessage,
    });
  };

  return (
    <Card
      className="relative w-full max-w-md mx-auto py-7 px-6 rounded-2xl bg-white/95 backdrop-blur
      ring-1 ring-indigo-100 border border-white/60
      shadow-[0_18px_50px_-12px_rgba(79,70,229,0.35),0_25px_55px_-25px_rgba(0,0,0,0.3)]"
    >
      <CardHeader className="flex flex-col items-center justify-center mb-2">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <RiProfileLine size={30} />
            <h1 className="text-3xl font-semibold">About you</h1>
          </div>
          <p className="text-neutral-500 text-center">
            Please complete your profile to continue to the app
          </p>
        </div>
      </CardHeader>

      <CardBody>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <ProfileForm />
              {errors.root?.serverError && (
                <p className="text-sm text-black">
                  {errors.root.serverError.message}
                </p>
              )}
              <div className="flex flex-row items-center gap-3 pt-0">
                <Button
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  fullWidth
                  disableRipple
                  className="h-10 rounded-lg bg-black text-white font-semibold shadow-md hover:shadow-lg active:translate-y-px"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}