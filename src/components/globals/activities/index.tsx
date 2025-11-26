import { getVideoComments } from "@/actions/user";
import CommentForm from "@/components/forms/comment-form";
import { useQueryData } from "@/hooks/useQueryData";
import { VideoCommentProps } from "@/types/index.types";
import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";
import CommentCard from "../comment-card";

type Props = {
  author: string;
  videoId: string;
};

const Activities = ({ author, videoId }: Props) => {
  const { data } = useQueryData(["video-comments"], () =>
    getVideoComments(videoId)
  );

  const { data: comments } = data as VideoCommentProps;
  return (
    <TabsContent
      value="Activity"
      className="p-5 bg-[#1d1d1d] rounded-xl flex flex-col gap-y-5"
    >
      <CommentForm author={author} videoId={videoId} />
      {/* <CommentCard
        comment={comment.comment}
        key={comment.id}
        author={{
          image: comment.User?.image,
          firstname: comment.User?.firstname!,
          lastname: comment.User?.lastname!,
        }}
        videoId={videoId}
        reply={comment.reply}
        commentId={comment.id}
      /> */}
      {comments.map((comment) => (<CommentCard
        comment={comment.comment}
        key={comment.id}
        author={{
          image: comment.User?.image,
          firstname: comment.User?.firstname!,
          lastname: comment.User?.lastname!,
        }}
        videoId={videoId}
        reply={comment.reply}
        commentId={comment.id}
      />))}
    </TabsContent>
  );
};

export default Activities;
