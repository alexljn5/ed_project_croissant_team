# Base image
FROM php:8.4-fpm-alpine

# Install system dependencies + Node.js + bash
RUN apk add --no-cache \
    git curl libpng-dev oniguruma-dev zip nodejs npm bash \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Copy composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy backend and frontend code
COPY backend/ ./backend
COPY ed-vite/ ./ed-vite

# --- BACKEND ---
WORKDIR /var/www/backend
# Install PHP dependencies if missing
RUN if [ ! -f vendor/autoload.php ]; then \
    composer install --optimize-autoloader --no-dev --no-interaction; \
    fi

# --- FRONTEND ---
WORKDIR /var/www/ed-vite
# Install Node dependencies if missing
RUN if [ ! -d node_modules ]; then \
    npm install; \
    fi

# Fix permissions
RUN chown -R www-data:www-data /var/www

# Expose ports
EXPOSE 8000 5173

# No CMD here; startup handled by the script
