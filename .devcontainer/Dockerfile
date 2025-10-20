FROM mcr.microsoft.com/devcontainers/base:alpine

RUN chsh -s /bin/bash
SHELL ["/bin/bash", "-c"]

RUN apk add --update --no-cache git ca-certificates openssl openssh curl git \
  libstdc++ libgcc gcompat

# fnm
RUN curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell --install-dir /usr/local/bin
RUN eval "$(/usr/local/bin/fnm env --shell bash)" && \
  fnm install 12 && \
  fnm default 12 && \
  npm install -g rollup

# Init script to load fnm
RUN echo '#!/bin/bash' > /entrypoint.sh && \
  echo 'set -e' >> /entrypoint.sh && \
  echo 'eval "$(/usr/local/bin/fnm env --use-on-cd --shell bash)"' >> /entrypoint.sh && \
  echo 'exec "$@"' >> /entrypoint.sh && \
  chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD [ "/bin/bash" ]
