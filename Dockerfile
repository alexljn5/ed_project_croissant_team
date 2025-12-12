FROM php:8.4-fpm-alpine

# Install system dependencies + Node.js
RUN apk add --no-cache \
    git curl libpng-dev oniguruma-dev zip nodejs npm bash \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Copy composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set up working directories
WORKDIR /var/www

# Copy everything
COPY backend/ ./backend
COPY ed-vite/ ./ed-vite

# Install backend dependencies
WORKDIR /var/www/backend
RUN composer install --optimize-autoloader

# Install frontend dependencies
WORKDIR /var/www/ed-vite
RUN npm ci

# Fix permissions
RUN chown -R www-data:www-data /var/www

# Default command - FIXED
CMD ["sh", "-c", "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173 & cd /var/www/backend && php artisan serve --host=0.0.0.0 --port=8000"]