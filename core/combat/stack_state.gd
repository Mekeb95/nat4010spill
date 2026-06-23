## StackState — én stabel av like kreaturer i kamp. REN logikk (RefCounted).
## Heltens stats (Angrep/Forsvar) bakes inn som flate bonuser per side, slik
## skadeformelen krever: effective_attack = creature.attack + hero.angrep (§5.1).
class_name StackState
extends RefCounted

enum Side { PLAYER, ENEMY }

var uid: int = 0                       ## stabil id for deterministisk turrekkefølge
var data: CreatureData
var count: int = 0
var top_hp: int = 0                    ## HP på den øverste (skadde) kreaturen i stabelen
var side: int = Side.PLAYER            ## Side-verdi lagret som int (unngår enum-self-quirk)
var pos: Vector2i = Vector2i.ZERO      ## hex-posisjon (offset)
var is_defending: bool = false
var has_waited: bool = false
var has_acted: bool = false
var shots_left: int = 0
var retaliations_left: int = 0
var hero_attack: int = 0
var hero_defense: int = 0


func _init(creature: CreatureData, n: int, s: int, p: Vector2i,
		h_atk: int = 0, h_def: int = 0) -> void:
	data = creature
	count = n
	side = s
	pos = p
	hero_attack = h_atk
	hero_defense = h_def
	if creature != null:
		top_hp = creature.max_hp
		shots_left = creature.shots
		retaliations_left = creature.retaliations


func effective_attack() -> int:
	return data.attack + hero_attack


func effective_defense() -> int:
	return data.defense + hero_defense


func is_alive() -> bool:
	return count > 0


func is_ranged() -> bool:
	return data.is_ranged


func total_hp() -> int:
	return (count - 1) * data.max_hp + top_hp


## Nullstilles ved starten av hver runde. Forsvarsbonusen (is_defending) varer til
## stabelens NESTE handling og nullstilles derfor i CombatState, ikke her.
func reset_round() -> void:
	has_waited = false
	has_acted = false
	retaliations_left = data.retaliations
