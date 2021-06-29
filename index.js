let canvas;
let ctx;
let draw_color;
let drawing_width;
let drawing_style;
let restore_array = [];
let index = -1;
let toolbarElement;
let menuElement;
let toolSettingsElement;
let footerElement;

const PENCIL_DEFAULT_WIDTH = 1;
const BRUSH_DEFAULT_WIDTH = 5;
const ERASER_DEFAULT_WIDTH = 3;
const TOOLS = ["pencil", "brush", "eraser"];
let active_tool = "pencil";

function resizeCanvas(canvas) {
    let temp = ctx.getImageData(0,0,canvas.width,canvas.height);
    // const parent = canvas.parentElement;
    // console.log(parent.offsetWidth, parent.offsetHeight);
    // canvas.width = parent.offsetWidth;
    // canvas.height = parent.offsetHeight;
    ctx.putImageData(temp,0,0);

    // console.log(parent.offsetWidth, parent.offsetHeight);
}

function getMouesPosition(e) {
    let mouseX = e.offsetX * canvas.width / canvas.clientWidth | 0;
    let mouseY = e.offsetY * canvas.height / canvas.clientHeight | 0;
    if (
        e.target == toolbarElement
        || e.target == menuElement
        || e.target.closest("#tool-bar") == toolbarElement
        || e.target.closest("#menu") == menuElement
    ) {
        const canvasPosition = canvas.getBoundingClientRect()
        mouseX = mouseX - canvasPosition.x | 0;
        mouseY = mouseY - canvasPosition.y | 0;
    } else if (
        e.target == toolSettingsElement
        || e.target.closest("#tool-settings") == toolSettingsElement
        || e.target == footerElement
        || e.target.closest("#footer") == footerElement
    ) {
        mouseX = -1;
        mouseY = -1;
    }
    return {x: mouseX, y: mouseY};
}

let painting = false;
function startPosition(e) {
    e.preventDefault();
    painting = true;
    draw(e);
    window.addEventListener("mouseup", endPosition);
    window.addEventListener("mousemove", draw);
}
function endPosition(event) {
    painting = false;
    ctx.beginPath();

    if (event.type =="mouseup") {
        restore_array.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
    // console.log(restore_array);
    window.removeEventListener("mouseup", endPosition);
    window.removeEventListener("mousemove", draw);
}
function draw(e) {
    if(!painting) return;
    // console.log(e)

    const mousePosition = getMouesPosition(e);
    // console.log(mousePosition);
    if(mousePosition.x == -1 || mousePosition.y == -1) {
        return;
    }
    ctx.lineWidth = drawing_width;
    ctx.lineCap = drawing_style;
    drawing_style = "round";
    ctx.strokeStyle = draw_color;
    ctx.lineTo(mousePosition.x, mousePosition.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mousePosition.x, mousePosition.y);
    ctx.beginPath();
    ctx.moveTo(mousePosition.x, mousePosition.y);
}

// function initDraw() {
//     ctx.fillStyle = "white";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     /*ctx.fillStyle = "yellow";
//     ctx.fillRect(20, 20, 30, 30);
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 10;
//     ctx.strokeRect(40, 40, 60, 60);

//     ctx.beginPath();
//     ctx.moveTo(105,100)
//     ctx.lineTo(300, 100);
//     ctx.lineTo(300, 150);
//     ctx.strokeStyle = "orange";
//     ctx.closePath();
//     ctx.stroke();*/

// }

window.addEventListener("load", () => {
    toolbarElement = document.getElementById("tool-bar");
    menuElement = document.getElementById("menu");
    toolSettingsElement = document.getElementById("tool-settings");
    footerElement = document.getElementById("footer");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas(canvas);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("range").value = PENCIL_DEFAULT_WIDTH;
    rangeChanged(PENCIL_DEFAULT_WIDTH);
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);
    {const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', () => save(canvas));
  };
});
window.addEventListener("resize", () => {
    resizeCanvas(canvas);
});




function clear_canvas() {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.clearRect(0,0, canvas.width, canvas.height);
    // ctx.clearRect(0,0, canvas.width, canvas.height);
    // restore_array = [];
    // index = -1;
}
function change_color(value) {
    if (active_tool == "eraser") {
        return
    }
    draw_color = value;
    
    
}

function changeActiveTool(tool) {
    active_tool = tool;
     let TOOLS = document.getElementsByClassName("tool");
     for (let i = 0; i < TOOLS.length; i++) {
         TOOLS[i].classList.remove("active");
     }
     document.getElementById(tool).classList.add("active");
}

function erase() {
    draw_color = "white";
    drawing_width = ERASER_DEFAULT_WIDTH;
    document.getElementById("range").value = drawing_width;
    changeActiveTool("eraser");
    rangeChanged(drawing_width);
}
function sketch() {
    draw_color = document.getElementById("color-picker").value;
    drawing_width = PENCIL_DEFAULT_WIDTH;
    document.getElementById("range").value = drawing_width;
    changeActiveTool("pencil");
    rangeChanged(drawing_width);
}
function paint() {
    draw_color = document.getElementById("color-picker").value;
    drawing_width = BRUSH_DEFAULT_WIDTH;
    document.getElementById("range").value = drawing_width;
    changeActiveTool("brush");
    rangeChanged(drawing_width);
}
function set_size() {
    drawing_width = document.getElementById("range").value;
}
function undo_last() {
    if (index <= 0){
        index -= 1;
        clear_canvas();
}   else {
    index -= 1;
    ctx.putImageData(restore_array[index], 0, 0);
}
}
function redo_next() {
    // console.log(index, restore_array);
    if (index >= restore_array.length - 1){
        return;
}   else {
    index += 1;
    ctx.putImageData(restore_array[index], 0, 0);
}
}
function rangeChanged(value) {
document.getElementById("range-value").innerHTML = value;
}
function save(canvas) {
    const data = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = data;
    anchor.download = 'image.png';
    anchor.click();
  }


  //COLOR-PICKER
  