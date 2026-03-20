# --- Build stage ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# --- Production stage ---
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]