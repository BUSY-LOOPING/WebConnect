"use client";

import { getWorkSpaces } from "@/actions/workspace";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useQueryData } from "@/hooks/useQueryData";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NotificationProps, WorkspaceProps } from "@/types/index.types";
import Modal from "../modal";
import { Menu, PlusCircle } from "lucide-react";
import Search from "../search";
import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./sidebar-item";
import { count } from "node:console";
import { getNotifications } from "@/actions/user";
import WorkspacePlaceholder from "./workspace-placeholder";
import GlobalCard from "../global-card";
import { Button } from "@/components/ui/button";
import Loader from "../loader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../info-bar";
import { UserButton } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { WORKSPACES } from "@/redux/slices/workspaces";
import PaymentButton from "../payment-button";
import { useEffect } from "react";

type Props = {
  activeWorkspaceId: string;
};

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();

  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkSpaces);
  const menuItems = MENU_ITEMS(activeWorkspaceId);

  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications,
  );
  const { data: workspace } = data as WorkspaceProps;
  const { data: count } = notifications as NotificationProps;

  const onChangeActiveWorkspace = (value: String) => {
    router.push(`/dashboard/${value}`);
  };

  const currentWorkspace = workspace.workspace.find(
    (s) => s.id == activeWorkspaceId,
  );

  useEffect(() => {
    if (isFetched && workspace) {
      dispatch(WORKSPACES({ workspaces: workspace.workspace }));
    }
  }, [isFetched, workspace, dispatch]);

  const SidebarSection = (
  <div className="bg-[#111111] flex-none relative h-screen w-[250px] flex flex-col">
    
    <Link  href="/dashboard" className="bg-[#111111] gap-2 py-4 px-4 justify-center flex items-center w-full z-20 shrink-0 pt-6">
      <Image src="/main-logo.svg" height={40} width={40} alt="logo" />
      <p className="text-2xl">WebConnect</p>
    </Link>

    <div className="mt-10 flex flex-col gap-4 items-center px-4 pb-4 overflow-y-auto flex-1">
      <Select defaultValue={activeWorkspaceId} onValueChange={onChangeActiveWorkspace}>
        <SelectTrigger className="w-full text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent className="bg-[#111111] backdrop-blur-xl">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspace.workspace.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map(
                (workspace) =>
                  workspace.WorkSpace && (
                    <SelectItem value={workspace.WorkSpace.id} key={workspace.WorkSpace.id}>
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  ),
              )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {currentWorkspace?.type === "PUBLIC" && workspace.subscription?.plan === "PRO" && (
        <Modal
          title="Invite To Workspace"
          description="Invite other users to your workspace"
          trigger={
            <span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
              <PlusCircle size={15} className="text-neutral-800/90 fill-neutral-500" />
              <span className="text-neutral-400 font-semibold text-xs">Invite to Workspace</span>
            </span>
          }
        >
          <Search workspaceId={activeWorkspaceId} />
        </Modal>
      )}

      <p className="w-full text-[#9d9d9d] font-bold mt-4">Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              href={item.href}
              icon={item.icon}
              title={item.title}
              selected={pathName === item.href}
              key={item.title}
              notifications={
                (item.title === "Notifications" && count._count && count._count.notification) || 0
              }
            />
          ))}
        </ul>
      </nav>

      <Separator className="w-4/5" />
      <p className="w-full text-[#9d9d9d] font-bold">Workspaces</p>

      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-[#3c3c3c] font-medium text-sm">
            {workspace.subscription?.plan === "FREE" ? "Upgrade to create workspaces" : "No Workspaces"}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul className="overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathName === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={0}
                    key={item.name}
                    icon={<WorkspacePlaceholder>{item.name.charAt(0)}</WorkspacePlaceholder>}
                  />
                ),
            )}
          {workspace.members.length > 0 &&
            workspace.members.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.WorkSpace.id}`}
                selected={pathName === `/dashboard/${item.WorkSpace.id}`}
                title={item.WorkSpace.name}
                notifications={0}
                key={item.WorkSpace.name}
                icon={<WorkspacePlaceholder>{item.WorkSpace.name.charAt(0)}</WorkspacePlaceholder>}
              />
            ))}
        </ul>
      </nav>

      <Separator className="w-4/5" />
      {workspace.subscription?.plan === "FREE" && (
        <GlobalCard
          title="Upgrade to Pro"
          description="Unlock AI features like transcription, AI summary, and more"
          footer={<PaymentButton />}
        />
      )}
    </div>
  </div>
);
  return (
    <div className="full">
      <InfoBar />

      <div className="md:hidden fixed my-4 z-50">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button variant={"ghost"} className="mt-[2px]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"} className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;
