# Lokale GUT-patcher (Godot 4.6.3-kompatibilitet)

GUT 9.7.0 har to parse-feil under Godot 4.6.3 som knekker test-dobler/mocks
(`double()`/`stub()`/singleton-spying). Assert-motoren er upåvirket. To minimale,
merkede patcher løser det. **Reappliker disse hvis GUT oppdateres.**

1. `godot_singletons.gd` (linje ~5)
   `AccessibilityServer` er ikke en global identifikator i 4.6.3-bygget → kommentert
   ut (samme `# excluded:`-stil som `EditorInterface`). Konsekvens: ingen — GUT kan
   bare ikke spionere på AccessibilityServer-singletonen, irrelevant for et spill.

2. `stub_params.gd` (linje ~13)
   `var return_val = GutConstants.NOT_SET` → `var return_val: Variant = ...`.
   4.6 inferer ellers returtypen til getteren som `StringName` (fra `NOT_SET`) og
   nekter `return null`. Eksplisitt `Variant` løser det.

Sjekk om en nyere GUT-utgave fikser begge offisielt; da kan patchene droppes.
