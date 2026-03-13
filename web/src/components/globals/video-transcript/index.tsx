import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

type Props = {
  description: string;
  processing: boolean;
  isPro: boolean
};

const TranscriptSkeleton = () => (
  <div className="flex flex-col gap-y-3 animate-pulse">
    {[..."12345678"].map((_, i) => (
      <div
        key={i}
        className="relative overflow-hidden rounded-full bg-[#252525]"
        style={{ height: "12px", width: `${60 + ((i * 17) % 40)}%` }}
      >
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      </div>
    ))}
  </div>
);

const VideoTranscript = ({ description: transcript, processing, isPro }: Props) => {
  return (
    <TabsContent
      value="Transcript"
      className="p-3 md:p-5 bg-[#1d1d1d] rounded-xl flex flex-col gap-y-6"
    >
      {processing ? (
        <TranscriptSkeleton />
      ) : transcript ? (
        <p className="text-[#a7a7a7] text-sm md:text-base leading-relaxed">
          {transcript}
        </p>
      ) : (
        <div className="flex flex-col items-center justify-center gap-y-2 py-10 text-center">
          <p className="text-[#5a5a5a] text-sm font-medium">
            No transcript available
          </p>
          <p className="text-[#3a3a3a] text-xs">
            {isPro ? 'Transcript generation failed' : 'Transcription is only generated for PRO plan recordings'}
          </p>
        </div>
      )}
    </TabsContent>
  );
};

export default VideoTranscript;