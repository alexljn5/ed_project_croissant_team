#!/bin/bash
set -e

PURPLE='\033[0;35m'
LIGHT_PURPLE='\033[1;35m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

clear
echo -e "${LIGHT_PURPLE}
 ___  _  _  ___  ___  ___  __       __  ___    ___   __  _  _  ____  ___
(   \\( )( )(  ,)(  ,)(  _)(  )     /  \\(  ,\\  (  ,) /  \\( )( )(_  _)(  _)
 ) ) ))()(  ) ,\\ ) ,\\ ) _) )(__   ( () )) _/   )  \\( () ))()(   )(   ) _)
(___/ \\__/ (___/(___/(___)(____)   \\__/(_)    (_)\\_)\\__/ \\__/  (__) (___)
${NC}"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${LIGHT_PURPLE}                    DUBBEL OP ROUTE                       ${NC}"
echo -e "${LIGHT_PURPLE}                Fullstack Development Environment         ${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════╝${NC}"
echo

# === ARGUMENTS ===
WATCH_MODE=false
FORCE=false
for arg in "$@"; do
  case "$arg" in
    --watch) WATCH_MODE=true ;;
    --force|-f) FORCE=true ;;
  esac
done

# === PREFLIGHT CHECKS ===
echo -e "${LIGHT_PURPLE}>>> Pre-flight checks...${NC}"

command -v docker >/dev/null || { echo -e "${RED}Docker not found${NC}"; exit 1; }
[[ -f docker-compose.yml ]] || { echo -e "${RED}docker-compose.yml missing${NC}"; exit 1; }
[[ -f Dockerfile ]] || { echo -e "${RED}Dockerfile missing${NC}"; exit 1; }

[[ -f backend/.env ]] || cp backend/.env.example backend/.env

echo -e "${GREEN}>>> Pre-flight OK${NC}"

# === FORCE CLEAN ===
if $FORCE; then
  echo -e "${RED}>>> FORCE: cleaning old builds, containers, and frontend deps${NC}"
  docker compose down -v --remove-orphans || true
  rm -f .docker_built .laravel_done .frontend_done
  rm -rf ed-vite/node_modules
fi

# === BUILD CONTAINERS ===
if [[ ! -f .docker_built ]]; then
  echo -e "${LIGHT_PURPLE}>>> Building Docker images...${NC}"
  docker compose build --no-cache
  touch .docker_built
else
  echo -e "${LIGHT_PURPLE}>>> Using existing Docker images${NC}"
fi

# === BACKEND / LARAVEL SETUP ===
if [[ ! -f .laravel_done ]]; then
  echo -e "${LIGHT_PURPLE}>>> Setting up Laravel...${NC}"
  docker compose run --rm app sh -c "
    cd /var/www/backend &&
    cp -n .env.example .env &&
    [ -d vendor ] || composer install --no-interaction --no-dev --optimize-autoloader &&
    php artisan key:generate --force &&
    php artisan migrate --force --no-interaction &&
    php artisan storage:link
  "
  touch .laravel_done
else
  echo -e "${LIGHT_PURPLE}>>> Laravel already set up${NC}"
fi

# === FRONTEND / VITE SETUP ===
echo -e "${LIGHT_PURPLE}>>> Checking frontend dependencies...${NC}"
docker compose run --rm app sh -c "
  cd /var/www/ed-vite &&
  if [ ! -d node_modules ] || [ ! -f node_modules/.bin/vite ]; then
    echo '>>> Reinstalling frontend dependencies'
    rm -rf node_modules
    npm install
  fi
"
touch .frontend_done

# === START SERVICES ===
echo -e "${PURPLE}>>> Starting services...${NC}"

if $WATCH_MODE; then
  echo -e "${LIGHT_PURPLE}>>> Watch mode enabled${NC}"
  docker compose watch
else
  docker compose up -d
  sleep 3
  echo -e "${GREEN}>>> Services ready!${NC}"
  echo -e "${PURPLE}Laravel: http://localhost:8000${NC}"
  echo -e "${PURPLE}Vite:    http://localhost:5173${NC}"

  echo -e "${PURPLE}Press any key for live logs, Ctrl+C to stop${NC}"
  read -n 1 -s -r

  docker compose logs -f &
  PID=$!
  trap 'kill $PID 2>/dev/null; docker compose stop; echo "Stopped."; exit 0' INT TERM
  wait $PID
fi
