#!/bin/bash

PURPLE='\033[0;35m'
LIGHT_PURPLE='\033[1;35m'
NC='\033[0m'

clear
echo
echo -e "${LIGHT_PURPLE}
 ___  _  _  ___  ___  ___  __       __  ___    ___   __  _  _  ____  ___
(   \( )( )(  ,)(  ,)(  _)(  )     /  \(  ,\  (  ,) /  \( )( )(_  _)(  _)
 ) ) ))()(  ) ,\ ) ,\ ) _) )(__   ( () )) _/   )  \( () ))()(   )(   ) _)
(___/ \__/ (___/(___/(___)(____)   \__/(_)    (_)\_)\__/ \__/  (__) (___)
${NC}"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${LIGHT_PURPLE}                    DUBBEL OP ROUTE                       ${NC}"
echo -e "${LIGHT_PURPLE}                Fullstack Development Environment         ${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════╝${NC}"
echo

# === HELPER FUNCTIONS ===
check_command() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}✗ $1 not found${NC}"
    return 1
  fi
  echo -e "${GREEN}✓ $1 found${NC}"
  return 0
}

# === ARGUMENT PARSING ===
WATCH_MODE=false
FORCE_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --watch) WATCH_MODE=true ;;
    --force|-f) FORCE_BUILD=true ;;
  esac
done

# === PRE-FLIGHT CHECKS ===
echo -e "${LIGHT_PURPLE}>>> Running pre-flight checks...${NC}"
ISSUES=false

check_command "docker" || ISSUES=true

if [[ ! -f "ed-vite/package-lock.json" ]]; then
  echo -e "${PURPLE}>>> package-lock.json missing — regenerating${NC}"
  (cd ed-vite && npm install) || ISSUES=true
fi

if [[ ! -f "backend/.env" ]]; then
  echo -e "${PURPLE}>>> backend/.env missing — copying from example${NC}"
  cp backend/.env.example backend/.env || ISSUES=true
fi

[[ ! -f "Dockerfile" ]] && echo -e "${PURPLE}>>> Dockerfile missing!${NC}" && ISSUES=true
[[ ! -f "docker-compose.yml" ]] && echo -e "${PURPLE}>>> docker-compose.yml missing!${NC}" && ISSUES=true

if $WATCH_MODE && ! docker compose watch --help >/dev/null 2>&1; then
  echo -e "${RED}✗ docker compose watch not available. Requires Docker Compose v2.24+${NC}"
  ISSUES=true
fi

if $ISSUES; then
  echo -e "${RED}>>> Critical issues found. Fix and retry.${NC}"
  exit 1
fi

echo -e "${GREEN}>>> All good. Proceeding...${NC}"

# === BUILD ===
if $FORCE_BUILD || [[ ! -f .docker_built ]] || \
   [[ Dockerfile -nt .docker_built ]] || [[ docker-compose.yml -nt .docker_built ]] || \
   ! docker image inspect ed_project_croissant_team-app >/dev/null 2>&1; then
  echo -e "${LIGHT_PURPLE}>>> Building containers...${NC}"
  docker compose build --no-cache || { echo -e "${RED}✗ Build failed${NC}"; exit 1; }
  touch .docker_built
else
  echo -e "${LIGHT_PURPLE}>>> Reusing existing image...${NC}"
fi

# === LARAVEL SETUP (only on force or if needed) ===
if $FORCE_BUILD || [[ ! -f .laravel_setup_done ]]; then
  echo -e "${LIGHT_PURPLE}>>> Running Laravel setup...${NC}"
  docker compose run --rm app sh -c "
    set -e
    cd /var/www/backend
    cp -n .env.example .env
    if [ ! -d vendor ]; then
      composer install --optimize-autoloader --no-dev --no-interaction --no-plugins
    fi
    php artisan key:generate --force
    php artisan config:cache
    php artisan route:cache
    php artisan migrate --force --no-interaction
    php artisan storage:link
  " || { echo -e "${RED}✗ Laravel setup failed${NC}"; exit 1; }
  touch .laravel_setup_done
else
  echo -e "${LIGHT_PURPLE}>>> Laravel setup skipped${NC}"
fi

# === START ===
echo -e "${PURPLE}>>> Starting services...${NC}"

if $WATCH_MODE; then
  echo -e "${LIGHT_PURPLE}>>> Running in watch mode...${NC}"
  echo -e "${PURPLE}Files will be watched for changes. Press Ctrl+C to stop.${NC}"
  docker compose watch || { echo -e "${RED}✗ Watch mode failed${NC}"; exit 1; }
else
  docker compose up -d || { echo -e "${RED}✗ Failed to start services${NC}"; exit 1; }
  sleep 3

  echo -e "${LIGHT_PURPLE}>>> Services ready!${NC}"
  echo -e "${PURPLE}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${LIGHT_PURPLE}   Laravel: http://localhost:8000                         ${NC}"
  echo -e "${LIGHT_PURPLE}   Vite Dev: http://localhost:5173                        ${NC}"
  echo -e "${PURPLE}╚══════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${PURPLE}Press any key for live logs, Ctrl+C to stop${NC}"

  read -n 1 -s -r
  docker compose logs -f &
  LOGS_PID=$!
  trap 'echo ""; kill $LOGS_PID 2>/dev/null; docker compose stop; echo "Stopped."; exit 0' INT TERM
  wait $LOGS_PID
fi
