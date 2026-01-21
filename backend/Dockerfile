FROM node:20.18.0-slim

# Install dependencies for Puppeteer/Chromium and netcat for DB wait
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    netcat-openbsd \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer env vars to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Wait for DB before starting
CMD ["sh", "-c", "until nc -z $DB_HOST $DB_PORT; do echo 'Waiting for DB...'; sleep 2; done; node server.js"]
