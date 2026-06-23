#!/usr/bin/env bash
# Kjører alle GUT-tester headless (§6.4). Krever 'godot' på PATH (4.6.x).
# Bruk: ./run_tests.sh
set -euo pipefail
cd "$(dirname "$0")"
godot --headless -s addons/gut/gut_cmdln.gd -gconfig=.gutconfig.json
