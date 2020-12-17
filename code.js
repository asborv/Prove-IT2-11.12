// category HTML-element

const lagOversiktRad1 = document.getElementById("lagOversiktRad1");
const lagOversiktBody = document.querySelector("#lagOversikt tbody");
const toppTreBody = document.querySelector("#toppTre tbody");
const trekkLagKnapp = document.getElementById("trekkLagKnapp");
const valgteLagListe = document.getElementById("valgteLagListe");
const registerLagSkjemaKnapp = document.getElementById("registerLagSkjemaKnapp");
const registerLagSkjema = document.getElementById("registerLagSkjema");
const spiltInput = document.getElementById("spiltInput");
// Alle tal-inputs som ikkje er totalt
const kampStatusArr = Array.from(document.querySelectorAll("#registerLagSkjema input[type=number]:not(#spiltInput)"));



// category variablar

// Sjølv om poeng er initialisert som 0, vert dei rekna ut dynamisk
const lagArr = [
    {lag: "Bodø/Glimt", spilt: 28, vunnet: 24, uavgjort: 3, tap: 1, poeng: 0},
    {lag: "Molde", spilt: 27, vunnet: 18, uavgjort: 2, tap: 7, poeng: 0},
    {lag: "Vålerenga", spilt: 28, vunnet: 14, uavgjort: 9, tap: 5, poeng: 0},
    {lag: "Rosenborg", spilt: 27, vunnet: 13, uavgjort: 6, tap: 8, poeng: 0},
];

const medaljeArr = ["🥇", "🥈", "🥉"];



// category funksjonar

/** 
* Aksepterer eit ubestemt tal strengar,
* og returnerer ein \<tr\>-node med kvar streng som barn i \<td\>-nodar
* @param {string} celletekster - Kommaseparerte verdiar av innhaldet i cellene
* @return {Element} \<tr\> som inneheld alle cellene
*/
// link https://gist.github.com/asborv/058622c57eac7f998fe1bfefa98d2887
function lagNyRad(...celletekster) {
    const nyRad = document.createElement("tr");
    
    // Legg til ny <td>-node for alle element i celletekster
    celletekster.forEach(tekst => {
        const nyCelle = document.createElement("td");
        const tekstNode = document.createTextNode(tekst);
        nyCelle.appendChild(tekstNode);
        nyRad.appendChild(nyCelle);
    });

    return nyRad;
}

/** 
* Legg ein \<tr\>-node som born av oversiktstabellen
* @param {Element} nyRad - \<tr\>-noden som skal leggjast til
* @return {Element} \<tr\>-noden som vart lagt til
*/
const leggTilRad = (nyRad, tabellBody) => tabellBody.appendChild(lagNyRad(...nyRad))

/** 
* Oppdaterer gjeve tabell med gjeve array med lag. Tømmer tabellen, og skriv ut heile på nytt
* @param {Array<object>} lagArr - Array med lag som skal skrivast til tabellen
* @param {Element} tabellBody - \<tbody\>-node som skal innehalde utskrifta.
*                               Brukar \<tbody\> grunna direkte forhold til relevante \<tr\>-noder
* @return {undefined}
*/
function oppdaterTabell(lagArr, tabellBody) {
    // Tømmer tabellen for noder
    while (tabellBody.firstChild) {
        tabellBody.removeChild(tabellBody.lastChild);
    }

    // Itererer over lagArr, legg til rad for alle radane
    lagArr.forEach(lag => leggTilRad(Object.values(lag), tabellBody))
}

/** 
* Reknar ut poenga til eitt lag. Brukar destructuring
* @param {number} vunnet - Talet kampar laget har vunne
* @param {number} uavgjort - Talet kampar laget har spelt uavgjort 
* @return {number} Poeng til laget
*/
const summerPoeng = ({vunnet, uavgjort}) => 3 * vunnet + uavgjort;

/** 
* Reknar ut poenga til alle laga i ein array. Returnerer modifisert array i tillegg til å modifisere original
* @param {Array<object>} lagArr - Array med lag-objekt
* @return {Array<object>} Modifisert array med lag-objekt
*/
function summerAllePoeng(lagArr) {
    // Modifiserer alle lag-objekt i lagArr
    lagArr.forEach(lag => lag.poeng = summerPoeng(lag));
    return lagArr;
}

/** 
* Finn dei N beste laga
* @param {number} N - Talet lag i returnert array
* @return {Array<object>} Array med dei N beste laga (som objekt)
*/
function finnTopp(N) {
    // Brukar spread for å ikkje endre lagArr
    const lagEtterPoeng = [...lagArr].sort(numeriskSortering("poeng")).reverse();
    const toppN = lagEtterPoeng.slice(0, N);
    return toppN;
}

/** 
* Formaterer ein array med lag-objekt, slik at dei passar i toppTre-tabellen.
* @param {Array<object>} toppLagArr - Array med topplaga
* @return {Array<object>} Topplaga formatert ned til medalje, namn og poeng
*/
function formaterToppLag(toppLagArr) {
    // Lagar ny array med topplaga, formatert slik at dei passar i toppTre-tabellen
    const formatertToppLagArr = toppLagArr.map(({lag, poeng}, i) => ({
        // Short circuit til tom streng dersom det ikkje er medalje på indeks i. Berre topp 3 får medalje
        medalje: medaljeArr[i] || "",
        lag: lag,
        poeng: poeng
    }));

    return formatertToppLagArr;
}

/** 
* Sorterer eit objekt alfabetisk etter nøkkel.
* @param {string} nokkel - Nøkkelen som bestemmer kva objektet skal sorterast etter
* @return {Function} Alfabetisk sorteringsalgoritme med nokkel (gjennom computed propert names)
*/
// link https://stackoverflow.com/questions/14491695/js-sort-custom-function-how-can-i-pass-more-parameters
function alfabetiskSortering(nokkel){
    // link https://gist.github.com/asborv/07d60bd9206dc413821498a7152442f5
    // link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    return (a, b) =>
        b[nokkel].toUpperCase() < a[nokkel].toUpperCase()
            ? 1 
            :-1;
}

/** 
* Gjennomfører numerisk samanlikning av objekt i array etter nøkkel.
* @param {string} nokkel - Nøkkelen som bestemmer kva objektet skal sorterast etter
* @return {Function} Numerisk sorteringsalgoritme med nokkel (gjennom computed property names)
*/
function numeriskSortering(nokkel) {
    return (a, b) => a[nokkel] - b[nokkel];
}

/** 
* Vurderer om ein array sorterast numerisk eller alfabetisk
* @param {Array<number|string>} sorteringsArr - Array som skal sorterast
* @param {string} nokkel - Nøkkelen som bestemmer kva arrayen skal sorterast etter
* @return {Function} Sorteringsalgoritme som stemmer med sorteringsArray
*/
function automatiskSortering(sorteringsArr, nokkel) {
    // Array med true/false om eit teikn kan vere eit tal
    const bokstavTallArr = sorteringsArr.map(obj => isNaN(obj[nokkel]));

    // Dersom eitt eller fleire teikn ikkje er tal, sorter alfabetisk. Elles numerisk
    return bokstavTallArr.includes(true)
        ? alfabetiskSortering(nokkel)
        : numeriskSortering(nokkel)
    ;
}

/** 
* Trekk namnet til N tilfeldige lag frå lagArr
* @param {number} N - Talet lag som skal vere med i trekket
* @return {Array<string>} Array med valgte lagnamn
*/
function trekkLag(N) {
    // Initielle verdiar. Ingen valgte lag og alle er tilgengelege
    const valgtelagArr = [];
    // Plukkar lag-attributten frå alle lag-objekt
    const tilgjelgeligeLagArr = lagArr.map(({lag}) => lag);

    // Går gjennom tal gongar bestemt av N
    for (let i = 0; i < N; i++) {
        // Finn tilfeldig gyldig indeks å fjerne frå
        const max = tilgjelgeligeLagArr.length;
        const tilfeldigIndex = Math.floor(Math.random() * max);

        // Legg til valgt lag og fjernar det for å unngå at det kjem med i neste iterasjon
        valgtelagArr.push(tilgjelgeligeLagArr[tilfeldigIndex]);
        tilgjelgeligeLagArr.splice(tilfeldigIndex, 1);
    }

    return valgtelagArr;
}

/** 
* Aksepterer eit ubestemt tal strengar,
* og returnerer ein array med \<li\>-nodar med kvar streng som barn (innerHTML)
* @param {Array<string>} punktTekstArr - Array med strengar som skal konverterast til \<li\>-nodar
* @return {Array<Element>} Array med konverterte \<li\>-nodar
*/
function lagNyeListePunkter(...punktTekstArr) {
    // Lagar nye nodar av kvart element i punktTekstArr, og returnerer konvertert array
    return punktTekstArr.map(tekst => {
        const nyttListePunkt = document.createElement("li");
        const tekstNode = document.createTextNode(tekst);
        nyttListePunkt.appendChild(tekstNode);
        return nyttListePunkt;
    });
}

/** 
* Skriv ei \<ol\>- eller \<ul\>-liste på nytt.
* Tømmer lista, og set inn alle <\li\>-nodar frå listePunktArr
* @param {Array<Element>} listePunktArr - Array med alle \<li\>-nodar
* @param {Element} liste - \<ol\>-eller \<ul\>-node som skal oppdaterast
* @return {undefined}
*/
function oppdaterListe(listePunktArr, liste) {
    // Tømmer tabellen for noder
    while (liste.firstChild) {
        liste.removeChild(liste.lastChild);
    }

    // Legg alle elementa i listePunktArr som born av liste
    listePunktArr.forEach(listePunkt => liste.appendChild(listePunkt));
}

/** 
* Legg til eit lag i lagArr frå eit skjema. Oppdaterer nettsida
* @param {Event} e - Event
* @return {undefined}
*/
function leggTilLag(e) {
    // Hindrar sida i å laste inn på nytt
    e.preventDefault();

    /*
        Itererer over alle <input>-felt, og legg til i objekt
        .reduce() "samlar" array
        Andre argument er initalverdien
        Ettrsom acc = {} for fyrste iterasjon, kan ein leggje nøkkel: verdi-par inn
        ...acc kopierer acc for kvar iterasjon, slik at han ikkje vert skrive over av seg sjølv
        [input.name] er ein "computed property". Kan brukast som nøkkel sidan input.name stemmer med objekta i lagArr
        Ternaty operator på verdi; cast til tal dersom mogleg
    */
    // link https://www.youtube.com/watch?v=P-jKHhr6YxI&feature=emb_title&ab_channel=JuniorDeveloperCentral
    const nyttLag = Array.from(document.querySelectorAll("#registerLagSkjema input"))
    .reduce((acc, input) => ({
        ...acc,
        [input.name]: isNaN(input.value) ? input.value : parseInt(input.value)
    }), {});

    // Oppdaterer nettsida
    tomSkjema(e.target);
    lagArr.push(nyttLag);
    summerAllePoeng(lagArr);
    oppdaterTabell(lagArr, lagOversiktBody);
    oppdaterTabell(formaterToppLag(finnTopp(3)), toppTreBody);
}

/** 
* Itererer over alle inputs i skjemaet sendt inn og set verdien til tom streng.
* Merk at skjema MÅ ha id.
* Dette vil òg setje verdi til submit-input til tom streng, som kan føre til bugs.
* @param {Element} skjema - Skjemaet ein vil tømme
* @return {undefined}
*/
function tomSkjema(skjema) {
    const inputArr = document.querySelectorAll(`#${skjema.id} input`);
    inputArr.forEach(inputFelt => inputFelt.value = "");
}

/** 
* Summerer alle kampane frå spelt, vunne og tapt, og set verdien til relevant input til riktig tal.
* Sikrar at skjema ikkje vert sendt dersom det er for mange kampar.
* @param {Event} e - Event
* @return {undefined}
*/
function oppdaterKamperSpilt(e) {
    // Summerer kampane
    const kamperTotalt = kampStatusArr.reduce((a, b) => a + Number(b.value), 0);
    spiltInput.value = kamperTotalt;

    // Sikrar at ikkje for mange kampar vert sendt inn
    registerLagSkjemaKnapp.disabled = kamperTotalt > 100;
}



// category event listeners

/*
*   Tjaa, det står namn, men når eg like greitt var i gang tok eg alle - gjekk like fort uansett :)
    Itererer over alle <th> i øvste <tr> (overskrifta)
    Legg til event listener på alle <th>
    Funksjonen til event listeneren brukar funksjonen for å finne alfabetisk/numerisk sorteringsalgoritme
    nokkel kjem frå .innerHTML ettersom den stemmer med nøklane i lagArr
*/
// TODO endre tabelloverskrift til å vise kva det er sortert etter (pil opp/ned)
Array.from(lagOversiktRad1.children)
    .forEach(thElement => {
        thElement.addEventListener("click", ({target}) => {
            const nokkel = target.innerHTML.toLowerCase();
            lagArr.sort(automatiskSortering(lagArr, nokkel));
            oppdaterTabell(lagArr, lagOversiktBody);
        });
    })
;

trekkLagKnapp.addEventListener("click", () => {
    oppdaterListe(lagNyeListePunkter(...trekkLag(2)), valgteLagListe);
});

registerLagSkjema.addEventListener("submit", leggTilLag);
registerLagSkjema.addEventListener("input", oppdaterKamperSpilt);



// category køyr automatisk

summerAllePoeng(lagArr);
oppdaterTabell(lagArr, lagOversiktBody);
oppdaterTabell(formaterToppLag(finnTopp(3)), toppTreBody);
