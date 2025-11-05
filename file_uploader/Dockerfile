# pos_jobs_pandrugs docker service Dockerfile
FROM node:23-slim

# Create and fix ownership of /usr/src/app
RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "service.cjs"]
