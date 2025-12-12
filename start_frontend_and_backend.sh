#!/bin/bash

RED='\033[0;31m'
DARKRED='\033[1;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}==============================================${NC}"
echo -e "${DARKRED}   WARNING: CREAM THE RABBIT IS AWAKENING...   ${NC}"
echo -e "${RED}==============================================${NC}"
echo -e "${CYAN}>>> Scanning for dormant containers... <<<${NC}"
sleep 1

# ==============================
# CHECK IF IMAGE EXISTS
# ==============================
if [[ "$(docker images -q ed_project_croissant_team-app 2>/dev/null)" == "" ]]; then
    echo -e "${RED}[!] NO CONTAINER IMAGE DETECTED.${NC}"
    echo -e "${DARKRED}>>> Cream is forging a new vessel. Stand by. <<<${NC}"
    docker compose build app
else
    echo -e "${DARKRED}[+] Image located. Cream approves.${NC}"
fi

# ==============================
# START BACKEND
# ==============================
echo -e "${RED}[1/2] Cream is waking the backend...${NC}"
docker compose up -d db app
sleep 3
echo -e "${DARKRED}>>> Backend is alive. The air shifts slightly. <<<${NC}"

# ==============================
# START FRONTEND (INSIDE CONTAINER)
# ==============================
echo -e "${RED}[2/2] Cream is activating the frontend...${NC}"

docker compose exec -T app sh -c "
    cd /var/www/ed-vite &&
    npm install --silent &&
    npm run dev -- --host 0.0.0.0 --port 5173
" &
VITE_PID=$!

sleep 1

echo -e "${RED}==============================================${NC}"
echo -e "${DARKRED}            SYSTEM NOW UNDER CONTROL           ${NC}"
echo -e "${RED}            Backend → http://localhost:8000"
echo -e "${RED}            Frontend → http://localhost:5173"
echo -e "${RED}==============================================${NC}"
echo -e "${DARKRED}Press Ctrl+C to attempt shutdown, if you dare.${NC}"

# ==============================
# CLEAN SHUTDOWN
# ==============================
trap '
echo -e "\n${RED}[!] INTERRUPT RECEIVED. CREAM RETURNS TO THE DARK.${NC}";
docker compose down;
kill $VITE_PID 2>/dev/null;
exit
' INT

wait $VITE_PID
