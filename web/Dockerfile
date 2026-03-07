FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

ARG DATABASE_URL
RUN echo "DB URL key present: $([ -n "$DATABASE_URL" ] && echo YES || echo NO)"
ENV DATABASE_URL=${DATABASE_URL}

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