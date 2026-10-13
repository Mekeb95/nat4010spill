# Nøkkelvokteren — spilldesign

Mobilvennlig RPG-læringsspill i naturfag for NAT4010 (lærerutdanning, 5.–10.).
Én spiller: studenten. Mål: morsomt, RPG-progresjon, og faktisk læring (forklaring,
anvendelse og overføring — ikke bare gjenkjenning).

## Premiss
Naturfagsenterets seks nøkkelark er revet i filler av **Misforståelsene** — vesener
som lever av hverdagsforestillinger («kulde kryper inn», «planter puster ikke»,
«energi blir brukt opp»). Du er **Lærlingen**, en lærerstudent som skal bli
**Nøkkelvokter**. Du reiser gjennom åtte regioner, bekjemper Misforståelsene med
argumenter (påstand → evidens → begrunnelse), samler **begrepskort** og setter
nøkkelarkene sammen igjen.

## Regioner (id → navn → fagstoff)
| id | Navn | Fagstoff | Boss (misforståelse) |
|---|---|---|---|
| `energi` | Energidalen | energiformer, overføring/omdanning, arbeid, effekt, kWh, virkningsgrad, Ep/Ek, termofysikk, 1. og 2. lov, energikvalitet, energikjeder, E=mc² | **Evighetsmaskinen** |
| `stoffer` | Stoffgruvene | rene stoffer/blandinger, grunnstoff/forbindelse, atom, periodesystem, isotoper, bindinger, faser, partikkelmodellen, reaksjoner, balansering, massebevaring, kjemiens tre nivåer | **Alkymisten** («massen forsvinner når noe brenner») |
| `liv` | Livsskogen | celle, fotosyntese, celleånding, netto gassutveksling, næringskjeder (90 % tap), karbonkretsløp, nedbrytning (k, S, Tea Bag Index), evolusjon, naturmangfold, bærekraft | **Pustetrollet** («planter puster ikke / planter lager energi») |
| `jorda` | Himmelfjellet | big bang, solsystem, årstider, døgn, flo/fjære, platetektonikk, geologisk kretsløp, atmosfære, drivhuseffekt, klima/vær | **Årstidsdragen** («sommer fordi jorda er nærmere sola») |
| `kropp` | Kroppsbyen | celler/vev/organer, organsystemer, DNA/gener, immunforsvar, vaksiner, helse, kildekritikk | **Kvakksalveren** |
| `teknologi` | Verkstedet | design, kravspesifikasjon, prototyp, system, styring/kontroll, programmering for å utforske fenomener (sekvens, løkke, variabel, betingelse, simulering) | **Buggen** |
| `praksis` | Utforskertårnet | utforskingsmodellen, undersøkbare spørsmål/hypoteser, variabelkontroll, observasjon vs. slutning, påstand–evidens–begrunnelse, NOS/FRA, modeller (av/for, styrker/begrensninger), 5E, HMS/risikovurdering | **Dogmatikeren** («det finnes én vitenskapelig metode») |
| `didaktikk` | Akademiet | ord vs. begrep, begrepsstigen, nøkkelbegreper, ordkort/begrepsvegg/bindeord, elevforestillinger (Henriksen & Angell), grubletegninger, læringsmål som kan vurderes, vurdering, Hva?–Hva så?–Hva nå? | **Hverdagsspråket** (finale) |

Rekkefølge på kartet: Energidalen og Stoffgruvene åpne fra start; resten låses opp
ved å slå bossen i en tilgrensende region (se `src/core/data-regions.js`).
Finalen (Akademiet) krever 5 bosser.

## Kjerneløkke
1. **Kart** → velg region → **sti** av 6–8 noder (generert med frøsatt RNG per besøk).
2. Nodetyper: ⚔ Kamp, ★ Elite, 🧪 Mini-spill (lab), ✉ Hendelse (valg med fagbegrunnelse),
   ☀ Solgløtt (hvile: fyll energi + repetisjon), 🎁 Kiste, ☠ Boss.
3. **Kamp** (turbasert): hver tur velger du handling. Angrep = svar på et spørsmål fra
   regionens pott. Riktig → skade (skalert av Forståelse, combo og kortnivå). Feil →
   Misforståelsen slår, og du **får alltid forklaringen** (læringen skjer her).
4. Belønning: XP, joule (valuta), gjenstander, begrepskort-progresjon.

## Energiregnskapet (spillmekanikk som lærer 1. og 2. lov)
Spilleren har **Energi (J)** som brukes på evner. Brukt energi forsvinner ikke — den
blir **Spillvarme** (lavverdig), vist i samme måler. Sum Energi + Spillvarme er
konstant gjennom kampen («energien er bevart, kvaliteten synker»). Spillvarme kan
ikke brukes direkte. **Solgløtt** fyller opp (kilden er sola). Gjenstanden
**Varmepumpe** løfter noe spillvarme tilbake til energi, men koster litt energi.

## Begrepskort og begrepsstigen
Hvert nøkkelbegrep er et kort med nivå 0–5, som følger stigen fra pensum:
0 ukjent → 1 **Gjenkjenne** → 2 **Definere** → 3 **Nettverk** → 4 **Anvende** → 5 **Overføre**.
Spørsmål er merket med begrep og nivå. Riktig svar på et spørsmål med nivå ≥ kortets
nivå+1 (eller tre riktige på lavere nivå) løfter kortet. Kortene gir passive bonuser
(skade mot regionens fiender). Kortsamlingen (Begrepsveggen) er også et oppslagsverk.

## Repetisjon (spaced repetition)
Leitner-bokser per spørsmål (1, 2, 4, 8, 16 «dager» — måles i reelle dager).
Spørsmål du bommer på kommer tilbake som **Gjenferd** i senere kamper og på Solgløtt.
«Dagens repetisjon» i leiren gir bonus-XP.

## Statistikk
- **Forståelse** (skade), **Utholdenhet** (maks-HP), **Nysgjerrighet** (hint-ladninger + XP).
- Nivå opp: +1 poeng å fordele, full HP.

## Evner (koster energi → blir spillvarme)
- **Partikkelblikket** (10 J): fjerner to gale alternativ.
- **PEB-kombo** (25 J): tre spørsmål på rad; alle riktige → trippel skade.
- **Grubletegning** (15 J): avslører Misforståelsens neste angrep og gir skjold.
- **Varmepumpe** (gjenstand): 5 J inn, 15 J spillvarme tilbake til energi.

## Orakelet (valgfritt, krever `sample`)
På bosser og Solgløtt kan du skrive en forklaring med egne ord. Claude vurderer den mot
påstand–evidens–begrunnelse og gir tilbakemelding og bonus. Uten `sample` skjules funksjonen.

## Lagring
`localStorage` umiddelbart + `db`-kapabilitet (privat dokument per bruker) når
tilgjengelig, slik at fremgang følger brukeren mellom enheter. Nyeste tidsstempel vinner.

## Visuell identitet
Tavle-estetikk: skiferblå-grønn tavle, krittskrift for overskrifter, hyperlesbar
brødtekst, fargekritt per region. Kun mørkt tema (bevisst valg). Store berøringsflater
(min 44px), portrett, én hånd.
