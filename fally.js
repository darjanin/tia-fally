"use strict";

var ctxFg;
var ctxBg;
var height;
var width;
var mousePos = { x: undefined, y: undefined };
var requestId;
var lastUpdate;
var clouds = [];
var firstCloudRowY;

var wallThickness = 50;                                                         // size in px
var spaceBetweenWalls = 400;                                                    // size in px
var minSpaceBetweenWalls = 200;
var cloudWidth = 0.3;                                                           // size in percent / 100
var fallSpeed = 5;

var score;
var startGame = false;

var ball = {
    x: undefined,
    y: undefined,
    radius: wallThickness,
    color: "black",
    vx: undefined,
    vy: undefined,
    imageFile: 'parachute.png',
    img: undefined,
    init: function () {
        this.x = width / 2;
        this.y = 60;

        var angle = Math.random() * 2 * Math.PI;
        var speed = Math.random() * 200 + 400;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.img = new Image();
        this.img.src = this.imageFile;
    },
    draw: function () {
        ctxFg.drawImage(this.img, this.x - this.radius,this.y - this.radius, this.radius*2, this.radius*2);
        // ctxFg.beginPath();
        // ctxFg.fillStyle = this.color;
        // ctxFg.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        // ctxFg.fill();
    }
};

function CloudRow () {
    var self = this;
    this.clouds = [];
    this.y = height - wallThickness;
    this.vy = fallSpeed;

    var x = randomRange(0, width / 2 - width *  cloudWidth);
    this.clouds.push(new Cloud(x, this.y, width * cloudWidth, wallThickness));
    x = randomRange(x + width * cloudWidth + 2 * wallThickness, width - width * cloudWidth);
    this.clouds.push(new Cloud(x, this.y, width * cloudWidth, wallThickness));

    this.move = function () {
        var clouds = this.clouds;
        this.y -= this.vy;
        // console.log(this.y);
        var y = this.y;

        for (var index = 0; index < clouds.length; index++) {
            clouds[index].y = y;
        }
    };
    this.detectCollision = function(ball) {
        var clouds = this.clouds;

        for (var index = 0; index < clouds.length; index++) {
            if (clouds[index].collision(ball))
                return true;
        }

        return false;
    };

    this.draw = function () {
        var clouds = this.clouds;

        for (var index = 0; index < clouds.length; index++) {
            clouds[index].draw();
        }
    };
}

function Cloud (x, y, width, height) {
    var self = this;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = 'white';

    this.collision = function (ball) {

        if ((ball.x >= this.x) && (ball.x <= this.x + this.width)) {
            if (ball.y + ball.radius >= this.y) {
                return true;
            }
        }
        return false;
    };

    this.draw = function () {
        ctxFg.beginPath();
        ctxFg.fillStyle = this.color;
        ctxFg.fillRect(this.x, this.y, this.width, this.height);
    };
}

window.requestAF = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;

function setSizeAndDrawBackground() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    var kX = newWidth / width;
    var kY = newHeight / height;

    mousePos.x *= kX;
    mousePos.y *= kY;

    ball.x *= kX;
    ball.y *= kY;

    // walls.x *= kX;
    // walls.y *= kY;
    for (var index = 0; index < clouds.length; index++) {
        for (var i = 0; i < clouds[index].length; i++) {
            clouds[index][i].x *= kX;
            clouds[index][i].y *= kY;
        }
    }

    fg.width = newWidth;
    fg.height = newHeight;

    bg.width = newWidth;
    bg.height = newHeight;

    width = newWidth;
    height = newHeight;

    drawBg();
}

function drawBg () {
    var radius = Math.sqrt(width * width + height * height) / 2;
    var radGrad = ctxBg.createRadialGradient(0,0,0,width / 2,height / 2 ,2*radius);
    radGrad.addColorStop(0.0, 'lightyellow');
    radGrad.addColorStop(0.5, 'lightblue');
    radGrad.addColorStop(1.0, 'navy');

    ctxBg.beginPath();
    ctxBg.fillStyle = radGrad;
    ctxBg.rect(0, 0, width, height);
    ctxBg.fill();
}

function drawFg () {
    ctxFg.clearRect(0, 0, width, height);
    ball.draw();

    ctxFg.font =  "40px monospace";
    ctxFg.textAlign = "right";
    ctxFg.fillText(score, width - 20, 50);

    for (var index = 0; index < clouds.length; index++) {
        clouds[index].draw();
    }
}

function frame() {
    var isSafeFly = update();
    drawFg();
    if (!isSafeFly) {
        console.log('Game over');
        ctxFg.font =  "bold 40px monospace";
        ctxFg.fillStyle = '#d01200';
        ctxFg.textAlign = "center";
        ctxFg.fillText("Game Over", width/2, height/2);
        return;
    }
    requestId = window.requestAF(frame);
}

function update () {
    // if (mousePos.x > ball.x )
    ball.x = mousePos.x;
    var collision = false;

    if (clouds[clouds.length - 1].y < height - spaceBetweenWalls) {
        clouds.push(new CloudRow());
    }
    for (var index = 0; index < clouds.length; index++) {
        clouds[index].move();
        if (clouds[index].detectCollision(ball))
            return false;
    }

    if (clouds[0].y < 0) {
        clouds.splice(0,1);
        score += 1;
        if (score % 2 == 0) {
            spaceBetweenWalls = Math.max(spaceBetweenWalls * 0.95, minSpaceBetweenWalls);
        }
    }
    return true;
}

function start() {
    ctxFg = fg.getContext('2d');
    ctxBg = bg.getContext('2d');

    setSizeAndDrawBackground();

    mousePos.x = width / 2;
    mousePos.y = height / 2;
    ball.init();
    clouds.push(new CloudRow());
    score = 0;

    fg.addEventListener('mousemove', function(event) {
        mousePos.x = event.pageX;
        mousePos.y = event.pageY;
    }, true);

    window.addEventListener("resize", setSizeAndDrawBackground, false);
    window.addEventListener("orientationchange", setSizeAndDrawBackground, false);


    lastUpdate = new Date();
    requestId = window.requestAF(frame);
}

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}