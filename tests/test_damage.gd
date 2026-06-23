## GULLTESTER — skadeformelen (docs/combat-spec.md §5.2). Alle verdier er håndregnet.
## Kreaturer har dmg_min == dmg_max, så terningkastet er fast og resultatet er
## uavhengig av RNG. Disse er ukrenkelige: endres formelen, endres specen + her.
extends GutTest

const F = preload("res://tests/_helpers/combat_factory.gd")


func _rng() -> SeededRng:
	return SeededRng.new(1)


func test_positive_diff_scales_5pct_per_point() -> void:
	# atk 6 vs def 3, diff +3 → mult 1.15. raw = 10 * 2 = 20 → floor(23.0) = 23.
	var atk := F.stack(F.creature(6, 0, 2), 10)
	var dfn := F.stack(F.creature(0, 3, 1), 1, StackState.Side.ENEMY)
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 23)


func test_high_attack_caps_at_300_percent() -> void:
	# diff +60 → 1 + 0.05*60 = 4.0, kappet til 3.0. raw = 1*5 = 5 → 15.
	var atk := F.stack(F.creature(70, 0, 5), 1)
	var dfn := F.stack(F.creature(0, 10, 1), 1, StackState.Side.ENEMY)
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 15)


func test_negative_diff_floors_at_30_percent() -> void:
	# diff -99 → 1 - 2.475 < 0.3 → mult 0.3. raw = 2*3 = 6 → floor(1.8) = 1.
	var atk := F.stack(F.creature(1, 0, 3), 2)
	var dfn := F.stack(F.creature(0, 100, 1), 1, StackState.Side.ENEMY)
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 1)


func test_defending_multiplies_defense_by_1_3() -> void:
	# def 10 * 1.3 = 13. atk 10, diff -3 → mult 0.925. raw = 4*4 = 16 → floor(14.8) = 14.
	var atk := F.stack(F.creature(10, 0, 4), 4)
	var dfn := F.stack(F.creature(0, 10, 1), 1, StackState.Side.ENEMY)
	dfn.is_defending = true
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 14)
	# Uten forsvar: diff 0 → mult 1.0 → 16.
	dfn.is_defending = false
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 16)


func test_ranged_forced_melee_halves() -> void:
	# Som test 1 (23), men skytter tvunget til nærkamp → floor(23*0.5) = 11.
	var atk := F.stack(F.creature(6, 0, 2, 10, 4, true, 5), 10)
	var dfn := F.stack(F.creature(0, 3, 1), 1, StackState.Side.ENEMY)
	assert_eq(Damage.compute(atk, dfn, true, _rng()), 11)
	# Ikke tvunget melee → ingen halvering.
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 23)


func test_minimum_damage_is_1() -> void:
	# raw 1, mult 0.3 → floor(0.3) = 0 → klemt opp til 1.
	var atk := F.stack(F.creature(1, 0, 1), 1)
	var dfn := F.stack(F.creature(0, 100, 1), 1, StackState.Side.ENEMY)
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 1)


func test_hero_attack_adds_into_effective_attack() -> void:
	# creature atk 2 + helt-angrep 4 = 6 effektivt; def 1 + helt-forsvar 2 = 3.
	# diff +3 → mult 1.15. raw = 10*2 = 20 → 23.
	var atk := F.stack(F.creature(2, 0, 2), 10, StackState.Side.PLAYER, Vector2i.ZERO, 4, 0)
	var dfn := F.stack(F.creature(0, 1, 1), 1, StackState.Side.ENEMY, Vector2i.ONE, 0, 2)
	assert_eq(atk.effective_attack(), 6)
	assert_eq(dfn.effective_defense(), 3)
	assert_eq(Damage.compute(atk, dfn, false, _rng()), 23)


func test_damage_scales_linearly_with_count() -> void:
	# Maks-mult (3.0). raw = count * 3. count 5 → 45, count 10 → 90.
	var dfn := F.stack(F.creature(0, 1, 1), 1, StackState.Side.ENEMY)
	var five := F.stack(F.creature(100, 0, 3), 5)
	var ten := F.stack(F.creature(100, 0, 3), 10)
	assert_eq(Damage.compute(five, dfn, false, _rng()), 45)
	assert_eq(Damage.compute(ten, dfn, false, _rng()), 90)
