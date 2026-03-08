import React from "react";
import LandingPageNavBar from "./_components/navbar";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col py-10 px-10 xl:px-12 container mx-auto w-full">
      <Suspense fallback={null}>
        <LandingPageNavBar />
      </Suspense>
      {children}
    </div>
  );
};

export default layout;
