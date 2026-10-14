/* Himmelfjellet — Orakel-oppgaver. */
(function () {
  'use strict';
  NG.content.addPrompts([
    { id: 'jorda.or.1', region: 'jorda', concepts: ['arstid', 'aksehelning'],
      prompt: 'Forklar for en 7.-klassing hvorfor det er varmere om sommeren enn om vinteren i Norge – og hvorfor avstanden til sola ikke er forklaringen.',
      rubric: 'Påstand: årstider skyldes aksehelningen (ca. 23,4°). Evidens: jorda er nærmest sola i januar; motsatte årstider på halvkulene; avstanden varierer bare ca. 3 %. Begrunnelse: høyere sol gir mer energi per m² (strålene spres mindre) og lengre dager. Gjerne modell (lommelykt/globus) og elevtilpasset språk.',
      model: 'Jordaksen står litt på skrå. Om sommeren heller vår del av jorda mot sola: sola står høyt på himmelen, og lyset treffer bakken bratt, så hver bit av bakken får mye energi – og dagene er lange. Om vinteren står sola lavt, lyset spres utover et stort område, og dagene er korte. Avstanden kan ikke være forklaringen: jorda er faktisk nærmest sola i januar, og når vi har vinter, har Australia sommer.' },
    { id: 'jorda.or.2', region: 'jorda', concepts: ['drivhuseffekt', 'drivhusgass', 'klimaendring'],
      prompt: 'Forklar forskjellen på den naturlige drivhuseffekten og den forsterkede drivhuseffekten. Hvorfor er den ene livsviktig og den andre et problem?',
      rubric: 'Påstand: naturlig drivhuseffekt gir ca. 15 °C i stedet for −19 °C; menneskeskapte utslipp forsterker den. Evidens: CO₂ fra ca. 280 til over 420 ppm; drivhusgasser tar opp infrarød stråling. Begrunnelse: sollys slipper inn, varmestråling holdes delvis tilbake; mer drivhusgass → mer tilbakeholdt → høyere likevektstemperatur. Skiller fra ozonhullet.',
      model: 'Sollyset går gjennom atmosfæren og varmer bakken. Bakken stråler ut varme (infrarød stråling), og gasser som vanndamp og CO₂ tar opp en del av den og sender noe tilbake. Uten denne naturlige drivhuseffekten ville jorda hatt ca. −19 °C i snitt i stedet for 15 °C. Når vi brenner fossilt brensel, øker CO₂ i lufta – fra ca. 280 til over 420 ppm – og mer varme holdes igjen. Det er den forsterkede drivhuseffekten som gir global oppvarming.' },
    { id: 'jorda.or.3', region: 'jorda', concepts: ['platetektonikk', 'platetektonikkteorien'],
      prompt: 'Hvilken evidens har vi for at kontinentene flytter seg, når ingen kan se det skje? Gi minst to typer evidens og forklar hvordan de støtter teorien.',
      rubric: 'Minst to: kystlinjer som passer; like fossiler/bergarter på ulike kontinenter; havbunnens alder og symmetriske magnetiske striper ved midthavsrygger; jordskjelv/vulkaner langs plategrenser; GPS-målinger (cm/år). Begrunnelse: kobler hver evidens til mekanismen (spredning, kollisjon) og tidsskalaen (cm/år × millioner år = tusenvis av km).',
      model: 'Kystene til Sør-Amerika og Afrika passer sammen, og de samme fossilene av landdyr finnes på begge sider av Atlanterhavet – de må ha vært samlet. Havbunnen er yngst ved Den midtatlantiske ryggen og blir eldre utover på begge sider, så ny skorpe dannes der og skyves fra hverandre. I dag kan vi også måle bevegelsen med GPS: ca. 2,5 cm i året. Over 200 millioner år blir det 5000 km.' },
  ]);
})();
