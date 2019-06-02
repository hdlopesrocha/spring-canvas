var visualizationCanvas;

$(document).ready(function() {
	visualizationCanvas = document.getElementById("visualization");
	window.requestAnimationFrame(loop);
});

function draw(time) {
	drawVisualization(time);
}

function drawVisualization(time) {
	var canvasContext = visualizationCanvas.getContext("2d");
	canvasContext.clearRect(0, 0, visualizationCanvas.width, visualizationCanvas.height);
	canvasContext.beginPath();
	canvasContext.lineWidth = 2;
	canvasContext.strokeStyle = '#fff';

	var first = true;
	for (var t=0; t <= 1; t+= 0.01) {
		var x = t * visualizationCanvas.width;
		var centerY = visualizationCanvas.height/2;
		var amplitude = visualizationCanvas.height/2;
		var y = centerY + amplitude*Math.sin((t+time)*2*Math.PI);
		if (first) {
			first = false;
			canvasContext.moveTo(x, visualizationCanvas.height-y);
		} else {
			canvasContext.lineTo(x, visualizationCanvas.height-y);
		}
	}
	canvasContext.stroke();
}
