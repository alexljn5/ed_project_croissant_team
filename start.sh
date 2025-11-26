#!/bin/bash
# ♡ Cream the Rabbit's Super Compatible Dual-Server Starter – 2025 DATABASE EDITION ♡

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "$$ {CYAN}============================================= $${NC}"
echo -e "${YELLOW}   Cream & Cheese lanceren de app! ✿       ${NC}"
echo -e "${PURPLE}   Nu met echte database opslag! ♡         ${NC}"
echo -e "$$ {CYAN}============================================= $${NC}"

# Start Laravel backend + auto migrate
echo -e "$$ {GREEN}[1/2] Starting Laravel backend + database... $${NC}"
cd backend
php artisan migrate --force
php artisan serve --port=8000 --host=127.0.0.1 &
BACKEND_PID=$!
cd ..

sleep 2

# Start Vite frontend
echo -e "$$ {GREEN}[2/2] Starting ed-vite frontend... $${NC}"
cd ed-vite
npm run dev -- --port=5173 --host &
FRONTEND_PID=$!
cd ..

echo -e "$$ {CYAN}============================================= $${NC}"
echo -e "$$ {GREEN}✨ Beide servers draaien perfect! ✨ $${NC}"
echo -e "   Frontend  → http://localhost:5173"
echo -e "   Backend   → http://localhost:8000"
echo -e "   API test  → http://localhost:8000/api/hello"
echo -e "$$ {CYAN}============================================= $${NC}"
echo -e "$$ {YELLOW}Druk op Ctrl+C om beide te stoppen ♡ $${NC}"

trap 'echo -e "\n$$ {RED}Cream & Cheese gaan slapen... bye bye! ♡ $${NC}"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT

wait