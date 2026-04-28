FROM node:lts

WORKDIR /server

COPY package*.json ./
RUN npm install

COPY tsconfig.json .
COPY server.ts .

COPY config ./config
COPY controller ./controller
COPY middleware ./middleware
COPY models ./models
COPY router ./router
COPY utils ./utils

RUN npm run build

EXPOSE 5000

# Start the application
CMD ["npm", "start"]
