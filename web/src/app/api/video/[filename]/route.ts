import { NextRequest } from "next/server";
import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

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
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const range = req.headers.get("range"); 

    const head = await s3.send(new HeadObjectCommand({
      Bucket: process.env.MINIO_BUCKET_NAME,
      Key: filename,
    }));

    const fileSize = head.ContentLength!;
    const contentType = filename.endsWith(".mp4") ? "video/mp4" : "video/webm";

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const command = new GetObjectCommand({
        Bucket: process.env.MINIO_BUCKET_NAME,
        Key: filename,
        Range: `bytes=${start}-${end}`,
      });

      const s3Response = await s3.send(command);
      const stream = s3Response.Body as ReadableStream;

      return new Response(stream, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.MINIO_BUCKET_NAME,
      Key: filename,
    });

    const s3Response = await s3.send(command);
    const stream = s3Response.Body as ReadableStream;

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes", 
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    if (err?.name === "NoSuchKey") {
      return new Response("Video not found", { status: 404 });
    }
    console.error("Video proxy error:", err);
    return new Response("Failed to load video", { status: 500 });
  }
}