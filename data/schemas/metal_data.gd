## MetalData — datadefinisjon for ett metall i malmbrann-systemet (§5.3).
## Én .tres per metall i data/metals/. display_name/nickname er norske.
## Eksakte balansetall settes i .tres-ene, aldri i kode.
class_name MetalData
extends Resource

## Kampeffekten metallet gir. Kode-identifikatorer er engelske; spillervendte
## navn ligger i display_name/nickname/description (§6.6).
enum Effect {
	DIRECT_DAMAGE,   ## Stål — direkte skade på et stack
	BUFF,            ## Stridsmalm — +fart/+angrep i X runder
	BERSERK,         ## Sink — fiende går berserk / mister moral
	PACIFY,          ## Messing — hopp over tur / kan ikke motangripe
	PULL,            ## Jern — dra et fiende-stack ut av posisjon
	REVEAL,          ## Tinn — avslør + treff/initiativ-bonus
	CLEANSE,         ## Kobber — immunitet mot malmeffekter / rens
	GODMETAL,        ## Gudemalm — ekstra tur / nær-uovervinnelig
}

@export var id: StringName
@export var display_name: String              ## norsk: "Stål"
@export var nickname: String                  ## norsk kallenavn: "Myntskytter"
@export var effect: Effect = Effect.DIRECT_DAMAGE
@export var base_magnitude: float = 0.0       ## grunneffekt (skade/buff-styrke)
@export var base_duration: int = 0            ## runder (buffs/debuffs)
@export var charge_cost: int = 1              ## ladninger fra reserven per brann
@export var powerburn_multiplier: float = 2.0 ## kraftbrann koster dette ganger
@export var malmkraft_scale: float = 0.25     ## magnitude *= (1 + scale * malmkraft)
@export var in_v1: bool = true
@export var description: String               ## spillervendt norsk
