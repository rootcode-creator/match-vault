"use client";

import { HeroUIProvider,Button,Link } from "@heroui/react";
import { GoSmiley } from "react-icons/go";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl">Hello App!</h1>

    <HeroUIProvider>

   
<Button  as={Link} href="/members" color="secondary" variant="solid" startContent={<GoSmiley/>}>
  Click me
</Button>  
 </HeroUIProvider>

</div>
  );
}  
