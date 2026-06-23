#!/usr/bin/env python3
"""Minimal statisk server for Godot-web-bygget (build/web/).
Tråder er AV i web-eksporten, så vi trenger IKKE cross-origin-isolation-headere.
Setter kun riktig MIME for .wasm. Bruk: python3 tools/serve_web.py [port] [dir]"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8099
DIRECTORY = sys.argv[2] if len(sys.argv) > 2 else "build/web"


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
        ".js": "text/javascript",
        ".pck": "application/octet-stream",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, *args):
        pass  # stille


with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serverer {DIRECTORY} på http://127.0.0.1:{PORT}", flush=True)
    httpd.serve_forever()
