FROM docker:cli AS docker_cli
FROM node:24-alpine
COPY --from=docker_cli /usr/local/bin/docker /usr/local/bin/docker
