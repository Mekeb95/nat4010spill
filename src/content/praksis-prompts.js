/* Utforskertårnet — Orakel-oppgaver (fritekst vurdert mot påstand–evidens–begrunnelse) */
(function () {
  'use strict';
  const R = 'praksis';
  NG.content.addPrompts([
    { id: 'praksis.or.1', region: R, concepts: ['pr-variabelkontroll', 'pr-pendelmodellen'],
      prompt: 'Forklar for en 8.-klassing hvordan dere kan finne ut om massen på kula påvirker svingetiden til en pendel – og hva dere vil finne.',
      rubric: 'Uavhengig variabel: masse. Avhengig: svingetid (10 svingninger delt på 10). Kontroll: lengde, utslag, tellemåte, samme tidtaker. Gjentak og gjennomsnitt. Forventet funn: ingen effekt, fordi større tyngdekraft oppveies av større treghet. Bonus: lengden målt til midten av kula.',
      model: 'Vi lar tråden være like lang og slipper kula fra samme vinkel hver gang – bare kula byttes. Vi tar tiden på 10 hele svingninger fem ganger og deler snittet på 10. Vi vil finne at svingetiden er den samme: den tunge kula trekkes hardere ned, men er også like mye tyngre å få i fart, så det jevner seg ut.' },
    { id: 'praksis.or.2', region: R, concepts: ['pr-utforskende-arbeid', 'pr-kokebokforsok'],
      prompt: 'Hvorfor er ikke alt praktisk arbeid utforskende? Gi et eksempel på hvordan du kan gjøre et oppskriftsforsøk utforskende.',
      rubric: 'Påstand: praktisk ≠ utforskende. Begrunnelse: utforsking krever at elevene arbeider med praksiser (spørsmål, planlegging, data som evidens, forklaring, formidling), ikke bare følger en oppskrift (hands-on vs minds-on). Eksempel med konkret omgjøring (f.eks. eget undersøkbart spørsmål og variabel). Gjerne nevne kognitiv belastning/grad av åpenhet.',
      model: 'Et oppskriftsforsøk lar elevene bruke hendene, men ikke nødvendigvis hodet: de følger trinn mot et kjent svar. Det blir utforskende når elevene selv må arbeide med et spørsmål og bruke data som evidens. Eddik-natron-forsøket blir utforskende med spørsmålet «Hvordan påvirker mengden natron gassmengden?», der elevene planlegger målingene og forklarer resultatet.' },
    { id: 'praksis.or.3', region: R, concepts: ['pr-modell', 'pr-gyldighetsomrade'],
      prompt: 'Velg en modell fra naturfaget (f.eks. partikkelmodellen eller skallmodellen). Drøft én styrke og én begrensning, og forklar hvordan du ville jobbet med dette i en 10.-klasse.',
      rubric: 'Modell som forenkling med formål. Konkret styrke og konkret begrensning (f.eks. tomrom/luft, bevegelse, elektronbaner). Didaktisk grep: sammenligne modeller, la elever lage egen modell, eksplisitt drøfting (kompetansemål 10. trinn om styrker og begrensninger). Gjerne skillet modell av/for eller pedagogisk modell.',
      model: 'Partikkelmodellen med kuler i en eske forklarer godt at gasser kan presses sammen, fordi det er stor avstand mellom partiklene. En begrensning er at elever tror det er luft mellom partiklene, og at et bilde ikke viser bevegelsen. Jeg ville latt elevene lage en animasjon eller et rollespill og deretter diskutere hva den nye modellen viser bedre – og hva den fortsatt skjuler.' },
    { id: 'praksis.or.4', region: R, concepts: ['pr-risikovurdering', 'pr-tiltakshierarki'],
      prompt: 'Lag en kort risikovurdering for et elevforsøk der saltsyre (1 mol/L) reagerer med magnesiumbånd, og forklar hvordan elevene kan delta.',
      rubric: 'Farer: etsende syre (sprut i øyne/hud), hydrogengass (brannfarlig), varme. Sannsynlighet × konsekvens. Tiltak i riktig rekkefølge: lav konsentrasjon/små mengder, god ventilasjon/ingen åpen flamme, rutiner, vernebriller. Beredskap: øyedusj, vann. Avfall. Elevmedvirkning: elevene leser etikett/datablad, foreslår tiltak (kompetansemålet).',
      model: 'Faren er sprut av etsende syre og at hydrogengassen kan antennes. Sannsynligheten for sprut er moderat, men konsekvensen for øynene er alvorlig. Vi bruker lav konsentrasjon og små mengder og holder åpen flamme borte. Vernebriller er påbudt, og øyedusjen sjekkes før start. Elevene finner faresetningene i databladet og foreslår tiltakene selv før jeg godkjenner planen.' },
    { id: 'praksis.or.5', region: R, concepts: ['pr-en-metode', 'pr-fra'],
      prompt: 'Dogmatikeren sier: «Det finnes én vitenskapelig metode.» Argumenter mot ham med Family Resemblance Approach og et eksempel.',
      rubric: 'Påstand: ingen enkelt metode. Evidens/eksempel: astronomi, geologi, evolusjonsbiologi eller klimamodellering arbeider uten kontrollerte eksperimenter. Begrunnelse: FRA – fagene deler trekk (mål, verdier, praksiser, metoder, kunnskap) som en familie, uten felles oppskrift. Gjerne: utforskingsmodellen er ikke lineær; det sosialt-institusjonelle systemet.',
      model: 'Geologer kan ikke spole tiden tilbake og gjøre forsøk med fjellkjeder. De rekonstruerer fortiden ut fra spor, men er like mye naturvitere som kjemikere. Ifølge Erduran og Dagher ligner fagene hverandre som en familie: de deler mål som å forklare og verdier som etterprøvbarhet, men har ingen felles oppskrift. Derfor er «én metode» en myte.' },
  ]);
})();
