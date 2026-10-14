/* Energidalen — misoppfatninger (Misforståelsene lever av disse).
   De ni første er elevforestillingene fra Henriksen & Angell (2019); andre agenter refererer til id-ene. */
(function () {
  'use strict';
  const HA = 'Henriksen & Angell 2019';
  NG.content.addMyths([
    {
      id: 'myte.energi-bare-levende',
      text: 'Energi finnes bare i levende ting – mennesker og dyr «har energi», en stein eller et batteri har det ikke.',
      fix: 'Energi er knyttet til alle fysiske systemer, levende og døde. En løftet stein har stillingsenergi, et batteri har kjemisk energi, varmt vann har indre energi. Hverdagsuttrykket «jeg har ingen energi i dag» handler om følelsen av overskudd, ikke om fysikkens energibegrep.',
      source: HA,
    },
    {
      id: 'myte.energi-krever-bevegelse',
      text: 'Bare ting som beveger seg, har energi. En stein som ligger stille på hylla, har ingen energi.',
      fix: 'Bevegelse er bare én energiform (kinetisk). Steinen på hylla har stillingsenergi (Eₚ = mgh) som blir bevegelsesenergi når den faller. Mat, batterier og en strukket strikk har også energi uten å bevege seg.',
      source: HA,
    },
    {
      id: 'myte.energi-er-kraft',
      text: 'Energi og kraft er det samme – «han har mye kraft» betyr at han har mye energi.',
      fix: 'Kraft er et dytt eller drag (newton) som virker i et øyeblikk mellom to ting. Energi (joule) er en størrelse som er bevart. Broen mellom dem er arbeid: energien endres når en kraft virker langs en strekning (W = F · s). Du kan dytte hardt i en vegg (stor kraft) uten å overføre energi til veggen.',
      source: HA,
    },
    {
      id: 'myte.bevaring-unodvendig',
      text: 'Energibevaring er en regel man lærer utenat, men man trenger den ikke for å forklare noe i hverdagen.',
      fix: 'Energibevaring er det kraftigste forklaringsverktøyet vi har: den lar oss føre regnskap («hvor ble det av alt?»), forutsi utfall (v = √(2gh)) og avsløre umulige maskiner. Uten den gir «energien ble brukt opp» seg selv som forklaring.',
      source: HA,
    },
    {
      id: 'myte.biologi-lager-energi',
      text: 'Biologiske prosesser lager energi – fotosyntesen lager energi, og celleåndingen produserer energi.',
      fix: 'Ingen prosess lager energi. Fotosyntesen omdanner strålingsenergi fra sola til kjemisk energi. Celleåndingen omdanner kjemisk energi i glukose + oksygen til andre former (ATP, bevegelse, kroppsvarme). Energien kommer et sted fra og går et sted hen.',
      source: HA,
    },
    {
      id: 'myte.energi-er-stoff',
      text: 'Energi er et slags stoff eller drivstoff som ligger lagret inni ting og kan helles over fra én ting til en annen.',
      fix: 'Energi er ikke et stoff; den har ingen masse du kan veie og ingen plass i rommet. Den er en tallstørrelse knyttet til tilstanden til et system (fart, stilling, bindinger). «Kjemisk energi i maten» hører til systemet mat + oksygen, ikke til maten alene.',
      source: HA,
    },
    {
      id: 'myte.metall-er-kaldt',
      text: 'Temperatur er en egenskap ved materialet: metall er kaldt, og tre og ull er varmt.',
      fix: 'Ting som har ligget lenge i samme rom, har samme temperatur (nulte lov). Metallet føles kaldere fordi det leder varme mye bedre: energi strømmer raskt fra hånda inn i metallet, og huden kjøles ned. Det er huden din du kjenner, ikke metallets temperatur.',
      source: HA,
    },
    {
      id: 'myte.varme-molekyler',
      text: 'Enkeltmolekyler kan være varme eller kalde – i varmt vann er molekylene varme.',
      fix: 'Temperatur er et gjennomsnitt av bevegelsesenergien til svært mange partikler. Ett enkelt molekyl har en fart og en bevegelsesenergi, men ikke en temperatur. I varmt vann beveger molekylene seg i gjennomsnitt raskere – de er ikke «varme».',
      source: HA,
    },
    {
      id: 'myte.kulde-overfores',
      text: 'Kulde strømmer fra kalde ting inn i varme ting – isbiten gir kulde til brusen, og kulda kryper inn gjennom vinduet.',
      fix: 'Det er alltid energi som overføres, og den går fra varmt til kaldt. Brusen blir kald fordi energi går fra brusen til isen. «Kulde» er ikke noe som finnes og kan flyttes – det er bare lav temperatur.',
      source: HA,
    },
    {
      id: 'myte.energi-brukes-opp',
      text: 'Energi brukes opp og forsvinner – når batteriet er flatt eller ballen ligger stille, er energien borte.',
      fix: 'Energi er bevart. Den omdannes til andre former og ender oftest som spredt termisk energi i omgivelsene. Det som «brukes opp», er energikvaliteten: spredt varme kan nesten ikke samles igjen til nyttig arbeid.',
      source: 'Fysikk for lærere kap. 4',
    },

    /* ---------- Egne myter fra pensum og artifaktene ---------- */
    {
      id: 'myte.kw-er-energi',
      text: 'Kilowatt og kilowattime er det samme, og kWh betyr «kilowatt per time».',
      fix: 'Kilowatt (kW) er effekt – hvor fort energi brukes. Kilowattime (kWh) er energi: effekt *ganger* tid. 1 kWh = 1000 J/s · 3600 s = 3,6 MJ. Watt er allerede en rate, så «watt per time» gir ingen mening her.',
      source: 'Watt ganger time (NAT4010)',
    },
    {
      id: 'myte.evighetsmaskin',
      text: 'Med smart nok konstruksjon kan en maskin gå for alltid, eller gi ut mer energi enn den får inn.',
      fix: '1. hovedsetning forbyr å få ut mer energi enn man putter inn. 2. hovedsetning forbyr at en maskin går evig på samme energi: i hver virkelig prosess blir litt energi spredt som varme med lav kvalitet, og den kan ikke samles fullt ut igjen til arbeid.',
      source: 'Fysikk for lærere kap. 4',
    },
    {
      id: 'myte.varme-er-stoff',
      text: 'Varme er noe en ting har eller inneholder – «det er mye varme i ovnen».',
      fix: 'Varme er en prosess: energi som *overføres* på grunn av temperaturforskjell. Det ovnen har, er indre energi. Å si at noe «har mye varme» er som å si at en innsjø «har mye regn».',
      source: 'Test deg selv (NAT4010)',
    },
    {
      id: 'myte.temperatur-er-varme',
      text: 'Temperatur og varme (eller indre energi) er det samme – høy temperatur betyr mye energi.',
      fix: 'Temperatur er *gjennomsnittlig* bevegelsesenergi per partikkel. Indre energi er *summen* for alle partiklene. Et badekar på 40 °C har ca. 250 ganger så mye indre energi som en kaffekopp på 95 °C.',
      source: 'Når temperaturen står stille (NAT4010)',
    },
    {
      id: 'myte.temperatur-stiger-jevnt',
      text: 'Når du varmer is jevnt, stiger temperaturen jevnt hele veien fra iskaldt til kokende – ellers forsvinner energien.',
      fix: 'Under smelting og koking står temperaturen stille. Energien går til å bryte bindinger mellom partiklene (bindingsenergi), ikke til å øke farten deres. Energien er lagret som indre energi, ikke borte.',
      source: 'Når temperaturen står stille (NAT4010)',
    },
    {
      id: 'myte.holde-er-arbeid',
      text: 'Å holde noe tungt i ro er fysisk arbeid fordi det er slitsomt.',
      fix: 'Arbeid W = F · s krever forflytning i kraftens retning. Står sekken stille, er s = 0 og W = 0 på sekken. At du blir sliten, skyldes at musklene dine hele tiden omdanner kjemisk energi til varme for å holde spenningen – ikke at energi går inn i sekken.',
      source: 'Watt ganger time (NAT4010)',
    },
    {
      id: 'myte.varmepumpe-skaper-energi',
      text: 'En varmepumpe som gir 3 kWh varme for 1 kWh strøm, lager energi – den har virkningsgrad 300 %.',
      fix: 'Varmepumpa skaper ingen energi. Den bruker 1 kWh høyverdig elektrisk energi til å *flytte* 2 kWh lavverdig energi fra uteluft, jord eller sjø og inn i huset. Inn: 1 + 2 = 3 kWh. Ut: 3 kWh. Regnskapet går opp.',
      source: 'Fysikk for lærere kap. 4',
    },
    {
      id: 'myte.klaer-varmer',
      text: 'Ulltrøya og dyna lager varme – derfor blir du varm under dyna.',
      fix: 'Klær og dyner er isolatorer: de holder på stillestående luft og bremser varmeledningen fra kroppen til omgivelsene. Varmen kommer fra kroppen din (celleånding). Et termometer pakket inn i en ulltrøye blir ikke varmere.',
      source: 'Vanlig elevforestilling i varmelæren',
    },
    {
      id: 'myte.kjoleskap-kjoler-rommet',
      text: 'Hvis du lar kjøleskapsdøra stå åpen en varm dag, blir kjøkkenet kjøligere.',
      fix: 'Et kjøleskap er en varmepumpe: det flytter energi fra innsiden til baksiden og tilfører i tillegg sin egen elektriske energi. Med døra åpen flytter det energi i ring i samme rom, og strømmen det bruker, ender som varme. Kjøkkenet blir litt varmere.',
      source: 'Fysikk for lærere kap. 4',
    },
  ]);
})();
