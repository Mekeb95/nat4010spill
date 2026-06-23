## Testfabrikk for kamp — bygger CreatureData/StackState i kode (ikke fra .tres),
## så gulltestene er selvstendige og uavhengige av roster-balansering.
## dmg_min == dmg_max ⇒ terningkastet er fast ⇒ deterministisk fasit uten RNG-avhengighet.
class_name CombatTestFactory
extends RefCounted


static func creature(atk: int, def: int, dmg: int, hp: int = 10, speed: int = 4,
		ranged: bool = false, shots: int = 0, flying: bool = false,
		retal: int = 1) -> CreatureData:
	var c: CreatureData = CreatureData.new()
	c.id = &"_test"
	c.display_name = "Test"
	c.tier = 1
	c.attack = atk
	c.defense = def
	c.dmg_min = dmg
	c.dmg_max = dmg
	c.max_hp = hp
	c.speed = speed
	c.is_ranged = ranged
	c.shots = shots
	c.is_flying = flying
	c.retaliations = retal
	return c


static func stack(c: CreatureData, count: int, side: int = StackState.Side.PLAYER,
		pos: Vector2i = Vector2i.ZERO, h_atk: int = 0, h_def: int = 0) -> StackState:
	return StackState.new(c, count, side, pos, h_atk, h_def)
