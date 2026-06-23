## Casualties — den KANONISKE tap-modellen (docs/combat-spec.md §5.2). REN logikk.
## `resolve` jobber på primitiver (trivielt gulltestbart); `apply` muterer en stabel.
class_name Casualties
extends RefCounted


## Resultatet av å påføre skade på en stabel.
class Result extends RefCounted:
	var killed: int = 0
	var new_count: int = 0
	var new_top_hp: int = 0
	var destroyed: bool = false


static func resolve(count: int, max_hp: int, top_hp: int, dmg: int) -> Result:
	var r: Result = Result.new()
	var total_hp: int = (count - 1) * max_hp + top_hp
	total_hp -= dmg
	if total_hp <= 0:
		r.killed = count
		r.new_count = 0
		r.new_top_hp = 0
		r.destroyed = true
	else:
		var new_count: int = ceili(float(total_hp) / float(max_hp))
		r.new_count = new_count
		r.new_top_hp = total_hp - (new_count - 1) * max_hp
		r.killed = count - new_count
		r.destroyed = false
	return r


static func resolve_stack(defender: StackState, dmg: int) -> Result:
	return resolve(defender.count, defender.data.max_hp, defender.top_hp, dmg)


## Som resolve_stack, men skriver resultatet tilbake i stabelen.
static func apply(defender: StackState, dmg: int) -> Result:
	var r: Result = resolve_stack(defender, dmg)
	defender.count = r.new_count
	defender.top_hp = r.new_top_hp
	return r
