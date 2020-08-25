let canvas;
let ctx;
let savedImageData;
let dragging = false;
let strokeColor = "brush";
let fillColor = "brush";
let lineWidth = 2;
let polygoneSides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

class ShapeBoundingBox {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}
