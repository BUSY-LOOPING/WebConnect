import { NextRequest } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!,
  },
  region: process.env.BUCKET_REGION,
  forcePathStyle: true,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME!,
    Key: filename,
  });

  const s3Response = await s3.send(command);
  const stream = s3Response.Body as ReadableStream;

  return new Response(stream, {
    headers: {
      "Content-Type": "video/webm",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
