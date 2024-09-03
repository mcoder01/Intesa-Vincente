let device;

let word;
let timeLeft;
let guessed;
let skips;

let overlay;
let countdown;
let result;
let menu;

let words;
let doubleWords;

let timerId;

let wordSound;
let buzzSound;
let timeOverSound;

async function loadTextFile(file) {
    let text = await (await fetch(file)).text();
    return text.split("\n");
}

async function loadWords() {
    words = await loadTextFile("res/parole.txt");
    doubleWords = await loadTextFile("res/raddoppio.txt");
}

function loadSounds() {
    wordSound = new Audio("res/sound/word-spawn.mp3");
    buzzSound = new Audio("res/sound/buzz.mp3");
    timeOverSound = new Audio("res/sound/time-over.mp3");
}

function checkDevice() {
    if (navigator.userAgent.match("Android|iPhone|iPad")) {
        document.getElementById("instr-mobile").classList.remove("hide");
        document.body.onclick = buzzer;
    } else {
        document.getElementById("instr-desktop").classList.remove("hide");
        window.onkeydown = key => {
            if (key.key == " ")
                buzzer();
        }
    }
}

window.onload = function() {
    word = document.getElementById("word");
    timeLeft = document.getElementById("time-left");
    guessed = document.getElementById("guessed");
    skips = document.getElementById("skips");
    doubles = document.getElementById("doubles");

    overlay = document.getElementById("overlay");
    countdown = document.getElementById("countdown");
    result = document.getElementById("result");
    menu = document.getElementById("restart");

    checkDevice();
    loadWords();
    loadSounds();
}

function answerProcedure() {
    stopTimer(timerId, () => timerId = undefined);
    let skipBtn = document.getElementById("skip-btn");
    if (parseInt(skips.innerText) > 0)
        skipBtn.classList.remove("hide");
    else skipBtn.classList.add("hide");
    overlay.classList.toggle("hide");
    createTimer(3, time => countdown.innerText = time, 
        () => {
            countdown.innerText = "3";
            countdown.classList.toggle("hide");
            document.body.onclick = undefined;
            result.classList.toggle("hide");
        }
    );
    buzzSound.play();
}

function getTimeLeft() {
    return parseInt(timeLeft.innerText.slice(1));
}

function buzzer() {
    let time = getTimeLeft();
    if (!overlay.classList.contains("hide") || timeLeft == 0)
        return;

    if (timerId === undefined) {
        let r = parseInt(Math.random()*words.length);
        word.innerText = words[r];
        timerId = createTimer(
            time, 
            time => timeLeft.innerText = ":" + (time > 9 ? time : "0" + time), 
            () => {
                timerId = undefined;
                timeOverSound.play();
                answerProcedure();
            }
        );
        wordSound.play();
    } else answerProcedure();
}

function createTimer(start, onupdate, onfinish) {
    let time = start;
    let id = setInterval(() => {
        time--;
        onupdate(time);
        if (time == 0)
            stopTimer(id, onfinish)
    }, 1000);
    return id;
}

function stopTimer(id, onfinish) {
    clearInterval(id);
    if (onfinish)
        onfinish();
}

function hideOverlay() {
    countdown.classList.toggle("hide");
    overlay.classList.toggle("hide");
    setTimeout(checkDevice, 300);
}

function resultButton(btn) {
    if (btn.innerText == "Passo") {
        let leftSkips = parseInt(skips.innerText);
        leftSkips--;
        skips.innerText = leftSkips;
        if (leftSkips == 0)
            btn.classList.toggle("hide");
    } else if (btn.innerText == "Raddoppia") {
        let leftDoubles = parseInt(doubles.innerText);
        leftDoubles--;
        skips.innerText = leftDoubles;
    } else {
        let guessedWords = parseInt(guessed.innerText);
        if (btn.innerText == "Si") guessedWords++;
        else if (guessedWords > 0) guessedWords--;
        guessed.innerText = guessedWords;
    }

    result.classList.toggle("hide");
    if (getTimeLeft() > 0)
        hideOverlay();
    else {
        document.getElementById("score").innerText = guessed.innerText;
        menu.classList.toggle("hide");
    }
}

function restart() {
    menu.classList.toggle("hide");
    hideOverlay();
    word.innerText = "";
    timeLeft.innerText = ":60";
    guessed.innerText = "0";
    skips.innerText = "3";
    doubles.innerText = "2";
}