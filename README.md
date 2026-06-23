# Aske og Malm

Roguelite turbasert taktikk (HoMM3-arv) for mobil, bygget i **Godot 4.6** med
statisk typet GDScript. Verden: Eskaria. En run = én avgrenset kampanje mot én rift,
20–40 min.

> **Kode på engelsk, lore/innhold/UI på norsk.** Ren, testbar kjerne (`core/`) skilt
> fra presentasjon (`scenes/`); alt innhold er data (`.tres`) i `data/`.

## Kom i gang

```bash
# Krever Godot 4.6.x på PATH (her: ~/Godot/godot, symlink ~/.local/bin/godot)
godot --path .              # kjør spillet (booter til hovedmeny)
godot                       # åpne i editoren
./run_tests.sh              # kjør alle GUT-tester headless
```

## Dokumentasjon

- `CLAUDE.md` — agentkontrakt (arkitekturregler, fasit, definition of done)
- `docs/design-bible.md` — visjon, pilarer, kanoniske mekanikker (§1–5)
- `docs/combat-spec.md` — låst kampmatematikk (skadeformel, tap-modell)
- `docs/roadmap.md` — vertikale faser, status
- `docs/aske-og-malm-plan.md` — komplett masterplan (inkl. arkitektur)

## Status

**Fase 0 — Fundament:** ✅ ferdig. Prosjektskjelett, 7 autoloads + EventBus, frøsatt
`SeededRng`, `CreatureData`/`MetalData`-schemas, `ContentRegistry`, GUT-testharness
(grønt headless), booter til hovedmeny. **Neste:** Fase 1 — kampskjelett (`core/combat`).
