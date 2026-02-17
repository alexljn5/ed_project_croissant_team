FROM php:8.4-fpm-alpine

# System deps
RUN apk add --no-cache \
    git curl bash \
    libpng-dev oniguruma-dev zip \
    nodejs npm

# PHP extensions
RUN docker-php-ext-install \
    pdo_mysql mbstring exif pcntl bcmath gd

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Working dir
WORKDIR /var/www

# Permissions
RUN chown -R www-data:www-data /var/www

# Expose ports
EXPOSE 8000 5173

# No CMD — docker-compose controls startup
