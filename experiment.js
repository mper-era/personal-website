let snowflakes = [];

let screenH, screenW;

let numSnow = 100;
let speedMin = 50;
let speedMax = 100;

let reset = false;

function init()
{
    window.addEventListener("DOMContentLoaded", generateSnowflakes, false);
    window.addEventListener("resize", setResetFlag, false);
}
init();

class Snowflake {

    constructor(elem, speed, x, y)
    {
        this.elem = elem;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.scale = randNum(0.8, 1.2);

        this.flakeTime = 0;
        this.a = Math.random() / 4;
        this.b = (Math.random() < 0.5 ? 1 : -1) * randNum(1.5, 4);
        this.initx = Math.random();
        this.inity = Math.random() + 0.1;

        this.elem.style.opacity = (0.3 + Math.random()) / 3;
    }

    update(delta) {
        // snowflake motion, delta is change in time
        this.flakeTime += (this.speed / 5000) * delta;
        this.x = ((this.initx * screenW) / (screenW / 10)) + (Math.sqrt(this.a * 2 * this.flakeTime) * Math.sin(2 * this.flakeTime) * Math.sin((1 / this.b) * (2 * this.flakeTime) * (Math.PI / this.b)));
        this.y = ((this.inity * screenH) / (screenH / 10)) + this.flakeTime - 1;

        // snowflake opacity, scale changing
        
        this.elem.style.transform = `translate3d(${this.x * (screenW / 10)}px, ${this.y * (screenH / 10)}px, 0) scale(${this.scale}, ${this.scale})`;
        if (this.y * (screenH / 10) > screenH) {
            this.flakeTime = 0;
            this.inity = 0;
        }
    }
}

function generateSnowflakes() {
    let origFlake = document.querySelector(".snowflake");

    let container = origFlake.parentNode;
    container.style.display = "block";

    screenH = document.documentElement.clientHeight;
    screenW = document.documentElement.clientWidth;

    for (let i = 0; i < numSnow; i++)
    {
        let cloneFlake = origFlake.cloneNode(true);
        container.appendChild(cloneFlake);

        let speed = randNum(speedMin, speedMax);

        let objFlake = new Snowflake(cloneFlake, speed, 0, -10);
        snowflakes.push(objFlake);
    }

    container.removeChild(origFlake);

    requestAnimationFrame(moveSnowflakes);
}

function randNum(a, b)
{
    return (a + ((b - a) * Math.random()));
}

let pastTime = performance.now();
let delta = 1

function moveSnowflakes(curTime) {
    delta = ((curTime - pastTime) / (1000 / 60));
    delta = Math.min(delta, 2);

    for (let i = 0; i < snowflakes.length; i++)
    {
        snowflakes[i].update(delta);
    }

    pastTime = curTime;

    if (reset == true) {
        screenH = document.documentElement.clientHeight;
        screenW = document.documentElement.clientWidth;

        for (let i = 0; i < snowflakes.length; i++)
        {
            let snowflake = snowflakes[i];

            snowflake.x = randNum(0, screenW);
            snowflake.y = -10;
        }

        reset = false;
    }

    requestAnimationFrame(moveSnowflakes);
}

function setResetFlag(e) {
    reset = true;
}