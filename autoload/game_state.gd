## GameState — autoload. Eier den aktive run-tilstanden, som nullstilles per run
## (§5.9). Stubb i Fase 0; run_state (core/progression/run_state.gd) kobles på i
## Fase 2–4. Det persistente ligger i MetaProgression, ikke her.
extends Node

var seed_value: int = 0
var day: int = 0
var is_run_active: bool = false


func start_run(run_seed: int) -> void:
	seed_value = run_seed
	day = 1
	is_run_active = true
	Rng.seed_run(run_seed)
	EventBus.run_started.emit(run_seed)


func end_run(victory: bool) -> void:
	is_run_active = false
	EventBus.run_ended.emit(victory)
