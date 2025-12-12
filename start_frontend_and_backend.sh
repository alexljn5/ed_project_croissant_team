#!/bin/bash

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}=======================================${NC}"
echo -e "${YELLOW}   Cream & Cheese are waking up… ♡    ${NC}"
echo -e "${CYAN}=======================================${NC}"

# ✅ Build Docker image if missing
if [[ "$(docker images -q ed_project_croissant_team-app 2>/dev/null)" == "" ]]; then
  echo -e "${YELLOW}First time? Building the magic container… (~60s)${NC}"
  docker compose build
else
  echo -e "${GREEN}Container image already exists — skipping build ♡${NC}"
fi

# ✅ Start backend containers in the background, rebuild app container if needed
echo -e "${GREEN}[1/2] Starting backend containers...${NC}"
docker compose up -d --build db app
sleep 5  # Give Laravel a moment to boot

# ✅ Start frontend dev server inside the container
echo -e "${GREEN}[2/2] Starting frontend dev server inside container...${NC}"
docker compose exec -T app sh -c "cd /var/www/ed-vite && npm install --silent && npm run dev -- --host 0.0.0.0 --port 5173" &
VITE_PID=$!

echo -e "${CYAN}=======================================${NC}"
echo -e "${GREEN}Everything is running! ♡${NC}"
echo -e "   Backend → http://localhost:8000"
echo -e "   Frontend → http://localhost:5173"
echo -e "${CYAN}=======================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop everything ♡${NC}"

# ✅ Clean shutdown
trap 'echo -e "\n${RED}Stopping everything… bye bye! ♡${NC}"; docker compose down; kill $VITE_PID 2>/dev/null; exit' INT

wait $VITE_PID
