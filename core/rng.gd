## SeededRng — frøsatt, deterministisk RNG-wrapper. REN logikk (RefCounted, ingen
## noder), slik at den kan testes headless. All tilfeldighet i core/ går via en
## instans av denne; det gir reproduserbare runs (§6.1, pkt 4). Aldri randi()/
## randf() direkte — heller en SeededRng (i core) eller Rng-autoloadet (i scenes).
class_name SeededRng
extends RefCounted

var _seed: int
var _rng: RandomNumberGenerator


func _init(seed_value: int) -> void:
	_seed = seed_value
	_rng = RandomNumberGenerator.new()
	_rng.seed = seed_value


func get_seed() -> int:
	return _seed


## Inklusiv i begge ender — samme semantikk som GDScripts randi_range og den
## kanoniske skadeformelen (docs/combat-spec.md).
func randi_range(from: int, to: int) -> int:
	return _rng.randi_range(from, to)


func randf() -> float:
	return _rng.randf()


func randf_range(from: float, to: float) -> float:
	return _rng.randf_range(from, to)


func chance(p: float) -> bool:
	return _rng.randf() < p


## Avledet, uavhengig delstrøm (f.eks. egen RNG per kamp) — determinstisk fra frøet.
func derive(salt: int) -> SeededRng:
	return SeededRng.new(_seed ^ (salt * 0x9E3779B1))
