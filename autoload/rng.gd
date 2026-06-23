## Rng — autoload. Spill-lagets (scenes/) eneste kilde til tilfeldighet, frøsatt
## per run (§6.1, pkt 4). Eier én SeededRng og proxer den. Kjernen (core/) bruker
## sine egne SeededRng-instanser som sendes inn i rene funksjoner — dette
## autoloadet er for presentasjons-/glue-koden som ellers ville fristet til randi().
extends Node

var _rng: SeededRng = SeededRng.new(0)


## Frøsetter run-ens RNG på nytt. Kalles av GameState.start_run().
func seed_run(new_seed: int) -> void:
	_rng = SeededRng.new(new_seed)
	EventBus.rng_seeded.emit(new_seed)


func get_seed() -> int:
	return _rng.get_seed()


## Den underliggende strømmen — sendes inn i core-funksjoner som krever en SeededRng.
func stream() -> SeededRng:
	return _rng


func randi_range(from: int, to: int) -> int:
	return _rng.randi_range(from, to)


func randf() -> float:
	return _rng.randf()


func randf_range(from: float, to: float) -> float:
	return _rng.randf_range(from, to)


func chance(p: float) -> bool:
	return _rng.chance(p)
