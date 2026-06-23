## TurnOrder — sorterer levende stabler for en runde (docs/combat-spec.md §5.2):
## fart synkende; uavgjort → spillerside først; deretter uid for determinisme.
## REN logikk. «Vent» og «Forsvar» håndteres i CombatState under runden.
class_name TurnOrder
extends RefCounted


static func initial_order(stacks: Array[StackState]) -> Array[StackState]:
	var living: Array[StackState] = []
	for s: StackState in stacks:
		if s.is_alive():
			living.append(s)
	living.sort_custom(_before)
	return living


static func _before(a: StackState, b: StackState) -> bool:
	if a.data.speed != b.data.speed:
		return a.data.speed > b.data.speed
	var a_player: bool = a.side == StackState.Side.PLAYER
	var b_player: bool = b.side == StackState.Side.PLAYER
	if a_player != b_player:
		return a_player
	return a.uid < b.uid
