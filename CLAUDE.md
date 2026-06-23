# Aske og Malm — agentkontrakt

Roguelite turbasert taktikk (HoMM3-arv) i Godot 4.6, GDScript statisk typet.
Full design: `docs/design-bible.md`. Kampfasit: `docs/combat-spec.md`. Veikart:
`docs/roadmap.md`. Komplett masterplan (inkl. arkitektur §6, kickoff §9): `docs/aske-og-malm-plan.md`.

## Arkitektur (ikke bryt disse)
- `core/` er REN logikk: ingen noder, ingen scene-avhengigheter. Må kunne kjøres headless.
- Presentasjon (`scenes/`) rendrer core-tilstand og sender intensjoner tilbake. Ingen
  spill-logikk i scene-scripts som hører hjemme i `core/`.
- Alt innhold er `.tres` i `data/`. Ny kreatur/metall/bygg = ny `.tres`, ikke ny kode.
- All tilfeldighet via frøsatt RNG: `SeededRng` (core/) eller `Rng`-autoloadet (scenes/).
  Aldri `randi()`/`randf()` direkte.
- Systemer kommuniserer via `EventBus`-signaler, ikke direkte node-referanser.
- Statisk typing ALLTID. Hver var, param og returverdi annoteres. Manglende
  type-annotasjon er konfigurert som **feil** (project.godot → untyped_declaration=2).

## Fasit (endres aldri uten å oppdatere både doc og gulltester)
- Skadeformel, tap-modell, motangrep, skytter-/flyger-regler: se `docs/combat-spec.md`.
- `effective_attack = creature.attack + hero.angrep`; tilsvarende for forsvar.
- Stats: Angrep, Forsvar, Malmkraft. Ressurser: Gull, Malm, Gudemalm.

## Navn
- Kode engelsk (PascalCase `class_name`, snake_case filer). Lore/innhold/UI norsk.

## Definition of done
- Endrer du `core/`: kjør testene (`./run_tests.sh`) — alle grønne.
- Ny mekanikk i `core/` kommer med tester. Gulltester for kamp er ukrenkelige.
- Ingen utypede variabler. Ingen logikk lekket fra `core/` til `scenes/`.

## Kjøring
- Tester (headless): `./run_tests.sh` — eller
  `godot --headless -s addons/gut/gut_cmdln.gd -gconfig=.gutconfig.json`
- Spillet: `godot` (åpner editor) / `godot --path .` (kjører main_scene).
- Godot-binær: `~/Godot/godot` (4.6.3-stable), symlink `~/.local/bin/godot`.

## Ikke-mål for v1
Flere helter, beleiring, krigsmaskiner, multiplayer, 3D, flere byfraksjoner,
d20-TTRPG-reglene. Foreslå dem ikke for v1.
