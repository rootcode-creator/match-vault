"use client";

import { HeroUIProvider } from "@heroui/react";
import React, { ReactNode } from "react";
import { ToastContainer, toast, Zoom, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Providers({ children }: { children: ReactNode }) {
  return (<HeroUIProvider>
    <ToastContainer position="top-right"
autoClose={5000}
hideProgressBar
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}/>
    {children}</HeroUIProvider>);
}
