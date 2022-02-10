// Set up the canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.lineWidth = 20;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// Set up mouse events for drawing
var drawing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;

canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    lastPos = getMousePos(canvas, e);
}, false);

canvas.addEventListener("mouseup", function (e) {
    drawing = false;
}, false);

canvas.addEventListener("mousemove", function (e) {
    mousePos = getMousePos(canvas, e);
}, false);

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
    };
}

// Get a regular interval for drawing to the screen
window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
            window.setTimeout(callback, 1000/60);
        };
})();

// Draw to the canvas
function renderCanvas() {
    if (drawing) {
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.stroke();
        lastPos = mousePos;
    }
}

// Allow for animation
(function drawLoop () {
    requestAnimFrame(drawLoop);
    renderCanvas();
})();

// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
    mousePos = getTouchPos(canvas, e);
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchend", function (e) {
    var mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchmove", function (e) {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);

document.body.addEventListener("touchend", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);

document.body.addEventListener("touchmove", function (e) {
    if (e.target == canvas) {
        e.preventDefault();
    }
}, false);

// Clear the canvas
function clean() {
    canvas.width = canvas.width;
    ctx.lineWidth = 20;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
}

// On call, send data to server
function predict() {

    // Convert canvas to DataURL
    var dataURL = canvas.toDataURL();
    var obj = {};
    var arr = [];
    var sorted_arr = [];
    
    // Ajax post to route /hook
    $.ajax({ type: "POST",
        url: "http://127.0.0.1:5000/hook",
        data:{
            imageBase64: dataURL
        },
        
        // If success:
        success: function(response){
            
            // Parse json
            obj = JSON.parse(response);
        
            // Add all percentagens to an array
            arr.push(obj.zero);
            arr.push(obj.one);
            arr.push(obj.two);
            arr.push(obj.three);
            arr.push(obj.four);
            arr.push(obj.five);
            arr.push(obj.six);
            arr.push(obj.seven);
            arr.push(obj.eight);
            arr.push(obj.nine);
            
            // Get file name from obj.name
            file = obj.name;
            
            // Reverse sort the array to get the winning prediction
            sorted_arr = arr.sort().reverse();
    
            // First element is the winning probability
            first_prob = sorted_arr[0];
            
            // Retrieve number key from percentage
            const key1 = Object.keys(obj).find(key1 => obj[key1] === first_prob);
            
            // Round the percentage to 3 decimals
            first_prob = first_prob.toFixed(3);
            
            // Redirect to results url with filename, key and probability values
            const url = "http://127.0.0.1:5000/results/" + file + "/" + key1  + "/" + first_prob;
            window.location.href = url;
  
        }
    });
}