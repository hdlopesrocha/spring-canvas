var visualizationCanvas;
var timeDomainCanvas;
var frequencyCanvas;
var audioContext;
var audioSource;
var analyser;
var frequencyData;
var timeDomainData;

$(document).ready(function() {
	visualizationCanvas = document.getElementById("visualization");
	timeDomainCanvas = document.getElementById("timeDomain");
	frequencyCanvas = document.getElementById("frequency");
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
