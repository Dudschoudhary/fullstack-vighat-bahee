# ---------- Build Stage ----------
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


# ---------- Runtime Stage ----------
FROM nginx:alpine

# Copy built files into nginx html dir
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx default port
EXPOSE 5001

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
