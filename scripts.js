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
class SpecialShapeSurroundingBox{
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


/*
Creation of the classes mentioned above, these will be used throughout the programme.
 */
let specialShapeSurroundingBox = new SpecialShapeSurroundingBox(0,0,0,0);
let mousedown = new MouseDownPos(0,0);
let loc = new Location(0,0);

document.addEventListener('DOMContentLoaded', setupCanvas);

/*
This function initialized and starts the creation of every element.
 */
function setupCanvas(){
    //Create canvas
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');

    //Set the stroke color and line width
    context.strokeStyle = strokeColor;
    context.lineWidth = line_Width;

    //Add the event listeners for the mouse moves
    canvas.addEventListener("mousedown", ReactToMouseDown);
    canvas.addEventListener("mousemove", ReactToMouseMove);
    canvas.addEventListener("mouseup", ReactToMouseUp);

    //The following 12 buttons are the buttons from the colour palette
    //If the colours are to be changed in the future, one must also change
    //the .html file
    document.getElementById("button1").onclick = function(){
        strokeColor = '#ffffff'; //white
    }

    document.getElementById("button2").onclick = function(){
        strokeColor = '#000000'; //black
    }

    document.getElementById("button3").onclick = function(){
        strokeColor = '#ff0000'; //red
    }

    document.getElementById("button4").onclick = function(){
        strokeColor = '#00ff00'; //lime-ish green
    }

    document.getElementById("button5").onclick = function(){
        strokeColor = '#0000ff'; //dark blue
    }

    document.getElementById("button6").onclick = function(){
        strokeColor = '#00ffff'; //light blue
    }

    document.getElementById("button7").onclick = function(){
        strokeColor = '#ff00ff'; //purple
    }

    document.getElementById("button8").onclick = function(){
        strokeColor = '#ffff00'; // yellow
    }

    document.getElementById("button9").onclick = function(){
        strokeColor = '#c46f0f'; //dark orange
    }

    document.getElementById("button10").onclick = function(){
        strokeColor = '#fd8f27'; //regular orange
    }
    document.getElementById("button11").onclick = function(){
        strokeColor = '#0099ff'; //blue
    }

    document.getElementById("button12").onclick = function(){
        strokeColor = '#ff009d'; //pink
    }

    //Enables rotations of the images
    const button = document.getElementById('Rotate');
    button.addEventListener("click", function(){
        angle = angle + 90; //The angle is set to 90 degrees bu default, it is subject to change
    });
}

/*
This function enables tool selection by accessing the tools with their id's.
If new tools are added or old ones are removed, the .html file must be changed as well.
 */
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

/*
This function returns the mouse position in x,y format.
 */
function GetMousePosition(x,y){
    let canvasSizeData = canvas.getBoundingClientRect();
    return { x: (x - canvasSizeData.left) * (canvas.width  / canvasSizeData.width),
        y: (y - canvasSizeData.top)  * (canvas.height / canvasSizeData.height)
    };
}

/*
This function saves the current state of the canvas.
 */
function SaveCanvasImage(){
    savedImageData = context.getImageData(0,0,canvas.width,canvas.height);
}

/*
This function updates the canvas.
 */
function RedrawCanvasImage(){
    context.putImageData(savedImageData,0,0);
}

/*
This function is used for updating the shape sizes such as rectangle line and circle when
they are first put to the canvas
 */
function updateSpecialShapeSize(loc){
    specialShapeSurroundingBox.width = Math.abs(loc.x - mousedown.x);
    specialShapeSurroundingBox.height = Math.abs(loc.y - mousedown.y);

    if(loc.x > mousedown.x){

        specialShapeSurroundingBox.left = mousedown.x;
    } else {

        specialShapeSurroundingBox.left = loc.x;
    }

    if(loc.y > mousedown.y){
        specialShapeSurroundingBox.top = mousedown.y;
    } else {
        specialShapeSurroundingBox.top = loc.y;
    }
}

/*
This function handles drawing shapes and images to the canvas, calls the relevant functions.
 */
function drawSpecialShape(loc){
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
        context.strokeRect(specialShapeSurroundingBox.left, specialShapeSurroundingBox.top, specialShapeSurroundingBox.width, specialShapeSurroundingBox.height);
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
        let radius = specialShapeSurroundingBox.width;
        context.beginPath();
        context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
        context.stroke();
    }
}


/*

 */
var TO_RADIANS = Math.PI/180;
function drawRotatedImage(image, x, y, angle) {
    context.save();
    context.translate(x, y);
    context.rotate(angle * TO_RADIANS);
    context.drawImage(image, -(image.width/2), -(image.height/2));
    context.restore();
}

/*

 */
function updateSpecialShapeOnMove(loc){
    updateSpecialShapeSize(loc);
    drawSpecialShape(loc);
}

/*

 */
function AddBrushPoint(x, y, mouseDown){
    brushXPoints.push(x);
    brushYPoints.push(y);
    brushDownPos.push(mouseDown);
}

/*

 */
function DrawBrush(){
    context.lineTo(currentPos.x, currentPos.y);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
}

/*

 */
function DrawEraser() {
    context.lineTo(currentPos.x, currentPos.y);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = eraserColor;
    context.stroke();
}

/*

 */
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

/*

 */
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
            updateSpecialShapeOnMove(loc);
        }
    }
};

/*

 */
function ReactToMouseUp(e){
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    //RedrawCanvasImage();
    updateSpecialShapeOnMove(loc);
    dragging = false;
    usingBrush = false;
}

/*

 */
function SaveImage(){
    var imageFile = document.getElementById("imageForDownload");
    imageFile.setAttribute('download', 'image.png');
    imageFile.setAttribute('href', canvas.toDataURL());
}








