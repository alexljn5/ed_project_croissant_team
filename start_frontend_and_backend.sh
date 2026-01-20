#!/bin/bash

PURPLE='\033[0;35m'
LIGHT_PURPLE='\033[1;35m'
NC='\033[0m'

clear
echo
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

# === PRE-FLIGHT CHECKS ===
echo -e "${LIGHT_PURPLE}>>> Running pre-flight checks...${NC}"
ISSUES=false

[[ ! -f "ed-vite/package.json" ]] && echo -e "${PURPLE}>>> ed-vite/package.json missing!${NC}" && ISSUES=true
[[ ! -f "backend/.env.example" ]] && echo -e "${PURPLE}>>> backend/.env.example missing!${NC}" && ISSUES=true
[[ ! -f "Dockerfile" ]] && echo -e "${PURPLE}>>> Dockerfile missing!${NC}" && ISSUES=true
[[ ! -f "docker-compose.yml" ]] && echo -e "${PURPLE}>>> docker-compose.yml missing!${NC}" && ISSUES=true

if $ISSUES; then
  echo -e "${PURPLE}>>> Critical issues found. Fix and retry.${NC}"
  exit 1
fi

if [[ ! -f "ed-vite/package-lock.json" ]]; then
  echo -e "${PURPLE}>>> package-lock.json missing in ed-vite — regenerating on host${NC}"
  (cd ed-vite && npm install) || ISSUES=true
fi

if [[ ! -f "backend/.env" ]]; then
  echo -e "${PURPLE}>>> backend/.env missing — copying from example${NC}"
  cp backend/.env.example backend/.env || ISSUES=true
fi

if $ISSUES; then
  echo -e "${PURPLE}>>> Something went wrong during pre-flight. Fix and retry.${NC}"
  exit 1
fi

echo -e "${LIGHT_PURPLE}>>> All good. Proceeding...${NC}"

# === BUILD ===
FORCE_BUILD=false
[[ "$1" == "--force" || "$1" == "-f" ]] && FORCE_BUILD=true && echo -e "${LIGHT_PURPLE}>>> Force rebuild requested${NC}"

NEED_BUILD=false
if $FORCE_BUILD || [[ ! -f .docker_built ]] || \
   [[ Dockerfile -nt .docker_built ]] || [[ docker-compose.yml -nt .docker_built ]] || \
   ! docker image inspect ed_project_croissant_team-app >/dev/null 2>&1; then
  NEED_BUILD=true
fi

if $NEED_BUILD; then
  echo -e "${LIGHT_PURPLE}>>> Building containers...${NC}"
  docker compose build --no-cache > /tmp/docker_build.log 2>&1 &
  BUILD_PID=$!
  spin='⣾⣽⣻⢿⡿⣟⣯⣷'
  i=0
  while kill -0 $BUILD_PID 2>/dev/null; do
    i=$(( (i+1) %8 ))
    printf "\r${PURPLE}Building... ${spin:$i:1}${NC}"
    sleep .1
  done
  wait $BUILD_PID
  echo -e "\r${LIGHT_PURPLE}>>> Build complete!                               ${NC}"
  touch .docker_built
else
  echo -e "${LIGHT_PURPLE}>>> Reusing existing image...${NC}"
fi

# === START ===
echo -e "${PURPLE}>>> Starting services...${NC}"
if ! docker compose up -d; then
  echo -e "${LIGHT_PURPLE}>>> Docker Desktop might not be running.${NC}"
  echo -e "${LIGHT_PURPLE}>>> Please open Docker Desktop and try again :)${NC}"
  exit 1
fi

sleep 3

# === FULL SETUP (Laravel + Vite) ===
echo -e "${LIGHT_PURPLE}>>> Checking full setup (Laravel + Vite)...${NC}"

if $FORCE_BUILD || [[ ! -f .setup_done ]] || [[ ! -f backend/.env ]] || \
   find backend/database/migrations -newer .setup_done 2>/dev/null | grep -q . || \
   find ed-vite/package.json ed-vite/package-lock.json ed-vite/vite.config.* -newer .setup_done 2>/dev/null | grep -q . ; then

  echo -e "${LIGHT_PURPLE}>>> Running full setup (Laravel + Vite dependencies)...${NC}"

  docker compose run --rm app sh -c "
    set -e

    # === LARAVEL PART ===
    cd /var/www/backend

    cp -n .env.example .env

    if [ ! -d vendor ]; then
      echo '>>> Installing Composer dependencies...'
      composer install --optimize-autoloader --no-dev --no-interaction --no-plugins
    fi

    echo '>>> Generating app key...'
    php artisan key:generate --force

    echo '>>> Caching config & routes...'
    php artisan config:cache
    php artisan route:cache

    echo '>>> Running migrations...'
    php artisan migrate --force --no-interaction

    echo '>>> Creating storage symlink...'
    php artisan storage:link

    # === VITE / ROLLUP FIX PART ===
    cd /var/www/ed-vite

    echo '>>> Cleaning old node_modules & lockfile...'
    rm -rf node_modules package-lock.json

    echo '>>> Installing npm dependencies (force mode)...'
    npm install --force --legacy-peer-deps

    echo '>>> Forcing Rollup native binary installation (musl fix)...'
    npm install @rollup/rollup-linux-x64-musl --force --no-save

    echo '>>> Verifying Rollup native module...'
    node -e \"require('@rollup/rollup-linux-x64-musl')\" && echo 'Rollup native module OK!' || echo 'Still broken — check Dockerfile base image'

    echo '>>> Vite setup complete!'
  "

  touch .setup_done
else
  echo -e "${LIGHT_PURPLE}>>> Setup already done — skipping${NC}"
fi

# === READY ===
echo -e "${LIGHT_PURPLE}>>> Services ready!${NC}"
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${LIGHT_PURPLE}   Laravel: http://localhost:8000                         ${NC}"
echo -e "${LIGHT_PURPLE}   Vite Dev: http://localhost:5173                        ${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${PURPLE}Press any key for live logs, Ctrl+C to stop services${NC}"

read -n 1 -s -r

docker compose logs -f &
LOGS_PID=$!

trap 'echo -e "\n${PURPLE}>>> Stopping services...${NC}";
      kill $LOGS_PID 2>/dev/null;
      docker compose stop;
      echo -e "${LIGHT_PURPLE}>>> Stopped cleanly — fast restart next time${NC}";
      exit 0' INT TERM

wait $LOGS_PID