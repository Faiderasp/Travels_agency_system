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
COPY docs ./docs

RUN npm run build

EXPOSE 3001

# Start the application
CMD ["npm", "start"]
