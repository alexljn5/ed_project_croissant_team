# 1. Build Vue
FROM node:22-alpine AS frontend
WORKDIR /frontend
COPY ed-vite/package*.json ./
RUN npm ci
COPY ed-vite .
RUN npm run build

# 2. Final image: PHP + Caddy + Node (for dev server)
FROM php:8.4-fpm-alpine

# Install Node.js + Caddy
RUN apk add --no-cache \
    nodejs npm \
    caddy \
    git curl libpng-dev oniguruma-dev zip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# Copy built assets
COPY --from=frontend /frontend/dist /var/www/backend/public/build

WORKDIR /var/www/backend
RUN composer install --optimize-autoloader --no-dev

RUN chown -R www-data:www-data /var/www

EXPOSE 8000 5173

CMD php artisan serve --host=0.0.0.0 --port=8000 & \
    cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173 & \
    exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
