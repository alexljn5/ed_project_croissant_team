FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    git curl libpng-dev oniguruma-dev zip nodejs npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# Build Vue assets
RUN cd ed-vite && npm ci && npm run build

# Create folder + copy assets
RUN mkdir -p backend/public/build && \
    cp -r ed-vite/dist/* backend/public/build/

# Install Laravel
WORKDIR /var/www/backend
RUN composer install --optimize-autoloader --no-dev

RUN chown -R www-data:www-data /var/www

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000