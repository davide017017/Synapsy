# syntax=docker/dockerfile:1

FROM php:8.2-cli-alpine AS build

# Install dependencies for PHP extensions and Node.js
RUN apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        postgresql-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        oniguruma-dev \
        git \
        curl \
        unzip \
    && apk add --no-cache nodejs npm

# PHP extensions required by Laravel
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_pgsql bcmath mbstring xml zip gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /app

# Copy application source
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Build front-end assets if package.json exists
RUN if [ -f package.json ]; then npm ci --omit=dev && npm run build; fi

# Fix permissions
RUN chown -R www-data:www-data storage bootstrap/cache

FROM php:8.2-cli-alpine

RUN apk add --no-cache \
        postgresql-libs \
        libpng \
        libjpeg-turbo \
        freetype \
        libzip \
        oniguruma

# Copy PHP extensions and configuration from build stage
COPY --from=build /usr/local/lib/php/extensions /usr/local/lib/php/extensions
COPY --from=build /usr/local/etc/php/conf.d /usr/local/etc/php/conf.d

WORKDIR /app

# Copy application from build stage
COPY --from=build --chown=www-data:www-data /app /app

USER www-data

EXPOSE 10000
CMD ["php", "artisan", "serve", "--host", "0.0.0.0", "--port", "10000"]

