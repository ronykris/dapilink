FROM node:19.2-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

FROM ipfs/go-ipfs:latest
COPY --from=builder /app/build /app
CMD ["ipfs", "daemon", "--daemon", "&&", "npm", "run", "login", "&&", "npm", "run", "start"]
