"use client";

import { getWorkSpaces } from "@/actions/workspace";
import React from "react";
import Modal from "../modal";
import { useQueryData } from "@/hooks/useQueryData";
import { Button } from "@/components/ui/button";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import WorkspaceForm from "@/components/forms/workspace-form";

type Props = {};

const CreateWorkspace = (props: Props) => {
  const { data } = useQueryData(["user-workspaces"], getWorkSpaces);

  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
  };

  if (plan.subscription?.plan === "FREE") {
    return <></>;
  }
  return (
    <Modal
      title="Create a Workspace"
      description="Workspaces help you collaborate with team members. You are assigned a default workspace where you can share videos in private with yourself."
      trigger={
        <Button className="bg-[#1d1d1d] text-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusDuotine/>
            Create a workspace
        </Button>
      }
    >
        <WorkspaceForm/>
    </Modal>
  );
};

export default CreateWorkspace;
