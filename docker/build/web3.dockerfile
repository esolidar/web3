# Install dependencies only when needed
FROM node:12 AS deps

ARG NPM_TOKEN=${NPM_TOKEN}
ENV NPM_TOKEN=${NPM_TOKEN}

ARG NODE_ENV=${NODE_ENV}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY package.json yarn.lock .env.${NODE_ENV} .npmrc ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" > ~/.npmrc
RUN yarn --pure-lockfile --production=false

# Rebuild the source code only when needed
FROM node:12 AS builder

ARG NODE_ENV=${NODE_ENV}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY . .
COPY --from=deps /app/.env.${NODE_ENV} ./.env.local
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:12 AS runner
WORKDIR /app

ENV NODE_ENV=${NODE_ENV}

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env.local ./.env.local
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
RUN npx next telemetry disable

CMD ["node_modules/.bin/next", "start"]