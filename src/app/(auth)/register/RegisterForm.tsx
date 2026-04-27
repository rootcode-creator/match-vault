"use client";

import {
  profileSchema,
  registerSchema,
  RegisterSchema,
} from "@/lib/schemas/RegisterSchema";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
} from "@heroui/react";

import {
  FormProvider,
  useForm,
} from "react-hook-form";
import { GiPadlock } from "react-icons/gi";
import UserDetailsForm from "./UserDetailsForm";
import { useState } from "react";
import { handleFormServerErrors } from "@/lib/util";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileDetailsForm from "./ProfileDetailsForm";
import { registerUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import type { ZodIssue } from "zod";
import Link from "next/link";

const stepSchemas = [registerSchema, profileSchema]


export default function RegisterForm() {
  
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchemas[activeStep];
  
  const registerFormMethods = useForm<RegisterSchema>({
      resolver: zodResolver(currentValidationSchema),
      mode: "onTouched",
    });

  const { handleSubmit,
    getValues,
    setError,
    formState: { errors,isValid, isSubmitting },
  } = registerFormMethods;
  
  
 const router = useRouter();

  const onSubmit = async () => {
    const result = await registerUser(
      getValues()
    );
    if (result.status === "success") {
      router.push("/register/success");
    } else {
      handleFormServerErrors(result, setError);

      if (Array.isArray(result.error)) {
        const accountFields = new Set(["name", "email", "password"]);
        const profileFields = new Set([
          "gender",
          "description",
          "city",
          "country",
          "dateOfBirth",
        ]);

        const hasAccountFieldError = result.error.some((issue: ZodIssue) =>
          accountFields.has(String(issue.path[0]))
        );
        const hasProfileFieldError = result.error.some((issue: ZodIssue) =>
          profileFields.has(String(issue.path[0]))
        );

        if (hasAccountFieldError) {
          setActiveStep(0);
          return;
        }

        if (hasProfileFieldError) {
          setActiveStep(1);
        }
      }
    }
  };

 
 const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
      case 1:
        return <ProfileDetailsForm />;
      default:
        return "Unknown step";
    }
  };
    

  const onBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onNext = async () => {
    if (activeStep === stepSchemas.length - 1) {
      await onSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };


  return (
    <Card
      className="relative w-full max-w-[30rem] mx-auto py-7 px-6 rounded-2xl bg-white/95 backdrop-blur
      ring-1 ring-indigo-100 border border-white/60
      shadow-[0_18px_50px_-12px_rgba(79,70,229,0.35),0_25px_55px_-25px_rgba(0,0,0,0.3)]"
    >
      <CardHeader className="flex flex-col items-center justify-center mb-2">
        <div className="flex flex-col gap-2 items-center text-default">
          <div className="flex flex-row items-center gap-3">
            <GiPadlock size={30} />
            <h1 className="text-3xl font-semibold">
              Register
            </h1>
          </div>
          <p className="text-neutral-500">
            Welcome to MatchVault
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <FormProvider  {...registerFormMethods}>
          <form onSubmit={handleSubmit(onNext)}>
            <div className="space-y-4">

               {getStepContent(activeStep)}
              {errors.root?.serverError && (
                <p className="text-sm text-black">
                  {
                    errors.root.serverError
                      .message
                  }
                </p>
              )}

            <div className="flex flex-row items-center gap-3 pt-0">
              {activeStep !== 0 && (
                  <Button
                    onClick={onBack}
                    fullWidth
                    className="h-10 rounded-lg bg-transparent border border-black text-black font-semibold hover:bg-black/5"
                  >
                    Back
                  </Button>
                )}
                <Button
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  fullWidth
                  disableRipple
                  className="h-10 rounded-lg bg-black text-white font-semibold shadow-md hover:bg-zinc-800 hover:shadow-lg active:translate-y-px"
                  type="submit"
                >
                  {activeStep ===
                  stepSchemas.length - 1
                    ? "Submit"
                    : "Continue"}
                </Button>
              </div>

              <div className="mt-3 flex justify-center text-sm text-default-700">
                Already have an account?{" "}
                <Link href="/login" className="ml-1 font-medium text-sky-600 hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
}