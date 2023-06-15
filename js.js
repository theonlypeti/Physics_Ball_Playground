const floor = document.getElementById("floor")
let objs = [];

let GRAVITY = 0.07;
let BOUNCINESS = 0.8;
let DRAG = 7;
let HDRAG = 0.001;
let BALLTYPE = "metal"


class Ball{
    constructor(elem){
        this.elem = elem;
        this.x = parseInt(elem.style.left);
        this.y = parseInt(elem.style.top);
        this.xv = 0;
        this.yv = 0;
        // this.bounciness = BOUNCINESS;
        this.drag = DRAG;
        // this.hdrag = HDRAG;
    }

    update(){
        this.xv = Math.sign(this.xv) * Math.max(Math.abs(this.xv) - this.hdrag, 0);
        this.x += this.xv;
        this.yv = Math.min(this.yv + GRAVITY, this.drag);
        this.y += this.yv;
        this.collision();
        console.log(this.xv, this.yv, this.y + this.elem.offsetHeight - floor.offsetTop)
        if (Math.abs(this.xv) <= this.hdrag && Math.abs(this.yv) <= 0.033 && Math.abs(this.y + this.elem.offsetHeight - floor.offsetTop) <= 0.13){
            objs.splice(objs.indexOf(this), 1);
        } else if (this.x + this.elem.offsetWidth < 0 || this.x > window.innerWidth) {
            this.elem.remove();
            objs.splice(objs.indexOf(this), 1);
        }
    }

    draw(){
        this.elem.style.left = this.x + "px";
        this.elem.style.top = this.y + "px";
    }

    collision(){
        if(this.y + this.elem.offsetHeight - 1 > floor.offsetTop){
            this.yv *= -this.bounciness;
            this.y = floor.offsetTop - this.elem.offsetHeight;
            // if (this.elem.classList.contains("squish")){
            //     this.elem.classList.remove("squish");
            //     void this.elem.offsetWidth;}
            // this.elem.classList.add("squish");
        }
    }
}

class Ice extends Ball{
    constructor(elem){
        super(elem);
        this.hdrag = 0.0005;
        this.bounciness = 0.3;
        this.color = "#60aaff";
        this.elem.style.backgroundColor = this.color;
    }
}

class Slime extends Ball{
    constructor(elem){
        super(elem);
        this.hdrag = 0.01;
        this.bounciness = 0.1;
        this.color = "#00ff00";
        this.elem.style.backgroundColor = this.color;
    }
}

class Rubber extends Ball{
    constructor(elem){
        super(elem);
        this.hdrag = 0.001;
        this.bounciness = 0.9;
        this.color = "#ccaa00";
        this.elem.style.backgroundColor = this.color;
    }
}

class Glass extends Ball{
    constructor(elem){
        super(elem);
        this.hdrag = 0.001;
        this.bounciness = 0.9;
        this.color = "#88aaff";
        this.elem.style.backgroundColor = this.color;
    }

    collision(){
        if(this.y + this.elem.offsetHeight >= floor.offsetTop){
            this.elem.remove();
            objs.splice(objs.indexOf(this), 1);
            this.spawnshards();
        }
    }

    spawnshards(){
        for (let i = 0; i < 10; i++) {
            const shard = document.createElement("div")
            shard.className = "shard bounce"
            shard.style.left = this.x + (Math.random()-0.5) * 20 * Math.min(this.xv,2) * -Math.min(this.yv,2) + "px";
            shard.style.top = floor.offsetTop + (Math.random()-0.5)*5 - 10 + "px";
            shard.style.transform = "rotate(" + Math.random() * 360 + "deg)";
            document.body.insertBefore(shard, floor)
            var rot = Math.random() * 360;
            shard.style.setProperty('--rot', rot +'deg');
            $('.shard').fadeOut(5000, function() {
                $(this).remove();
            });
        }
    }
}

class Metal extends Ball{
    constructor(elem){
        super(elem);
        this.hdrag = 0.001;
        this.bounciness = 0.3;
        this.color = "#aaaaaa";
        this.elem.style.backgroundColor = this.color;
    }
}

const balltypes = {
    "ice": Ice,
    "slime": Slime,
    "rubber": Rubber,
    "glass": Glass,
    "metal": Metal
}


let startpos = 0;
window.onmousedown = function(event) {
    if(event.clientY > 100){
        startpos = event
        dragging = true;
        startarrow(event)
    }
}


window.onmouseup = function(event) {
    if(!dragging){return}
    //velocities
    const xv = (startpos.clientX - event.clientX)/50;
    const yv = (startpos.clientY - event.clientY)/50;

    //make ball elem
    const ball = document.createElement("div")
    ball.className = "ball"
    ball.style.left = startpos.clientX - ball.offsetWidth/2 + "px";
    ball.style.top = startpos.clientY - ball.offsetHeight/2 + "px";

    //make ball obj
    const ballobj = new balltypes[BALLTYPE](ball)
    ballobj.xv = xv;
    ballobj.yv = yv;
    objs.push(ballobj)

    //cleanup
    document.getElementById("arrow").remove()
    dragging = false;

    //insert ball
    const floor = document.getElementById("floor")
    document.body.insertBefore(ball, floor)

}

function startarrow(event){
    const arrow = document.createElement("div")
    arrow.id = "arrow"
    document.body.appendChild(arrow)
    arrow.style.left = event.clientX + "px";
    arrow.style.top = event.clientY + "px";
}

// ball = new Ball(document.getElementById("ball"))
// const ball = document.createElement("div")
// ball.className = "ball"
//
// objs.push(new Ball(ball))
function main(){
    for (const obj of objs){
        // console.log(obj)
        obj.update();
        obj.draw();
    }
}

let dragging = false;
window.onmousemove = function(event) {

    if (dragging) {
        const arrow = document.getElementById("arrow")
        facing(arrow, event.clientX, event.clientY, 270)
    }
}

function facing(elem,x=0,y=0,offset=0){
    const ex = parseInt(window.getComputedStyle(elem).left)
    const ey = parseInt(window.getComputedStyle(elem).top)
    elem.style.height = Math.min(200,Math.sqrt(Math.pow(parseInt(elem.style.top)-y,2) + Math.pow(parseInt(elem.style.left) - x,2))) + "px";
    elem.style.rotate = Math.atan2(ey - y, ex - x) * 180 / Math.PI + offset + "deg"
}
//
// document.getElementById("bounce").addEventListener("input", function(event) {
//     BOUNCINESS = event.target.value;
//     for (const obj of objs){
//         obj.bounciness = BOUNCINESS;
//     }
// })

// document.getElementById("drag").addEventListener("input", function(event) {
//     DRAG = event.target.value;
//     for (const obj of objs){
//         obj.drag = DRAG;
//     }
// })

document.getElementById("gravity").addEventListener("input", function(event) {
    GRAVITY = Number(event.target.value);
    // console.log(GRAVITY)
})

document.getElementById("reset").addEventListener("click", function(event) {
    objs = [];
    const balls = document.getElementsByClassName("ball")
    let balls2 = Array.from(balls)
    for (const ball of balls2) {
        ball.remove()
    }
})

document.getElementById("balltype").addEventListener("change", function(event) {
    BALLTYPE = event.target.value;
})

setInterval(main,1)