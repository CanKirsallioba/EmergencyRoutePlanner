/*
Global variables
*/
let canvas;
let context;
let savedImageData;
let dragging = false;
let strokeColor = 'black';
let eraserColor = 'white';
let fillColor = 'black';
let line_Width = 2; /* Adjust the width of the strokes in here */
let currentTool = 'brush';
let canvasWidth = 1000; /* if the canvas width is changed here, it must also be changed in the .html file */
let canvasHeight = 600; /* if the canvas height is changed here, it must also be changed in the .html file */
let angle = 0; /* used in drawing rotated images */
let usingBrush = false;
let brushXPoints = new Array();
let brushYPoints = new Array();
let brushDownPos = new Array();

/*
This class is used for all the details about measures and shapes.
 */
class ShapeBoundingBox{
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

/*
This class tracks down the x and y values of the mouse, used for drawing and many other operations.
 */
class MouseDownPos{
    constructor(x,y) {
        this.x = x,
            this.y = y;
    }
}

/*
Location class is used for general locations throughout the programme.
 */
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
    context = canvas.getContext('2d');
    context.strokeStyle = strokeColor;
    context.lineWidth = line_Width;
    canvas.addEventListener("mousedown", ReactToMouseDown);
    canvas.addEventListener("mousemove", ReactToMouseMove);
    canvas.addEventListener("mouseup", ReactToMouseUp);
    document.getElementById("button1").onclick = function(){
        strokeColor = '#ffffff';
    }

    document.getElementById("button2").onclick = function(){
        strokeColor = '#000000';
    }

    document.getElementById("button3").onclick = function(){
        strokeColor = '#ff0000';
    }

    document.getElementById("button4").onclick = function(){
        strokeColor = '#00ff00';
    }

    document.getElementById("button5").onclick = function(){
        strokeColor = '#0000ff';
    }

    document.getElementById("button6").onclick = function(){
        strokeColor = '#00ffff';
    }

    document.getElementById("button7").onclick = function(){
        strokeColor = '#ff00ff';
    }

    document.getElementById("button8").onclick = function(){
        strokeColor = '#ffff00';
    }

    document.getElementById("button9").onclick = function(){
        strokeColor = '#c46f0f';
    }

    document.getElementById("button10").onclick = function(){
        strokeColor = '#fd8f27';
    }
    document.getElementById("button11").onclick = function(){
        strokeColor = '#0099ff';
    }

    document.getElementById("button12").onclick = function(){
        strokeColor = '#ff009d';
    }


    const button = document.getElementById('Rotate');
    button.addEventListener("click", function(){
        angle = angle + 90;
    });


    if (currentTool === 'alarm') {
        let pctrId = currentTool.replace('Button','');
        $( function() {
            $( pctrId ).draggable();
        } );
    }


}

function ChangeTool(toolClicked){
    document.getElementById("save").className = "";
    document.getElementById("brush").className = "";
    document.getElementById("eraser").className = "";
    document.getElementById("line").className = "";
    document.getElementById("rectangle").className = "";
    document.getElementById("circle").className = "";
    document.getElementById("alarmButton").className = "";
    document.getElementById("compassButton").className = "";
    document.getElementById("exitButton").className = "";
    document.getElementById("fireButton").className = "";
    document.getElementById("medkitButton").className = "";
    document.getElementById("meetingButton").className = "";
    document.getElementById("telephoneButton").className = "";
    document.getElementById("youarehereButton").className = "";
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
    savedImageData = context.getImageData(0,0,canvas.width,canvas.height);
}

function RedrawCanvasImage(){
    context.putImageData(savedImageData,0,0);
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

function drawRubberbandShape(loc){
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    if(currentTool === "brush"){
        //DrawBrush();
    }
    else if (currentTool === "eraser") {
        //DrawEraser();
    } else if(currentTool === "line"){
        context.beginPath();
        context.moveTo(mousedown.x, mousedown.y);
        context.lineTo(loc.x, loc.y);
        context.stroke();
    } else if(currentTool === "rectangle"){
        context.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top, shapeBoundingBox.width, shapeBoundingBox.height);
    } else if(currentTool === "alarmButton"){

        let pctrId = currentTool.replace('Button','');
        var pctr = document.getElementById(pctrId);
       // context.drawImage(pctr, loc.x, loc.y);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "compassButton"){
        let pctrId = currentTool.replace('Button','');
         pctr = document.getElementById(pctrId);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "exitButton"){
        let pctrId = currentTool.replace('Button','');
         pctr = document.getElementById(pctrId);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "fireButton"){
        let pctrId = currentTool.replace('Button','');
         pctr = document.getElementById(pctrId);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "medkitButton"){
        let pctrId = currentTool.replace('Button','');
         pctr = document.getElementById(pctrId);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "meetingButton"){
        let pctrId = currentTool.replace('Button','');
         pctr = document.getElementById(pctrId);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "telephoneButton"){
        let pctrId = currentTool.replace('Button','');
         pctr = document.getElementById(pctrId);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "youarehereButton"){
        let pctrId = currentTool.replace('Button','');
         pctr = document.getElementById(pctrId);
        drawRotatedImage(pctr,loc.x,loc.y,angle);
    } else if(currentTool === "circle"){
        let radius = shapeBoundingBox.width;
        context.beginPath();
        context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
        context.stroke();
    }
}



var TO_RADIANS = Math.PI/180;
function drawRotatedImage(image, x, y, angle) {
    context.save();
    context.translate(x, y);
    context.rotate(angle * TO_RADIANS);
    context.drawImage(image, -(image.width/2), -(image.height/2));
    context.restore();
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
    context.lineTo(currentPos.x, currentPos.y);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
}

function DrawEraser() {
    context.lineTo(currentPos.x, currentPos.y);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = eraserColor;
    context.stroke();
}

function ReactToMouseDown(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    startPos = GetMousePosition(e.clientX, e.clientY);
    SaveCanvasImage();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;

    if(currentTool === 'brush'){

        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);

        context.strokeStyle = strokeColor;
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);

    }

    if (currentTool === 'eraser') {
        context.strokeStyle = eraserColor;
        context.beginPath();
        context.moveTo(startPos.x, startPos.y);
    }

};

function ReactToMouseMove(e){
    currentPos = GetMousePosition(e.clientX, e.clientY);

    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);

    if(currentTool === 'brush' && dragging && usingBrush) {

        if(loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight){
            AddBrushPoint(loc.x, loc.y, true);
        }

        RedrawCanvasImage();
        DrawBrush();
    }
    else if (currentTool === 'eraser') {
        RedrawCanvasImage();
        DrawEraser();
    }
    else {
        if(dragging){
            RedrawCanvasImage();
            UpdateRubberbandOnMove(loc);
        }
    }
};

function ReactToMouseUp(e){
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    //RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}

function SaveImage(){
    var imageFile = document.getElementById("img-file");
    imageFile.setAttribute('download', 'image.png');
    imageFile.setAttribute('href', canvas.toDataURL());
}








