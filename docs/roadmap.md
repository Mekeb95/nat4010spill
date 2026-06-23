# Veikart — roadmap.md

Vertikale skiver: hver fase ender **spillbart** (§8 i design-bibelen). Rekkefølgen er
bevisst — Fase 1 beviser den vanskeligste biten (kampen) tidlig, og hver påfølgende
fase legger ett lag på en sløyfe som allerede henger sammen.

| Fase | Mål | Ferdig når … |
|---|---|---|
| **0 — Fundament** | prosjektskjelett, autoloads, EventBus, RNG, Resource-schemas, ContentRegistry, testharness, CLAUDE.md | spillet booter til hovedmeny, testene kjører grønt |
| **1 — Kampskjelett** | port matten til `core/combat` med full test; `combat/`-scene (hex-render, touch, initiativkø, logg) drevet av core | du spiller en håndsatt kamp på telefonen; matte matcher gulltester |
| **2 — Eventyrkart** | `core/map` + pathfinding; `adventure_map/`-scene; helt-bevegelse, tåke, 2–3 objekttyper | flytt → kjemp → tilbake-loopen funker |
| **3 — By & økonomi** | `town/`-scene, ~6–8 bygg, Gull/Malm-økonomi, verving, Malmkollegiet | bygg by, verv, voks hæren mellom kamper |
| **4 — Riften & run-loopen** | rift-objekt + trykk-klokke + askedjevel-spawns; vinn/tap; `run_summary/` | en hel avgrenset run start→lukk-rift på ~30 min |
| **5 — Roguelite-meta** | ekko-valuta, Malmminne-unlock-butikk, ascension-stige, blodmalm, persistent meta-save | runs mater meta; unlocks endrer neste run |
| **6 — Innhold & dybde** | fyll 7-tier-rosteret, fullt metallsett, flere objekter/biomer/rift-typer, artefakter, balansepass | spillet har variasjon og rejátszhatóság |
| **7 — Mobil & lansering** | portrett-UX-polish, touch, Android-eksport, iOS via sky-bygg, butikk-assets | byggbar .aab/.ipa, klar for TestFlight/Play |

## Status

- **Fase 0 — pågår/ferdig:** struktur (§6.2), 7 autoloads, `SeededRng`, `CreatureData`/
  `MetalData`-schemas, `ContentRegistry`, GUT-røyktest grønt headless, booter til
  hovedmeny. Sample-innhold: `asketrell` (kreatur), `staal` (metall).
- **Neste — Fase 1:** port skadeformel + tap-modell fra `combat-spec.md` til
  `core/combat/`, rekonstruer referanse-roster + gulltester.
