/* Nøkkelarkene som låses opp når bossen i regionen er slått.
   Seks ark bygger på Naturfagsenterets nøkkelark (omskrevet og forkortet),
   to er NAT4010-ark for praksiser og fagdidaktikk. */
(function () {
  'use strict';
  NG.SHEETS = {
    energi: {
      questions: ['Hvordan drives prosesser av energi?', 'Hvordan er energi en ressurs for samfunnet?'],
      text: 'Energi er det som **kan** få noe til å skje. Den kommer i ulike former (potensiell, kinetisk, termisk, kjemisk, elektrisk) og kan **omdannes** fra én form til en annen, for eksempel fra potensiell til kinetisk energi når noe faller. Energi kan også **overføres** mellom objekter: ved varme, ved stråling eller ved at krefter gjør arbeid.\n\nSelv om energi omdannes og overføres, er den totale mengden **bevart**. Men energikvaliteten går ned i alle prosesser: energien sprer seg, og blir vanskeligere å utnytte til arbeid. Det vi kaller *energiforbruk*, er egentlig at energi blir omdannet til en mindre nyttig form.\n\nI atomkjerner kan masse gå over til energi (E = mc²): i sola smelter hydrogenkjerner sammen til helium, og sola mister masse som sendes ut som stråling. En energikilde er fornybar når den er del av de raske kretsløpene i naturen. En energibærer (som et batteri) lagrer eller transporterer energi.',
      laws: 'Energibevaringsloven (1. hovedsetning: ΔU = Q + W) · Loven om energikvalitet (2. hovedsetning: entropien øker, evighetsmaskiner er umulige)',
    },
    stoffer: {
      questions: ['Hvordan er alt i og rundt oss bygd opp?', 'Hvordan påvirker stoffer og kjemiske reaksjoner vår hverdag?'],
      text: 'Stoffer er alt som tar opp plass og har masse. Alle stoffer er bygd opp av **atomer** med protoner, nøytroner og elektroner, og egenskapene bestemmes av hvilke atomer stoffet består av og hvordan de er satt sammen. **Grunnstoffer** består av én atomtype og er samlet i periodesystemet; **kjemiske forbindelser** består av flere atomtyper og kan være molekyler eller ioneforbindelser. Rene stoffer er enten ett grunnstoff eller én forbindelse; **blandinger** er flere rene stoffer som ikke er kjemisk bundet.\n\n**Partikkelmodellen** forklarer faser og faseoverganger: partiklene er alltid i bevegelse, og jo raskere de beveger seg, jo høyere energi. Tilføres eller avgis energi, endres bevegelsen eller bindingene, og stoffet kan skifte fase.\n\nI en **kjemisk reaksjon** settes atomene i utgangsstoffene sammen på nye måter til produkter med nye egenskaper — men den totale massen er uendret. Alle reaksjoner trenger energi for å starte; noen frigjør energi, andre trenger tilførsel.\n\nKjemiens tre nivåer: **makro** (det vi ser), **mikro** (partiklene) og **representasjon** (formler, tegninger, modeller).',
      laws: 'Partikkelmodellen · Periodesystemet · Massebevaringsloven',
    },
    liv: {
      questions: ['Hvordan har det mangfoldige livet på jorda utviklet seg?', 'Hvordan kan vi både bruke og ta vare på naturen?'],
      text: 'Et samfunn av organismer og området de lever i, utgjør et **økosystem**, og all variasjon av arter og økosystemer kalles **naturmangfold**. Alle organismer er bygd av celler med arvestoff. Planter bruker energi fra lys til å lage karbohydrater og oksygengass i **fotosyntesen**, mens **celleåndingen** foregår hele tiden i alle levende celler — det som varierer for en plante, er *netto* gassutveksling.\n\n**Stoff går i kretsløp, energi strømmer gjennom.** Karbon sirkulerer raskt (fotosyntese ↔ celleånding) og langsomt (nedbrytning, fossile lagre). Rundt 90 % av energien går tapt som varme i hvert ledd i næringskjeden, så sola må hele tiden fylle på. Nedbrytning styres av temperatur, fuktighet, pH, næring, materiale og nedbrytere — der den går sakte (myr, permafrost), lagres karbon.\n\nAlt liv har utviklet seg fra en encellet organisme for rundt fire milliarder år siden. Den viktigste mekanismen er **naturlig utvalg**: individer som er best tilpasset, har størst sjanse for å overleve og føre genene videre.',
      laws: 'Evolusjonsteorien',
    },
    jorda: {
      questions: ['Hvordan har universet og jorda utviklet seg?', 'Hvordan påvirker menneskelig aktivitet jorda?'],
      text: 'Universet oppsto i **big bang** for omtrent 14 milliarder år siden og utvider seg fortsatt. Solsystemet ble dannet for om lag 4,5 milliarder år siden i galaksen Melkeveien. Jorda roterer én gang i døgnet (dag og natt) og bruker ett år rundt sola. Fordi jordaksen **heller**, får ulike deler av jorda ulik mengde sol gjennom året — det gir **årstider**. Tyngdekraften fra månen og sola gir flo og fjære.\n\nJordskorpa består av plater som beveger seg (**platetektonikk**): jordskjelv, vulkaner, fjellkjeder og det geologiske kretsløpet. Atmosfæren er omtrent 99 % nitrogen og oksygen; små mengder CO₂ og andre gasser gir en **drivhuseffekt** som holder snittemperaturen over 15 °C i stedet for −19 °C. Klima er gjennomsnittlig vær over lang tid. Utslipp av CO₂ fra menneskelig aktivitet har forsterket drivhuseffekten og ført til klimaendringer.',
      laws: 'Platetektonikkteorien · Big bang-teorien',
    },
    kropp: {
      questions: ['Hvordan virker kroppen?', 'Hvordan tar vi vare på helsa?'],
      text: 'Kroppen er et **system** av celler som danner vev og organer, som igjen samarbeider i organsystemer: nervesystemet, muskel- og skjelettsystemet, sirkulasjonssystemet, respirasjonssystemet, fordøyelsessystemet og immunsystemet. Systemene sørger for **vekst, overlevelse og reproduksjon**. Hjertet pumper blod med næringsstoffer og oksygen til cellene, der celleåndingen frigjør energien.\n\nCellekjernen inneholder **DNA** med gener som overføres mellom generasjoner og påvirker utviklingen — sammen med miljø og livsstil.\n\n**Helse** er fysisk, psykisk og sosial tilstand, påvirket av levekår, miljø, livsstil og helsetilbud. Å forholde seg kritisk til helseinformasjon er en del av naturfaget: hvordan virker ernæring, rusmidler, legemidler og miljøgifter, hvordan smitter sykdommer, og hva betyr vaksiner for folkehelsa?',
      laws: 'Evolusjonsteorien',
    },
    teknologi: {
      questions: ['Hvordan utvikler vi teknologiske løsninger?', 'Hva er fordeler og ulemper ved teknologi?'],
      text: 'Teknologi skal skape løsninger som gjør livet enklere, tryggere og mer effektivt — eller som åpner for ny kunnskap. Den omfatter fysiske og digitale verktøy og systemer, og kunnskapen om dem. Utvikling skjer **iterativt**: fra **brukerbehov** og **kravspesifikasjon** via idéer og **prototyper** som testes og forbedres. Form, funksjon, mekanisme, materiale og materialegenskaper henger sammen.\n\nDigital teknologi kan **styre og kontrollere** annen teknologi; kjernen er programkode. I naturfag bruker vi **programmering til å utforske fenomener**: simuleringer av avkjøling, fritt fall eller populasjoner er modeller — med styrker og begrensninger. Teknologi kan også skape nye problemer, som forurensning, så bærekraftige løsninger krever at vi veier fordeler mot ulemper.',
      laws: 'Designprosessen · Sekvens, løkke, variabel, betingelse',
    },
    praksis: {
      questions: ['Hvordan vet vi det vi vet?', 'Hva gjør en påstand naturvitenskapelig?'],
      text: 'Det finnes ikke **én** vitenskapelig metode. Utforskende arbeid kan beskrives som motivasjon → spørsmål og hypoteser → planlegging og datainnsamling → bearbeiding → forklaring → formidling, men forskere hopper fram og tilbake. **Praktisk arbeid er ikke automatisk utforskende** — det avgjørende er hvem som eier spørsmålet og tankearbeidet.\n\nSkill **observasjon** (det sansene/instrumentene registrerer) fra **slutning** (tolkningen). Et godt argument har **påstand, evidens og begrunnelse**. I et rettferdig forsøk endres én **uavhengig** variabel, den **avhengige** måles, og **kontrollvariablene** holdes like.\n\n**Modeller** kan være modeller *av* noe kjent eller modeller *for* å utvikle ny kunnskap; alle har styrker og begrensninger. Naturvitenskap (NOS/Family Resemblance Approach) kjennetegnes av mål og verdier, praksiser, metoder og kunnskap — og av at kunnskapen er solid, men åpen for revisjon.\n\n**HMS:** Elevene skal delta i risikovurderinger knyttet til forsøk og følge sikkerhetstiltakene — farepiktogrammer, sikkerhetsdatablad, verneutstyr og avfallshåndtering.',
      laws: 'Utforskingsmodellen · Påstand–evidens–begrunnelse · 5E-modellen',
    },
    didaktikk: {
      questions: ['Hvordan blir et ord til et begrep?', 'Hvordan vet jeg at elevene lærte det jeg ville?'],
      text: '**Ordet er formen, begrepet er innholdet.** Begrepslæring går fra gjenkjennelse → definisjon → nettverk → anvendelse → overføring. Velg få nøkkelbegreper og bruk dem over lang tid; skill over- og underbegreper. Ordkort, begrepsvegg, begrepsalias og bindeord bygger nettverket.\n\nElever har gjennomtenkte **forestillinger** (Henriksen & Angell 2019): energi bare i levende ting, energi krever bevegelse, energi = kraft, energi som et stoff, «metall er kaldt», kulde som overføres … De møtes med grubletegninger, energikjeder, partikkelmodellen og en bevisst bro fra **hverdagsspråk til fagspråk** — hverdagsspråket er utgangspunktet, ikke fienden.\n\n**Planlegging:** Læringsmål knyttes til kompetansemål og må kunne **vurderes**. Aktiviteten må henge sammen med målet, valgene begrunnes med kilder, og å *beskrive* er ikke det samme som å *forklare*. Bærekraft kobles inn der det er naturlig. Reflekter med **Hva? Hva så? Hva nå?**',
      laws: 'Begrepsstigen · Vurdering for læring · Hva? – Hva så? – Hva nå?',
    },
  };
})();
