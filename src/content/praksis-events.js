/* Utforskertårnet — hendelser (✉-noder) */
(function () {
  'use strict';
  const R = 'praksis';
  NG.content.addEvents([
    { id: 'praksis.ev.pendel', region: R, title: 'Pendelkaoset',
      text: 'Ei gruppe har byttet til lengre tråd OG tyngre kule på én gang. «Svingetiden økte – det er kula!» roper de. Hva gjør du?',
      choices: [
        { label: 'Spør: «Hvordan kan dere vite at det var kula og ikke tråden?» og la dem planlegge to nye forsøk.', correct: true,
          result: 'Gruppa ser problemet selv. Med én variabel om gangen viser det seg at lengden er synderen – og at massen ikke betyr noe.', reward: { xp: 25 } },
        { label: 'Si at det er tråden, og be dem skrive det ned.', correct: false,
          result: 'De skriver det ned – uten å forstå hvorfor forsøket deres ikke kunne avgjøre saken. Alt-varieren gliser.', reward: { xp: 5 } },
        { label: 'Godta konklusjonen – de har jo data.', correct: false,
          result: 'Data uten variabelkontroll ga feil konklusjon. Misforståelsen vokser.', reward: { hp: -6 } },
      ] },
    { id: 'praksis.ev.krabbe', region: R, title: 'Krabben i fjæra',
      text: 'Elevene har funnet et rødt krabbeskall. Én skriver i observasjonskolonnen: «Krabben er kokt.»',
      choices: [
        { label: 'Be eleven skille: «Hva *ser* du? Hva *tror* du? Finnes andre forklaringer på fargen?»', correct: true,
          result: 'Eleven flytter «kokt» til slutningskolonnen og foreslår at arten kanskje er rød. Krabbe-aktiviteten gjør jobben sin.', reward: { xp: 25 } },
        { label: 'La det stå – det er sikkert riktig.', correct: false,
          result: 'Observasjonsblanderen får mat. Neste gang blander eleven igjen.', reward: { hp: -5 } },
      ] },
    { id: 'praksis.ev.syre', region: R, title: 'Flaska uten etikett',
      text: 'I kjemikalieskapet står en halvfull flaske uten etikett. En elev vil bruke den: «Det ser ut som vann!»',
      choices: [
        { label: 'Sett den til side, merk den «ukjent – ikke bruk», og lever den som farlig avfall etter skolens rutine.', correct: true,
          result: 'Riktig. Et ukjent stoff kan ikke risikovurderes. Du finner en ny flaske med datablad i stoffkartoteket.', reward: { xp: 20, item: 'item-vernebriller' } },
        { label: 'Lukt forsiktig på den for å finne ut hva det er.', correct: false,
          result: 'Au! Flaska inneholdt ammoniakk. Å lukte på ukjente stoffer er aldri en sikker identifikasjon.', reward: { hp: -10 } },
        { label: 'Hell det i vasken med mye vann, så er problemet borte.', correct: false,
          result: 'Ukjente stoffer kan være miljøfarlige eller reagere i avløpet. Sikkerhetsslurven klapper.', reward: { hp: -8 } },
      ] },
    { id: 'praksis.ev.hypotese', region: R, title: 'Den avkreftede hypotesen',
      text: 'En elev gråter nesten: «Hypotesen min var feil. Jeg har mislyktes.»',
      choices: [
        { label: '«En avkreftet hypotese er ny kunnskap. Du testet den ærlig – det er god naturvitenskap. Hva tror du nå?»', correct: true,
          result: 'Eleven retter seg opp og begynner å lete etter en ny forklaring. Hypotesehaien mister en tann.', reward: { xp: 20 } },
        { label: '«Skriv om hypotesen så den passer med resultatet.»', correct: false,
          result: 'Å tilpasse hypotesen i etterkant er å jukse med vitenskapen. Eleven lærer at det er om å gjøre å ha rett.', reward: { hp: -6 } },
      ] },
    { id: 'praksis.ev.metode', region: R, title: 'Plakaten på veggen',
      text: 'På veggen henger en plakat: «DEN VITENSKAPELIGE METODEN: 1 Problem 2 Hypotese 3 Eksperiment 4 Resultat 5 Konklusjon». Kollegaen vil ha den der.',
      choices: [
        { label: 'Foreslå å henge utforskingsmodellen ved siden av, med piler som går begge veier – og la elevene diskutere hvordan en geolog eller astronom ville arbeidet.', correct: true,
          result: 'Plakatene blir et diskusjonsgrunnlag om naturvitenskapens egenart. Dogmatikeren rister på tronen sin.', reward: { xp: 25 } },
        { label: 'Rive ned plakaten uten å si noe.', correct: false,
          result: 'Kollegaen blir sur, og elevene lærer ingenting om hvorfor plakaten var for enkel.', reward: { xp: 0 } },
        { label: 'La den henge – den er jo pensum.', correct: false,
          result: 'Det finnes ikke én vitenskapelig metode, og pensum sier nettopp det. Dogmatikeren vokser.', reward: { hp: -5 } },
      ] },
    { id: 'praksis.ev.modell', region: R, title: 'Modellen som lyver',
      text: 'En elev ser på en klimasimulering og sier: «Modellen er jo ikke ekte, så den kan vi ikke stole på.»',
      choices: [
        { label: '«Ingen modell er virkeligheten. Spørsmålet er hva den er laget for, hva den får til og hvor den svikter. Skal vi undersøke det?»', correct: true,
          result: 'Eleven begynner å liste styrker og begrensninger – akkurat som kompetansemålet ber om.', reward: { xp: 20 } },
        { label: '«Modellen er laget av forskere, så den er riktig.»', correct: false,
          result: 'Autoritet er ikke evidens. Modellmonumentet nikker fornøyd.', reward: { hp: -5 } },
      ] },
    { id: 'praksis.ev.kokebok', region: R, title: 'Oppskriften',
      text: 'Du har arvet et forsøksark: «Hell 50 mL eddik i begeret. Tilsett 1 ts natron. Noter hva du ser.» Du har 20 minutter til timen starter.',
      choices: [
        { label: 'Legg til et spørsmål: «Hvordan påvirker mengden natron hvor mye gass som dannes?» – og la elevene planlegge målingen.', correct: true,
          result: 'Med én setning er kokebokforsøket blitt et utforskende forsøk. Kokebok-kokken mister grepet om sleiva.', reward: { xp: 25 } },
        { label: 'Kjør arket som det er.', correct: false,
          result: 'Det skummer og elevene ler – men ingen tenker. Hands-on, minds-off.', reward: { xp: 5 } },
      ] },
  ]);
})();
