## EventBus — global signal-hub (§6.1, pkt 3). Systemer kommuniserer via signaler
## her, ikke via direkte node-referanser. Hold signalene grovkornede og navngitt
## på domenet. Nye signaler legges til etter hvert som fasene fylles ut.
extends Node

# --- Innhold / oppstart ---
signal content_loaded(creature_count: int, metal_count: int)

# --- RNG ---
signal rng_seeded(seed_value: int)

# --- Run-livssyklus (fylles ut i Fase 2–4) ---
signal run_started(seed_value: int)
signal run_ended(victory: bool)

# --- Lagring (fylles ut i Fase 4–5) ---
signal game_saved(slot: String)
signal game_loaded(slot: String)
