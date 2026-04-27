"use client";

import { Card, CardHeader, Divider, CardBody, CardFooter } from "@heroui/react";
import React, { ReactNode } from "react";
type Props = {
  header: ReactNode | string;
  body: ReactNode;
  footer?: ReactNode;
  compactFooter?: boolean;
};

export default function CardInnerWrapper({
  header,
  body,
  footer,
  compactFooter = false,
}: Props) {
  return (
    <Card className="glass-card mx-2 my-2 sm:mx-4">
      <CardHeader className="pb-3">
        {typeof header === "string" ? (
          <div className="text-xl font-semibold text-default sm:text-2xl">
            {header}
          </div>
        ) : (
          <>{header}</>
        )}
      </CardHeader>
      <Divider className="mb-4" />
      <CardBody
        className={
          compactFooter && footer
            ? "mt-3 mb-0 !flex-none bg-transparent px-3 sm:mt-4 sm:px-5"
            : "my-3 px-3 sm:my-4 sm:px-5"
        }
      >
        {body}
      </CardBody>
      {footer && (
        <CardFooter
          className={
            compactFooter
              ? "bg-transparent px-3 pt-0 pb-4 sm:px-5"
              : "px-3 pb-4 sm:px-5"
          }
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}