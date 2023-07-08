# Use node 16 on alpine 3.17 as base
FROM node:16-alpine3.17

# Set working directory to "app"
WORKDIR /app

# Copy source code from "src" to "app"
COPY . .

# Install dependencies
RUN npm install

# Compile into javascript
RUN npx tsc

# Opens port 3000 (for monitoring purposes)
EXPOSE 3000

# Runs code
CMD [ "node", "index.js" ]