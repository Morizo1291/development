FROM node:20-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /workspace

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    bash \
    sudo \
    procps \
    psmisc \
    lsof \
    iproute2 \
    net-tools \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable

EXPOSE 3000 5173 8080 8787

CMD ["bash"]
