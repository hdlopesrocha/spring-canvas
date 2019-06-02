var timeDomainCanvas;	
var frequencyCanvas;	
var visualizationCanvas;	
var audioContext;
var audioSource;
var analyser;
var frequencyData; 						
var timeDomainData;

$(document).ready(function() {
	timeDomainCanvas = document.getElementById("timeDomain");
	frequencyCanvas = document.getElementById("frequency");
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
	analyser = audioContext.createAnalyser();
	audioSource.connect(analyser).connect(audioContext.destination); 
	
	audioContext.decodeAudioData(data, function(buffer) {
		audioSource.buffer = buffer;
		audioSource.start(0);
	});

	frequencyData = new Uint8Array(analyser.frequencyBinCount); 						
	timeDomainData = new Uint8Array(analyser.frequencyBinCount);

	$("#myFile").remove();
}

function draw(time) {
	if(frequencyData) {
		analyser.getByteFrequencyData(frequencyData);
		drawArray(time, frequencyCanvas, frequencyData);
	}
	if(timeDomainData){
		analyser.getByteTimeDomainData(timeDomainData);
		drawArray(time, timeDomainCanvas, timeDomainData);
	}
	drawVisualization(time, visualizationCanvas);
}

function drawVisualization(time, canvas) {
	var canvasContext = canvas.getContext("2d");
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);  
	canvasContext.beginPath();
	canvasContext.lineWidth = 2;
	canvasContext.strokeStyle = '#fff';

	var first = true;
	var radius = Math.min(canvas.width, canvas.height)*0.25;
	var bump = Math.min(canvas.width, canvas.height)*0.25;

	for (var t=0; t <= 1.00001; t+=0.001) {
		var r = radius+ bump* myNoise3dx(Math.sin(2*Math.PI*t),Math.cos(2*Math.PI*t),0,1,6);

		var x = canvas.width/2 + r*Math.sin(2*Math.PI*t);
		var y = canvas.height/2 + r*Math.cos(2*Math.PI*t);

		if (first) {
			first = false;
			canvasContext.moveTo(x, canvas.height-y);
		} else {
			canvasContext.lineTo(x, canvas.height-y);
		}
	}
	canvasContext.stroke();
}

function drawArray(time, canvas, array) {
	var canvasContext = canvas.getContext("2d");
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);  
	canvasContext.beginPath();
	canvasContext.lineWidth = 2;
	canvasContext.strokeStyle = '#fff';

	var first = true;
	for (var i=0; i < array.length; ++i) {
		var x = (i/array.length)*canvas.width;
		var y = (array[i]/255)*canvas.height;
		if (first) {
			first = false;
			canvasContext.moveTo(x, canvas.height-y);
		} else {
			canvasContext.lineTo(x, canvas.height-y);
		}
	}
	canvasContext.stroke();
}