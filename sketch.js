var WIDTH = 500;
var HEIGHT = 500;
var boringUrl = "https://s20.postimg.org/py9hp6lr1/boring.png";
var starUrl = "https://s20.postimg.org/vq9lwbvkt/star.png";


var bgUrl = "https://s20.postimg.org/wng157731/image.png";
var pointerUrl = "https://s20.postimg.org/n5ga55lel/pointer.png";
var rotatableUrl = "https://s20.postimg.org/qdkri77od/rotatable.png";
var topUrl = "https://s20.postimg.org/4gy8htuhp/top.png";

var complete = false;
var boringImage;
var starImage;


var bgImage;
var pointerImage;
var rotatableImage;
var topCircleImage;

var wheelIcons;
var wheelTexts;
var wheelPoints;

/**
 * graphic value
 */
var centerX;
var centerY;
var scaling;
var textRadius;
var iconRadius;

var robotoFont;

var g;

/**
 * control value
 */

var isLocked = false;
var mouseIsStartDrag = false;
var isConfirm = false;
var topCircleDown = false;
/**
 * Physic value 
 */
var vRT = 0;
var tableAngle = 0;
var lastPointerAngle;


/**
 * listener
 */

function doNothing() {
    return false;
}

var mousePressedAct = doNothing;
var mouseReleasedAct = doNothing;

var effect = doNothing;

function loadSketchFuncs() {
    initValue();
    drawAct = sketchDraw;
    mousePressedAct = sketchMousePressed;
    mouseReleasedAct = sketchMouseReleased;

}



/**
 * math function
 */

function normalRadian(r) {
    var res = r;
    while (res < 0)
        res += Math.PI * 2;
    while (res >= Math.PI * 2)
        res -= Math.PI * 2;
    return res;
}

function directVector(s, d) {
    if (Math.abs(d - s) > Math.PI) {
        if (s > d)
            return (d - s + Math.PI * 2);
        else
            return (d - Math.PI * 2 - s);
    } else
        return (d - s);
}


function manageVector(s, d, h) {
    var distance = directVector(s, d);
    return distance / (distance * distance / h / h + 1);
}

function getSellId(angle) {
    var t = normalRadian(-angle + Math.PI / 8);
    return Math.floor(t / (Math.PI / 4));
}

function getAngle(id) {
    return normalRadian(-id * Math.PI / 4);
}

function updatePhysical() {
    if (mouseIsStartDrag) {
        var crAngle = getMouseAngle();
        vRT = vRT * 0.7 + directVector(lastPointerAngle, crAngle) * 0.3;
        lastPointerAngle = crAngle;
    } else
        vRT *= 0.99;
    if (!isConfirm)
        if ((Math.abs(vRT) > 0.2) && (!mouseIsStartDrag))
            isConfirm = true;
    tableAngle = normalRadian(vRT + tableAngle);
    if (Math.abs(vRT) < 0.002) {
        vRT = vRT * 0.3 + manageVector(tableAngle, getAngle(getSellId(tableAngle)), (Math.PI / 4)) / 120 * 0.7;
        tableAngle += vRT;
        if (isConfirm)
            if (Math.abs(directVector(tableAngle, getAngle(getSellId(tableAngle)))) < 0.05) {
                isConfirm = false;
                handleResult(getSellId(tableAngle));
            }
    }
}


function getMouseAngle() {
    return normalRadian(Math.atan2(g.mouseY - centerY, g.mouseX - centerX));
}

function getMouseRad() {
    return Math.sqrt((g.mouseY - centerY) * (g.mouseY - centerY) + (g.mouseX - centerX) * (g.mouseX - centerX));
}

function autoRotate() {
    vRT = g.random(0.3, 1.01);
}

function topCircleVisited() {
    return getMouseRad() < (topCircleImage.width * scaling / 2);
}

function wheelVisited() {
    return getMouseRad() < (rotatableImage.width * scaling / 2);
}


function sketchMousePressed() {

    if (isLocked || isConfirm) return;
    if (wheelVisited()) {
        isConfirm = false;
        if (topCircleVisited()) {
            topCircleDown = true;

        } else {
            mouseIsStartDrag = true;
            lastPointerAngle = getMouseAngle();
        }
    }
}

function sketchMouseReleased() {
    mouseIsStartDrag = false;
    if (topCircleDown) {
        if (topCircleVisited()) {
            autoRotate();
        }
        topCircleDown = false;
    }


}

function lock(locked) {
    isLocked = locked;
}


/**
 * Effect function
 */

function showEffectHappy(resultID) {
    var icon = wheelIcons[resultID];
    var maxStar = 40;
    var x = [];
    var y = [];
    var dx = [];
    var dy = [];
    var angle = [];
    var dAngle = [];
    var frame = 0;
    var starRemain = maxStar;
    var startExist = 0;

    function runHappy() {
        frame++;
        if (frame % 10 === 0 && startExist < maxStar) {
            x[startExist] = 0;
            y[startExist] = -iconRadius;
            dx[startExist] = g.random(-4, 4);
            dy[startExist] = g.random(-7, -3);
            angle[startExist] = 0;
            dAngle[startExist] = g.random(-Math.PI / 32, Math.PI / 32);
            startExist++;
        }
        starRemain = maxStar;
        for (var i = 0; i < startExist; i++) {
            if (y[i] + centerY > HEIGHT * 1.5) {
                starRemain--;
                continue;
            }
            dy[i] += 0.2;
            x[i] += dx[i];
            y[i] += dy[i];
            angle[i] += dAngle[i];
            g.push(); {
                g.translate(x[i], y[i]);
                g.rotate(angle[i]);
                drawCenter(icon, 0, 0);
            }
            g.pop();
        }
        if (starRemain === 0)
            effect = doNothing;
    }
    effect = runHappy;
}


function showEffectBoring(resultID) {
    var icon = wheelIcons[resultID];
    var frame = 0;

    function runBoring() {
        frame++;
        g.push();
        g.translate(0, -iconRadius);
        g.scale(Math.sqrt(1 + frame / 4));
        drawCenter(icon, 0, 0);
        g.pop();
        if (frame > 150) effect = doNothing;
    }
    effect = runBoring;

}

var setupAct = function() {
    //staticP = p;
    g.createCanvas(WIDTH, HEIGHT);
    g.frameRate(60);
    g.loop();
    loadSketch();
    g.println("setup()");
};

var loadingText = "Connecting";
var drawAct = function() {
    g.background(255, 255, 255);
    var len = Math.floor(g.frameCount % 60 / 20);
    var i;
    var s = loadingText.concat(" ")
    for (i = 0; i <= len; i++)
        s = s.concat(".");
    g.textSize(40);
    g.text(s, 100, 300);
};



function drawCenter(im, x, y) {
    g.image(im, x - im.width / 2, y - im.height / 2);
}


function sketchDraw() {
    updatePhysical();
    g.background(255, 255, 255);
    g.translate(centerX, centerY);
    g.scale(scaling);
    g.push(); {
        if (isConfirm) {
            if (Math.floor(tableAngle % Math.PI * 2) % 2 === 0)
                g.rotate(Math.PI / 16);
        }
        drawCenter(bgImage, 0, 0);
    }
    g.pop();
    g.push(); {
        g.rotate(tableAngle);
        drawRotatable();
    }
    g.pop();
    drawCenter(pointerImage, 0, 0);
    if (topCircleDown) {
        g.push();
        g.scale(0.95);
        drawCenter(topCircleImage, 0, 0);
        g.pop();
    } else {
        drawCenter(topCircleImage, 0, 0);
    }
    effect();
}




var loadImageErrorOverride = function(errEvt) {
    g.print("fail")
    const pic = errEvt.target;
    if (!pic.crossOrigin)
        return g.print('Failed to reload ' + pic.src + '!');
    g.print('Attempting to reload it as a tainted image now...');
    pic.crossOrigin = null;
    pic.src = pic.src;
}




function loadImageFromArray(arr, success, fail) {
    var res = [];
    //  g.print("loadImageFromArray(arr, success, fail) len\n".concat(arr));
    function loader(id, arr, ret) {
        if (id < arr.length)
            g.loadImage(arr[id], function(pic) {
                ret.push(pic);
                g.print("load Image ".concat(arr[id]))
                loader(id + 1, arr, ret);
            }, loadImageErrorOverride);
        else
            success(res);

    }
    loader(0, arr, res);
}

/**
 * 
 *
 * 
 **/

function loadWheelText(points) {
    wheelTexts = [];
    var i;
    for (i = 0; i < points.length; i++)
        if (points[i] > 0) wheelTexts.push("+".concat(points[i]).concat(" points"));
        else
            wheelTexts.push("Better luck\nnext time");
}

function loadSketch() {
    g.print("loadSketch()")
    g.loadImage(bgUrl, function(pic) {
            bgImage = pic; loadingText = "Loading 30%";
            g.loadImage(pointerUrl, function(pic) {
                pointerImage = pic;
                g.loadImage(topUrl, function(pic) {
                    topCircleImage = pic; loadingText = "Loading 50%";
                    g.loadImage(rotatableUrl, function(pic) {
                        rotatableImage = pic; loadingText = "Loading 60%";
                        g.loadImage(topUrl, function(pic) {
                            topCircleImage = pic; loadingText = "Loading 65%";
                            loadItem(function(points, url) {
                                loadWheelText(points);
                                wheelPoints = points; loadingText = "Loading text 90%";
                                loadImageFromArray(url, function(pics) {
                                    wheelIcons = pics; loadingText = "Load 100%";
                                    loadSketchFuncs();
                                }, function() {});
                            }, function() {

                            });

                        }, loadImageErrorOverride);
                    }, loadImageErrorOverride);
                }, loadImageErrorOverride);
            }, loadImageErrorOverride);
        },
        loadImageErrorOverride);
    //robotoFont = g.loadFont("Roboto-Bold-18.vlw");
    //g.textFont(g.createFont("Arial Bold", 18));


}


function initValue() {
    centerX = WIDTH / 2.0;
    centerY = HEIGHT / 2.0;
    scaling = g.min(HEIGHT, WIDTH) / bgImage.width * 0.95;
    textRadius = bgImage.width * 0.65 / 2;
    iconRadius = bgImage.width * 0.46 / 2;

}



function drawRotatable() {
    g.rotate(-Math.PI / 8);
    drawCenter(rotatableImage, 0, 0);
    g.rotate(Math.PI / 8);
    g.textSize(18);
    g.fill(255, 255, 255);
    g.stroke(255, 255, 255);
    g.textAlign(g.CENTER, g.CENTER);
    for (var i = 0; i < 8; i++) {
        g.text(wheelTexts[i], 0, -textRadius);
        drawCenter(wheelIcons[i], 0, -iconRadius);
        g.rotate(Math.PI / 4);
    }

}




/**
 * load sketch to webpage
 * do not edit
 **/

var luckyWheel = function(p) {
    g = p;
    p.setup = function() {
        setupAct();
    }

    p.draw = function() {
        drawAct();
    }

    p.mousePressed = function() {
        mousePressedAct();
    }

    p.mouseReleased = function() {
        mouseReleasedAct();
    }

};
var myp5 = new p5(luckyWheel);


















/**
 * Udate data 
 */

function handleResult(idResult) {
    g.print("Result ".concat(idResult));
    if (wheelPoints[idResult]>0)showEffectHappy(idResult);
    else showEffectBoring(idResult);
    
    //todo : submit result here
    
}


function loadItem(success, fail) {
    //todo : return your data 

    g.print("loadItem(success, fail)");
    success([0, 1, 0, 3, 5, 9, 6, 0], [
        boringUrl,
        starUrl,
        boringUrl,
        starUrl,
        starUrl,
        starUrl,
        starUrl,
        boringUrl
    ]);
}





function refresh() {
    s = Date();
}