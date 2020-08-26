let canvas;
let contex;
let savedImageData;
let dragging = false;
let strokeColor = 'red';
let fillColor = 'black';
let line_Width = 2;
let currentTool = 'brush';
let canvasWidth = 1000;
let canvasHeight = 600;

let usingBrush = false;
let brushXPoints = new Array();
let brushYPoints = new Array();
let brushDownPos = new Array();

class ShapeBoundingBox{
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

class MouseDownPos{
    constructor(x,y) {
        this.x = x,
            this.y = y;
    }
}

class Location{
    constructor(x,y) {
        this.x = x,
            this.y = y;
    }
}


let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
let mousedown = new MouseDownPos(0,0);
let loc = new Location(0,0);

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    canvas = document.getElementById('my-canvas');
    contex = canvas.getContext('2d');
    contex.strokeStyle = strokeColor;
    contex.lineWidth = line_Width;
    canvas.addEventListener("mousedown", ReactToMouseDown);
    canvas.addEventListener("mousemove", ReactToMouseMove);
    canvas.addEventListener("mouseup", ReactToMouseUp);
}

function ChangeTool(toolClicked){
    document.getElementById("save").className = "";
    document.getElementById("brush").className = "";
    document.getElementById("line").className = "";
    document.getElementById("rectangle").className = "";
    document.getElementById("circle").className = "";
    document.getElementById(toolClicked).className = "selected";
    currentTool = toolClicked;
}
function GetMousePosition(x,y){
    let canvasSizeData = canvas.getBoundingClientRect();
    return { x: (x - canvasSizeData.left) * (canvas.width  / canvasSizeData.width),
        y: (y - canvasSizeData.top)  * (canvas.height / canvasSizeData.height)
    };
}

function SaveCanvasImage(){
    savedImageData = contex.getImageData(0,0,canvas.width,canvas.height);
}

function RedrawCanvasImage(){
    contex.putImageData(savedImageData,0,0);
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
    if(rad < 0){
        return (360.0 + (rad * (180 / Math.PI))).toFixed(2);
    } else {
        return (rad * (180 / Math.PI)).toFixed(2);
    }
}

function degreesToRadians(degrees){
    return degrees * (Math.PI / 180);
}

function drawRubberbandShape(loc){
    contex.strokeStyle = strokeColor;
    contex.fillStyle = fillColor;
    if(currentTool === "brush"){
        DrawBrush();
    } else if(currentTool === "line"){
        contex.beginPath();
        contex.moveTo(mousedown.x, mousedown.y);
        contex.lineTo(loc.x, loc.y);
        contex.stroke();
    } else if(currentTool === "rectangle"){
        contex.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "circle"){
        let radius = shapeBoundingBox.width;
        contex.beginPath();
        contex.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
        contex.stroke();
    }
}

function UpdateRubberbandOnMove(loc){
    UpdateRubberbandSizeData(loc);

    drawRubberbandShape(loc);
}


function AddBrushPoint(x, y, mouseDown){
    brushXPoints.push(x);
    brushYPoints.push(y);
    brushDownPos.push(mouseDown);
}

function DrawBrush(){
    for(let i = 1; i < brushXPoints.length; i++){
        contex.beginPath();
        if(brushDownPos[i]){
            contex.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
        } else {
            contex.moveTo(brushXPoints[i]-1, brushYPoints[i]);
        }
        contex.lineTo(brushXPoints[i], brushYPoints[i]);
        contex.closePath();
        contex.stroke();
    }
}

function ReactToMouseDown(e){
    canvas.style.cursor = "crosshair";
    // Store location
    loc = GetMousePosition(e.clientX, e.clientY);
    SaveCanvasImage();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;

    if(currentTool === 'brush'){
        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);
    }
};

function ReactToMouseMove(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);

    if(currentTool === 'brush' && dragging && usingBrush){
        if(loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight){
            AddBrushPoint(loc.x, loc.y, true);
        }
        RedrawCanvasImage();
        DrawBrush();
    } else {
        if(dragging){
            RedrawCanvasImage();
            UpdateRubberbandOnMove(loc);
        }
    }
};

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
