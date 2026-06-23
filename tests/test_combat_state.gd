## Integrasjonstester for kampmotoren: motangrep, dobbel-motangrep (Grif),
## skyttere, blokkering og en full auto-resolvert kamp. Deterministisk (faste kast).
extends GutTest

const F = preload("res://tests/_helpers/combat_factory.gd")


func _cs() -> CombatState:
	return CombatState.new(6, 7, SeededRng.new(1))


func test_melee_attack_and_retaliation() -> void:
	var cs := _cs()
	var a := cs.add_stack(F.stack(F.creature(10, 5, 4), 10, StackState.Side.PLAYER, Vector2i(0, 0)))
	var d := cs.add_stack(F.stack(F.creature(6, 5, 3), 10, StackState.Side.ENEMY, Vector2i(1, 0)))
	cs.begin_round()
	cs.attack_melee(a, d)
	assert_eq(d.count, 5, "forsvarer: 50 skade → 5 falt")
	assert_eq(a.count, 9, "angriper: 15 motangrepsskade → 1 falt")
	assert_eq(d.retaliations_left, 0, "motangrep brukt opp")


func test_grif_retaliates_twice() -> void:
	var cs := _cs()
	var d := cs.add_stack(F.stack(F.creature(6, 10, 2), 10, StackState.Side.ENEMY, Vector2i(2, 2)))
	var a1 := cs.add_stack(F.stack(F.creature(5, 5, 1), 10, StackState.Side.PLAYER, Vector2i(2, 1)))
	var a2 := cs.add_stack(F.stack(F.creature(5, 5, 1), 10, StackState.Side.PLAYER, Vector2i(3, 2)))
	d.data.retaliations = 2
	cs.begin_round()
	cs.attack_melee(a1, d)
	cs.attack_melee(a2, d)
	assert_lt(a2.count, 10, "andre angriper fikk også motangrep")
	assert_eq(d.retaliations_left, 0)


func test_single_retaliation_spares_second_attacker() -> void:
	var cs := _cs()
	var d := cs.add_stack(F.stack(F.creature(6, 10, 2), 10, StackState.Side.ENEMY, Vector2i(2, 2)))
	var a1 := cs.add_stack(F.stack(F.creature(5, 5, 1), 10, StackState.Side.PLAYER, Vector2i(2, 1)))
	var a2 := cs.add_stack(F.stack(F.creature(5, 5, 1), 10, StackState.Side.PLAYER, Vector2i(3, 2)))
	cs.begin_round()
	cs.attack_melee(a1, d)
	cs.attack_melee(a2, d)
	assert_eq(a2.count, 10, "normal forsvarer slår ikke tilbake mot andre angriper")


func test_ranged_shoot_no_retaliation_consumes_shot() -> void:
	var cs := _cs()
	var a := cs.add_stack(F.stack(F.creature(6, 2, 3, 10, 4, true, 5), 5, StackState.Side.PLAYER, Vector2i(0, 0)))
	var d := cs.add_stack(F.stack(F.creature(4, 3, 2), 10, StackState.Side.ENEMY, Vector2i(4, 4)))
	cs.begin_round()
	cs.shoot(a, d)
	assert_eq(a.shots_left, 4, "ett skudd brukt")
	assert_eq(a.count, 5, "ingen motangrep på avstand")
	assert_eq(d.count, 9, "17 skade → 1 falt")


func test_blocked_shooter_forced_melee_halved() -> void:
	var cs := _cs()
	var a := cs.add_stack(F.stack(F.creature(6, 2, 3, 10, 4, true, 5), 5, StackState.Side.PLAYER, Vector2i(0, 0)))
	var d := cs.add_stack(F.stack(F.creature(4, 3, 2), 10, StackState.Side.ENEMY, Vector2i(1, 0)))
	cs.begin_round()
	cs.shoot(a, d)
	assert_eq(a.shots_left, 5, "blokkert nærkamp bruker ikke skudd")
	assert_eq(d.count, 10, "8 skade (halvert) → ingen falt")
	assert_lt(a.count, 5, "nærkamp gir motangrep")


func test_auto_resolve_terminates_with_winner() -> void:
	var cs := _cs()
	cs.add_stack(F.stack(F.creature(12, 10, 5, 10, 5), 20, StackState.Side.PLAYER, Vector2i(2, 6)))
	cs.add_stack(F.stack(F.creature(3, 3, 2, 10, 4), 5, StackState.Side.ENEMY, Vector2i(3, 0)))
	var result := CombatAI.auto_resolve(cs)
	assert_true(cs.is_over(), "kampen skal bli avgjort")
	assert_eq(result, StackState.Side.PLAYER, "sterk + rask spillerside vinner")
