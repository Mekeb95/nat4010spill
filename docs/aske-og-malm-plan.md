# Aske og Malm — Prosjektplan & Designbibel

> **Arbeidstittel:** *Aske og Malm* · **Sjanger:** roguelite turbasert taktikk (HoMM3-arv) · **Motor:** Godot 4.6.x stable · **Språk:** GDScript (statisk typet) · **Mål:** mobil (Android først, iOS via sky-bygg) · **Verden:** Eskaria (fra GM-dokumentet ditt)

---

## 0. Slik bruker du dette dokumentet

Dette er **fasit**. Alt under §5 (kanoniske mekanikker) og §6 (arkitektur) er låst med vilje — endrer du noe der, oppdaterer du *både* teksten og gulltestene i samme slengen. Poenget er å fjerne «skal vi gjøre det sånn eller sånn?»-fiklingen: avgjørelsene er allerede tatt.

Når repoet er satt opp, splittes dokumentet til:
- `docs/design-bible.md` ← §1–5
- `docs/combat-spec.md` ← §5.2 (de eksakte formlene, isolert)
- `docs/roadmap.md` ← §8
- `CLAUDE.md` (rot) ← §7.2

Regelen for hele dokumentet: **kode på engelsk, lore på norsk.** Klassenavn, variabler og filer er engelske (best LLM-støtte, Godot-konvensjon). Innholdsverdier og spillervendt tekst er norske (`display_name = "Spydmann"`, metallnavn, Tæreren).

---

## 1. Visjon & designpilarer

Et HoMM3-spill destillert til mobil og én helt, der hver mekanikk vokser ut av Eskaria i stedet for å limes på. En run er en avgrenset kampanje mot **én rift** — 20–40 minutter, spillbart på farten.

Sju pilarer som avgjør framtidige uenigheter:

1. **Sløyfa er hellig.** *Utforsk → samle → bygg hær → vinn taktisk kamp → voks → større kamp.* Hver feature må tjene den. Tjener den ikke sløyfa, ut.
2. **Lore-mekanikk-fusjon.** Hver mekanikk er diegetisk forankret: malmbrann *er* magien, malmminne *er* meta-progresjonen, riften *er* vinnvilkåret. Ingen bolted-on systemer.
3. **Avgrensede økter.** En run varer 20–40 min og er designet for telefon i lomma, ikke 6-timers kampanjer.
4. **Dybde fra samspill, ikke volum.** Få systemer som kombinerer rikt (HoMM3s geni), ikke mange grunne. Når vi er i tvil: færre mekanikker, dypere.
5. **Horisontal roguelite.** Meta-progresjon låser opp *valg* (metaller, kreaturer, perks, biomer), ikke rå styrke. Vanskelighet skaleres via en ascension-stige, ikke ved at spilleren bare blir sterkere.
6. **Data-drevet og testbart.** Innhold er `Resource`-filer (`.tres`); logikk er ren, testbar GDScript skilt fra presentasjon. Dette er både en design- og arkitekturpilar.
7. **Mobil-først UX.** Touch, portrett, lesbart, én tommel. Hex-kart høyere enn bredt; aldri avhengig av hover.

---

## 2. Ikke-mål for v1 (scope-vakt)

Like viktig som hva vi bygger. Disse er **eksplisitt utelatt** fra v1 og skal ikke snikes inn:

- Flere helter samtidig, caravans, helt-vs-helt på kartet (solo-helt er hele poenget)
- Beleiring, bymurer, krigsmaskiner
- Flere byfraksjoner (én by-mal i v1)
- Multiplayer / nettverk
- 3D, fri kamerarotasjon
- Gral, undergrunn, dag/natt-sykluser på kartet
- Den fulle d20-TTRPG-regelmotoren fra GM-dokumentet (se §3)
- Moral/flaks som dype systemer (kan komme som lett krydder senere)

Når noe føles fristende å legge til: hører det hjemme i en pilar i §1? Hvis nei → backlog, ikke v1.

---

## 3. Fra verden til spill: hva vi låner

Vi låner **verden og vokabularet** fra GM-dokumentet — Eskaria, Skårmaktene (Bevareren/Tæreren), malmkunsten, folkeslagene, riftene, fraksjonene. Vi låner **ikke** d20-regelmotoren (1d20 + evne vs. VG). Det er to forskjellige spill: GM-prompten er et fortellende TTRPG; dette er et taktisk strategispill med HoMM3-avledede regler.

**Hvorfor dette skillet er en fasit-avgjørelse:** å blande to regelsystemer er en av de største fikle-kildene som finnes. Kampen vår er stack-basert med HoMM3-skadeformel og fartsbasert initiativ — *ikke* terningkast per handling. Eskaria gir oss fiksjonen; HoMM3 gir oss reglene.

Oversettelsen lore → mekanikk:

| Eskaria | Spillsystem |
|---|---|
| Malmbrann (svelg og brenn metall) | Magisystemet — metaller = «trolldomsskoler» |
| Malmreserve (ladninger) | Mana — ladninger per metall |
| Malmminne (lagre i metall) | Roguelite meta-progresjon («ekko i malm») |
| Blodmalm (forbudt) | Mørk permanent unlock med korrupsjonsarr |
| Riftene til Askeplanet | Vinnvilkår + tempo-klokke |
| Folkeslagene | Kreatur-stigen (tier 1–7) |
| Fraksjoner/laug | Rykte og kartmøter (senere fase) |

---

## 4. Kjernesløyfa

```
   ┌──────────────────────────────────────────────────────┐
   │  EVENTYRKART (firkant-rutenett, 8 retn., tåke)        │
   │  beveg helt · kapre gruver · plukk malm · møt fiende  │
   └───────────┬──────────────────────────────┬───────────┘
               │ gå inn i fiende               │ besøk by
               ▼                               ▼
        ┌─────────────┐                 ┌──────────────┐
        │ KAMP (hex)  │ ── loot/xp ──▶  │ BY           │
        │ taktisk     │                 │ bygg · verv  │
        │ stack-strid │ ◀── sterkere ── │ lær metall   │
        └─────────────┘                 └──────────────┘
               │
               ▼  riftens trykk stiger hver dag
        ┌─────────────────────────────────────────┐
        │ RIFTEN — nå den og lukk den før trykket  │
        │ overvelder. Klimaks-kamp. Run slutt.     │
        └──────────────────┬──────────────────────┘
                           ▼
                 RUN-OPPSUMMERING → ekko i malm → meta-unlocks
```

**Arkitektonisk arv fra HoMM3, beholdt med vilje:** oververdenen er et **firkant-rutenett (8 retninger)**, og bare **kampen er hex**. Dette er både trofast og det mest mobilvennlige — og betyr at vi gjenbruker prototypens hex-matte kun i kampscenen.

---

## 5. Kanoniske mekanikker (FASIT)

### 5.1 Helt & stats

Tre primærstats (HoMM3s fire → tre) pluss en reserve-pool:

| Stat | Effekt |
|---|---|
| **Angrep** | Legges flatt til *alle* egne stacks' angrep i skadeformelen |
| **Forsvar** | Legges flatt til alle egne stacks' forsvar |
| **Malmkraft** | Skalerer effekt og varighet på all malmbrann |

- `effective_attack(stack) = creature.attack + hero.angrep`
- `effective_defense(stack) = creature.defense + hero.forsvar`
- **Helse/reserve:** helten har ikke HP (han dør ikke i kamp som en stack); han har en **malmreserve** per metall (ladninger). Tom reserve = ingen brann.
- Helten starter en run med valgt klasse/loadout (se §5.10) og vokser gjennom run-en (se §5.9).

### 5.2 Kamp — `docs/combat-spec.md` (uendelig viktig: dette er låst)

Portert direkte fra HTML-prototypen. Disse tallene er gulltestet; endres aldri uten å oppdatere testene.

**Brett:** hex-rutenett, odd-r offset (pointy-top). Portrett: fiende øverst, spiller nederst, 6 kolonner × 7 rader som standard. Avstand via cube-koordinater.

**Turrekkefølge:** hver runde sorteres levende stacks etter `speed` synkende; uavgjort → spillerside først. Én handling per stack per runde. **Vent** flytter handlingen bakerst i runden (kan gjøres én gang). **Forsvar** gir +30 % forsvar til neste tur og avslutter handlingen.

**Skadeformel (kanonisk):**
```
raw        = stack.count * randi_range(creature.dmg_min, creature.dmg_max)
def_eff    = effective_defense(defender) * (1.3 hvis defender forsvarer ellers 1.0)
diff       = effective_attack(attacker) - def_eff
mult       = min(3.0, 1 + 0.05 * diff)    hvis diff > 0
           = max(0.3, 1 + 0.025 * diff)   hvis diff <= 0
dmg        = floor(raw * mult)
hvis skytter tvunget til nærkamp: dmg = floor(dmg * 0.5)
dmg        = max(1, dmg)
```

**Tap (casualty-modell):**
```
total_hp   = (count - 1) * max_hp + top_hp
total_hp  -= dmg
hvis total_hp <= 0:  hele stacken dør (drepte = count)
ellers:
  new_count = ceil(total_hp / max_hp)
  new_top   = total_hp - (new_count - 1) * max_hp
  drepte    = count - new_count
```

**Motangrep:** kun ved nærkamp. Forsvareren slår tilbake én gang per runde hvis i live (Grif: to ganger). Ranged forsvarer som slår tilbake i nærkamp bruker 50 %-regelen.

**Skyttere:** skyter et hvilket som helst fiendtlig stack hvis de har skudd og *ikke* er blokkert (ingen fiende i nabohex). Blokkert eller tom for skudd → nærkamp på 50 % skade. Trekker ett skudd per skudd.

**Flygere:** ignorerer opptatte hex under bevegelse; rekkevidde = hex-avstand ≤ `speed`. Landingshex må være tom.

**Malmkraft i kamp:** helten kan brenne metall i stedet for å flytte/angripe-fokus (én brann per egen runde, som «én stav per tur» i HoMM3). Se §5.3.

### 5.3 Malmbrann (magisystemet)

Helten er **énbrenner** ved start (ett metall), lærer flere via Malmkollegiet (§5.7) og skrin. Brann koster ladninger fra reserven; **kraftbrann** koster dobbelt for forsterket effekt.

| Metall | Kallenavn | Kampeffekt | v1? |
|---|---|---|---|
| **Stål** | Myntskytter | Direkte skade på et stack (skalerer med Malmkraft) | ✅ |
| **Stridsmalm** | Banker | Buff eget stack: +fart +angrep i X runder | ✅ |
| **Sink** | Opphisser | Fiende-stack går berserk / mister moral | ✅ |
| **Messing** | Demper | Pasifiser et stack: hopper over tur / kan ikke motangripe | ✅ |
| **Jern** | Trekker | Dra et fiende-stack ut av posisjon | ⏳ |
| **Tinn** | Tinnauge | Avslør + treff/initiativ-bonus | ⏳ |
| **Kobber** | Kobbersmug | Immun mot fiendens malmeffekter / rens | ⏳ |
| **Gudemalm** | — | Ekstra tur / nær-uovervinnelig kort. Sjelden, dyrebar | ⏳ (sjelden) |

`Malmkraft` skalerer magnitude: f.eks. `stål_skade = base * (1 + 0.25 * malmkraft)`, buff-varighet = `2 + malmkraft` runder. Eksakte tall settes i `data/metals/*.tres`, ikke i kode.

### 5.4 Økonomi & ressurser

HoMM3s sju ressurser → **to + én sjelden**:

| Ressurs | Kilde | Bruk |
|---|---|---|
| **Gull** | Rådhus (daglig), gullgruver, skrin, loot | Verving, bygg, smie |
| **Malm** | Malmsmelteri (daglig), malmgruver, hauger | Bygg, reserve-påfyll, høyere kreaturer |
| **Gudemalm** (sjelden) | Sjelden gruve, riftnær loot | Topp-tier bygg, gudemalm-brann |

Inntekt tikker **per dag** (en «dag» = ett kart-tur-sett). Gruver må kapres og holdes.

### 5.5 Kreatur-stigen

Sju tiers fra folkeslagene. Schema (alle felt i `CreatureData`, se §6.3):

`id · display_name · tier · max_hp · attack · defense · dmg_min · dmg_max · speed · is_ranged · shots · is_flying · retaliations · growth · cost_gold · cost_malm`

| Tier | Kreatur | Rolle | Nøkkeltrekk |
|---|---|---|---|
| 1 | Asketrell-milits | billig kjøtt | mange, lav stat |
| 2 | Slyngekaster / Bueskytter | skytter | rekkevidde, lav HP |
| 3 | Tåkehund | rusher | rask, flankering |
| 4 | Orsk-banker | elite nærkamp | tank, høy skade |
| 5 | Skifter | flankør | snik, posisjonering |
| 6 | Tåkevender | caster/støtte | malm-resonans |
| 7 | Askejotn / Riftedjevel | tungvekter | flygende, enorm HP |

V1 trenger ~4–5 av disse spillbare; resten fylles i fase 6. Tallene baseres på prototypens roster (Spydmann/Bueskytter/Grif/Sverdmann/Munk/Drage) som referansekurve.

### 5.6 Eventyrkart & objekter

Firkant-rutenett, 8 retninger, tåke (fog of war). Helten har et **bevegelsesbudsjett per dag**. Objekttyper (v1 i fet):

- **Ressurshauger** (gull/malm) — engangsplukk
- **Gruver** (gull/malm/gudemalm) — kapre for daglig inntekt
- **Boliger** — verv kreaturer ute i felten
- **Vandrende fiende-stacks** — kamp → loot/xp
- **Skrin** — gull, eller lær et metall, eller xp
- Helligdommer/boons — stat- eller reserve-bonus
- Obelisker/lore — valgfritt krydder
- **Riften** — målet (§5.8)

### 5.7 By & bygg

Én by-mal, ~8 bygg med ekte spenning (økonomi vs. militær vs. metall-opplåsing). Bygg koster gull+malm og tar ofte en dag.

| Bygg | Effekt |
|---|---|
| Rådhus | +daglig gull (oppgraderbart) |
| Malmsmelteri | +daglig malm |
| Boliger (2–3 tiers) | lås opp + verv kreaturer |
| **Malmkollegiet** | lærer helten nye metaller — *kroken*: bybygging mater heltens kraft direkte |
| Smie | kjøp artefakter/oppgraderinger |
| Festning | +kreaturvekst, +forsvar i bykamp |
| Helligdom (Bevareren) | reserve-påfyll / velsignelse |
| Utkikkspost | avslør kart / scouting |

### 5.8 Riften (vinnvilkår + tempo-klokke)

Erstatter HoMM3s «drep alle helter» med noe heroisk, på-tema og *avgrenset*.

- Riften har et **trykk** som stiger hver dag.
- Ved terskler spytter den ut **askedjevel-stacks** som roamer mot deg/byen din.
- For å vinne: nå riften og **lukk** den (hard klimaks-kamp). Lukking kan kreve et nøkkel-item eller heltenivå.
- Taper du: byen faller, eller trykket overvelder (mister du alt → run slutt).

Trykk-klokka er den sentrale tempo-motoren: den tvinger fram framdrift og gir ekte stakes. Alle terskler/tall er tunbare i `data/`.

### 5.9 Helteprogresjon i en run + perks

Helten levler av kamp og oppdrag. Per nivå: +1 stat-poeng (fordel på Angrep/Forsvar/Malmkraft), av og til et nytt metall eller en perk, +reserve-tak. **Nullstilles hver run** — det persistente ligger i meta (§5.10).

Perks (~6, erstatter HoMM3s 28 sekundærferdigheter):

| Perk | Effekt |
|---|---|
| Logistikk | +bevegelse på kartet |
| Rustning | −skade tatt / +Forsvar |
| Malmkjenner | billigere brann / +reserve |
| Taktikk | bedre startposisjon / initiativ i kamp |
| Lederskap | +kreaturvekst |
| Skattejeger | +loot |

### 5.10 Roguelite-meta (Malmminne, ekko, ascension, blodmalm)

**Diegetisk motor:** Malmminne-kunsten *er* meta-progresjonen. Det du rakk å lagre i malmminner følger deg mellom runs.

- **Valuta:** *ekko i malm*, tjent per run (skalert av framdrift + ascension-nivå).
- **Unlock-bøtter (horisontale, ikke rå styrke):**
  - nye startmetaller
  - nye boliger inn i kart-poolen
  - nye helteperks/klasser
  - nye biomer / rift-typer
  - artefakter inn i poolen
  - nye loadout-slots
- **Ascension-stige («Tærerens trapp»):** vanskelighetsnivåer som skrur opp fiende-styrke og rift-trykk for bedre belønning. Holder utfordringen oppe når spilleren har låst opp mye.
- **Blodmalm (mørk variant):** permanent unlock — behold en falt fiendes metallkraft inn i neste run, men bær et **korrupsjonsarr** (vedvarende debuff/fristelse fra Tæreren som følger deg på tvers av runs). Ekte risiko/belønning, rett på tema.
- En run = velg helteklasse + en loadout satt sammen av opplåste malmminner.

---

## 6. Teknisk arkitektur (Godot)

### 6.1 Prinsipper (de som hindrer fikling)

1. **Ren kjerne, skilt fra presentasjon.** All spill-logikk (kamp, skade, AI, pathfinding, økonomi, progresjon) lever i `core/` som rene `RefCounted`-klasser *uten* node-/scene-avhengigheter. Scenene *rendrer* kjerne-tilstand og sender spiller-intensjoner tilbake. Dette er den viktigste avgjørelsen: kjernen kan kjøres og testes **headless**, så Claude Code kan verifisere matematikken uten å «trykke play».
2. **Data-drevet innhold.** Kreaturer, metaller, bygg, kartobjekter, artefakter er `Resource`-filer (`.tres`). Å legge til en kreatur = en ny `.tres`, ingen kodeendring.
3. **Autoloads + EventBus.** Tverrgående tilstand i singletons; systemer snakker sammen via signaler på en `EventBus`, ikke direkte referanser. Løs kobling = trygt å endre.
4. **Frøsatt determinisme.** All tilfeldighet går gjennom én `RNG`-autoload med seed per run. Gir reproduserbare runs, lettere debugging og (senere) daglige seeds.
5. **Statisk typing overalt.** Alltid `: Type`-annotasjoner. Kutter agent-feil kraftig (GDScripts dynamiske typing er den vanligste kilden til MCP-kall som feiler) og fanger bugs ved compile.

### 6.2 Mappestruktur

```
res://
├── project.godot
├── CLAUDE.md                     # §7.2 — limt inn her
├── docs/
│   ├── design-bible.md           # §1–5
│   ├── combat-spec.md            # §5.2 (fasit-formler)
│   └── roadmap.md                # §8
├── core/                         # REN logikk — ingen noder, full test-dekning
│   ├── combat/
│   │   ├── hex_grid.gd
│   │   ├── combat_state.gd
│   │   ├── stack_state.gd
│   │   ├── damage.gd             # kanonisk skadeformel
│   │   ├── casualties.gd
│   │   ├── turn_order.gd
│   │   └── combat_ai.gd
│   ├── map/
│   │   ├── map_state.gd
│   │   └── pathfinding.gd
│   ├── economy/economy.gd
│   ├── progression/
│   │   ├── run_state.gd          # nullstilles per run
│   │   └── meta_state.gd         # persistent
│   └── rng.gd                    # SeededRng-wrapper
├── data/                         # innhold som .tres
│   ├── schemas/                  # Resource-klassedefs (creature_data.gd …)
│   ├── creatures/  metals/  buildings/  map_objects/  artifacts/  hero_classes/
├── autoload/                     # singletons (Project > Autoload)
│   ├── event_bus.gd
│   ├── game_state.gd             # aktiv run
│   ├── meta_progression.gd       # på tvers av runs
│   ├── save_manager.gd
│   └── audio_manager.gd
├── scenes/                       # presentasjon — rendrer core-tilstand
│   ├── main.tscn
│   ├── main_menu/  adventure_map/  town/  combat/  run_summary/
├── ui/                           # gjenbrukbare komponenter + theme
├── assets/                       # kunst, lyd, fonter
├── tests/                        # GUT/GdUnit-tester for core/
└── addons/                       # godot-ai (MCP) · GUT · GodotPrompter
```

### 6.3 Data som Resources — schema-eksempel

```gdscript
# data/schemas/creature_data.gd
class_name CreatureData
extends Resource

@export var id: StringName
@export var display_name: String          # norsk, spillervendt: "Spydmann"
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
@export var growth: int = 0                # ukentlig vekst
@export var cost_gold: int = 0
@export var cost_malm: int = 0
```

Hver kreatur blir én `.tres` i `data/creatures/`. Samme mønster for `MetalData`, `BuildingData`, `MapObjectData`, `ArtifactData`, `HeroClassData`. En `ContentRegistry`-autoload laster og validerer alle ved oppstart.

### 6.4 Ren kjerne + test (eksempel)

```gdscript
# core/combat/damage.gd
class_name Damage
extends RefCounted

# KANONISK — endres aldri uten å oppdatere combat-spec.md OG gulltestene.
static func compute(attacker: StackState, defender: StackState,
        forced_melee: bool, rng: SeededRng) -> int:
    var cd: CreatureData = attacker.data
    var raw: int = attacker.count * rng.randi_range(cd.dmg_min, cd.dmg_max)
    var def_eff: float = defender.effective_defense()
    if defender.is_defending:
        def_eff *= 1.3
    var diff: float = attacker.effective_attack() - def_eff
    var mult: float = (minf(3.0, 1.0 + 0.05 * diff) if diff > 0.0
                       else maxf(0.3, 1.0 + 0.025 * diff))
    var dmg: int = int(floor(raw * mult))
    if cd.is_ranged and forced_melee:
        dmg = int(floor(dmg * 0.5))
    return maxi(1, dmg)
```

```gdscript
# tests/test_damage.gd  (GUT)
extends GutTest

func test_high_attack_caps_at_300_percent() -> void:
    # diff = +60 → mult skal kappes til 3.0
    var rng := SeededRng.new(1)
    var atk := _stack("drage", 1)   # høy effective_attack
    var dfn := _stack("spyd", 10)
    var dmg := Damage.compute(atk, dfn, false, rng)
    assert_true(dmg >= 1)
    # gullverdi-assert mot håndregnet fasit her
```

Kjøres headless: `godot --headless --path . -s addons/gut/gut_cmdln.gd`. Dette lukker «agenten kan ikke trykke play»-gapet for den delen som betyr mest — matematikken.

### 6.5 Lagring (to filer)

- **Meta-save** (persistent): opplåste malmminner, ekko-saldo, ascension-nivå, statistikk. Skrives når en run avsluttes.
- **Run-save** (gjenopptakbar): aktiv run-tilstand, autolagres hver dag/tur. Slettes når run er ferdig.

Bruk `Resource` + `ResourceSaver`/`load`, eller JSON via `save_manager.gd`. Versjonsfelt i begge fra dag én (sparer deg migrerings-smerte senere).

### 6.6 Navnekonvensjoner

- Kode (klasser/filer/variabler): **engelsk**, `snake_case` filer, `PascalCase` `class_name`.
- Innholdsverdier + spillervendt tekst: **norsk** (`display_name`, metallnavn). Spillervendt tekst gjennom et i18n-vennlig lag fra start, så lokalisering ikke krever refaktor.
- Domeneenums kan være norske verdier: `enum Skåarmakt { BEVAREREN, TÆREREN }` — men hold *koden* rundt dem engelsk.

---

## 7. Agentisk arbeidsflyt (MCP + skills + CLAUDE.md)

### 7.1 Oppsett (Fedora)

1. **Godot 4.6.x stable** — last ned editor (standard, ikke Mono, med mindre du vil ha C#). Kjør native på Fedora.
2. **Godot-MCP** — installer `godot-ai`/GDAI som addon i `addons/`, aktiver i *Project Settings > Plugins*, og ett-klikks-konfigurer Claude Code fra docken. Gir Claude Code tilgang til scenetre, noder, scripts, *kjøre prosjektet, lese debugger-feil og ta skjermbilder*.
3. **GodotPrompter-skills** — `claude plugins marketplace add jame581/skillsmith` så `claude plugins install godot-prompter@skillsmith`. 51 Godot-skills (GDScript-mønstre, arkitektur, mobil-shipping). Rett i gata di siden du bygger skills selv.
4. **GUT** (eller GdUnit4) — testrammeverk i `addons/`, for `tests/`.
5. Init git. Lim `CLAUDE.md` i rot.

### 7.2 CLAUDE.md (lim inn i repo-rot)

```markdown
# Aske og Malm — agentkontrakt

Roguelite turbasert taktikk (HoMM3-arv) i Godot 4.6, GDScript statisk typet.
Full design: docs/design-bible.md. Kampfasit: docs/combat-spec.md. Veikart: docs/roadmap.md.

## Arkitektur (ikke bryt disse)
- core/ er REN logikk: ingen noder, ingen scene-avhengigheter. Må kunne kjøres headless.
- Presentasjon (scenes/) rendrer core-tilstand og sender intensjoner tilbake. Ingen
  spill-logikk i scene-scripts som hører hjemme i core/.
- Alt innhold er .tres i data/. Ny kreatur/metall/bygg = ny .tres, ikke ny kode.
- All tilfeldighet via RNG-autoload (frøsatt). Aldri randi()/randf() direkte.
- Systemer kommuniserer via EventBus-signaler, ikke direkte node-referanser.
- Statisk typing ALLTID. Hver var, param og returverdi annoteres.

## Fasit (endres aldri uten å oppdatere både doc og gulltester)
- Skadeformel, tap-modell, motangrep, skytter-/flyger-regler: se docs/combat-spec.md.
- effective_attack = creature.attack + hero.angrep; tilsvarende for forsvar.
- Stats: Angrep, Forsvar, Malmkraft. Ressurser: Gull, Malm, Gudemalm.

## Navn
- Kode engelsk (PascalCase class_name, snake_case filer). Lore/innhold/UI norsk.

## Definition of done
- Endrer du core/: kjør testene (godot --headless … gut_cmdln.gd) — alle grønne.
- Ny mekanikk i core/ kommer med tester. Gulltester for kamp er ukrenkelige.
- Ingen utypede variabler. Ingen logikk lekket fra core/ til scenes/.

## Ikke-mål for v1
Flere helter, beleiring, krigsmaskiner, multiplayer, 3D, flere byfraksjoner,
d20-TTRPG-reglene. Foreslå dem ikke for v1.
```

### 7.3 Arbeidsrytme

- **Test-drevet kjerne:** ny logikk i `core/` skrives mot en test. Agenten kan verifisere seg selv headless.
- **Editor for det visuelle:** scene-oppsett, noder, animasjon gjør du (med agent som co-pilot via MCP). Det er her din rolle er størst.
- **Små vertikale skiver:** alltid et spillbart resultat per fase (§8), aldri «bygg alt så test til slutt».

---

## 8. Veikart (vertikale skiver — hver fase ender spillbart)

| Fase | Mål | Ferdig når … |
|---|---|---|
| **0 — Fundament** | prosjektskjelett, autoloads, EventBus, RNG, Resource-schemas, ContentRegistry, testharness, MCP+skills, CLAUDE.md | spillet booter til hovedmeny, testene kjører grønt |
| **1 — Kampskjelett** | port prototypens matte til `core/combat` med full test; `combat/`-scene (hex-render, touch, initiativkø, logg) drevet av core | du spiller en håndsatt kamp på telefonen; matte matcher gulltester |
| **2 — Eventyrkart** | `core/map` + pathfinding; `adventure_map/`-scene; helt-bevegelse, tåke, 2–3 objekttyper; «gå inn i fiende → kamp → tilbake med resultat» | flytt → kjemp → tilbake-loopen funker |
| **3 — By & økonomi** | `town/`-scene, ~6–8 bygg, Gull/Malm-økonomi, verving, Malmkollegiet lærer metaller | bygg by, verv, voks hæren mellom kamper |
| **4 — Riften & run-loopen** | rift-objekt + trykk-klokke + askedjevel-spawns; vinn/tap; `run_summary/` | en hel avgrenset run start→lukk-rift på ~30 min |
| **5 — Roguelite-meta** | ekko-valuta, Malmminne-unlock-butikk, ascension-stige, blodmalm-opsjon, persistent meta-save | runs mater meta; unlocks endrer neste run |
| **6 — Innhold & dybde** | fyll 7-tier-rosteret, fullt metallsett, flere objekter/biomer/rift-typer, artefakter, balansepass via tester | spillet har variasjon og rejátszhatóság |
| **7 — Mobil & lansering** | portrett-UX-polish, touch, Android-eksport (Linux), iOS via sky-bygg, butikk-assets, 4.2-compliance | byggbar .aab/.ipa, klar for TestFlight/Play |

Rekkefølgen er ikke tilfeldig: fase 1 beviser den vanskeligste biten (kampen) tidlig, og hver påfølgende fase legger ett lag på en sløyfe som allerede henger sammen.

---

## 9. Første økt i Claude Code (kickoff)

Unngå blank-side-start. Åpne repoet og gi Claude Code omtrent dette:

> «Les `CLAUDE.md` og `docs/`. Sett opp **Fase 0**: prosjektstruktur fra design-bibelen §6.2, autoloads (`event_bus`, `game_state`, `meta_progression`, `save_manager`, `audio_manager`), `core/rng.gd` (frøsatt wrapper), Resource-schemas i `data/schemas/` for `CreatureData` og `MetalData`, en `ContentRegistry`-autoload som laster `data/`, og GUT-oppsett med én røyktest. Statisk typing overalt. Ikke skriv spill-logikk ennå — bare fundamentet, og bekreft at testene kjører headless.»

Når Fase 0 står grønt, neste melding: «Fase 1 — port skadeformelen og tap-modellen fra `docs/combat-spec.md` til `core/combat/`, med gulltester mot disse håndregnede verdiene: [lim inn 3–4 eksempler].»

---

## 10. Mobil & lansering (kort)

- **Android først:** bygg `.aab` rett på Fedora. Google Play: $25 én gang.
- **iOS:** Apples verktøykjede kjører bare på macOS → sky-bygg (Codemagic / Expo EAS / Xcode Cloud). Apple Developer Program $99/år. Du utvikler på Linux, bygger og signerer i skyen.
- **Review-felle:** Apples «minimum functionality» (4.2) avviser tynne web-skall — ikke et problem her, dette er et ekte native Godot-spill.
- GodotPrompters `mobile-development`-skill dekker iOS/Android-eksport, livssyklus og IAP når du kommer dit.

---

*Dette dokumentet er fasit. Er noe uklart eller selvmotsigende: løs det i dokumentet først, så i koden. Lykke til — aske og malm.*
