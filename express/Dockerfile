FROM node:20-alpine

RUN apk update && apk add --no-cache ffmpeg

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
