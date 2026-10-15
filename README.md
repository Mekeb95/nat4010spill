# Nøkkelvokteren

Mobilvennlig RPG-læringsspill for NAT4010 (Naturfag 1: Energi, stoffer og praksiser).
Bekjemp Misforståelsene med påstand, evidens og begrunnelse, klatre på begrepsstigen
og restaurer de åtte nøkkelarkene.

- **Spill:** `node tools/build.mjs` lager `dist/index.html` (én selvstendig fil) og `dist/artifact.html`. `dist/` og `site/` ligger ikke i git – de bygges.
- **GitHub Pages + PWA:** byggingen lager også `site/` (manifest, service worker, ikoner og selvhostede skrifter — ingen kall til Google, virker offline og kan installeres på hjemskjermen). `.github/workflows/pages.yml` sjekker, bygger og publiserer `site/` ved push til `main`.
- **Sjekk på pull requests:** `.github/workflows/ci.yml` kjører validering, lengdeskjevhet, enhetstester, røyktest av alle mini-spill og automatisk gjennomspilling, og laster opp skjermbilder.
- **Design:** `docs/DESIGN.md` · **Modulkontrakt:** `docs/CONTRACT.md` · **Fiender:** `docs/ROSTER.md` · **Fagstoff:** (holdes utenfor repoet)

## Innhold
8 regioner · 789 spørsmål (6 typer, begrepsstigens nivå 1–5) · 228 begrepskort · 64 fiender ·
51 hendelser · 34 Orakel-oppgaver · 28 mini-spill (minst tre per region) · eksamenstrening mot deleksamen 1–5.

- **Begrepskort som lever:** kortene stiger på begrepsstigen ved gode svar, og synker ett trinn etter to feil på rad på eget nivå.
- **Misforståelsen bak:** ved feil svar vises elevforestillingen spørsmålet er laget for å avsløre, med forklaring.
- **Tilgjengelighet:** tilbakemeldinger og kamputfall leses opp av skjermlesere (aria-live).

- **Forgreinet ekspedisjonskart** (à la Slay the Spire): 8 rader + boss, stier som deler seg og møtes; Kamp, Elite, Laben, Hendelse, Kiste, Handelsmann og Solgløtt (fyll energi, velg så hvile/studere/trene).
- **Relikvier:** varige gjenstander (Materiallageret) + ekspedisjonsrelikvier — «Velg én av tre» etter elite/boss, kjøp hos Handelsmannen.
- **Evner med nivå 1–5:** mestring når du bruker dem godt; hvert nivå gir en ny effekt. Trykk «i» (eller hold inne) for forklaring.
- **Fiendens plan** (intensjoner) vises i kampen; eliter har modifikatorer.
- **Generativ musikk** per sted (av/på + volum i innstillingene), **skjerm alltid på** (Wake Lock), tilbakeknapp som virker i appen.
- Korte animasjoner (treff, rist, flyttall, overganger) som respekterer «redusert bevegelse».

## Utvikling
```
npm ci                      # playwright (bare for nettlesertestene)
npm run check               # validering + lengdeskjevhet + enhetstester + bygg (det samme som CI)
node tools/validate.mjs     # valider innhold
node tools/lengthbias.mjs   # sjekk at riktig svar ikke avsløres av lengde (feiler over grensen)
node --test tests/*.test.mjs   # enhetstester for kort, repetisjon, spørsmålsvalg, svarsjekk og lagring
node tools/build.mjs        # bygg dist/ og site/
node tools/mgsmoke.mjs [id …] --shots=/tmp/mg   # røyktest av mini-spill i mobilformat
node tools/playtest.mjs /tmp/pt --smart --region=energi   # automatisk gjennomspilling på mobilbredde
node tools/playtest.mjs /tmp/pt --smart --dev --region=liv --steps=450   # --dev: regionen låst opp
node tools/playtest.mjs /tmp/pt --smart --strict   # --strict: feiler ved konsollfeil eller overflow
```
