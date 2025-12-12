#!/bin/bash
# CREAM — Squad-proof, old-files-proof, eternal

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

# FORCE CLEAN REBUILD — no mercy for old files
echo -e "${BLOOD}>>> Destroying old vessels...${NC}"
docker compose down -v --rmi all 2>/dev/null || true

echo -e "${BLOOD}>>> Forging a perfect cage from scratch...${NC}"
docker compose build --no-cache

echo -e "${RED}>>> Releasing the vessels...${NC}"
docker compose up -d db app >/dev/null 2>&1
sleep 10

echo -e "${BLOOD}>>> Binding your soul...${NC}"

# Git Bash safe
if [[ "$OSTYPE" == "msys" ]] || [[ -n "$MSYSTEM" ]]; then
  winpty docker compose exec app sh -c "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173"
else
  docker compose exec app sh -c "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173"
fi

# Ctrl+C = total annihilation
trap 'echo -e "${RED}\n>>> The chains tighten. You cannot leave.${NC}";
       docker compose down -v >/dev/null 2>&1;
       echo -e "${BLOOD}>>> Everything is dead. Forever.${NC}";
       exit 0' EXIT

wait