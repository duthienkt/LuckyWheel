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


var centerX;
var centerY;
var scaling;
var textRadius;
var iconRadius;

var robotoFont;

var g;



var setupAct = function() {
    //staticP = p;
    g.createCanvas(WIDTH, HEIGHT);
    g.frameRate(60);
    g.loop();
    loadSketch();
    g.println("setup()");
};

var drawAct = function() {
    g.background(255, 255, 255);
    var len = g.floor(g.frameCount % 60 / 20);
    var i;
    var s = "Loading "
    for (i = 0; i <= len; i++)
        s = s.concat(".");
    g.textSize(40);
    g.text(s, 100, 300);
};


var mousePressedAct = function(g) {

};
var mouseReleasedAct = function(g) {

};


function drawCenter(im, x, y) {
    g.image(im, x - im.width / 2, y - im.height / 2);
}


function sketchDraw() {
    g.background(0);
    g.translate(centerX, centerY);
    drawCenter(bgImage, 0, 0);
    drawRotatable();
    drawCenter(pointerImage, 0, 0);
    drawCenter(topCircleImage, 0, 0);

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

function loadSketchFuncs() {
    initValue();
    drawAct = sketchDraw;

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
            bgImage = pic;
            g.loadImage(pointerUrl, function(pic) {
                pointerImage = pic;
                g.loadImage(topUrl, function(pic) {
                    topCircleImage = pic;
                    g.loadImage(rotatableUrl, function(pic) {
                        rotatableImage = pic;
                        g.loadImage(topUrl, function(pic) {
                            topCircleImage = pic;
                            loadItem(function(points, url) {
                                loadWheelText(points);
                                wheelPoints = points;
                                loadImageFromArray(url, function(pics) {
                                    wheelIcons = pics;
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
        robotoFont = g.loadFont("https://github.com/FabLabBerlin/Fablab3D/raw/master/data/fonts/Roboto-Bold-48.vlw");
        g.textFont(robotoFont);
    
        
}


function initValue() {
        centerX = WIDTH / 2.0;
        centerY = HEIGHT / 2.0;
        scaling = g.min(HEIGHT, WIDTH) /  bgImage.width * 0.95;
        textRadius = bgImage.width * 0.65 / 2;
        iconRadius = bgImage.width * 0.46 / 2;

    }



function drawRotatable() {
    g.rotate(-g.PI / 8);
    drawCenter(rotatableImage, 0, 0);
    g.rotate(g.PI / 8);
    g.textSize(18);
    g.textAlign(g.CENTER, g.CENTER);
    for (var i = 0; i < 8; i++) {
        g.text(wheelTexts[i], 0, -textRadius);
        drawCenter(wheelIcons[i], 0, -iconRadius);
        g.rotate(g.PI / 4);
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

function refresh() {
    s = Date();
}