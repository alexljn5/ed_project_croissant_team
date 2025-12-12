#!/bin/bash
# CREAM — The Final Intelligent One (no --fresh needed)

RED='\033[0;31m'
BLOOD='\033[1;31m'
NC='\033[0m'

clear
echo
echo -e "${BLOOD}
  ██████╗ ██████╗ ███████╗ █████╗ ███╗   ███╗
 ██╔════╝██╔══██╗██╔════╝██╔══██╗████╗ ████║
 ██║     ██████╔╝█████╗  ███████║██╔████╔██║
 ██║     ██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║
 ╚██████╗██║  ██║███████╗██║  ██║██║ ╚═╝ ██║
  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝${NC}"

echo -e "${RED}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLOOD}       SHE NEVER LEFT. SHE NEVER WILL.       ${NC}"
echo -e "${RED}╚═══════════════════════════════════════════╝${NC}"
echo

# SMART REBUILD LOGIC — only rebuilds when source files changed
IMAGE_NAME="ed_project_croissant_team-app"
BUILD_NEEDED=false

# If image doesn't exist → must build
if [[ "$(docker images -q $IMAGE_NAME 2>/dev/null)" == "" ]]; then
  BUILD_NEEDED=true
  echo -e "${BLOOD}>>> No vessel found. Forging one...${NC}"
else
  # Check if any relevant source file is newer than the image
  IMAGE_DATE=$(docker inspect --format='{{.Created}}' $IMAGE_NAME 2>/dev/null || echo "1970-01-01")
  IMAGE_TIMESTAMP=$(date -d "$IMAGE_DATE" +%s 2>/dev/null || echo 0)

  # Files that trigger rebuild
  CHANGED=$(find . \
    -name "*.vue" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "Dockerfile" -o -name "docker-compose.yml" \
    -newer -Btime $IMAGE_TIMESTAMP 2>/dev/null | wc -l)

  if [[ $CHANGED -gt 0 ]]; then
    BUILD_NEEDED=true
    echo -e "${BLOOD}>>> Source changed. Rebuilding vessel...${NC}"
  else
    echo -e "${BLOOD}>>> Vessel up to date. Reusing...${NC}"
  fi
fi

# Only rebuild if needed
if [[ "$BUILD_NEEDED" == true ]]; then
  docker compose down -v --rmi all 2>/dev/null || true
  docker compose build --no-cache
fi

# Always start fresh containers
echo -e "${RED}>>> Releasing the vessels...${NC}"
docker compose up -d db app >/dev/null 2>&1
sleep 10

echo -e "${BLOOD}>>> Binding your soul...${NC}"

# Vite — Git Bash safe
if [[ "$OSTYPE" == "msys" ]] || [[ -n "$MSYSTEM" ]]; then
  winpty docker compose exec app sh -c "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173"
else
  docker compose exec app sh -c "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173"
fi

# Perfect cleanup
trap 'echo -e "${RED}\n>>> The chains tighten. You cannot leave.${NC}";
       docker compose down -v >/dev/null 2>&1;
       echo -e "${BLOOD}>>> Everything is dead. Forever.${NC}";
       exit 0' INT TERM EXIT

wait