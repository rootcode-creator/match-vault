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


    <Card className="mx-4 my-2">


      <CardHeader>


        {typeof header === "string" ? (


          <div className="text-2xl font-semibold text-default">


            {header}


          </div>


        ) : (


          <>{header}</>


        )}


      </CardHeader>


      <Divider className="mb-4"/>


      <CardBody className="mr-6 my-4">{body}</CardBody>


      {footer && (


        <CardFooter>{footer}</CardFooter>


      )}


    </Card>


  );


}