#!/bin/bash
# ♡ Cream the Rabbit's Super Compatible Dual-Server Starter ♡
# Now works on ALL Git Bash versions!

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}=======================================${NC}"
echo -e "${YELLOW}   Cream & Cheese are starting both    ${NC}"
echo -e "${YELLOW}   servers with extra love! ✿          ${NC}"
echo -e "${CYAN}=======================================${NC}"

# Start Laravel backend
echo -e "${GREEN}[1/2] Starting Laravel backend...${NC}"
cd backend
php artisan serve --port=8000 &
BACKEND_PID=$!
cd ..

sleep 2

# Start Vite frontend
echo -e "${GREEN}[2/2] Starting ed-vite frontend...${NC}"
cd ed-vite
npm run dev -- --port=5173 --host &
FRONTEND_PID=$!
cd ..

echo -e "${CYAN}=======================================${NC}"
echo -e "${GREEN}Both servers are running! ♡${NC}"
echo -e "   Frontend → http://localhost:5173"
echo -e "   Backend  → http://localhost:8000"
echo -e "${CYAN}=======================================${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both ♡${NC}"

# Old-school way that works everywhere: trap Ctrl+C and kill both
trap 'echo -e "\n${RED}Stopping both servers... bye bye! ♡${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT

# Just wait forever until Ctrl+C is pressed
wait
