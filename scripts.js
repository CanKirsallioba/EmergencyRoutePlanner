let canvas;
let ctx;
let savedImageData;
let dragging = false;
let strokeColor = "brush";
let fillColor = "brush";
let lineWidth = 2;
let polygoneSides = 6;
let currentTool = 'brush';
let canvasWidth = 1000;
let canvasHeight = 600;

class ShapeBoundingBox {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

class MouseDownPos {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class PolygonPoint {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
let mousedown = new MouseDownPos(0,0);
let loc = new Location(0,0);

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    canvas.addEventListener("mousedown", ReactToMouseDown);
    canvas.addEventListener("mousemove", ReactToMouseMove);
    canvas.addEventListener("mouseup", ReactToMouseUp)
}

function ChangeTool(toolClicked) {
    document.getElementById('save').className="";
    document.getElementById('brush').className="";
    document.getElementById('line').className="";
    document.getElementById('circle').className="";
    document.getElementById('ellipse').className="";
    document.getElementById('polygon').className="";

    document.getElementById(toolClicked).className = 'selected';
    currentTool = toolClicked
}

function GetMousePosition(x,y) {
    let canvasSizeData = canvas.getBoundingClientRect();
    return {x: (x - canvasSize.Data.left) * (canvas.width / canvasSizeData.width),
        y: (y - canvasSize.Data.top) * (canvas.height / canvasSizeData.height)};
}

function SaveCanvasImage() {
    savedImageData = ctx.getImageData(0, 0, canvas.width,canvas.height);
}

function RedrawCanvasImage() {
    ctx.putImageData(savedImageData,0,0);
}

function UpdateRubberbandSizeData(loc){
    shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

    if(loc.x > mousedown.x){
        shapeBoundingBox.left = mousedown.x;
    } else {
        shapeBoundingBox.left = loc.x;
    }

    if(loc.y > mousedown.y){
        shapeBoundingBox.top = mousedown.y;
    } else {
        shapeBoundingBox.top = loc.y;
    }
}

function getAngleUsingXAndY(mouselocX, mouselocY){
    let adjacent = mousedown.x - mouselocX;
    let opposite = mousedown.y - mouselocY;

    return radiansToDegrees(Math.atan2(opposite, adjacent));
}

function radiansToDegrees(rad){
    if (rad < 0){
        return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
    } else {
        return (rad * (180 / Math.PI)).toFixed(2);
    }
}

function degreesToRadians(degrees){
    return degrees * (Math.PI / 180);
}

function ReactToMouseDown(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    SaveCanvasImage();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;
}

function ReactToMouseMove(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
}

function ReactToMouseUp(e){
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}

function SaveImage(){
    var imageFile = document.getElementById("img-file");
    imageFile.setAttribute('download', 'image.png');
    imageFile.setAttribute('href', canvas.toDataURL());
}