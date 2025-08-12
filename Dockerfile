FROM node:22-alpine3.22 AS builder

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm install -g corepack@latest
RUN corepack enable pnpm && pnpm install --frozen-lockfile;

COPY . .

RUN npm run build

# Production
FROM node:22-alpine3.22

RUN apk add --no-cache openssl

WORKDIR /app
 
ENV NODE_ENV=production 

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

CMD [ "npm", "run", "start:prod" ]