# pos_jobs_pandrugs docker service Dockerfile
FROM node:23-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "service.cjs"]
