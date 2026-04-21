"use client";

import { Card, CardHeader, Divider, CardBody, CardFooter } from "@heroui/react";
import React, { ReactNode } from "react";
type Props = {
  header: ReactNode | string;
  body: ReactNode;
  footer?: ReactNode;
};

export default function CardInnerWrapper({
  header,
  body,
  footer,
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
      <CardBody className="my-3 px-3 sm:my-4 sm:px-5">{body}</CardBody>
      {footer && <CardFooter className="px-3 pb-4 sm:px-5">{footer}</CardFooter>}
    </Card>
  );
}