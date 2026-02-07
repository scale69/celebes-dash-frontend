FROM oven/bun:latest

WORKDIR /app

# Salin hanya package.json dulu
COPY package.json ./

# Install dependencies
RUN bun install --no-save

# Salin seluruh project
COPY . .

# Build project
RUN bun run build

# Jalankan server
CMD ["bun", "run", "start"]