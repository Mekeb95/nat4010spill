## GULLTESTER — tap-modellen (docs/combat-spec.md §5.2). Håndregnede verdier.
extends GutTest

const F = preload("res://tests/_helpers/combat_factory.gd")


func test_partial_kill() -> void:
	# total 100, -35 = 65 → new_count ceil(6.5)=7, top 65-60=5, killed 3.
	var r := Casualties.resolve(10, 10, 10, 35)
	assert_eq(r.killed, 3)
	assert_eq(r.new_count, 7)
	assert_eq(r.new_top_hp, 5)
	assert_false(r.destroyed)


func test_full_wipe() -> void:
	# total (1*10)+4 = 14, -20 ≤ 0 → hele stacken dør.
	var r := Casualties.resolve(2, 10, 4, 20)
	assert_true(r.destroyed)
	assert_eq(r.killed, 2)
	assert_eq(r.new_count, 0)


func test_exact_multiple_boundary() -> void:
	# total 50, -20 = 30 → new_count 3, top 30-20=10, killed 2.
	var r := Casualties.resolve(5, 10, 10, 20)
	assert_eq(r.killed, 2)
	assert_eq(r.new_count, 3)
	assert_eq(r.new_top_hp, 10)


func test_small_damage_wounds_top_only() -> void:
	# total 27, -5 = 22 → new_count 3, top 22-20=2, killed 0.
	var r := Casualties.resolve(3, 10, 7, 5)
	assert_eq(r.killed, 0)
	assert_eq(r.new_count, 3)
	assert_eq(r.new_top_hp, 2)


func test_last_creature_survives_with_1_hp() -> void:
	var r := Casualties.resolve(1, 10, 10, 9)
	assert_eq(r.killed, 0)
	assert_eq(r.new_count, 1)
	assert_eq(r.new_top_hp, 1)


func test_apply_mutates_stack() -> void:
	var s := F.stack(F.creature(0, 0, 1, 10), 10)
	var r := Casualties.apply(s, 35)
	assert_eq(s.count, 7)
	assert_eq(s.top_hp, 5)
	assert_eq(r.killed, 3)
