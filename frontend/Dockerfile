# ==========================================
# STAGE 1: Build the React Application
# ==========================================
# Use Node.js to install dependencies and build the static files.
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production. 
# The output will be placed in the /app/dist directory.
RUN npm run build

# ==========================================
# STAGE 2: Serve with Nginx
# ==========================================
# Use a lightweight Nginx web server to serve the static HTML/JS files.
FROM nginx:alpine

# Copy our custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React files from the builder stage to Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
