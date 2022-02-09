const autoCompleteJS = new autoComplete({
    placeHolder: "херачь баны сюда",
    data: {
        src: Object.keys(LEADERS_INVERTED),
        cache: false,
    },
    resultItem: {
        highlight: true
    },
    events: {
        input: {
            selection: (event) => {
                const selection = event.detail.selection.value;
                autoCompleteJS.input.value = selection;
            }
        }
    }
});

const audio = new Audio('stamp.mp3');

function addBan(canonical) {
    if (!(banList.includes(canonical)) && (canonical in CIV_LEADERS)) {
        banList.push(canonical);
        updateBanList();
    };
};

function updateBanList() {
    let result = '<h3>Зобанено:</h3>';
    banList.forEach(civ => result += `<li>${CIV_LEADERS[civ]} <button id="removeBan_${civ}" onClick="removeBan('${civ}')">-</button></li>`);
    banListElement.innerHTML = result;
};

function removeBan(civ) {
    let index = banList.indexOf(civ);
    if (index > -1) {
        banList.splice(index, 1);
    };
    updateBanList();
};

function makeDraft() {
    let availableCivs = Object.keys(CIV_LEADERS).filter(x => !banList.includes(x));
    console.log(availableCivs);
    let players = document.querySelector('#playerCount').value;
    let picks = document.querySelector('#pickCount').value;

    if (availableCivs.length < players * picks) {
        throw('Ашипко: нафсех нихвотает пикоф');
    };

    let shuffled = availableCivs
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    console.log(shuffled);

    result = '<h3>Зопикано:</h3>';
    result_plain = '';
    for (p = 0; p < players; p++) {
        result += `<b>Игрок ${p+1}:</b> `;
        result_plain += `Игрок ${p+1}: `;
        pick = [];
        for (i = 0; i < picks; i++) {
            pick.push(CIV_LEADERS[shuffled[p*picks+i]]);
        }
        result += pick.join(' / ');
        result += '<br/><br/>';

        result_plain += pick.join(' / ');
        result_plain += '\r\n\r\n';
    };
    
    document.querySelector('#output').innerHTML = result;
    document.querySelector('#drafter').innerHTML = 'копипаста схоранена в буфер';
    textToClipboard(result_plain);
};

function textToClipboard (text) {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
};

const banListElement = document.querySelector('#bans');
const ac = document.querySelector('#autoComplete');
let banList = [].concat(AUTOBAN_LIST);

ac.addEventListener('results', function (event) {
    if (event.detail.results.length == 1) {
        autoCompleteJS.select(0);
    } else if (event.detail.results.length < 4) {
        let count = 0;
        let bestChoice = -1;
        console.log(event.detail.results);
        event.detail.results.forEach((civ, index) => {
            console.log(autoCompleteJS.input.value);
            console.log(civ.value);
            if (civ.value.toLowerCase().startsWith(autoCompleteJS.input.value.toLowerCase())) {
                count += 1;
                bestChoice = index;
            };
        });
        if (count == 1) {
            autoCompleteJS.select(bestChoice);
        };
    }
});

ac.addEventListener("selection", function (event) {
    let displayName = event.detail.selection.value;
    addBan(LEADERS_INVERTED[displayName]);
    audio.play();
    ac.value = '';
});

updateBanList();