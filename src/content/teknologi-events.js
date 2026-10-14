/* Verkstedet — hendelser (✉-noder) */
(function () {
  'use strict';
  const R = 'teknologi';
  NG.content.addEvents([
    { id: 'teknologi.ev.lokke', region: R, title: 'Den frosne skjermen',
      text: 'En elevs micro:bit viser «90» og ingenting mer. Koden: `while t > 20: show(t)`. «Den har hengt seg opp!»',
      choices: [
        { label: '«Hva skal få t til å endre seg inne i løkka? Les koden linje for linje med meg.»', correct: true,
          result: 'Eleven ser at `t` aldri endres og legger inn `t = t - 1`. Den uendelige løkka løser seg opp.', reward: { xp: 20 } },
        { label: '«Prøv å starte den på nytt.»', correct: false,
          result: 'Den henger seg opp igjen. Og igjen. Datamaskinen gjør nøyaktig det koden sier.', reward: { hp: -5 } },
      ] },
    { id: 'teknologi.ev.prototyp', region: R, title: 'Prototypen som lekker',
      text: 'Gruppas første termosprototyp lekker kakao over hele pulten. De vil gi opp og «bare kjøpe en termos».',
      choices: [
        { label: '«Perfekt – nå vet dere noe nytt! Hva lekker, og hvordan kan dere teste en bedre løsning?»', correct: true,
          result: 'Gruppa lager tre lokkvarianter og tester dem. Den tredje holder tett. Fossefallsfantomet blekner.', reward: { xp: 25, item: 'termos' } },
        { label: '«Greit, vi hopper over prototypen og går rett på sluttproduktet.»', correct: false,
          result: 'Sluttproduktet lekker også – men nå er det for sent å endre. Fossefallsfantomet ler.', reward: { hp: -6 } },
      ] },
    { id: 'teknologi.ev.krav', region: R, title: 'Kravlista',
      text: 'Gruppas kravspesifikasjon for en fuglekasse lyder: «Den skal være fin og bra.»',
      choices: [
        { label: 'Be dem finne ut hva fuglen (brukeren!) trenger, og lage målbare krav: inngangshull 32 mm, tåle regn, kunne åpnes for rengjøring.', correct: true,
          result: 'Kravene kan nå testes – og elevene lærer mye om kjøttmeis på veien. Kravløsen mister propellen.', reward: { xp: 20 } },
        { label: 'Godta den – de vet nok hva de mener.', correct: false,
          result: 'Kassa blir fin, men inngangshullet er så stort at skjæra spiser eggene.', reward: { hp: -5 } },
      ] },
    { id: 'teknologi.ev.simulering', region: R, title: 'Kurven som ikke passer',
      text: 'Elevenes simulering sier at kaffen er 45 °C etter 20 minutter. Termometeret viser 52 °C. «Termometeret er ødelagt!»',
      choices: [
        { label: '«Kanskje – men hva med modellen? Hvilke forutsetninger har den, og hva skjer hvis dere endrer k?»', correct: true,
          result: 'Elevene justerer k til kurven passer, og oppdager at koppen hadde lokk. Modellen og målingen møtes. Simulatorsirenen tier.', reward: { xp: 25 } },
        { label: '«Simuleringen er regnet ut av en datamaskin, så den har rett.»', correct: false,
          result: 'Simulatorsirenen synger høyere. Modellen ble aldri prøvd mot virkeligheten.', reward: { hp: -7 } },
      ] },
    { id: 'teknologi.ev.svartboks', region: R, title: 'Den gamle vekkerklokka',
      text: 'I et skap finner du en ødelagt vekkerklokke. En elev spør om hun kan skru den fra hverandre.',
      choices: [
        { label: '«Ja! Tegn delene du finner, og prøv å forklare hvilken jobb hver del gjør i systemet.»', correct: true,
          result: 'Hun finner fjær, tannhjul og ringeklokke – og forklarer hvordan tannhjulene deler opp tiden. Svartboksen åpner seg.', reward: { xp: 20 } },
        { label: '«Nei, det er bare skrap. Kast den.»', correct: false,
          result: 'En gyllen sjanse til å utforske et mekanisk system havner i restavfallet.', reward: { xp: 0 } },
      ] },
    { id: 'teknologi.ev.feilsok', region: R, title: 'Tre endringer',
      text: 'Programmet for skritteller teller feil. En elev vil endre terskelverdien, løkkehastigheten og formelen samtidig.',
      choices: [
        { label: '«Endre én ting om gangen og test etter hver – ellers vet du ikke hva som hjalp.»', correct: true,
          result: 'Etter to tester er feilen funnet: terskelverdien. Eleven sier: «Det er jo variabelkontroll!»', reward: { xp: 20 } },
        { label: '«Endre alt – det går raskere.»', correct: false,
          result: 'Nå teller den annerledes feil. Ingen vet hvorfor. Off-by-one-ogeren klapper i hendene.', reward: { hp: -5 } },
      ] },
  ]);
})();
