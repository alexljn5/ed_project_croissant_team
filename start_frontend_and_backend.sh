#!/bin/bash
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
echo

# Check if package-lock.json exists
if [[ ! -f "ed-vite/package-lock.json" ]]; then
    echo -e "${RED}>>> ERROR: package-lock.json not found in ed-vite/${NC}"
    echo -e "${BLOOD}>>> Generating it now...${NC}"
    cd ed-vite && npm install && cd ..
fi

# Build logic
FORCE_BUILD=false
if [[ "$1" == "--force" ]] || [[ "$1" == "-f" ]]; then
    FORCE_BUILD=true
    echo -e "${BLOOD}>>> Force rebuild requested${NC}"
fi

if [[ "$FORCE_BUILD" == true ]] || \
   [[ ! -f .docker_built ]] || \
   [[ Dockerfile -nt .docker_built ]] || \
   [[ docker-compose.yml -nt .docker_built ]]; then
    echo -e "${BLOOD}>>> Building/rebuilding vessel...${NC}"
    docker compose build
    touch .docker_built
else
    echo -e "${BLOOD}>>> Vessel intact. Reusing...${NC}"
fi

echo -e "${RED}>>> Releasing the vessels...${NC}"
docker compose up -d

sleep 5

echo -e "${BLOOD}>>> Binding your soul...${NC}"
echo ""
echo -e "${RED}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLOOD}    Laravel:  http://localhost:8000          ${NC}"
echo -e "${BLOOD}    Vite:     http://localhost:5173          ${NC}"
echo -e "${RED}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${RED}Press Ctrl+C to release the spirits${NC}"

# Show logs (this will block until Ctrl+C)
docker compose logs -f

# Cleanup on exit
trap 'echo -e "\n${RED}>>> Sealing the tomb...${NC}";
      docker compose down;
      echo -e "${BLOOD}>>> The dead shall rest. For now.${NC}";
      exit 0' INT TERM

wait