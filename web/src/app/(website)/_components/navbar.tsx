"use client";

import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type Props = {};

const LandingPageNavBar = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "home";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleTab = (value: string) => {
    router.push(`?tab=${value}`, { scroll: false });
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="text-3xl font-semibold flex items-center gap-x-3">
          <Image alt="logo" src="/main-logo.svg" width={32} height={32} className="w-8 h-8 md:w-10 md:h-10" />
          <span className="text-white/90 font-semibold text-xl md:text-3xl">WebConnect</span>
        </div>

        <div className="hidden gap-x-2 items-center lg:flex">
          <button
            onClick={() => handleTab("home")}
            className={`py-2 px-5 font-semibold text-lg rounded-full transition-colors ${
              tab === "home"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleTab("pricing")}
            className={`py-2 px-5 font-semibold text-lg rounded-full transition-colors ${
              tab === "pricing"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            Pricing
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-x-3">
          <Link href="/auth/sign-in">
            <Button className="text-base flex gap-x-2">
              <User />
              Login
            </Button>
          </Link>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#111111] border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-x-2.5">
            <Image alt="logo" src="/main-logo.svg" width={28} height={28} className="w-7 h-7" />
            <span className="font-semibold text-lg">WebConnect</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-y-1 p-3 mt-2">
          <div className="text-xs font-mono uppercase tracking-widest text-white/20 px-3 mb-2">
            Navigation
          </div>
          <button
            onClick={() => handleTab("home")}
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
              tab === "home"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                tab === "home" ? "bg-black" : "bg-white/20"
              }`}
            />
            Home
          </button>
          <button
            onClick={() => handleTab("pricing")}
            className={`flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
              tab === "pricing"
                ? "bg-white text-black"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                tab === "pricing" ? "bg-black" : "bg-white/20"
              }`}
            />
            Pricing
          </button>
        </div>

         <div className="mt-auto p-4 border-t border-white/10">
          <Link href="/auth/sign-in" onClick={() => setSidebarOpen(false)}>
            <Button className="w-full text-sm flex gap-x-2">
              <User className="w-4 h-4" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingPageNavBar;