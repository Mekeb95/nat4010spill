## ContentRegistry — autoload. Laster og validerer alt data-drevet innhold (.tres)
## ved oppstart (§6.2/§6.3). Ny kreatur/metall = ny .tres i data/, ingen kodeendring.
## Slår opp innhold via id (StringName). Validering fanger feildata tidlig.
extends Node

const CREATURES_DIR: String = "res://data/creatures/"
const METALS_DIR: String = "res://data/metals/"

var _creatures: Dictionary = {}   # StringName -> CreatureData
var _metals: Dictionary = {}      # StringName -> MetalData


func _ready() -> void:
	_load_all()
	EventBus.content_loaded.emit(_creatures.size(), _metals.size())


func _load_all() -> void:
	for res: Resource in _load_dir(CREATURES_DIR):
		var cd: CreatureData = res as CreatureData
		if cd == null:
			push_error("ContentRegistry: ikke-CreatureData i %s" % CREATURES_DIR)
			continue
		_validate_creature(cd)
		_creatures[cd.id] = cd
	for res: Resource in _load_dir(METALS_DIR):
		var md: MetalData = res as MetalData
		if md == null:
			push_error("ContentRegistry: ikke-MetalData i %s" % METALS_DIR)
			continue
		_validate_metal(md)
		_metals[md.id] = md


func _load_dir(path: String) -> Array[Resource]:
	var out: Array[Resource] = []
	var dir: DirAccess = DirAccess.open(path)
	if dir == null:
		push_error("ContentRegistry: fant ikke mappe %s" % path)
		return out
	dir.list_dir_begin()
	var file: String = dir.get_next()
	while file != "":
		if not dir.current_is_dir() and (file.ends_with(".tres") or file.ends_with(".res")):
			var res: Resource = ResourceLoader.load(path + file)
			if res != null:
				out.append(res)
		file = dir.get_next()
	dir.list_dir_end()
	return out


func _validate_creature(cd: CreatureData) -> void:
	assert(cd.id != &"", "CreatureData uten id: %s" % cd.resource_path)
	assert(cd.max_hp > 0, "CreatureData %s har max_hp <= 0" % cd.id)
	assert(cd.tier >= 1, "CreatureData %s har ugyldig tier" % cd.id)
	assert(cd.dmg_min <= cd.dmg_max, "CreatureData %s har dmg_min > dmg_max" % cd.id)


func _validate_metal(md: MetalData) -> void:
	assert(md.id != &"", "MetalData uten id: %s" % md.resource_path)
	assert(md.charge_cost >= 0, "MetalData %s har negativ charge_cost" % md.id)


func get_creature(id: StringName) -> CreatureData:
	return _creatures.get(id, null)


func get_metal(id: StringName) -> MetalData:
	return _metals.get(id, null)


func all_creatures() -> Array[CreatureData]:
	var out: Array[CreatureData] = []
	for cd: CreatureData in _creatures.values():
		out.append(cd)
	return out


func all_metals() -> Array[MetalData]:
	var out: Array[MetalData] = []
	for md: MetalData in _metals.values():
		out.append(md)
	return out


func creature_count() -> int:
	return _creatures.size()


func metal_count() -> int:
	return _metals.size()
