> Utdrag av aske-og-malm-plan.md §1–5. Full plan (inkl. §6 arkitektur, §9 kickoff): docs/aske-og-malm-plan.md

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

