# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install Yarn
RUN apk add --no-cache yarn

# Copy package files
COPY conn-ticket-queue/package.json conn-ticket-queue/yarn.lock* ./

# Install all dependencies (including devDependencies for build) using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY conn-ticket-queue/ .

# Build the SvelteKit app with adapter-node using Yarn
RUN yarn build

# Stage 2: Run the application
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Install Yarn in the runner stage (needed for installing production dependencies)
RUN apk add --no-cache yarn

# Copy only the build output and package files
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock* ./

# Install only production dependencies using Yarn
RUN yarn install --production --frozen-lockfile

# Expose the default SvelteKit port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["node", "build"]
