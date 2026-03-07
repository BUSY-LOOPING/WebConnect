FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

ARG DATABASE_URL
ARG STRIPE_SUBSCRIPTION_PRICE_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISH_KEY
ARG STRIPE_CLIENT_SECRET
ENV DATABASE_URL=${DATABASE_URL}
ENV STRIPE_SUBSCRIPTION_PRICE_ID=${STRIPE_SUBSCRIPTION_PRICE_ID}
ENV NEXT_PUBLIC_STRIPE_PUBLISH_KEY=${NEXT_PUBLIC_STRIPE_PUBLISH_KEY}
ENV STRIPE_CLIENT_SECRET=${STRIPE_CLIENT_SECRET}

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules/.prisma ./.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]