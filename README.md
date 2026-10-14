# Nøkkelvokteren

Mobilvennlig RPG-læringsspill for NAT4010 (Naturfag 1: Energi, stoffer og praksiser).
Bekjemp Misforståelsene med påstand, evidens og begrunnelse, klatre på begrepsstigen
og restaurer de åtte nøkkelarkene.

- **Spill:** `dist/index.html` (én selvstendig fil) — også publisert som artifact.
- **Design:** `docs/DESIGN.md` · **Modulkontrakt:** `docs/CONTRACT.md` · **Fiender:** `docs/ROSTER.md` · **Fagstoff:** `docs/fagstoff/`

## Innhold
8 regioner · 750 spørsmål (6 typer, begrepsstigens nivå 1–5) · 228 begrepskort · 64 fiender ·
51 hendelser · 34 Orakel-oppgaver · 16 mini-spill · eksamenstrening mot deleksamen 1–5.

## Utvikling
```
node tools/validate.mjs     # valider innhold
node tools/lengthbias.mjs   # sjekk at riktig svar ikke avsløres av lengde
node tools/build.mjs        # bygg dist/
node tools/playtest.mjs /tmp/pt --smart --region=energi   # automatisk gjennomspilling på mobilbredde
```
