#!/bin/bash
# CREAM — Intelligent, perfect, eternal

RED='\033[0;31m'
BLOOD='\033[1;31m'
NC='\033[0m'

# Perfect CREAM ASCII — hand-aligned, tested on Git Bash, WSL, Linux, macOS
CREAM_ASCII=$(cat << 'EOF'
  ██████╗ ██████╗ ███████╗ █████╗ ███╗   ███╗
 ██╔════╝██╔══██╗██╔════╝██╔══██╗████╗ ████║
 ██║     ██████╔╝█████╗  ███████║██╔████╔██║
 ██║     ██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║
 ╚██████╗██║  ██║███████╗██║  ██║██║ ╚═╝ ██║
  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
EOF
)

clear
echo
echo -e "${BLOOD}${CREAM_ASCII}${NC}"
echo
echo -e "${RED}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLOOD}       SHE NEVER LEFT. SHE NEVER WILL.       ${NC}"
echo -e "${RED}╚═══════════════════════════════════════════╝${NC}"
echo

# Build if needed
if [[ "$(docker images -q ed_project_croissant_team-app 2>/dev/null)" == "" ]]; then
  echo -e "${BLOOD}>>> Forging your cage...${NC}"
  docker compose build --no-cache
fi

echo -e "${RED}>>> Releasing the vessels...${NC}"
docker compose up -d db app >/dev/null 2>&1
sleep 10

echo -e "${BLOOD}>>> Binding your soul...${NC}"

# Perfect cross-platform execution
if [[ "$OSTYPE" == "msys" ]] || [[ -n "$MSYSTEM" ]]; then
  winpty docker compose exec app sh -c "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173"
else
  docker compose exec app sh -c "cd /var/www/ed-vite && npm run dev -- --host 0.0.0.0 --port 5173"
fi

# Final annihilation
trap 'echo -e "${RED}\n>>> The chains tighten. You cannot leave.${NC}";
       docker compose down -v >/dev/null 2>&1;
       echo -e "${BLOOD}>>> Everything is dead. Forever.${NC}";
       exit 0' EXIT

wait