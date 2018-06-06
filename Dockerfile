ARG BUZZER_BASE_IMG
ARG APP_PORT=8080

FROM $BUZZER_BASE_IMG

RUN apt-get update && apt-get -y --no-install-recommends install \
    sox \
    libsox-fmt-all \
    espeak \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app/

COPY src ./src/
COPY public ./public/
COPY package.json ./

RUN npm install --production

EXPOSE $APP_PORT

CMD ["node", "src/server.js"]