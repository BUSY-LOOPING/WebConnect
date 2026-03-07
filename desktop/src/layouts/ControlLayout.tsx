import { cn, onCloseApp } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { X } from "lucide-react";
import React, { useState } from "react";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const ControlLayout = ({ children, className }: Props) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  window.ipcRenderer.on("hide-plugin", (event, payload) => {
    //(event);
    setIsVisible(payload.state);
  });
  return (
    <div
    //   onMouseEnter={enableDrag}
    //   onMouseLeave={disableDrag}
      className={cn(
        styles.layout,
        className,
        isVisible && "invisible",
        "bg-[#171717] flex px-1 flex-col rounded-3xl overflow-hidden border-2 border-neutral-700",
      )}
    >
      <div className="flex justify-between items-center p-5 draggable">
        <span className="non-draggable">
          <UserButton />
        </span>
        <X
          size={20}
          className="text-gray-400 non-draggable hover:text-white cursor-pointer"
          onClick={onCloseApp}
        />
      </div>
      <div className="flex-1 h-0 overflow-auto">{children}</div>
      <div className="p-5 flex w-full">
        <div className="flex items-center gap-x-2">
          <img className="size-9" src="main-logo.svg" alt="Logo" />
          <p className="text-white text-2xl">WebConnect</p>
        </div>
      </div>
    </div>
  );
};

export default ControlLayout;
