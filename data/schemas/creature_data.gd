## CreatureData — datadefinisjon for ett folkeslag/kreatur (§5.5, §6.3).
## Én .tres per kreatur i data/creatures/. Tallene er referansekurven fra
## prototypens roster; display_name/emoji er norske og spillervendte.
class_name CreatureData
extends Resource

@export var id: StringName
@export var display_name: String          ## norsk, spillervendt: "Spydmann"
@export var emoji: String
@export var tier: int = 1
@export var max_hp: int = 10
@export var attack: int = 4
@export var defense: int = 5
@export var dmg_min: int = 1
@export var dmg_max: int = 3
@export var speed: int = 4
@export var is_ranged: bool = false
@export var shots: int = 0
@export var is_flying: bool = false
@export var retaliations: int = 1
@export var growth: int = 0                ## rekruttering per inntektsperiode
@export var cost_gold: int = 0
@export var cost_malm: int = 0
