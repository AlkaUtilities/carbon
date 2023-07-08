# Use node 16 on alpine 3.17 as base
FROM node:16-alpine3.17

# Change working directory to "app"
WORKDIR /app

# Copy source code from "src" to "app"
COPY . .

# Install dependencies
RUN npm install

# Compile into javascript
RUN npx tsc

# Opens port 3000 (for monitoring purposes)
EXPOSE 3000

# Set the working directory to "dist"
WORKDIR /app/dist

# Run the compiled JavaScript
CMD ["node", "index.js"]