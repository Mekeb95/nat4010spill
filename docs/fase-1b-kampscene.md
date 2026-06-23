# Fase 1b — Kampscenen (handoff / plan)

> Skrevet på slutten av Fase 1a-økta som overlevering til neste økt. Mål: en
> **spillbar håndsatt kamp på telefonen** → Fase 1 i mål.

## Utgangspunkt (allerede ferdig)

- **Fase 1a:** hele kampkjernen i `core/combat/` (ren, headless-testet, 35 gulltester
  grønne). Motoren `CombatState` har alt logikken trenger:
  - `begin_round()`, `current_actor()`, kø (`queue`/`queue_index`)
  - handlinger: `attack_melee`, `shoot`, `move(s, dest)` / `can_move_to`,
    `step_toward`, `defend`, `wait`, `skip`
  - spørringer: `living_stacks(side)`, `are_adjacent`, `is_blocked`, `is_occupied`,
    `is_over()`, `winner`
  - `log_lines: Array[String]` ← mat kamploggen i UI direkte herfra
  - `CombatAI.take_turn(cs, stack)` for fiendens trekk
- 6-kreatur-roster i `data/creatures/` (asketrell, bueskytter, takehund, griff,
  orsk_banker, askejotn).

## Arbeidsflyt (besluttet)

**Bygg scenen i kode** (som `scenes/main_menu/main_menu.gd`), boot headless for å fange
feil, så **kjører brukeren spillet og limer inn et skjermbilde** — da ser jeg resultatet
og itererer. Ingen MCP (GDAI valgt bort: donasjon + krever `uv`; gratis Node-MCP gir
ikke skjermbilder). GodotPrompter-skills installeres av brukeren (`claude plugins
... jame581/skillsmith`) og er tilgjengelig etter restart.

For å se scenen: enklest å midlertidig la hovedmenyens **«Ny run»** laste kampscenen med
en hardkodet kamp (eller sett `combat.tscn` som main_scene mens vi jobber).

## Hva som skal bygges

`scenes/combat/combat.gd` (+ `.tscn`) som **rendrer `CombatState` og sender intensjoner
tilbake** — ingen spill-logikk i scenen (CLAUDE.md-regel). Komponenter:

1. **Hex-brett-render.** Pointy-top odd-r layout. Trenger en *presentasjons*-funksjon
   `hex_to_pixel(offset) -> Vector2` (hør hjemme i scenen/`ui/`, IKKE i `core/`).
   Tegn 6×7 hex-celler (Polygon2D eller `_draw()`). Portrett: fiende øverst, spiller
   nederst.
2. **Stabler.** Per levende `StackState`: ikon (`data.emoji`) + antall (`count`) +
   fargekode per side, plassert via `hex_to_pixel(stack.pos)`. Marker `current_actor()`.
3. **Touch-input (én tommel).** Tapp egen aktiv stabel → marker gyldige hex
   (`can_move_to`) + angripbare fiender (`are_adjacent` / skytter-rekkevidde). Tapp
   hex → `move`; tapp fiende → `attack_melee`/`shoot`. Knapper: **Forsvar** (`defend`),
   **Vent** (`wait`).
4. **Initiativkø.** Horisontal stripe som viser `TurnOrder`-rekkefølgen, aktiv uthevet.
5. **Kamplogg.** Rullende panel matet av `CombatState.log_lines`.
6. **Turløkke.** Spillertur → vent på input. Fiendetur → `CombatAI.take_turn` +
   oppdater visning (gjerne kort forsinkelse/animasjon). Sjekk `is_over()` → vis
   seier/tap-overlay.

Start med en **hardkodet kamp** (f.eks. spiller: 10 asketrell + 5 bueskytter mot fiende:
8 takehund) for å bevise loopen. Pen grafikk kommer senere — først funksjon.

## Verifisering

- `./run_tests.sh` skal forbli grønt (ikke rør `core/combat`-logikken; scenen bare leser
  den).
- Boot headless (`godot --headless --path . --quit-after 5`) skal være feilfri.
- Brukeren kjører `godot --path .`, spiller en runde, deler skjermbilde.

## Kickoff for ny økt (lim inn)

> «Fortsett Aske og Malm — Fase 1b, kampscenen. Les `CLAUDE.md`, `docs/roadmap.md`,
> `docs/combat-spec.md` og `docs/fase-1b-kampscene.md`. Bygg `scenes/combat/` som
> rendrer `CombatState` (hex-brett, touch flytt/angrip, initiativkø, kamplogg) for en
> håndsatt kamp, drevet av kjernen. Bygg i kode — jeg kjører og deler skjermbilde.»
