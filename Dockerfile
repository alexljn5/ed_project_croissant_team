FROM php:8.4-fpm-alpine AS final

RUN apk add --no-cache \
    git curl libpng-dev oniguruma-dev zip nodejs npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy everything
COPY . .

# Build Vue — force correct cwd
WORKDIR /var/www/ed-vite
RUN npm ci --foreground-scripts && npm run build

# Copy assets
RUN mkdir -p /var/www/backend/public/build && \
    cp -r dist/* /var/www/backend/public/build/

# Install Laravel
WORKDIR /var/www/backend
RUN composer install --optimize-autoloader --no-dev
RUN chown -R www-data:www-data /var/www

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]