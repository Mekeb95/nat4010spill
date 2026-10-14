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
ved å slå bossen i en tilgrensende region (se `src/core/01-regions.js`).
Finalen (Akademiet) krever 5 bosser.

## Kjerneløkke
1. **Leirkart** → velg region → **ekspedisjonskart** (frøsatt per besøk): 8 rader + boss øverst,
   3–4 stier som deler seg og møtes (StS-stil, kryssfrie kanter). Du velger neste node langs en kant.
   Rad 0 er alltid kamp, rad 4 kiste, siste rad før bossen Solgløtt. Minst én Handelsmann.
2. Nodetyper: ⚔ Kamp, ★ Elite (fra rad 3–4), 🧪 Laben (mini-spill), ✉ Hendelse, 🎁 Kiste,
   🏪 Handelsmann (kjøp for joule), ☀ Solgløtt, ☠ Boss. Hver node gir belønning bare én gang
   (lagres på noden, så en lukket app ikke gir dobbel gevinst).
3. **Kamp** (turbasert): svar på et spørsmål fra regionens pott. Riktig → skade (Forståelse, rekke,
   kortnivå, relikvier). Feil → Misforståelsen slår, og du **får alltid forklaringen**.
   Fiendens **plan** (intensjon) vises: Lurer, Slag, Storslag, Mytekall, Forskanser seg, Energityv,
   Lader opp → Utlading. Eliter har modifikatorer (Seiglivet, Smittsom, Rask).
4. Belønning: XP, joule (valuta), gjenstander, begrepskort-progresjon. Elite/boss gir
   **«Velg én av tre»** ekspedisjonsrelikvier (valget overlever at appen lukkes — det vises på kartet).

### Solgløtt
Sola fyller **alltid** energien (spillvarmen stråles ut — energiregnskapet vises). Deretter velger
du **én** ting: *Hvil* (+40 % HP), *Studer* (3 repetisjonsspørsmål, bonus-XP), *Tren* (mestring på
svakeste evne) eller *Spør Orakelet* (når tilgjengelig).

### Relikvier
- **Varige** (Materiallageret, bossdrop): følger spilleren alltid.
- **Ekspedisjonsrelikvier** (`NG.RUN_RELICS`, sjeldenhet vanlig/sjelden/episk/boss): varer ut
  ekspedisjonen og forsvinner ved seier, død eller avbrudd. Kilder: «Velg én av tre» etter elite/boss
  og Handelsmannen. Hver har en faglig begrunnelse (Seebeck-effekten, katalysatorer, Leitner …).

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
Evnene har **mestringsnivå 1–5** som følger spilleren mellom ekspedisjoner. Mestring: +2 når du
bruker evnen og svarer riktig, +1 ved feil, og Solgløtt-trening. Hvert nivå gir en ny effekt
(f.eks. billigere, gratis første bruk, sterkere skjold). Detaljark med «naturfaget bak» via «i»/hold inne.
- **Partikkelblikket** (10 J): fjerner to gale alternativ.
- **Grubletegning** (15 J): avslører Misforståelsens neste trekk og gir skjold.
- **PEB-kombo** (25 J): tre riktige på rad (påstand → evidens → begrunnelse) gir et knusende argument.
- **Varmepumpe** (krever gjenstanden): løfter spillvarme tilbake til energi (opp til maks).
- **Modellbygging** (20 J, låses opp på nivå 6): neste riktige svar gir ekstra skade per kortnivå.
Energitilførsel går alltid via `NG.addEnergy` (overskudd blir spillvarme) og `NG.recoverHeat`.

## Orakelet (valgfritt, krever `sample`)
På bosser og Solgløtt kan du skrive en forklaring med egne ord. Claude vurderer den mot
påstand–evidens–begrunnelse og gir tilbakemelding og bonus. Uten `sample` skjules funksjonen.

## Lagring
`localStorage` umiddelbart + `db`-kapabilitet (privat dokument per bruker) når
tilgjengelig, slik at fremgang følger brukeren mellom enheter. Nyeste tidsstempel vinner.

## Visuell identitet
Tavle-estetikk: skiferblå-grønn tavle, krittskrift for overskrifter, hyperlesbar
brødtekst, fargekritt per region. Kun mørkt tema (bevisst valg). Store berøringsflater
(min 44px), portrett, én hånd. Tekst skal alltid få plass i boksen sin på 360–430 px
(norsk orddeling, `overflow-wrap: anywhere` på knapper/brikker, skriftstørrelse med `clamp`).

**Bevegelse** (`src/ui/motion.css`): korte transform/opacity-animasjoner, ≤ 0,4 s etter et trykk,
blokkerer aldri input — skjermovergang, treff (rist, rødt blink, flyttall, utbrudd ved kritisk),
spilleren truffet (HUD-rist, HP-blink, vignett), fiendens pust og oppløsning, HUD-søyler som glir
fra forrige verdi, nivå opp, evne opp, relikvie valgt, kiste, ny sti tegnes inn på kartet.
Alt slås av med `prefers-reduced-motion`. Toasts ligger øverst under HUD-en, maks 2 synlige,
og tar aldri imot trykk.
