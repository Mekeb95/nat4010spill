## Damage — den KANONISKE skadeformelen (docs/combat-spec.md §5.2). REN logikk.
## Endres ALDRI uten å oppdatere combat-spec.md OG gulltestene (tests/test_damage.gd).
class_name Damage
extends RefCounted


static func compute(attacker: StackState, defender: StackState,
		forced_melee: bool, rng: SeededRng) -> int:
	var cd: CreatureData = attacker.data
	var raw: int = attacker.count * rng.randi_range(cd.dmg_min, cd.dmg_max)
	var def_eff: float = float(defender.effective_defense())
	if defender.is_defending:
		def_eff *= 1.3
	var diff: float = float(attacker.effective_attack()) - def_eff
	var mult: float = (minf(3.0, 1.0 + 0.05 * diff) if diff > 0.0
			else maxf(0.3, 1.0 + 0.025 * diff))
	var dmg: int = int(floor(raw * mult))
	if cd.is_ranged and forced_melee:
		dmg = int(floor(dmg * 0.5))
	return maxi(1, dmg)
