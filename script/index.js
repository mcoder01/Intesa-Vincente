let word;
let timeLeft;
let guessed;

let overlay;
let countdown;
let result;

let words;
let doubleWords;

let timerId;

async function loadTextFile(file) {
    let text = await (await fetch(file)).text();
    return text.split("\n");
}

async function loadWords() {
    words = await loadTextFile("res/parole.txt");
    doubleWords = await loadTextFile("res/raddoppio.txt");
}

window.onload = function() {
    word = document.getElementById("word");
    timeLeft = document.getElementById("time-left");
    guessed = document.getElementById("guessed");

    overlay = document.getElementById("overlay");
    countdown = document.getElementById("countdown");
    result = document.getElementById("result");
    loadWords();
}

window.onkeydown = function(key) {
    if (!overlay.classList.contains("hide"))
        return;

    if (key.key == " ") {
        if (timerId === undefined) {
            let r = parseInt(Math.random()*words.length);
            word.innerText = words[r];
            timerId = createTimer(
                parseInt(timeLeft.innerText.slice(1)), 
                time => timeLeft.innerText = ":" + (time > 9 ? time : "0" + time), 
                () => timerId = undefined
            );
        } else {
            stopTimer(timerId, () => timerId = undefined);
            overlay.classList.toggle("hide");
            createTimer(3, time => countdown.innerText = time, 
                () => {
                    countdown.innerText = "3";
                    countdown.classList.toggle("hide");
                    result.classList.toggle("hide");
                }
            );
        }
    }
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

function resultButton(btn) {
    let guessedWords = parseInt(guessed.innerText);
    if (btn.innerText == "Si") guessedWords++;
    else if (guessedWords > 0) guessedWords--;
    guessed.innerText = guessedWords;
    result.classList.toggle("hide");
    countdown.classList.toggle("hide");
    overlay.classList.toggle("hide");
}