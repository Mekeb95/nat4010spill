## CombatState — kampmotoren som binder sammen matematikken. REN logikk
## (RefCounted, ingen noder): kampscenen rendrer denne tilstanden og kaller
## handlingene. All tilfeldighet via den injiserte SeededRng (deterministisk).
class_name CombatState
extends RefCounted

const NO_WINNER: int = -1
const DRAW: int = -2

var grid: HexGrid
var stacks: Array[StackState] = []
var rng: SeededRng
var round_number: int = 0
var queue: Array[StackState] = []
var queue_index: int = 0
var winner: int = NO_WINNER
var log_lines: Array[String] = []

var _uid_counter: int = 0


func _init(cols: int = 6, rows: int = 7, seeded_rng: SeededRng = null) -> void:
	grid = HexGrid.new(cols, rows)
	rng = seeded_rng if seeded_rng != null else SeededRng.new(0)


func add_stack(s: StackState) -> StackState:
	s.uid = _uid_counter
	_uid_counter += 1
	stacks.append(s)
	return s


# --- Spørringer ---

func living_stacks(side: int) -> Array[StackState]:
	var out: Array[StackState] = []
	for s: StackState in stacks:
		if s.is_alive() and s.side == side:
			out.append(s)
	return out


func is_over() -> bool:
	return winner != NO_WINNER


func are_adjacent(a: StackState, b: StackState) -> bool:
	return HexGrid.distance(a.pos, b.pos) == 1


func is_blocked(s: StackState) -> bool:
	for e: StackState in living_stacks(_other_side(s.side)):
		if HexGrid.distance(s.pos, e.pos) == 1:
			return true
	return false


func is_occupied(p: Vector2i) -> bool:
	for s: StackState in stacks:
		if s.is_alive() and s.pos == p:
			return true
	return false


# --- Rundestyring ---

func begin_round() -> void:
	round_number += 1
	for s: StackState in stacks:
		if s.is_alive():
			s.reset_round()
	queue = TurnOrder.initial_order(stacks)
	queue_index = 0


func current_actor() -> StackState:
	while queue_index < queue.size():
		var s: StackState = queue[queue_index]
		if s.is_alive():
			return s
		queue_index += 1
	return null


# --- Handlinger ---

func defend(s: StackState) -> void:
	_begin_turn(s)
	s.is_defending = true
	log_lines.append("%s forsvarer" % _name(s))
	_end_action(s)


func wait(s: StackState) -> void:
	# Flytt handlingen bakerst i runden — kun én gang, og bare hvis det finnes
	# andre uhandlede stabler igjen (ellers unngår vi en evig løkke).
	if not s.has_waited and _has_other_pending():
		s.has_waited = true
		queue.remove_at(queue_index)
		queue.append(s)
		log_lines.append("%s venter" % _name(s))
	else:
		skip(s)


func skip(s: StackState) -> void:
	_begin_turn(s)
	_end_action(s)


func move(s: StackState, dest: Vector2i) -> bool:
	if not can_move_to(s, dest):
		return false
	_begin_turn(s)
	s.pos = dest
	return true


func can_move_to(s: StackState, dest: Vector2i) -> bool:
	if not grid.in_bounds(dest):
		return false
	if dest != s.pos and is_occupied(dest):
		return false
	return HexGrid.distance(s.pos, dest) <= s.data.speed


func attack_melee(attacker: StackState, defender: StackState) -> void:
	_begin_turn(attacker)
	if not are_adjacent(attacker, defender):
		_end_action(attacker)
		return
	var dmg: int = Damage.compute(attacker, defender, false, rng)
	var res: Casualties.Result = Casualties.apply(defender, dmg)
	log_lines.append("%s slår %s: %d skade, %d falt" % [_name(attacker), _name(defender), dmg, res.killed])
	# Motangrep: kun nærkamp, hvis forsvareren lever og har motangrep igjen.
	if defender.is_alive() and defender.retaliations_left > 0:
		defender.retaliations_left -= 1
		var rdmg: int = Damage.compute(defender, attacker, defender.is_ranged(), rng)
		var rres: Casualties.Result = Casualties.apply(attacker, rdmg)
		log_lines.append("%s slår tilbake: %d skade, %d falt" % [_name(defender), rdmg, rres.killed])
	_end_action(attacker)


func shoot(attacker: StackState, defender: StackState) -> void:
	_begin_turn(attacker)
	# Blokkert eller tom for skudd → tvunget nærkamp på 50 % hvis tilstøtende.
	if not attacker.is_ranged() or attacker.shots_left <= 0 or is_blocked(attacker):
		if are_adjacent(attacker, defender):
			var fdmg: int = Damage.compute(attacker, defender, true, rng)
			var fres: Casualties.Result = Casualties.apply(defender, fdmg)
			log_lines.append("%s (blokkert) nærkamp %s: %d skade, %d falt" % [_name(attacker), _name(defender), fdmg, fres.killed])
			if defender.is_alive() and defender.retaliations_left > 0:
				defender.retaliations_left -= 1
				var rdmg: int = Damage.compute(defender, attacker, defender.is_ranged(), rng)
				Casualties.apply(attacker, rdmg)
		_end_action(attacker)
		return
	attacker.shots_left -= 1
	var dmg: int = Damage.compute(attacker, defender, false, rng)
	var res: Casualties.Result = Casualties.apply(defender, dmg)
	log_lines.append("%s skyter %s: %d skade, %d falt" % [_name(attacker), _name(defender), dmg, res.killed])
	_end_action(attacker)


## Flytter greedy mot målet (opp til fart), stopper ved siden av. Returnerer endelig hex.
func step_toward(s: StackState, target_pos: Vector2i) -> Vector2i:
	var cur: Vector2i = s.pos
	var steps: int = 0
	while steps < s.data.speed:
		if HexGrid.distance(cur, target_pos) <= 1:
			break
		var best: Vector2i = cur
		var best_d: int = HexGrid.distance(cur, target_pos)
		for n: Vector2i in grid.neighbors(cur):
			if is_occupied(n) and n != s.pos:
				continue
			var d: int = HexGrid.distance(n, target_pos)
			if d < best_d:
				best_d = d
				best = n
		if best == cur:
			break
		cur = best
		steps += 1
	return cur


# --- Internt ---

func _begin_turn(s: StackState) -> void:
	s.is_defending = false   # forrige forsvar varte til denne handlingen


func _end_action(s: StackState) -> void:
	s.has_acted = true
	queue_index += 1
	_check_winner()


func _check_winner() -> void:
	var p: int = living_stacks(StackState.Side.PLAYER).size()
	var e: int = living_stacks(StackState.Side.ENEMY).size()
	if p > 0 and e == 0:
		winner = StackState.Side.PLAYER
	elif e > 0 and p == 0:
		winner = StackState.Side.ENEMY
	elif p == 0 and e == 0:
		winner = DRAW


func _has_other_pending() -> bool:
	for i: int in range(queue_index + 1, queue.size()):
		if queue[i].is_alive():
			return true
	return false


func _other_side(side: int) -> int:
	return StackState.Side.ENEMY if side == StackState.Side.PLAYER else StackState.Side.PLAYER


func _name(s: StackState) -> String:
	return s.data.display_name
