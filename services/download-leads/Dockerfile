FROM node:24-alpine

WORKDIR /app

COPY services/download-leads/package.json ./package.json
COPY services/download-leads/src ./src
COPY config/downloads.json ./config/downloads.json

RUN chown -R node:node /app

USER node

EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8787/api/download-leads/health || exit 1

CMD ["node", "src/server.mjs"]
