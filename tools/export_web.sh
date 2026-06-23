#!/usr/bin/env bash
# Eksporterer spillet til web (build/web/). Krever Godot 4.6.x på PATH + web-
# eksportmaler installert. Web-bygget har tråder AV (serverbar uten spesielle headere).
# Loop for visuell verifisering:
#   ./tools/export_web.sh
#   python3 tools/serve_web.py 8099 build/web   # i bakgrunnen
#   → Playwright: naviger til http://127.0.0.1:8099/index.html, vent ~6s, skjermbilde
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p build/web
godot --headless --path . --export-release "Web" build/web/index.html
echo "Web-bygg klart: build/web/  (server: python3 tools/serve_web.py 8099 build/web)"
