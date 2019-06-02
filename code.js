var canvas;	

$(document).ready(function() {
	canvas = document.getElementById("myCanvas");
	window.requestAnimationFrame(loop);
});

function draw(time) {
	var canvasContext = canvas.getContext("2d");
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);  
	canvasContext.beginPath();
	canvasContext.lineWidth = 2;
	canvasContext.strokeStyle = '#fff';

	var first = true;
	for (var t=0; t <= 1; t+= 0.01) {
		var x = t*canvas.width;
		var centerY = canvas.height/2;
		var amplitude = canvas.height/2;
		var y = centerY + amplitude*Math.sin((t+time)*2*Math.PI);
		if (first) {
			first = false;
			canvasContext.moveTo(x, canvas.height-y);
		} else {
			canvasContext.lineTo(x, canvas.height-y);
		}
	}
	canvasContext.stroke();
}
