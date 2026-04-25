"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@heroui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons/lib";

type Props = {
  body?: ReactNode;
  headerIcon: IconType;
  headerText: string;
  subHeaderText?: string;
  action?: () => void;
  actionLabel?: string;
  footer?: ReactNode;
};

export default function CardWrapper({
  body,
  footer,
  headerIcon: Icon,
  headerText,
  subHeaderText,
  action,
  actionLabel,
}: Props) {
  return (
    <div className="flex items-center justify-center vertical-center px-4 py-6 sm:px-6">
      <Card className="glass-card mx-auto w-full max-w-md p-4 sm:p-5">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-neutral-800">
            <div className="flex flex-row items-center gap-3">
              <Icon size={30} className="text-black" />
              <h1 className="text-2xl font-medium text-black sm:text-3xl">
                {headerText}
              </h1>
            </div>
            {subHeaderText && (
              <p className="text-center text-neutral-500">
                {subHeaderText}
              </p>
            )}
          </div>
        </CardHeader>
        {body && <CardBody>{body}</CardBody>}
        <CardFooter className="flex flex-col justify-center">
          {action && (
            <Button
              onClick={action}
              fullWidth
              color="default"
              variant="bordered"
              className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-[15px] font-normal text-neutral-700"
            >
              {actionLabel}
            </Button>
          )}
          {footer && <>{footer}</>}
        </CardFooter>
      </Card>
    </div>
  );
}