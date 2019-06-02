var visualizationCanvas;
var audioContext;
var audioSource;

$(document).ready(function() {
	visualizationCanvas = document.getElementById("visualization");
	window.requestAnimationFrame(loop);

	$("#myFile").change(function (event){
		var file = $(this)[0].files[0];
		if (file) {
			var reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onload = function(e) {
				playSound(e.target.result);
			};
		}
	});
});

function playSound(data) {
	audioContext = new AudioContext();
	audioSource = audioContext.createBufferSource();
	audioSource.connect(audioContext.destination);
	audioContext.decodeAudioData(data, function(buffer) {
		audioSource.buffer = buffer;
		audioSource.start(0);
	});
	$("#myFile").remove();
}

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
