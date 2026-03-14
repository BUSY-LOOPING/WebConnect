# WebConnect

A full-stack video recording, sharing, and collaboration platform. Record your screen or camera from the browser or desktop, share videos with teammates, get AI-generated transcriptions and summaries, and manage everything through workspaces with role-based access.

---

## Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)

### Backend & API
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Desktop
![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)

### Auth & Payments
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)

### Infrastructure
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-C72E49?style=for-the-badge&logo=minio&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=Jenkins&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

### AI & Media
![FFmpeg](https://img.shields.io/badge/FFmpeg-007808?style=for-the-badge&logo=ffmpeg&logoColor=white)
![Whisper](https://img.shields.io/badge/OpenAI_Whisper-412991?style=for-the-badge&logo=openai&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logoColor=white)

---

## Features

- **Browser Recording** — record camera, screen, or both directly from the web app with live preview and countdown timer
- **Desktop Recording** — Electron app for full screen capture with system audio support
- **Chunked Streaming Upload** — video chunks are streamed via Socket.io in real time as you record, no waiting for upload after stopping
- **AI Transcription** — PRO plan recordings are automatically transcribed using self-hosted Whisper medium model, or swap to OpenAI Whisper API via env config
- **AI Summaries** — transcriptions are summarized into structured titles and descriptions using a local Ollama LLM (Qwen 2.5), or swap to OpenAI GPT models by updating `BASE_URL` and `OPEN_AI_KEY`
- **Workspaces** — personal and public workspaces with folder organization
- **Team Collaboration** — invite members to workspaces via email, accept invitations, and share videos across teams
- **First View Notifications** — get an email when someone watches your video for the first time
- **Video Preview** — stream videos directly from MinIO object storage with HTTP range request support for seek and mobile compatibility. MinIO is S3-compatible and can be swapped for AWS S3 by updating the storage env variables
- **Copy Link & Rich Previews** — shareable links with OpenGraph-style rich previews
- **Subscription Tiers** — FREE and PRO plans managed via Stripe, with PRO unlocking AI features and public workspace creation
- **CI/CD** — automated deployment via Jenkins pipeline with Docker Compose

---

## Architecture

```
┌────────────────────────────────────────────────┐
│                  Cloudflare Tunnel             │
└────────────────────────────────────────────────┘
       │              │
       │              │
┌──────▼──────┐ ┌─────▼────────┐
│  Next.js    │ │  Express +   │
│  (web:3000) │ │  Socket.io   │
│             │ │  (3002)      │
└──────┬──────┘ └─────┬────────┘
       │              │
       │         ┌────▼──────────────────┐
       │         │  FFmpeg (conversion)  │
       │         │  Whisper (ASR :9005)  │
       │         │  Ollama LLM (local)   │
       │         └────┬──────────────────┘
       │              │
┌──────▼──────────────▼──┐
│   MinIO Object Storage  │
│   (S3-compatible :9000) │
└─────────────────────────┘
       │
┌──────▼──────┐
│  PostgreSQL  │
│  (Prisma)    │
└─────────────┘
```

---

## Project Structure

```
webconnect/
├── web/                    # Next.js app
│   ├── src/
│   │   ├── app/            # App router pages and API routes
│   │   │   └── api/
│   │   │       ├── recording/[id]/
│   │   │       │   ├── processing/  # Create video record, mark processing
│   │   │       │   ├── complete/    # Mark video as done
│   │   │       │   └── transcribe/  # Save AI title, summary, transcript
│   │   │       └── video/[filename] # Video streaming proxy (range requests)
│   │   ├── actions/        # Server actions (user, workspace)
│   │   ├── components/     # UI components
│   │   └── lib/            # Prisma client, utilities
│   └── Dockerfile
├── express/                # Socket.io + video processing server
│   └── index.js            # Chunk ingestion, FFmpeg, S3 upload, Whisper, Ollama
├── electron/               # Desktop recording app
├── docker-compose.yml      # Full stack orchestration
└── .env                    # Environment configuration
```

---

## Services

| Service | Port | Description |
|---|---|---|
| `web` | 3000 | Next.js frontend and API |
| `express` | 3002 | Socket.io server, video processing |
| `minio` | 9000 | Object storage (S3-compatible) |
| `minio-console` | 9001 | MinIO web UI |
| `whisper` | 9005 | Speech-to-text ASR service |

---

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- FFmpeg installed on the Express server host
- A running Ollama instance with `qwen2.5-coder:14b` pulled
- A running Whisper ASR container

### Environment Setup

Copy the example env and fill in the required values:

```bash
cp .env.example .env
```

Required variables:

```dotenv
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Stripe
STRIPE_SUBSCRIPTION_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISH_KEY=pk_...
STRIPE_CLIENT_SECRET=sk_...

# App URLs
NEXT_PUBLIC_HOST_URL=https://your-domain.com
NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL=https://your-domain.com/api/video
NEXT_PUBLIC_SOCKET_URL=https://your-socket-domain.com

# AI — defaults to self-hosted Ollama + Whisper
BASE_URL=http://your-ollama-host:11434/v1
OPEN_AI_KEY=ollama
WHISPER_MODEL=medium
WHISPER_URL=http://whisper:9000

# To use OpenAI instead of Ollama, set:
# BASE_URL=https://api.openai.com/v1
# OPEN_AI_KEY=sk-...
# And update the model name in express/index.js from 'qwen2.5-coder:14b' to 'gpt-4o' or similar

# Storage — defaults to self-hosted MinIO (S3-compatible)
MINIO_ROOT_USER=your_user
MINIO_ROOT_PASSWORD=your_password
ACCESS_KEY=your_access_key
SECRET_KEY=your_secret_key
MINIO_BUCKET_NAME=your_bucket
MINIO_ENDPOINT=http://minio:9000
BUCKET_REGION=us-east-1

# To use AWS S3 instead of MinIO, set:
# MINIO_ENDPOINT=https://s3.amazonaws.com  (or leave unset for default AWS endpoint)
# ACCESS_KEY=your_aws_access_key_id
# SECRET_KEY=your_aws_secret_access_key
# BUCKET_REGION=your_aws_region
# MINIO_BUCKET_NAME=your_s3_bucket_name
# Remove forcePathStyle from the S3 client config in express/index.js

# Email
MAILER_EMAIL=your_email@gmail.com
MAILER_PASSWORD=your_app_password
```

### Run with Docker Compose

```bash
docker compose up -d
```

### Local Development

```bash
# Web
cd web
npm install
npm run dev

# Express
cd express
npm install
node index.js
```

---

## Recording Flow

```
Browser/Electron
     │
     │  video-chunks (Socket.io, every 2s)
     ▼
Express Server
     │  appends chunks to temp file
     │
     │  process-video (on stop)
     ▼
FFmpeg → converts WebM to MP4
     │
     ▼
MinIO ← uploads MP4
     │
     ▼ (PRO plan only)
Whisper ASR → transcript
     │
     ▼
Ollama LLM → title + summary JSON
     │
     ▼
Next.js API → saves to PostgreSQL
```

---

## Deployment

The project uses Jenkins for CI/CD. On every push to the main branch:

1. Workspace is cleaned and code is checked out
2. Secrets are injected from Jenkins credentials store
3. Docker images are built with build-time environment variables
4. Containers are recreated with `--force-recreate`
5. Deployment is verified with `docker ps`

---

## License

MIT License

Copyright (c) 2026 Dhruv Yadav

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.