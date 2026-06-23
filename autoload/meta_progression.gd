## MetaProgression — autoload. Persistent meta på tvers av runs (§5.10):
## ekko-saldo, opplåste malmminner, ascension-nivå. Stubb i Fase 0; ekte
## unlock-logikk og lagring kommer i Fase 5 (sammen med SaveManager).
extends Node

var echoes: int = 0
var ascension: int = 0
var unlocked_metals: Array[StringName] = [&"staal"]


func has_metal(id: StringName) -> bool:
	return unlocked_metals.has(id)


func add_echoes(amount: int) -> void:
	echoes += amount
