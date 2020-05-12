/* Note that y axis of the coodinate system is opposite to the standard mathematic coordinate system */

class Plane {
    constructor() {
        this.equations = [];
        for (const equation of arguments) {
            if (equation !== void 0 && typeof equation.func === 'function') this.equations.push(equation);
        }

        this.scaler = 1;
        this.origin = {
            x: 0,
            y: 0
        };
        this.gap = 1;

    }
}
Plane.prototype.draw = function() {
    /* drawing the blank plane */
    stroke(60, 60, 60);

    // draws the x axis and the y axis
    strokeWeight(2);
    line(this.origin.x, height/2, this.origin.x, -height/2);
    line(width/2, -this.origin.y, -width/2, -this.origin.y);
    
    //100 > 10
    // draws the markers
    // const max_gap = 300;
    // const gap = 50;
    const scaler = this.scaler / (height*0.5);
    const gap = 300*scaler*this.getGap(round(Math.log(scaler)/Math.log(2))+2);

    // console.log(scaler);
    // console.log(round(Math.log(scaler)/Math.log(2))+1, this.getGap(round(Math.log(scaler)/Math.log(2))+1));
    strokeWeight(0.5);
    fill(0);
    textSize(12);
    
    for (let x = -100; x < 100; x++) {
        line(this.origin.x+(x*gap), height/2, this.origin.x+(x*gap), -height/2);
        // text(String(this.getGap(round(Math.log(scaler)/Math.log(2))+2)), this.origin.x+(x*gap), 0);
    }
    for (let y = -100; y < 100; y++) {
        line(width/2, -this.origin.y+(y*gap), -width/2, -this.origin.y+(y*gap));
        text((this.getGap(round(Math.log(scaler)/Math.log(2))+2)*-y).toFixed(2), this.origin.x+10, -this.origin.y+(y*gap));
    }

    // strokeWeight(0.1);
    // for (let x = -100; x < 100; x++) {
    //     line(this.origin.x+(x*gap/5), height/2, this.origin.x+(x*gap/5), -height/2);
    // }
    // for (let y = -100; y < 100; y++) {
    //     line(width/2, -this.origin.y+(y*gap/5), -width/2, -this.origin.y+(y*gap/5));
    // }

    /* plots the equations */
    strokeWeight(3);
    noFill();

    for (let equation of this.equations){
        const color = equation.color;
        const func = equation.func;
        stroke(color[0], color[1], color[2]);

        beginShape();
        for (let x = -100; x < 100; x+=0.1) {
            vertex(this.origin.x+(x*this.scaler), -this.origin.y-((func(x))*this.scaler));
        }
        endShape();
    }
}
Plane.prototype.scale = function(scale_factor) {
    this.origin.x *= scale_factor;
    this.origin.y *= scale_factor;
    this.scaler *= scale_factor;
}
Plane.prototype.getGap = function(factor) {
    let gap = 1;
    if (factor >= 0) {
        for (let i = 0; i < factor; i++){
            gap /= (gap.toString().split('').pop() !== '5') ? 2 : 2.5
        }
    } else {
        for (let i = 0; i < -factor; i++){
            gap *= (gap.toString()[0] !== '2') ? 2 : 2.5
        }
    }
    return gap
}

class Equation {
    constructor(func, color = [255, 0, 0]) {
        this.func = func;
        this.color = color;
    }
}


let plane = new Plane(new Equation((x) => Math.sin(x), [50, 50, 255]), 
                      new Equation((x) => Math.cos(x/10)*10, [255, 50, 50]), 
                      new Equation((x) => Math.cos(x/100)*100, [100, 50, 50]), 
                      new Equation((x) => Math.cos(x*100)/100, [0, 50, 50]), 
                      new Equation((x) => Math.tan(x), [50, 255, 50]), 
                      new Equation((x) => x**2, [50, 255, 255]), 
                      new Equation((x) => x**3, [255, 255, 50]));
plane.scale(300)

function setup() {
    createCanvas(600, 600);
}

function draw() {
    background(252, 252, 252);
    translate(width/2, height/2);

    plane.draw();
}


      //////////////////
     ///// EVENTS /////
    //////////////////


function mouseWheel(event) {
    plane.scale(((event.delta < 0) ? 1.1 : (1/1.1)));
    return false; // avoiding some behaviors on different browsers
}


let previus_mouse_position = {
    x: null,
    y: null
}

function mousePressed() {
    previus_mouse_position.x = mouseX - width/2;
    previus_mouse_position.y = mouseY - height/2;
    return false; // refer above
}

function mouseDragged() {
    const translated_mouseX = mouseX - width/2;
    const translated_mouseY = mouseY - height/2;

    const dx = translated_mouseX - previus_mouse_position.x;
    const dy = translated_mouseY - previus_mouse_position.y;

    plane.origin.x += dx;
    plane.origin.y -= dy;

    previus_mouse_position.x = translated_mouseX;
    previus_mouse_position.y = translated_mouseY;

    return false; // refer above
}