# BACKEND: deps and runtime stages (non-root user)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production --silent

FROM node:18-alpine AS runtime
RUN addgroup -S app && adduser -S user -G app
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN chown -R user:app /app
USER user
EXPOSE 5000
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD curl -f http://localhost:5000/health || exit 1
CMD ["node","src/index.js"]
