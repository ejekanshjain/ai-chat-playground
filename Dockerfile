FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

COPY .env.example .env

RUN bun run build

ENTRYPOINT ["bun", "start"]
