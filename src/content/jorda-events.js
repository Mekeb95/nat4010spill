/* Himmelfjellet — hendelser (✉-noder). */
(function () {
  'use strict';
  NG.content.addEvents([
    { id: 'jorda.ev.australia', region: 'jorda', title: 'Postkort fra Australia',
      text: 'En brevdue lander med et postkort fra Sydney, datert 24. desember: «Badetemperatur og sol! Hilsen kusina di.» En elev ved siden av deg sier: «Rart. Jorda er jo nærmere sola om sommeren …»',
      choices: [
        { label: '«Hvis det var avstanden, ville vi hatt sommer samtidig. Det er aksehelningen: nå heller sørlige halvkule mot sola.»', correct: true,
          result: 'Eleven ser på postkortet, så ut på snøen. «Så det er vinkelen, ikke avstanden!» Årstidsdragen hveser fra toppen av fjellet.', reward: { xp: 25 } },
        { label: '«Australia er nærmere sola enn Norge.»', correct: false,
          result: 'Forskjellen i avstand mellom Norge og Australia er ubetydelig sammenlignet med 150 millioner km til sola. Årstidsdragen vokser.', reward: { hp: -6 } },
        { label: '«Kusina tuller sikkert.»', correct: false,
          result: 'Hun tuller ikke. Motsatte årstider på halvkulene er nettopp evidensen som avliver avstandsforklaringen.', reward: { hp: -4 } },
      ] },
    { id: 'jorda.ev.romstasjon', region: 'jorda', title: 'Romstasjonen over fjellet',
      text: 'Et lysende punkt glir raskt over kveldshimmelen. «Romstasjonen!» roper noen. «Der oppe er det ingen tyngdekraft.»',
      choices: [
        { label: '«Tyngdekraften er nesten 90 % av den her nede. De svever fordi de faller fritt rundt jorda.»', correct: true,
          result: 'Dere tegner Newtons kanonkule i snøen: fort nok sidelengs, og kula bommer på jorda hele tiden. Tyngdeløsingen daler skamfullt ned.', reward: { xp: 20 } },
        { label: '«Ja, tyngdekraften slutter der atmosfæren slutter.»', correct: false,
          result: 'Da ville månen fløyet sin vei. Tyngdekraften avtar, men forsvinner aldri.', reward: { hp: -5 } },
      ] },
    { id: 'jorda.ev.kaldvinter', region: 'jorda', title: 'Kuldeknepp',
      text: 'Det er −28 °C på fjellet. En turist banker på hytteveggen: «Global oppvarming, sier du? Ha! Se på termometeret!»',
      choices: [
        { label: '«Dette er vær, her og nå. Klima er gjennomsnittet over 30 år for hele jorda – og det trender oppover.»', correct: true,
          result: 'Dere finner fram normalene på telefonen. Turisten ser at vintrene i snitt er blitt mildere. Værvirvelen blåser forvirret bort.', reward: { xp: 20, joule: 5 } },
        { label: '«Kanskje du har rett.»', correct: false,
          result: 'Én kald dag er én måling. Værvirvelen vokser seg dobbelt så stor.', reward: { hp: -6 } },
      ] },
    { id: 'jorda.ev.fossil', region: 'jorda', title: 'Fossilet i fjellveggen',
      text: 'Høyt oppe i fjellveggen finner du et forsteinet skjell. Følget ditt er forvirret: «Hvordan har et havdyr kommet seg hit opp?»',
      choices: [
        { label: '«Det levde på en havbunn. Sedimentene ble til stein, og platebevegelser løftet dem opp til fjell over millioner av år.»', correct: true,
          result: 'Dere tegner det geologiske kretsløpet i notatboka. Kontinentkjempen knurrer i det fjerne – den liker ikke å bli minnet om at den har flyttet seg.', reward: { xp: 25 } },
        { label: '«En fugl må ha mistet det.»', correct: false,
          result: 'Skjellet sitter inne *i* steinen, i lag med mange andre. Det ble begravd der det levde.', reward: { hp: -4 } },
        { label: '«Havet sto så høyt en gang at det dekket alle fjell.»', correct: false,
          result: 'Det finnes ikke nok vann på jorda til det. Det er fjellet som har flyttet seg opp, ikke havet.', reward: { hp: -5 } },
      ] },
    { id: 'jorda.ev.manetegning', region: 'jorda', title: 'Månetegningen',
      text: 'En elev har tegnet månefasene som jordas skygge som spiser gradvis av månen. «Riktig?» spør hun.',
      choices: [
        { label: '«La oss teste med en lampe og en ball: hold ballen rundt hodet ditt og se hva som skjer med den belyste delen.»', correct: true,
          result: 'Eleven snurrer rundt med ballen og ser fasene dukke opp – uten at hodet hennes skygger. «Skyggen kommer jo bare når ballen er rett bak meg!» Månefaseskyggen blekner.', reward: { xp: 25 } },
        { label: '«Ja, det er jordas skygge.»', correct: false,
          result: 'Skyggen treffer månen bare ved måneformørkelse, ved fullmåne. Månefaseskyggen fniser.', reward: { hp: -6 } },
      ] },
  ]);
})();
