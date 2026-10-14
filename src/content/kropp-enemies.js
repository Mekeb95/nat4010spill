/* Kroppsbyen — Misforståelsene (id-er låst i docs/ROSTER.md). */
(function () {
  'use strict';
  NG.content.addEnemies([
    {
      id: 'antibiotika-alven', name: 'Antibiotika-alven', region: 'kropp', tier: 'normal',
      myth: 'myte.kropp-antibiotika-virus', hp: 30, atk: 6,
      intro: 'En liten alv med pilleboks-vinger summer rundt apoteket og strør tabletter over alle som nyser.',
      taunts: [
        'Snørrete? Her, ta en kur! Det hjelper mot alt som er lite og ekkelt.',
        'Virus, bakterier – smått er smått. Pang, pang!',
        'Jeg sluttet kuren etter to dager. Følte meg bra. Resten sparer jeg til neste forkjølelse!',
        'Resistens? Det er noe bakteriene sier for å skremme oss.',
      ],
      defeat: 'Alven går tom for piller – og forkjølelsen går over av seg selv etter en uke, som den alltid gjør. Antibiotika angriper bakteriers cellevegg og maskineri; virus har ikke det. Unødvendig bruk avler resistente bakterier.',
      topics: ['Immunforsvar og vaksiner'],
    },
    {
      id: 'detoxdragen', name: 'Detox-dragen', region: 'kropp', tier: 'normal',
      myth: 'myte.kropp-detox', hp: 32, atk: 6,
      intro: 'En grønn drage med sugerør i snuten slurper selleri-juice og puster ut dufter av «rensende» urter.',
      taunts: [
        'Tarmene dine er fulle av slagg! Tre dager juice, så er du ren!',
        'Leveren? Den er sliten. Hjelp den med min spesielle te – kun 899 kr.',
        'Se så brun fotbadet ble! Det er giftstoffene som kommer ut gjennom føttene!',
        'Kroppen er en søppelbøtte som må tømmes en gang i måneden.',
      ],
      defeat: 'Dragen hikster og innrømmer at fotbadet ble brunt fordi elektrodene ruster. Lever og nyrer bryter ned og skiller ut avfallsstoffer hele tiden. «Slagg» er ikke et medisinsk begrep, og detox-kurer har ingen dokumentert renseeffekt.',
      topics: ['Helse og kildekritikk', 'Organsystemer'],
    },
    {
      id: 'genfatalisten', name: 'Genfatalisten', region: 'kropp', tier: 'normal',
      myth: 'myte.kropp-genfatalisme', hp: 32, atk: 7,
      intro: 'En figur i DNA-stripet dress ligger i sofaen og spiser chips. «Hvorfor trene? Alt står jo skrevet i genene mine.»',
      taunts: [
        'Mormor hadde diabetes, så jeg får det uansett. Pass chipsen.',
        'Eneggede tvillinger er helt like i alt. Gener er skjebne!',
        'Miljø? Oppvekst? Kosthold? Ord, bare ord.',
        'Jeg har genet for dårlig kondis. Det er vitenskap.',
      ],
      defeat: 'Genfatalisten reiser seg fra sofaen og går en tur. Gener gir anlegg og risiko, men miljø og livsstil avgjør mye av hvordan genene kommer til uttrykk. Eneggede tvillinger med likt DNA kan få ulik helse.',
      topics: ['DNA og gener'],
    },
    {
      id: 'blodblaen', name: 'Blodblåen', region: 'kropp', tier: 'normal',
      myth: 'myte.kropp-blatt-blod', hp: 28, atk: 6,
      intro: 'En dryppende blå skapning klatrer opp av en vene i en lærebokillustrasjon. «Se! Jeg er det ekte blodet!»',
      taunts: [
        'Se på håndleddet ditt. Blått! Saken er avgjort.',
        'Jeg blir rød i det øyeblikket du stikker hull. Magi!',
        'Alle tegninger viser blå årer. Tegninger lyver aldri.',
        'Oksygenfattig blod er himmelblått. Det vet hver kongelig.',
      ],
      defeat: 'Blodblåen tørker inn til en mørkerød flekk. Blod er alltid rødt – lyst rødt med mye oksygen, mørkt rødt med lite. Venene ser blå ut fordi huden slipper gjennom og sprer lys med ulike farger forskjellig. Blått i tegninger er bare en fargekode.',
      topics: ['Respirasjon og sirkulasjon'],
    },
    {
      id: 'tiprosenten', name: 'Tiprosenten', region: 'kropp', tier: 'normal',
      myth: 'myte.kropp-ti-prosent-hjernen', hp: 30, atk: 7,
      intro: 'En hjerne med 90 % av seg selv dekket av «LEDIG»-skilt vagler fram på små ben. «Kjøp mitt kurs, og lås opp resten!»',
      taunts: [
        'Ni tideler av hjernen din sover. Tenk hva du kunne fått til!',
        'Einstein brukte 11 %. Derfor ble han geni.',
        'Hjerneskanning? Den viser bare de 10 prosentene som er på.',
        'Superkrefter, telepati – alt ligger i de ubrukte 90 %.',
      ],
      defeat: 'Alle «LEDIG»-skiltene lyser opp samtidig. Hjerneskanning viser at hele hjernen er i bruk i løpet av et døgn, og skade på selv små områder gir tydelige utfall. Hjernen bruker ca. 20 % av kroppens energi – et så dyrt organ ville ikke vært bevart om det meste var ubrukt.',
      topics: ['Nervesystemet'],
    },
    {
      id: 'ryktespreder', name: 'Ryktesprederen', region: 'kropp', tier: 'elite',
      myth: 'myte.kropp-vaksinemyter', hp: 60, atk: 9,
      intro: 'En skikkelse med hundre munner hvisker fra hvert gatehjørne i Kroppsbyen. Ryktene sprer seg raskere enn noe virus.',
      taunts: [
        'Meslinger? Det har ingen hatt på årevis. Hvorfor vaksinere?',
        'Naturlig immunitet er alltid best. Bare bli syk, du!',
        'Jeg hørte at vaksinen gjør deg magnetisk.',
        'Vaksinerer DU deg, er det din sak. Det angår ikke andre.',
        'Fetteren til naboen ble syk dagen etter vaksinen. Mer bevis trenger jeg ikke.',
      ],
      defeat: 'Munnene stilner én etter én. Sykdommene er sjeldne *fordi* nesten alle er vaksinert. Når dekningen synker, kommer de tilbake – slik meslingene har gjort i flere land. Høy dekning gir flokkimmunitet som beskytter spedbarn og syke som ikke kan vaksineres.',
      topics: ['Immunforsvar og vaksiner'],
    },
    {
      id: 'kildeforfalskeren', name: 'Kildeforfalskeren', region: 'kropp', tier: 'elite',
      myth: 'myte.kropp-anekdote-evidens', hp: 64, atk: 10,
      intro: 'En slesk skikkelse med en koffert full av «studier» med fete overskrifter og ingen forfatternavn. Hver gang du ser på en, endrer tallene seg.',
      taunts: [
        'Tante Grete ble kvitt hodepinen med magnetarmbånd. Case closed!',
        'Folk som drikker rødvin, lever lenger. Altså gjør rødvin deg udødelig!',
        'Studien min hadde fire deltakere og ingen kontrollgruppe. Fire av fire ble bedre!',
        'Legene vil ikke at du skal vite dette …',
        'Det står på internett. Med STORE bokstaver.',
      ],
      defeat: 'Kofferten spretter opp, og «studiene» viser seg å være reklame. En anekdote kan ikke skille virkning fra tilfeldigheter, placebo eller naturlig bedring. Korrelasjon er ikke årsak. God evidens kommer fra kontrollerte, gjerne blindede studier – og fra kilder uten penger i potten.',
      topics: ['Helse og kildekritikk'],
    },
    {
      id: 'kvakksalveren', name: 'Kvakksalveren', region: 'kropp', tier: 'boss',
      myth: 'myte.kropp-naturlig-trygt', hp: 145, atk: 13,
      intro: 'På torget i Kroppsbyen står en vogn full av flasker, krystaller og pulvere. Kvakksalveren slår ut med armene: «Mine mirakelkurer helbreder ALT – og de er 100 % naturlige!»',
      taunts: [
        'Naturlig betyr trygt! Revebjelle er da også naturlig … ehm, glem det.',
        'Dobbeltblind studie? Jeg ser da med egne øyne at det virker!',
        'Kunder er fornøyde! Les vitnesbyrdene!',
        'Kroppen er full av slagg, og bare MIN kur kan rense den.',
        'Antibiotika, vaksiner, piller fra apoteket – alt er kjemikalier. Mine dråper er bare … energi.',
      ],
      phases: [
        { at: 0.66, text: 'Kvakksalveren tar fram en bunke vitnesbyrd. «Hundre fornøyde kunder kan ikke ta feil!» Nå må du skille anekdoter fra evidens.' },
        { at: 0.33, text: 'Kvakksalveren veiver med en «studie» uten kontrollgruppe. Han blander korrelasjon og årsak – og skylder på «skolemedisinen».' },
      ],
      defeat: 'Vogna velter, og flaskene viser seg å inneholde sukkervann. «Naturlig» sier ingenting om virkning eller sikkerhet. En helsepåstand trenger evidens: kontrollgruppe, mange deltakere, blinding – og en kilde uten egeninteresse. Placebo og naturlig bedring forklarer mye av det kundene opplevde.',
      topics: ['Helse og kildekritikk', 'Immunforsvar og vaksiner'],
    },
  ]);
})();
