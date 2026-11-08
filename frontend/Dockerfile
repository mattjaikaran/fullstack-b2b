# Build stage. The context is the repo root, because the API client is
# generated from backend/docs/openapi/openapi.json.
FROM oven/bun:1 as builder

WORKDIR /app

COPY frontend/package.json frontend/bun.lock* ./
RUN bun install --frozen-lockfile

COPY frontend/ .
COPY backend/docs/openapi/openapi.json ./openapi.json
ENV OPENAPI_INPUT=/app/openapi.json
RUN bun run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
