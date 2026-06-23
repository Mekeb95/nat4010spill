## CombatAI — enkel kamp-AI. REN logikk. Velger nærmeste fiende: skyt hvis
## skytter og ikke blokkert, slå hvis tilstøtende, ellers flytt mot målet og slå
## hvis man kommer inntil. Erstattes/utvides i Fase 6 (taktisk dybde).
class_name CombatAI
extends RefCounted


static func take_turn(cs: CombatState, s: StackState) -> void:
	var enemies: Array[StackState] = cs.living_stacks(
			StackState.Side.ENEMY if s.side == StackState.Side.PLAYER else StackState.Side.PLAYER)
	if enemies.is_empty():
		cs.skip(s)
		return
	var target: StackState = _nearest(s, enemies)
	if s.is_ranged() and s.shots_left > 0 and not cs.is_blocked(s):
		cs.shoot(s, target)
		return
	if cs.are_adjacent(s, target):
		cs.attack_melee(s, target)
		return
	var dest: Vector2i = cs.step_toward(s, target.pos)
	cs.move(s, dest)
	if cs.are_adjacent(s, target):
		cs.attack_melee(s, target)
	else:
		cs.skip(s)


## Kjør hele kampen automatisk (AI på begge sider). Brukes i tester og auto-resolve.
## Bor her (ikke i CombatState) så kjernen slipper å avhenge av AI-en — enveis kobling.
static func auto_resolve(cs: CombatState, max_rounds: int = 200) -> int:
	while not cs.is_over() and cs.round_number < max_rounds:
		cs.begin_round()
		while not cs.is_over():
			var actor: StackState = cs.current_actor()
			if actor == null:
				break
			take_turn(cs, actor)
	return cs.winner


static func _nearest(s: StackState, enemies: Array[StackState]) -> StackState:
	var best: StackState = enemies[0]
	var best_d: int = HexGrid.distance(s.pos, best.pos)
	for e: StackState in enemies:
		var d: int = HexGrid.distance(s.pos, e.pos)
		if d < best_d:
			best_d = d
			best = e
	return best
