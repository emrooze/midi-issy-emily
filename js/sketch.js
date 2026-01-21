//////////////////////////
/* EDIT VALUES BELOW TO MATCH DEVICE SLIDERS*/
const CCSLIDER1 = 36;
const CCSLIDER2 = 37;
const CCSLIDER3 = 38;
const CCSLIDER4 = 39;
const CCKNOB1 = 32;
const CCKNOB2 = 33;
const CCKNOB3 = 34;
const CCKNOB4 = 35;
let myController;


///////////////////////////
// variables that correspond to MIDI controller values 
let r1 = 180;
let r2 = 180;
let a1 = 0;
let a2 = 0;

let a1Inc = 2.5;
let a2Inc = 2.5;

let prevX;
let prevY;

let strokeW = 3.5;
let max = 5;
let r = 255;
let g = 255;
let b = 255;
let a;


//////////////////////////
// built in P5 function gets called at the beginning
function setup() {
    createCanvas(innerWidth, innerHeight);
    background(0);
    angleMode(DEGREES);

    WebMidi
        .enable()
        .then(onEnabled)
        .catch(err => alert(err));


    a1Inc = random(0.1, 5);
    a2Inc = random(0.1, 5);
}
// gets called by MIDI library once MIDI enabled
function onEnabled() {
    // Display available MIDI input devices
    if (WebMidi.inputs.length < 1) {
        console.log("No device detected.");
    } else {
        WebMidi.inputs.forEach((device, index) => {
            console.log(`${index}: ${device.name}`);
        });
    }
    myController = WebMidi.inputs[0];
    myController.channels[1].addListener("controlchange", allCC);

}
// gets called when a MIDI control change message is intercepted
function allCC(e) {
    console.log("controller number = " + e.controller.number + ", value = " + e.data[2]);
    let ratio = e.data[2] / 127
    switch (e.controller.number) {
        case CCSLIDER1:
            console.log("Slider 1 moved to " + ratio);
            r = 255 * ratio;
            break;
        case CCSLIDER2:
            g = 255 * ratio;
            break;
        case CCSLIDER3:
            b = 255 * ratio;
            break;
        case CCSLIDER4:
            a = 255 * ratio;
            break;
        case CCKNOB1:
            r1, r2 = 350 * ratio;
            break;
        case CCKNOB2:
            a1Inc, a2Inc = 5 * ratio;
        
            break;
        case CCKNOB3:
            strokeW = 7 * ratio;
            break;
        case CCKNOB4:
            max = 1 + 29 * ratio;
            break;
    }

}

function draw() {
    noFill();
    drawSpiral();

    drawFrame(230, 0)
}

function drawSpiral() {

    translate(width / 2, height / 2);

    for (let i = 0; i < max; i++) {
        let x1 = r1 * cos(a1);
        let y1 = r1 * sin(a1);

        let x2 = x1 + r2 * cos(a2);
        let y2 = y1 + r2 * sin(a2);

        // let r = map(sin(frameCount), -1, 1, 100, 200);
        // let g = map(cos(frameCount), -1, 1, 100, 200);
        // let b = map(sin(frameCount), -1, 1, 200, 100);

        stroke(r, g, b, a);
        strokeWeight(strokeW);

        line(prevX, prevY, x2, y2);

        prevX = x2;
        prevY = y2;

        a1 += a1Inc;
        a2 += a2Inc;
    }
}
function drawFrame(w){
    noStroke();
    fill(0,0,0);
    rect( - width / 2, - height/2, w, height);
    rect((width/2)-w, - height/2, w, height)

}
