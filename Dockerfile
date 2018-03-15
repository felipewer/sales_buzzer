FROM node:8.5

RUN apt-get update && apt-get -y --no-install-recommends install \
    sox \
    libsox-fmt-all \
    speech-dispatcher \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/sales_buzzer/

COPY src ./src/
COPY package.json ./

RUN yarn install

EXPOSE 8080

CMD ["npm", "start"]