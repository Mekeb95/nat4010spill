# Kampfasit — combat-spec.md

> **Dette er låst.** Tallene og formlene her er kanoniske (§5.2 i design-bibelen).
> Endrer du noe her, oppdaterer du gulltestene i `tests/` i samme slengen — og
> omvendt. `core/combat/` skal implementere *nøyaktig* dette.

## Brett

- Hex-rutenett, **odd-r offset** (pointy-top).
- Portrett: fiende øverst, spiller nederst. **6 kolonner × 7 rader** som standard.
- Avstand måles via **cube-koordinater**.

## Turrekkefølge

- Hver runde sorteres levende stacks etter `speed` synkende.
- Uavgjort fart → **spillerside først**.
- Én handling per stack per runde.
- **Vent:** flytter handlingen bakerst i runden. Kan gjøres **én gang** per stack per runde.
- **Forsvar:** gir **+30 %** forsvar til neste tur og avslutter handlingen.

## Skadeformel (kanonisk)

```
raw      = stack.count * randi_range(creature.dmg_min, creature.dmg_max)
def_eff  = effective_defense(defender) * (1.3 hvis defender forsvarer ellers 1.0)
diff     = effective_attack(attacker) - def_eff
mult     = min(3.0, 1 + 0.05 * diff)     hvis diff > 0
         = max(0.3, 1 + 0.025 * diff)    hvis diff <= 0
dmg      = floor(raw * mult)
hvis skytter tvunget til nærkamp:  dmg = floor(dmg * 0.5)
dmg      = max(1, dmg)
```

der
- `effective_attack(stack)  = creature.attack  + hero.angrep`
- `effective_defense(stack) = creature.defense + hero.forsvar`

## Tap (casualty-modell)

```
total_hp   = (count - 1) * max_hp + top_hp
total_hp  -= dmg
hvis total_hp <= 0:
    hele stacken dør (drepte = count)
ellers:
    new_count = ceil(total_hp / max_hp)
    new_top   = total_hp - (new_count - 1) * max_hp
    drepte    = count - new_count
```

## Motangrep

- Kun ved **nærkamp**.
- Forsvareren slår tilbake **én gang per runde** hvis i live (Grif: to ganger).
- En ranged forsvarer som slår tilbake i nærkamp bruker **50 %-regelen**.

## Skyttere

- Skyter et hvilket som helst fiendtlig stack hvis de har skudd igjen og **ikke** er
  blokkert (ingen fiende i nabohex).
- Blokkert eller tom for skudd → nærkamp på **50 %** skade.
- Trekker **ett skudd** per skudd.

## Flygere

- Ignorerer opptatte hex under bevegelse.
- Rekkevidde = hex-avstand **≤ `speed`**.
- Landingshex må være tom.

## Malmkraft i kamp

- Helten kan brenne metall i stedet for å flytte/angripe-fokus: **én brann per egen
  runde** (som «én stav per tur» i HoMM3). Effektene per metall: design-bibelen §5.3.

---

## Gulltester (Fase 1)

Vi har ikke HTML-prototypen som §5.2 ble portert fra, så **referanse-rosteret og de
håndregnede gullverdiene rekonstrueres i Fase 1**: vi utleder et roster langs HoMM3-
kurven (Spydmann/Bueskytter/Grif/Sverdmann/Munk/Drage som form), regner ut fasit-
verdier for hånd fra formlene over, og fryser dem som gulltester. RNG i testene
frøsettes (`SeededRng`) slik at `randi_range`-trekkene er reproduserbare. Når
prototypen eventuelt dukker opp, sjekkes tallene mot den.
