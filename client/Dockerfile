FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies separately to cache the layer
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# We accept ARG to build it into the frontend React app bundle
ARG VITE_SOCKET_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
