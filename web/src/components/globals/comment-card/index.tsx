import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentRepliesProp } from "@/types/index.types";
import { AvatarImage } from "@radix-ui/react-avatar";

import React, { useState } from "react";

type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string };
  videoId: string;
  commentId?: string;
  reply: CommentRepliesProp[];
  isReply?: boolean;
};

const CommentCard = ({
  comment,
  author: { image, firstname, lastname },
  videoId,
  commentId,
  reply,
  isReply,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false)

  return <Card className={cn(isReply ? 'bg-[#1d1d1d] pl-10 border-none' : 'border-[1px] bg-[#1d1d1d]')}>
    <div className="flex gap-x-2 items-center pl-5">
      <Avatar>
        <AvatarImage src={image} alt="author"/>
      </Avatar>
      <p className="capitalize text-sm text-[#bdbdbd]">
        {firstname} {lastname}
      </p>
    </div>
    <div>
      <p className="text-[#bdbdbd] pl-5">{comment}</p>
    </div>
  </Card>;
};

export default CommentCard;
