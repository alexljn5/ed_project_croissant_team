#!/bin/bash
# CREAM'S FINAL JUDGMENT — nothing escapes

RED='\033[0;31m'
BLOOD='\033[1;31m'
NC='\033[0m'

clear
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

# Build if needed
[[ "$(docker images -q ed_project_croissant_team-app 2>/dev/null)" == "" ]] && docker compose build --no-cache

docker compose up -d db app >/dev/null 2>&1
sleep 10

echo -e "${BLOOD}>>> Binding your soul...${NC}"

# Run Vite in foreground — this is what Ctrl+C actually kills
winpty docker compose exec app sh -c "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173"

# This trap fires when Vite dies (i.e. when you press Ctrl+C)
trap 'echo -e "${RED}\n>>> The chains tighten. You cannot leave.${NC}";
       docker compose down -v >/dev/null 2>&1;
       echo -e "${BLOOD}>>> Everything is dead. Forever.${NC}";
       exit 0' EXIT

wait