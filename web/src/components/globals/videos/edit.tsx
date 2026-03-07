import React from "react";
import Modal from "../modal";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type Props = {
  title: string;
  description: string;
  videoId: string;
};

const EditVideo = ({ description, title, videoId }: Props) => {
  return (
    <Modal
      title="Edit video details"
      description={description}
      trigger={<Button variant={"ghost"}>
        <Edit className="text-[#6c6c6c]"/>
      </Button>}
    >
        {}
    </Modal>
  );
};

export default EditVideo;
